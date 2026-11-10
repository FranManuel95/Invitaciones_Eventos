"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import {
  BloomEffect,
  DepthOfFieldEffect,
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  ToneMappingEffect,
  ToneMappingMode,
  VignetteEffect,
  BlendFunction,
} from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  ClampToEdgeWrapping,
  Color,
  ExtrudeGeometry,
  FrontSide,
  type Group,
  HalfFloatType,
  Matrix4,
  type Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  PCFShadowMap,
  Plane,
  type DirectionalLight,
  type PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  type PointLight,
  type Points,
  PointsMaterial,
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
  easeInOut,
  easeOut,
  flapProfile,
  lerp,
  parseOutline,
  parsePolygon,
  type Point,
  sealHalves,
  segment,
} from "@/lib/envelope-3d";
import { ENVELOPES, flapGeometry, mix, sealOutline, STYLES, type Theme, waxHex } from "@/lib/theme";
import { haptic, playPaper, playSealCrack } from "../../effects/sound";
import {
  flapMaskCanvas,
  foliageCanvas,
  glowCanvas,
  letterCanvas,
  linerCanvas,
  sealCanvases,
  softShadowCanvas,
} from "./textures";

/*
 * Sobre en 3D rodado como una película (three.js). El sobre descansa en una mesa, a contraluz,
 * con la sombra de unas ramas que se mueven. Al tocarlo, la cámara baja en grúa hasta el lacre y
 * enfoca la cera; el lacre se parte a cámara lenta, las mitades saltan y ruedan por la mesa y las
 * migas vuelan; la solapa se levanta curvándose y del sobre sale luz y chispas doradas; la carta
 * se desliza fuera y sube hacia la cámara, que ya mira desde arriba, mientras la mesa se
 * desenfoca. La imagen pasa por un objetivo: profundidad de campo, brillo, viñeta y grano.
 *
 * Todo se mueve por tiempo (no por fotogramas): en un móvil lento dura lo mismo, con menos
 * fotogramas, y si va muy justo se quita el desenfoque, que es lo más caro.
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
const FOV = 32;
const FLAP_SHADOW_PAD = 0.04;

const TABLE_Z = -0.02;
/** De dónde viene el sol: alto, desde detrás y a la izquierda (a contraluz). */
const SUN = new Vector3(-5.5, 8, 6.5);

/** Coreografía en segundos (a ritmo normal). */
const T = {
  dolly: [0, 1.5],
  press: [1.05, 1.6],
  crack: 1.6,
  pullBack: [2.5, 4.3],
  flap: [2.45, 4.1],
  glow: [3.0, 4.1],
  letter: [3.9, 5.8],
  rise: [5.4, 7.2],
} as const;

/**
 * Un plano de cámara: a qué mira, desde qué distancia, a qué altura sobre la mesa (90° es desde
 * arriba) y desde qué lado; el alabeo inclina el horizonte. Entre dos planos la cámara recorre un
 * arco, como una grúa.
 */
interface Shot {
  target: [number, number, number];
  dist: number;
  elev: number;
  azim: number;
  roll: number;
}

const SHOT_KEYS = ["dist", "elev", "azim", "roll"] as const;

/** Curva suave entre dos valores con sus pendientes (Hermite): no frena al pasar por cada punto. */
function hermite(p0: number, p1: number, m0: number, m1: number, h: number, u: number) {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * p0 +
    (u3 - 2 * u2 + u) * h * m0 +
    (-2 * u3 + 3 * u2) * p1 +
    (u3 - u2) * h * m1
  );
}

/**
 * La cámara en el instante `t`: recorre los planos de `path` en un solo movimiento continuo. Sale
 * despacio del primero y llega despacio al último, pero pasa por los intermedios sin detenerse.
 */
