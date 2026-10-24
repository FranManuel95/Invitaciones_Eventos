"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  BackSide,
  CanvasTexture,
  DoubleSide,
  ClampToEdgeWrapping,
  Color,
  ExtrudeGeometry,
  FrontSide,
  type Group,
  type Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  type DirectionalLight,
  type PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  type PointLight,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  distanceToFill,
  easeIn,
  easeInOut,
  easeOut,
  fall,
  flapProfile,
  lerp,
  parseOutline,
  parsePolygon,
  type Point,
  sealHalves,
  segment,
  TIMELINE as T,
} from "@/lib/envelope-3d";
import { ENVELOPES, flapGeometry, mix, sealOutline, STYLES, type Theme, waxHex } from "@/lib/theme";
import { haptic, playPaper, playSealCrack } from "../../effects/sound";
import {
  flapMaskCanvas,
  letterCanvas,
  linerCanvas,
  sealCanvases,
  softShadowCanvas,
} from "./textures";

/*
 * Sobre en 3D (three.js): papel con relieve real (texturas de ambientCG, CC0), una solapa que se
 * curva al levantarse, un lacre de cera con volumen que se parte en dos y una luz que sigue la
 * inclinación del móvil. Todo se mueve por tiempo (no por fotogramas), así que en un móvil lento
 * la apertura dura lo mismo, solo que con menos fotogramas.
 */

/** Medidas en unidades de escena: apaisado, como el sobre CSS. */
const W = 3.2;
const H = 2.2;
const POCKET_Z = 0.026;
const LETTER_Z = 0.012;
const SEAL_R = 0.3;
const FLAP_ROWS = 28;
const FLAP_COLS = 24;
const LETTER_W = W - 0.24;
const LETTER_H = H - 0.2;
const FOV = 32;
const SHADOW_PAD = 0.14;
const FLAP_SHADOW_PAD = 0.04;

export interface SceneHandle {
  open: () => void;
}

export interface SceneProps {
  theme: Theme;
  monogram: string;
  initials: [string, string];
  names: string;
  date: string;
  fonts: { display: string; names: string };
  tilt: { x: MotionValue<number>; y: MotionValue<number> };
  pace: number;
  handleRef: React.RefObject<SceneHandle | null>;
  /** Hueco de la carta en la pantalla: se coloca encima de la carta 3D para el relieve final. */
  proxyRef: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onPresented: () => void;
}

/** Migas de cera: velocidad inicial (x, y, z), giro y tamaño, deterministas. */
const CRUMBS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + 0.3;
  return {
    v: [
      Math.cos(a) * (0.7 + (i % 4) * 0.25),
      0.6 + Math.abs(Math.sin(a)) * 1.3,
      0.5 + (i % 3) * 0.35,
    ],
    spin: 5 + (i % 5) * 2,
    size: 0.018 + (i % 4) * 0.007,
  };
});

function shapeFrom(points: Point[]) {
  const shape = new Shape();
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  return shape;
}

/** Triángulo plano del bolsillo con UV en coordenadas de sobre (la textura sigue continua). */
function pocketPiece(points: Point[]) {
  const geometry = new ShapeGeometry(shapeFrom(points));
  const pos = geometry.attributes.position!;
  const uv = geometry.attributes.uv!;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / W + 0.5, pos.getY(i) / H + 0.5);
  return geometry;
}

const WAX_EXTRUDE = {
  depth: 0.06,
  bevelEnabled: true,
  bevelThickness: 0.07,
  bevelSize: 0.06,
  bevelSegments: 4,
  curveSegments: 6,
};