function shotAt(path: { at: number; shot: Shot }[], t: number): Shot {
  const last = path.length - 1;
  if (t <= path[0]!.at) return path[0]!.shot;
  if (t >= path[last]!.at) return path[last]!.shot;
  let i = 0;
  while (t > path[i + 1]!.at) i++;
  const [a, b] = [path[i]!, path[i + 1]!];
  const h = b.at - a.at;
  const u = (t - a.at) / h;
  // Pendiente en cada plano: la que une el anterior con el siguiente (cero en los extremos).
  const slope = (k: number, value: (shot: Shot) => number) =>
    k === 0 || k === last
      ? 0
      : (value(path[k + 1]!.shot) - value(path[k - 1]!.shot)) / (path[k + 1]!.at - path[k - 1]!.at);
  const curve = (value: (shot: Shot) => number) =>
    hermite(value(a.shot), value(b.shot), slope(i, value), slope(i + 1, value), h, u);
  const shot = { ...a.shot, target: [0, 0, 0] as [number, number, number] };
  for (const key of SHOT_KEYS) shot[key] = curve((s) => s[key]);
  for (const axis of [0, 1, 2] as const) shot.target[axis] = curve((s) => s.target[axis]);
  return shot;
}

/** Rebote de una pieza lanzada hacia arriba con velocidad `v`: sube, cae, bota una vez y se queda. */
function bounce(v: number, t: number, gravity = 9) {
  const first = (2 * v) / gravity;
  if (t < first) return v * t - (gravity * t * t) / 2;
  const v2 = v * 0.32;
  const k = t - first;
  if (k < (2 * v2) / gravity) return v2 * k - (gravity * k * k) / 2;
  return 0;
}

/** Recorrido de una pieza que resbala por la mesa hasta pararse. */
const slide = (v: number, t: number, drag = 2.4) => (v / drag) * (1 - Math.exp(-drag * t));

/** Cámara lenta al romperse el lacre: el tiempo de las piezas que saltan. */
function slowMotion(k: number) {
  const [a, b] = [0.45, 1.5];
  const u = Math.min(1, Math.max(0, (k - a) / (b - a)));
  // El tiempo va al 16 % y acelera poco a poco hasta la velocidad normal, sin escalón.
  return 0.16 * k + 0.84 * ((b - a) * (u * u * u - (u * u * u * u) / 2) + Math.max(0, k - b));
}

/** Tiempo desde la rotura del lacre. */
const tc0 = (t: number) => t - T.crack;

/** Segundos antes del final en los que la mesa se funde con la pantalla de la carta. */
export const ARRIVAL = 0.7;

const DUST = 150;
const SPARKS = 70;

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
  /** La carta completa: su proporción (alto/ancho, medida en la carta de papel) y sus textos. */
  letter: { aspect: number; greeting: string; message: string; tilt: number };
  tilt: { x: MotionValue<number>; y: MotionValue<number> };
  pace: number;
  handleRef: React.RefObject<SceneHandle | null>;
  onReady: () => void;
  /** La carta está llegando a su sitio: empieza el fundido con la pantalla de la carta. */
  onArriving: () => void;
  onPresented: () => void;
}