function canvasTexture(el: HTMLCanvasElement, color = true) {
  const texture = new CanvasTexture(el);
  if (color) texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Envelope(props: SceneProps) {
  const { theme, handleRef, proxyRef, tilt, pace, onReady, onPresented } = props;
  const { camera, size, gl } = useThree();

  const [detail, relief] = useLoader(TextureLoader, [
    "/texturas/papel-detalle.webp",
    "/texturas/papel-relieve.webp",
  ]) as [Texture, Texture];

  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const flapMesh = useRef<Mesh>(null);
  const flapGroup = useRef<Group>(null);
  const letter = useRef<Group>(null);
  const seal = useRef<Group>(null);
  const halves = useRef<(Group | null)[]>([]);
  const crumbs = useRef<(Mesh | null)[]>([]);
  const flash = useRef<PointLight>(null);
  const dropShadow = useRef<Mesh>(null);
  const flapShadow = useRef<Mesh>(null);
  const key = useRef<DirectionalLight>(null);
  const startedAt = useRef<number | null>(null);
  const presented = useRef(false);
  const sounds = useRef({ crack: false, flap: false, letter: false });

  // Colores y formas del tema: los mismos que el sobre CSS.
  const look = useMemo(() => {
    const envelope = ENVELOPES[theme.envelope];
    const palette = STYLES[theme.style].palette;
    const flap = flapGeometry(theme.flap);
    return {
      paper: envelope.paper,
      inside: envelope.inside,
      wax: waxHex(theme),
      palette,
      flapDepth: (flap.depth / 100) * H,
      flapPoints: parsePolygon(flap.clip),
      pocketTip: theme.flap === "pico" ? 0.54 : flap.depth / 100 - 0.01,
      linerIsDots: envelope.liner.includes("radial-gradient"),
    };
  }, [theme]);

  const textures = useMemo(() => {
    // Copias propias de las texturas cargadas, repetidas a lo largo del sobre.
    const [grain, bumps] = [detail.clone(), relief.clone()];
    for (const t of [grain, bumps]) {
      t.wrapS = t.wrapT = RepeatWrapping;
      t.repeat.set(2.2, 1.6);
      t.anisotropy = 4;
    }
    grain.colorSpace = SRGBColorSpace;
    const sealArt = sealCanvases({
      wax: look.wax,
      shape: theme.sealShape,
      mark: theme.sealMark,
      monogram: props.monogram,
      font: props.fonts.display,
    });
    const sealColor = canvasTexture(sealArt.color);
    const sealMetal = canvasTexture(sealArt.metal, false);
    const sealRelief = canvasTexture(sealArt.relief, false);
    for (const t of [sealColor, sealMetal, sealRelief]) {
      // Las caras del lacre usan sus coordenadas (−1…1) como UV.
      t.wrapS = t.wrapT = ClampToEdgeWrapping;
      t.repeat.set(0.5, 0.5);
      t.offset.set(0.5, 0.5);
    }
    return {
      grain,
      bumps,
      liner: canvasTexture(
        linerCanvas(theme.liner, look.inside, look.palette.gold, look.linerIsDots),
      ),
      mask: canvasTexture(flapMaskCanvas(look.flapPoints), false),
      sealColor,
      sealMetal,
      sealRelief,
      // Sombras suaves pintadas: la del sobre sobre el fondo y la del borde de la solapa.
      envelopeShadow: canvasTexture(
        softShadowCanvas(
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ],
          W / H,
          { pad: SHADOW_PAD, blur: 0.06, color: "rgb(52 38 22 / 0.9)" },
        ),
      ),
      flapShadow: canvasTexture(
        softShadowCanvas(look.flapPoints, W / look.flapDepth, {
          pad: FLAP_SHADOW_PAD,
          blur: 0.012,
          color: "rgb(70 50 28 / 0.75)",
        }),
      ),
      letter: canvasTexture(
        letterCanvas({
          width: LETTER_W,
          height: LETTER_H,
          paper: look.palette.paper,
          ink: look.palette.ink,
          inkSoft: look.palette.inkSoft,
          gold: look.palette.gold,
          initials: props.initials,
          names: props.names,
          date: props.date,
          displayFont: props.fonts.display,
          namesFont: props.fonts.names,
        }),
      ),
    };
  }, [
    detail,
    relief,
    look,
    theme,
    props.monogram,
    props.initials,
    props.names,
    props.date,
    props.fonts,
  ]);

  const geometry = useMemo(() => {
    const tipY = H / 2 - look.pocketTip * H;
    const outline = parseOutline(sealOutline(theme.sealShape));
    const { left, right } = sealHalves(outline);
    return {
      left: pocketPiece([
        [-W / 2, H / 2],
        [-W / 2, -H / 2],
        [0, tipY],
      ]),
      right: pocketPiece([
        [W / 2, H / 2],
        [0, tipY],
        [W / 2, -H / 2],
      ]),
      bottom: pocketPiece([
        [-W / 2, -H / 2],
        [W / 2, -H / 2],
        [0, tipY + 0.08],
      ]),
      flap: new PlaneGeometry(W, look.flapDepth, FLAP_COLS, FLAP_ROWS),
      seal: new ExtrudeGeometry(shapeFrom(outline), WAX_EXTRUDE),
      halves: [left, right].map((half) => new ExtrudeGeometry(shapeFrom(half), WAX_EXTRUDE)),
      letter: new PlaneGeometry(LETTER_W, LETTER_H, 16, 2),
    };
  }, [look, theme.sealShape]);

  // Reflejos suaves de una habitación: dan brillo de cera al lacre y de oro a la marca.
  const environment = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return env;
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);

  // Materiales: papel con el color del tema, el grano de la textura y su relieve.
  const materials = useMemo(() => {
    const paper = (color: string) =>
      new MeshStandardMaterial({
        color: new Color(color),
        map: textures.grain,
        normalMap: textures.bumps,
        normalScale: new Vector2(0.9, 0.9),
        roughness: 0.88,
      });
    const sealFace = new MeshStandardMaterial({
      map: textures.sealColor,
      metalnessMap: textures.sealMetal,
      metalness: 1,
      bumpMap: textures.sealRelief,
      bumpScale: 4,
      roughness: 0.46,
    });
    const sealSide = new MeshStandardMaterial({
      color: new Color(look.wax).multiplyScalar(0.72),
      roughness: 0.36,
    });
    const all = {
      // Cada pliegue con su tono: la solapa, la más clara; los laterales, los más oscuros.
      pocketSide: paper(look.paper[1]),
      pocketBottom: paper(mix(look.paper[0], look.paper[1], 0.45)),
      flapOuter: Object.assign(paper(look.paper[0]), {
        alphaMap: textures.mask,
        alphaTest: 0.5,
        side: FrontSide,
      }),
      flapInner: new MeshStandardMaterial({
        map: textures.liner,
        alphaMap: textures.mask,
        alphaTest: 0.5,
        side: BackSide,
        roughness: 0.9,
      }),
      inside: new MeshStandardMaterial({ map: textures.liner, roughness: 0.92 }),
      letter: new MeshStandardMaterial({
        map: textures.letter,
        normalMap: textures.bumps,
        normalScale: new Vector2(0.5, 0.5),
        roughness: 0.86,
      }),
      seal: [sealFace, sealSide],
      crumb: new MeshStandardMaterial({ color: new Color(look.wax), roughness: 0.4 }),
      envelopeShadow: new MeshBasicMaterial({
        map: textures.envelopeShadow,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
      flapShadow: new MeshBasicMaterial({
        map: textures.flapShadow,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    };
    for (const material of Object.values(all).flat()) {
      if (!(material instanceof MeshStandardMaterial)) continue;
      material.envMap = environment;
      material.envMapIntensity = material === sealFace ? 0.4 : 0.25;
      // El papel es una lámina: proyecta sombra por las dos caras (por defecto, solo por detrás).
      material.shadowSide = DoubleSide;
    }
    return all;
  }, [textures, look, environment]);

  // Al desmontarse se libera la memoria de la tarjeta gráfica.
  useEffect(
    () => () => {
      Object.values(geometry)
        .flat()
        .forEach((g) => g.dispose());
      Object.values(textures).forEach((t) => t.dispose());
      Object.values(materials)
        .flat()
        .forEach((m) => m.dispose());
    },
    [geometry, textures, materials],
  );

  // Encuadre: el sobre cabe a lo ancho en el móvil y deja aire arriba para que salga la carta.
  const fit = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    const byWidth = distanceToFill(W, FOV, aspect, 0.84);
    const byHeight = distanceToFill(H * 2.1, FOV, 1, 0.92);
    // La carta, al final, ocupa casi todo el ancho (o el alto, en pantallas anchas).
    const letterAt = Math.max(
      distanceToFill(LETTER_W, FOV, aspect, 0.9),
      distanceToFill(LETTER_H, FOV, 1, 0.6),
    );
    return { distance: Math.max(byWidth, byHeight), letterAt };
  }, [size]);

  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(0, 0, fit.distance);
    cam.lookAt(0, 0, 0);
  }, [camera, fit]);

  useEffect(() => {
    handleRef.current = {
      open: () => {
        if (startedAt.current === null) startedAt.current = -1;
      },
    };
    onReady();
    return () => {
      handleRef.current = null;
    };
  }, [handleRef, onReady]);

  const corner = useMemo(() => new Vector3(), []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (startedAt.current === -1) startedAt.current = now;
    const t = startedAt.current === null ? 0 : (now - startedAt.current) / pace;
    const tx = tilt.x.get();
    const ty = tilt.y.get();

    // Luz: sigue la inclinación del móvil (o el ratón); el brillo recorre la cera y el oro.
    if (key.current) key.current.position.set(-3.2 + tx * 3, 4.2 - ty * 2.2, 3.6);

    // Inclinación del conjunto, que se calma cuando la carta pasa al primer plano.
    const present = easeInOut(segment(t, ...T.present));
    if (root.current) {
      const calm = 1 - present;
      const idle = startedAt.current === null ? Math.sin(now * 1.1) * 0.025 : 0;
      root.current.rotation.x = lerp(
        root.current.rotation.x,
        (-0.16 + ty * 0.1 + idle) * calm,
        0.08,
      );
      root.current.rotation.y = lerp(root.current.rotation.y, tx * 0.16 * calm, 0.08);
      root.current.position.y = idle * 0.6 * calm;
    }

    // 1. Presión: el sobre cede bajo el dedo y la cera se aplasta un poco.
    const press = Math.sin(segment(t, ...T.press) * Math.PI);
    if (body.current) body.current.position.z = -press * 0.06;
    if (seal.current)
      seal.current.scale.set(
        SEAL_R * (1 + press * 0.04),
        SEAL_R * (1 + press * 0.04),
        SEAL_R * (1 - press * 0.35),
      );

    // 2. El lacre se parte: las mitades se abren por la grieta y caen girando; saltan migas.
    const tc = t - T.crack[0];
    const broken = tc >= 0;
    if (broken && !sounds.current.crack) {
      sounds.current.crack = true;
      playSealCrack();
      haptic([10, 30, 18]);
    }
    if (seal.current) seal.current.visible = !broken;
    if (flash.current) flash.current.intensity = broken ? Math.max(0, 1 - tc / 0.18) * 3 : 0;
    halves.current.forEach((half, i) => {
      if (!half) return;
      const dir = i === 0 ? -1 : 1;
      const k = Math.max(0, tc);
      half.visible = broken && k < T.crack[1] - T.crack[0];
      // Un instante pegadas a la cera (se separan apenas) y después caen con su peso.
      const hold = Math.min(k, 0.12);
      const drop = Math.max(0, k - 0.12);
      half.position.set(
        dir * (hold * 0.25 + fall(0.55, 0, drop)),
        fall(0.35, -7.5, drop),
        fall(0.9, 0, drop),
      );
      half.rotation.set(-drop * 2.2, dir * drop * 1.2, dir * (hold * 0.6 + drop * 3.2));
    });
    crumbs.current.forEach((crumb, i) => {
      const c = CRUMBS[i]!;
      if (!crumb) return;
      const k = Math.max(0, tc);
      crumb.visible = broken && k < 1.2;
      crumb.position.set(fall(c.v[0]!, 0, k), fall(c.v[1]!, -8, k), fall(c.v[2]!, 0, k) + 0.04);
      crumb.rotation.set(k * c.spin, k * c.spin * 0.7, 0);
    });

    // 3. La solapa gira sobre la bisagra y se curva; pasados los 90° queda detrás de la carta.
    const flapK = easeInOut(segment(t, ...T.flap));
    if (flapK > 0 && !sounds.current.flap) {
      sounds.current.flap = true;
      playPaper(0.7, 0.05);
    }
    const angle = Math.PI * 1.02 * flapK;
    if (flapMesh.current) {
      const pos = flapMesh.current.geometry.attributes.position!;
      const profile = flapProfile(FLAP_ROWS, look.flapDepth, angle);
      for (let r = 0; r <= FLAP_ROWS; r++) {
        const [y, z] = profile[r]!;
        for (let c = 0; c <= FLAP_COLS; c++) {
          pos.setXYZ(r * (FLAP_COLS + 1) + c, -W / 2 + (c / FLAP_COLS) * W, y, z);
        }
      }
      pos.needsUpdate = true;
      flapMesh.current.geometry.computeVertexNormals();
    }
    if (flapShadow.current) {
      (flapShadow.current.material as MeshBasicMaterial).opacity =
        0.55 * (1 - segment(angle, 0, 0.9));
    }
    // La sombra del sobre se desplaza al contrario que la luz y se aprieta al pulsarlo.
    if (dropShadow.current) {
      dropShadow.current.position.x = 0.1 - tx * 0.12;
      dropShadow.current.position.y = -0.16 + ty * 0.1;
    }
    if (flapGroup.current)
      flapGroup.current.position.z = angle > Math.PI / 2 ? 0.004 : POCKET_Z + 0.022;

    // 4. La carta sale con un tirón y se desliza con fricción, algo flexionada.
    const pull = segment(t, ...T.letter);
    if (pull > 0 && !sounds.current.letter) {
      sounds.current.letter = true;
      playPaper(0.9, 0.05);
    }
    const rise = easeOut(pull);
    if (letter.current) {
      const bend = Math.sin(pull * Math.PI) * 0.07;
      const yIn = rise * H * 0.88;
      letter.current.position.set(
        0,
        lerp(yIn, 0, present),
        lerp(LETTER_Z, fit.distance - fit.letterAt, present),
      );
      // Se inclina hacia quien la saca (la parte de abajo sigue dentro, detrás del bolsillo).
      letter.current.rotation.set(bend * (1 - present), 0, lerp(-0.012, 0, present));
    }

    // 5. El sobre se va hacia abajo con su peso mientras la carta llega al primer plano.
    const away = segment(t, ...T.away);
    if (body.current) {
      body.current.position.y = -easeIn(away) * 4.2;
      body.current.rotation.z = easeIn(away) * 0.1;
      body.current.visible = away < 1;
    }

    // El hueco de la carta en la pantalla sigue a la carta 3D (para el relevo a la carta grande).
    if (letter.current && proxyRef.current && present > 0) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const [x, y] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ] as const) {
        corner.set((x * LETTER_W) / 2, (y * LETTER_H) / 2, 0);
        letter.current.localToWorld(corner).project(camera);
        const sx = ((corner.x + 1) / 2) * size.width;
        const sy = ((1 - corner.y) / 2) * size.height;
        minX = Math.min(minX, sx);
        maxX = Math.max(maxX, sx);
        minY = Math.min(minY, sy);
        maxY = Math.max(maxY, sy);
      }
      Object.assign(proxyRef.current.style, {
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${maxX - minX}px`,
        height: `${maxY - minY}px`,
      });
    }

    if (!presented.current && t >= T.present[1]) {
      presented.current = true;
      onPresented();
    }
  });

  const sealY = H / 2 - look.flapDepth;

  return (
    <>
      <hemisphereLight args={["#fff8ec", "#8a7c66", 0.62]} />
      {/* Relleno suave desde la derecha: las sombras no se quedan negras. */}
      <directionalLight position={[3, 1, 4]} intensity={0.35} color="#f2ece4" />
      <directionalLight
        ref={key}
        position={[-3.2, 4.2, 3.6]}
        intensity={1.5}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-intensity={0.6}
      />
      {/* Sombra del sobre sobre el fondo (el fondo de verdad es el degradado de la página). */}

      <group ref={root}>
        <group ref={body}>
          {/* Sombra suave del sobre sobre el fondo, algo desplazada por la luz. */}
          <mesh
            ref={dropShadow}
            material={materials.envelopeShadow}
            position={[0.1, -0.16, -0.3]}
            scale={[W * (1 + 2 * SHADOW_PAD), H * (1 + 2 * SHADOW_PAD), 1]}
          >
            <planeGeometry />
          </mesh>
          {/* Interior con el forro, visible al levantar la solapa. */}
          <mesh material={materials.inside} receiveShadow castShadow>
            <planeGeometry args={[W, H]} />
          </mesh>
          {/* Bolsillo: tres pliegues de papel con un poco de altura entre ellos. */}
          <mesh
            geometry={geometry.left}
            material={materials.pocketSide}
            position-z={POCKET_Z}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={geometry.right}
            material={materials.pocketSide}
            position-z={POCKET_Z}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={geometry.bottom}
            material={materials.pocketBottom}
            position-z={POCKET_Z + 0.006}
            castShadow
            receiveShadow
          />

          {/* Sombra del borde de la solapa sobre el bolsillo: se va al levantarla. */}
          <mesh
            ref={flapShadow}
            material={materials.flapShadow}
            position={[0.025, H / 2 - look.flapDepth / 2 - 0.035, POCKET_Z + 0.014]}
            scale={[W * (1 + 2 * FLAP_SHADOW_PAD), look.flapDepth * (1 + 2 * FLAP_SHADOW_PAD), 1]}
          >
            <planeGeometry />
          </mesh>
          {/* Solapa: malla que se deforma fotograma a fotograma; el recorte viene del tema. */}
          <group ref={flapGroup} position={[0, H / 2, POCKET_Z + 0.022]}>
            <mesh
              ref={flapMesh}
              geometry={geometry.flap}
              material={materials.flapOuter}
              castShadow
              receiveShadow
            />
            <mesh geometry={geometry.flap} material={materials.flapInner} receiveShadow />
          </group>

          {/* Lacre entero, en la punta de la solapa. */}
          <group position={[0, sealY, POCKET_Z + 0.05]}>
            <group ref={seal} scale={SEAL_R}>
              <mesh geometry={geometry.seal} material={materials.seal} castShadow />
            </group>
            {/* Destello cálido en la grieta al partirse el lacre. */}
            <pointLight
              ref={flash}
              position={[0, 0, 0.4]}
              color="#ffd9a8"
              intensity={0}
              distance={2}
            />
            {geometry.halves.map((g, i) => (
              <group
                key={i}
                ref={(el) => {
                  halves.current[i] = el;
                }}
                visible={false}
              >
                <mesh geometry={g} material={materials.seal} scale={SEAL_R} castShadow />
              </group>
            ))}
            {CRUMBS.map((c, i) => (
              <mesh
                key={i}
                ref={(el) => {
                  crumbs.current[i] = el;
                }}
                material={materials.crumb}
                visible={false}
                castShadow
              >
                <dodecahedronGeometry args={[c.size, 0]} />
              </mesh>
            ))}
          </group>
        </group>

        {/* La carta va fuera del cuerpo: se queda cuando el sobre se va. */}
        <group ref={letter} position={[0, 0, LETTER_Z]}>
          <mesh geometry={geometry.letter} material={materials.letter} castShadow receiveShadow />
        </group>
      </group>
    </>
  );
}

export default function EnvelopeScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden
      shadows={{ type: PCFShadowMap }}
      dpr={[1, 2]}
      camera={{ fov: FOV, near: 0.1, far: 80, position: [0, 0, 8] }}
      gl={{ antialias: true, alpha: true, toneMapping: NeutralToneMapping }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Envelope {...props} />
    </Canvas>
  );
}