/** Migas de cera: velocidad por la mesa (x, y), salto hacia arriba, giro y tamaño. */
const CRUMBS = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2 + 0.3;
  const speed = 0.7 + (i % 5) * 0.32;
  return {
    v: [Math.cos(a) * speed, Math.sin(a) * speed - 0.5, 1.1 + (i % 4) * 0.5],
    spin: 5 + (i % 5) * 2,
    size: 0.016 + (i % 4) * 0.008,
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
  const { theme, handleRef, tilt, pace, onReady, onArriving, onPresented } = props;
  // La carta es la de la invitación: vertical y más alta que el sobre.
  const letterH = LETTER_W * props.letter.aspect;
  // Plano que recorta la carta por debajo del sobre mientras está dentro (sigue al sobre).
  const clip = useMemo(() => new Plane(new Vector3(0, 1, 0), H / 2), []);
  const { camera, size, gl, scene } = useThree();

  const [detail, relief] = useLoader(TextureLoader, [
    "/texturas/papel-detalle.webp",
    "/texturas/papel-relieve.webp",
  ]) as [Texture, Texture];

  const body = useRef<Group>(null);
  const flapMesh = useRef<Mesh>(null);
  const flapGroup = useRef<Group>(null);
  const letter = useRef<Group>(null);
  const seal = useRef<Group>(null);
  const halves = useRef<(Group | null)[]>([]);
  const crumbs = useRef<(Mesh | null)[]>([]);
  const flash = useRef<PointLight>(null);
  const flapShadow = useRef<Mesh>(null);
  const sun = useRef<DirectionalLight>(null);
  const foliage = useRef<Mesh>(null);
  const innerGlow = useRef<Mesh>(null);
  const innerLight = useRef<PointLight>(null);
  const dust = useRef<Points>(null);
  const sparks = useRef<Points>(null);
  const startedAt = useRef<number | null>(null);
  const presented = useRef(false);
  const arriving = useRef(false);
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
      scene: STYLES[theme.style].scene,
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
      // La mesa: el mismo papel, con el grano más menudo.
      table: (() => {
        const t = detail.clone();
        t.wrapS = t.wrapT = RepeatWrapping;
        t.repeat.set(26, 26);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      })(),
      tableBumps: (() => {
        const t = relief.clone();
        t.wrapS = t.wrapT = RepeatWrapping;
        t.repeat.set(26, 26);
        return t;
      })(),
      foliage: canvasTexture(foliageCanvas(), false),
      glow: canvasTexture(glowCanvas(), false),
      // Sombra suave pintada del borde de la solapa sobre el bolsillo.
      flapShadow: canvasTexture(
        softShadowCanvas(look.flapPoints, W / look.flapDepth, {
          pad: FLAP_SHADOW_PAD,
          blur: 0.012,
          color: "rgb(70 50 28 / 0.75)",
        }),
      ),
      letter: canvasTexture(
        letterCanvas({
          aspect: props.letter.aspect,
          paper: look.palette.paper,
          ink: look.palette.ink,
          inkSoft: look.palette.inkSoft,
          gold: look.palette.gold,
          initials: props.initials,
          greeting: props.letter.greeting,
          message: props.letter.message,
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
    props.letter,
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
      letter: new PlaneGeometry(LETTER_W, letterH, 16, 2),
      dust: new BufferGeometry().setAttribute(
        "position",
        new BufferAttribute(new Float32Array(DUST * 3), 3),
      ),
      sparks: new BufferGeometry().setAttribute(
        "position",
        new BufferAttribute(new Float32Array(SPARKS * 3), 3),
      ),
    };
  }, [look, theme.sealShape, letterH]);

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
        clippingPlanes: [clip],
        clipShadows: true,
        normalMap: textures.bumps,
        normalScale: new Vector2(0.5, 0.5),
        roughness: 0.86,
      }),
      seal: [sealFace, sealSide],
      crumb: new MeshStandardMaterial({ color: new Color(look.wax), roughness: 0.4 }),
      table: new MeshStandardMaterial({
        color: new Color(look.scene[1]),
        map: textures.table,
        normalMap: textures.tableBumps,
        normalScale: new Vector2(0.45, 0.45),
        roughness: 0.96,
      }),
      // Lámina de ramas delante del sol: no se ve, solo da sombra.
      foliage: new MeshBasicMaterial({
        map: textures.foliage,
        alphaTest: 0.5,
        side: DoubleSide,
        colorWrite: false,
        depthWrite: false,
      }),
      // La luz que sale del sobre: se suma a la imagen y hace brillar el objetivo.
      innerGlow: new MeshBasicMaterial({
        map: textures.glow,
        color: new Color(0.95, 0.8, 0.5),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
      dust: new PointsMaterial({
        map: textures.glow,
        color: new Color(1.6, 1.4, 1.1),
        size: 0.09,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
      sparks: new PointsMaterial({
        map: textures.glow,
        color: new Color(4, 2.9, 1.3),
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
      flapShadow: new MeshBasicMaterial({
        map: textures.flapShadow,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    };
    for (const material of Object.values(all).flat()) {
      if (!(material instanceof MeshStandardMaterial) || material === all.table) continue;
      material.envMap = environment;
      material.envMapIntensity = material === sealFace ? 0.4 : 0.25;
      // El papel es una lámina: proyecta sombra por las dos caras (por defecto, solo por detrás).
      material.shadowSide = DoubleSide;
    }
    return all;
  }, [textures, look, environment, clip]);

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

  // Encuadre: desde arriba, el sobre cabe a lo ancho en el móvil; al final la carta mide lo que
  // la carta grande de papel (ancho de pantalla menos márgenes).
  const fit = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    const byWidth = distanceToFill(W, FOV, aspect, 0.84);
    const byHeight = distanceToFill(H * 2.5, FOV, 1, 0.95);
    const paperWidth = size.width >= 640 ? 448 : Math.min(352, size.width - 40);
    const letterAt = Math.max(
      distanceToFill(LETTER_W, FOV, aspect, paperWidth / Math.max(1, size.width)),
      distanceToFill(letterH, FOV, 1, 0.85),
    );
    return { distance: Math.max(byWidth, byHeight), letterAt };
  }, [size, letterH]);

  const sealY = H / 2 - look.flapDepth;
  // La carta empieza dentro, con el borde de arriba bajo la bisagra, y sale entera por la boca
  // del sobre hasta quedar sobre la mesa, justo encima de él.
  const letterIn = H / 2 - 0.1 - letterH / 2;
  const letterOut = H / 2 + 0.06 + letterH / 2;

  // Los planos de la película, en orden.
  const path = useMemo(() => {
    const d = fit.distance;
    const seal: [number, number, number] = [0, sealY, 0.05];
    return [
      { at: 0, shot: { target: [0, 0.05, 0], dist: d * 0.92, elev: 44, azim: -13, roll: 0 } },
      { at: T.dolly[1], shot: { target: seal, dist: d * 0.42, elev: 34, azim: 7, roll: -2 } },
      // Mientras el lacre se rompe, la cámara sigue deslizándose muy despacio a su alrededor.
      { at: T.pullBack[0], shot: { target: seal, dist: d * 0.38, elev: 33, azim: 13, roll: -3 } },
      {
        at: T.pullBack[1],
        shot: { target: [0, 0.7, 0.2], dist: d * 0.9, elev: 60, azim: -5, roll: 0 },
      },
      {
        at: T.rise[0] + 0.2,
        shot: { target: [0, letterOut - 0.6, 0.1], dist: d * 0.96, elev: 74, azim: 3, roll: 0 },
      },
      {
        at: T.rise[1] - 0.2,
        shot: { target: [0, letterOut, 0], dist: d, elev: 90, azim: 0, roll: 0 },
      },
    ] satisfies { at: number; shot: Shot }[];
  }, [fit, sealY, letterOut]);

  // Reparto fijo del polvo y de las chispas (posición de partida y carácter de cada una).
  const seeds = useMemo(() => {
    const spread = (i: number, k: number) => (i * k) % 1;
    return {
      dust: Array.from({ length: DUST }, (_, i) => ({
        x: spread(i, 0.6180339887) * 12 - 6,
        y: spread(i, 0.3819660113) * 12 - 5,
        z: 0.15 + spread(i, 0.7548776662) * 5,
        phase: i * 1.7,
      })),
      sparks: Array.from({ length: SPARKS }, (_, i) => ({
        x: spread(i, 0.6180339887) * 2.2 - 1.1,
        delay: spread(i, 0.3819660113) * 1.5,
        vx: spread(i, 0.7548776662) - 0.5,
        vy: 0.25 + spread(i, 0.569840291) * 0.7,
        vz: 0.9 + spread(i, 0.2360679775) * 1.8,
      })),
    };
  }, []);

  // El objetivo: profundidad de campo, brillo, viñeta, curva de color y grano de película.
  const lens = useRef<{
    composer: EffectComposer;
    dof: DepthOfFieldEffect | null;
    bloom: BloomEffect;
    vignette: VignetteEffect;
    focus: Vector3;
    /** Sin desenfoque, para móviles que van justos. */
    simplify: () => void;
  } | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl, {
      frameBufferType: HalfFloatType,
      multisampling: gl.getPixelRatio() > 1.5 ? 0 : 4,
    });
    composer.addPass(new RenderPass(scene, camera));
    const focus = new Vector3();
    const finishing = () => {
      const bloom = new BloomEffect({
        mipmapBlur: true,
        luminanceThreshold: 1.0,
        luminanceSmoothing: 0.25,
        intensity: 0.6,
        radius: 0.72,
      });
      const vignette = new VignetteEffect({ offset: 0.26, darkness: 0.45 });
      const tone = new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL });
      const grain = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY });
      grain.blendMode.opacity.value = 0.055;
      return { bloom, vignette, tone, grain };
    };
    const full = finishing();
    const dof = new DepthOfFieldEffect(camera, {
      focusRange: 1.6,
      bokehScale: 5,
      resolutionScale: 0.5,
    });
    dof.target = focus;
    let pass = new EffectPass(camera, dof, full.bloom, full.vignette, full.tone, full.grain);
    composer.addPass(pass);
    const current: NonNullable<typeof lens.current> = {
      composer,
      dof,
      bloom: full.bloom,
      vignette: full.vignette,
      focus,
      simplify() {
        if (!current.dof) return;
        composer.removePass(pass);
        pass.dispose();
        const lite = finishing();
        pass = new EffectPass(camera, lite.bloom, lite.vignette, lite.tone, lite.grain);
        composer.addPass(pass);
        Object.assign(current, { dof: null, bloom: lite.bloom, vignette: lite.vignette });
      },
    };
    lens.current = current;
    return () => {
      lens.current = null;
      composer.dispose();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    lens.current?.composer.setSize(size.width, size.height);
  }, [size]);

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

  const speed = useRef({ frames: 0, total: 0, done: false, level: 0 });
  const frame = useRef(0);

  // Prioridad 1: la imagen la pinta el objetivo, no el render automático.
  useFrame((state, delta) => {
    const cam = state.camera as PerspectiveCamera;
    const now = state.clock.elapsedTime;
    if (startedAt.current === -1) startedAt.current = now;
    // Para revisar la película plano a plano (capturas): `window.__cine = { t: 1.2, alta: true }`.
    const debug = (window as { __cine?: { t?: number; alta?: boolean } }).__cine;
    const started = startedAt.current !== null || debug?.t !== undefined;
    const t = debug?.t ?? (started ? (now - startedAt.current!) / pace : 0);
    const tx = tilt.x.get();
    const ty = tilt.y.get();
    const post = lens.current;

    // Si el equipo va justo en reposo, se aligera la imagen antes de que empiece la película:
    // primero se quita el desenfoque (lo más caro) y, si aun así no va suelto, se baja la
    // resolución. Se mide un segundo cada vez.
    const meter = speed.current;
    if (!meter.done && !started && !debug?.alta) {
      meter.frames += 1;
      if (meter.frames > 8) meter.total += delta;
      const average = meter.total / Math.max(1, meter.frames - 8);
      const slow =
        (meter.frames === 20 && average > 0.05) || (meter.frames === 50 && average > 0.021);
      if (slow && meter.level === 0) {
        post?.simplify();
        Object.assign(meter, { level: 1, frames: 0, total: 0 });
      } else if (slow) {
        state.setDpr(1);
        meter.done = true;
      } else if (meter.frames >= 50) meter.done = true;
    }

    // Las sombras se recalculan una imagen sí y otra no: las ramas se mueven muy despacio.
    frame.current += 1;
    if (frame.current % 2 === 0 || (tc0(t) >= 0 && tc0(t) < 2.5))
      state.gl.shadowMap.needsUpdate = true;

    // ── Cámara ────────────────────────────────────────────────────────────────────────────
    const shot = shotAt(path, t);
    // En reposo la cámara respira y acompaña la inclinación del móvil; al abrir se calma.
    const calm = 1 - easeInOut(segment(t, 0, 1.2));
    const elev = ((shot.elev + (Math.cos(now * 0.21) * 1.3 - ty * 4) * calm) * Math.PI) / 180;
    const azim = ((shot.azim + (Math.sin(now * 0.17) * 3 + tx * 6) * calm) * Math.PI) / 180;
    const dist = shot.dist * (1 - Math.sin(now * 0.26) * 0.012 * calm);
    DIR.set(Math.sin(azim) * Math.cos(elev), -Math.cos(azim) * Math.cos(elev), Math.sin(elev));
    RIGHT.set(Math.cos(azim), Math.sin(azim), 0);
    UP.crossVectors(DIR, RIGHT);
    cam.quaternion.setFromRotationMatrix(BASIS.makeBasis(RIGHT, UP, DIR));
    cam.rotateZ((shot.roll * Math.PI) / 180);
    cam.position.set(...shot.target).addScaledVector(DIR, dist);
    // El golpe del lacre sacude la cámara un instante.
    const tc = t - T.crack;
    if (tc >= 0 && tc < 0.9) {
      const amp = 0.022 * Math.exp(-5 * tc);
      cam.position.x += Math.sin(tc * 34) * amp;
      cam.position.y += Math.cos(tc * 27) * amp;
    }

    // Sol entre las ramas: la lámina de hojas se mece delante de la luz.
    if (foliage.current) {
      foliage.current.position
        .copy(SUN)
        .multiplyScalar(0.5)
        .addScaledVector(RIGHT.set(1, 0.4, 0), Math.sin(now * 0.35) * 0.18);
      foliage.current.lookAt(0, 0, 0);
      foliage.current.rotateZ(0.4 + Math.sin(now * 0.27) * 0.035);
    }

    // 1. Presión: el sobre cede bajo el dedo y la cera se aplasta un poco.
    const press = Math.sin(segment(t, ...T.press) * Math.PI);
    if (seal.current)
      seal.current.scale.set(
        SEAL_R * (1 + press * 0.05),
        SEAL_R * (1 + press * 0.05),
        SEAL_R * (1 - press * 0.4),
      );

    // 2. El lacre se parte a cámara lenta: las mitades saltan, giran y resbalan por la mesa; las
    //    migas vuelan, botan y se quedan donde caen.
    const broken = tc >= 0;
    const physics = slowMotion(Math.max(0, tc));
    if (broken && !sounds.current.crack) {
      sounds.current.crack = true;
      playSealCrack();
      haptic([10, 30, 18]);
    }
    if (seal.current) seal.current.visible = !broken;
    if (flash.current) flash.current.intensity = broken ? Math.max(0, 1 - tc / 0.22) * 1.2 : 0;
    halves.current.forEach((half, i) => {
      if (!half) return;
      const dir = i === 0 ? -1 : 1;
      half.scale.setScalar(broken ? 1 : 0);
      const wobble = Math.sin(Math.min(physics / 0.6, 1) * Math.PI);
      half.position.set(
        dir * (0.02 + slide(0.95 + i * 0.25, physics)),
        -slide(0.5 + i * 0.3, physics),
        bounce(1.25 + i * 0.2, physics),
      );
      half.rotation.set(
        -wobble * 0.3,
        dir * wobble * 0.22,
        dir * (slide(2.6 + i, physics) + Math.min(physics * 6, 0.3)),
      );
    });
    crumbs.current.forEach((crumb, i) => {
      const c = CRUMBS[i]!;
      if (!crumb) return;
      crumb.scale.setScalar(broken ? 1 : 0);
      crumb.position.set(
        slide(c.v[0]!, physics),
        slide(c.v[1]!, physics),
        bounce(c.v[2]!, physics) + c.size * 0.6 - 0.06,
      );
      const spin = slide(c.spin, physics, 1.6);
      crumb.rotation.set(spin, spin * 0.7, 0);
    });

    // 3. La solapa gira sobre la bisagra y se curva; pasados los 90° queda detrás de la carta.
    const flapK = easeInOut(segment(t, ...T.flap));
    if (flapK > 0 && !sounds.current.flap) {
      sounds.current.flap = true;
      playPaper(0.9, 0.05);
    }
    const angle = Math.PI * 1.02 * flapK;
    if (flapMesh.current) {
      const pos = flapMesh.current.geometry.attributes.position!;
      const profile = flapProfile(FLAP_ROWS, look.flapDepth, angle, 0.7);
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
    if (flapGroup.current)
      flapGroup.current.position.z = angle > Math.PI / 2 ? 0.004 : POCKET_Z + 0.022;

    // La luz de dentro: se enciende al abrirse el sobre y baja cuando la carta ya está fuera.
    const rise = easeInOut(segment(t, ...T.rise));
    const glow = easeOut(segment(t, ...T.glow)) * (1 - 0.7 * segment(t, T.letter[1], T.rise[1]));
    if (innerGlow.current) {
      (innerGlow.current.material as MeshBasicMaterial).opacity = glow * 0.9;
      innerGlow.current.scale.setScalar(3.2 * (0.6 + glow * 0.5));
    }
    if (innerLight.current) innerLight.current.intensity = glow * 0.8 * (1 - rise);

    // Chispas doradas que suben del sobre y se apagan.
    if (sparks.current) {
      const pos = sparks.current.geometry.attributes.position!;
      const since = t - T.glow[0];
      seeds.sparks.forEach((s, i) => {
        const age = since - s.delay;
        if (age < 0 || age > 1.9) return pos.setXYZ(i, 0, 0, -50);
        const k = slide(1, age, 1.1);
        pos.setXYZ(
          i,
          s.x + s.vx * k + Math.sin(age * 5 + i) * 0.04,
          H / 2 - 0.3 + s.vy * k,
          0.05 + s.vz * k,
        );
      });
      pos.needsUpdate = true;
      (sparks.current.material as PointsMaterial).opacity =
        segment(since, 0, 0.3) * (1 - segment(t, T.letter[1] - 0.6, T.rise[0] + 0.4));
    }

    // Motas de polvo en el aire, que suben despacio; cerca de la luz del sobre se ven más.
    if (dust.current) {
      const pos = dust.current.geometry.attributes.position!;
      seeds.dust.forEach((d, i) => {
        pos.setXYZ(
          i,
          d.x + Math.sin(now * 0.3 + d.phase) * 0.25,
          d.y + Math.cos(now * 0.24 + d.phase) * 0.2,
          0.15 + ((d.z + now * 0.06) % 5),
        );
      });
      pos.needsUpdate = true;
      (dust.current.material as PointsMaterial).opacity = 0.32 + glow * 0.4;
    }

    // 4. La carta sale con un tirón y se desliza con fricción, algo flexionada; después sube
    //    hacia la cámara, primero por el borde de arriba, como al sacarla con la mano.
    const pull = segment(t, ...T.letter);
    if (pull > 0 && !sounds.current.letter) {
      sounds.current.letter = true;
      playPaper(0.9, 0.05);
    }
    if (letter.current) {
      const bend = Math.sin(pull * Math.PI) * 0.05;
      letter.current.position.set(
        0,
        lerp(letterIn, letterOut, easeInOut(pull)),
        lerp(LETTER_Z, fit.distance - fit.letterAt, rise),
      );
      // Sube plana (sin inclinarse: se vería encoger y crecer) y acaba girada como la carta
      // de la pantalla siguiente.
      letter.current.rotation.set(
        bend * (1 - rise),
        0,
        lerp(-0.012, (props.letter.tilt * Math.PI) / 180, rise),
      );
    }

    // ── Objetivo: el foco sigue a lo que importa en cada plano ─────────────────────────────
    if (post) {
      const toMouth = easeInOut(segment(t, ...T.pullBack));
      post.focus.set(0, lerp(sealY, H / 2 - 0.2, toMouth), 0.05);
      if (letter.current) post.focus.lerp(letter.current.position, segment(pull, 0.3, 0.9));
      if (post.dof) {
        const macro = Math.sin(easeInOut(segment(t, 0.3, T.pullBack[1])) * Math.PI);
        post.dof.cocMaterial.focusRange = lerp(1.5, 0.55, macro) + rise * 1.2;
        post.dof.bokehScale = lerp(5, 7.5, macro);
      }
      post.bloom.intensity = 0.6 + glow * 0.7;
      post.vignette.darkness = 0.45 + segment(t, 0, 1.2) * 0.25;
      post.composer.render(delta);
    }

    if (!arriving.current && t >= T.rise[1] - ARRIVAL) {
      arriving.current = true;
      onArriving();
    }
    if (!presented.current && t >= T.rise[1]) {
      presented.current = true;
      onPresented();
    }
  }, 1);

  // El fondo es la bruma luminosa del contraluz: la mesa se pierde en ella a lo lejos.
  const haze = mix(look.scene[0], "#ffffff", 0.3);

  return (
    <>
      <color attach="background" args={[haze]} />
      <fog attach="fog" args={[haze, fit.distance * 1.1, fit.distance * 2.3]} />
      <hemisphereLight args={["#fff6e8", "#8a7c66", 0.5]} />
      {/* Relleno suave desde la derecha: las sombras no se quedan negras. */}
      <directionalLight position={[4, -2, 5]} intensity={0.3} color="#f2ece4" />
      <directionalLight
        ref={sun}
        position={SUN}
        intensity={2.3}
        color="#ffeed2"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={5}
        shadow-intensity={0.62}
      />
      <mesh ref={foliage} material={materials.foliage} scale={11} castShadow>
        <planeGeometry />
      </mesh>

      {/* La mesa. */}
      <mesh material={materials.table} position-z={TABLE_Z} receiveShadow>
        <planeGeometry args={[90, 90]} />
      </mesh>

      <points ref={dust} geometry={geometry.dust} material={materials.dust} frustumCulled={false} />
      <points
        ref={sparks}
        geometry={geometry.sparks}
        material={materials.sparks}
        frustumCulled={false}
      />

      <group ref={body}>
        {/* Interior con el forro, visible al levantar la solapa. */}
        <mesh material={materials.inside} receiveShadow castShadow>
          <planeGeometry args={[W, H]} />
        </mesh>
        {/* La luz que sale de dentro: un resplandor en la boca del sobre y una luz que baña el
            forro y la carta. */}
        <mesh
          ref={innerGlow}
          material={materials.innerGlow}
          position={[0, H / 2 - 0.15, 0.02]}
          scale={3.2}
        >
          <planeGeometry />
        </mesh>
        <pointLight
          ref={innerLight}
          position={[0, H / 2 - 0.2, 1.5]}
          color="#ffe2b0"
          intensity={0}
          distance={7}
        />
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
            distance={2.5}
          />
          {geometry.halves.map((g, i) => (
            <group
              key={i}
              ref={(el) => {
                halves.current[i] = el;
              }}
              scale={0}
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
              scale={0}
              castShadow
            >
              <dodecahedronGeometry args={[c.size, 0]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* La carta va fuera del cuerpo: sube sola hacia la cámara. */}
      <group ref={letter} position={[0, 0, LETTER_Z]}>
        <mesh geometry={geometry.letter} material={materials.letter} castShadow receiveShadow />
      </group>
    </>
  );
}

const DIR = new Vector3();
const RIGHT = new Vector3();
const UP = new Vector3();
const BASIS = new Matrix4();

export default function EnvelopeScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden
      flat
      shadows={{ type: PCFShadowMap }}
      dpr={[1, 1.5]}
      camera={{ fov: FOV, near: 0.1, far: 140, position: [0, 0, 8] }}
      gl={{ antialias: false, alpha: false, toneMapping: NoToneMapping }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
      }}
    >
      <Envelope {...props} />
    </Canvas>
  );
}
