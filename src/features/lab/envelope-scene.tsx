"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BackSide,
  DoubleSide,
  FrontSide,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  PCFShadowMap,
  type PerspectiveCamera,
  Shape,
  ShapeGeometry,
} from "three";
import { haptic, playPaper, playSealCrack, unlockAudio } from "../invitation/effects/sound";
import { letterTexture, paperTexture, sealFaceTextures } from "./textures";

/** Medidas del sobre en unidades de escena (apaisado, como el de la versión CSS). */
const W = 3.2;
const H = 2.2;
const FLAP = H * 0.62;
const POCKET_Z = 0.03;
const SEAL_R = 0.27;
const SEAL_Y = H / 2 - FLAP + 0.22;

/** Coreografía en segundos: la misma que la versión CSS. */
const T = {
  press: [0, 0.22],
  crack: [0.22, 0.95],
  flap: [0.6, 1.55],
  letter: [1.45, 2.55],
  present: [2.55, 3.45],
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const CRUMBS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.4;
  return {
    vx: Math.cos(angle) * (0.9 + (i % 3) * 0.35),
    vy: Math.sin(angle) * 0.8 + 1.1,
    vz: 0.6 + (i % 2) * 0.5,
    spin: 4 + i,
    size: 0.028 + (i % 3) * 0.01,
  };
});

function triangle(points: [number, number][]) {
  const shape = new Shape();
  shape.moveTo(...points[0]!);
  for (const p of points.slice(1)) shape.lineTo(...p);
  shape.closePath();
  const geometry = new ShapeGeometry(shape);
  // UV en coordenadas de sobre para que la textura de papel sea continua entre piezas.
  const pos = geometry.attributes.position!;
  const uv = geometry.attributes.uv!;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / W + 0.5, pos.getY(i) / H + 0.5);
  return geometry;
}

export interface SceneControls {
  open: () => void;
  reset: () => void;
}

function Envelope({
  controlsRef,
  onOpened,
  onFps,
  names,
  date,
  place,
}: {
  controlsRef: React.RefObject<SceneControls | null>;
  onOpened: () => void;
  onFps: (fps: number) => void;
  names: string;
  date: string;
  place: string;
}) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const flap = useRef<Group>(null);
  const flapShade = useRef<MeshStandardMaterial>(null);
  const letter = useRef<Group>(null);
  const halves = useRef<(Group | null)[]>([]);
  const crumbs = useRef<(Mesh | null)[]>([]);
  const startedAt = useRef<number | null>(null);
  const opened = useRef(false);
  const fps = useRef({ frames: 0, since: 0 });
  const { camera, size } = useThree();

  const textures = useMemo(() => {
    const [first, second] = names.split(" & ");
    return {
      paper: paperTexture(),
      liner: paperTexture("#d9cdb4"),
      seal: sealFaceTextures(first ?? "", second ?? ""),
      letter: letterTexture({ names, date, place }),
    };
  }, [names, date, place]);

  const geometry = useMemo(
    () => ({
      left: triangle([
        [-W / 2, H / 2],
        [-W / 2, -H / 2],
        [0, 0.02],
      ]),
      right: triangle([
        [W / 2, H / 2],
        [0, 0.02],
        [W / 2, -H / 2],
      ]),
      bottom: triangle([
        [-W / 2, -H / 2],
        [W / 2, -H / 2],
        [0, 0.1],
      ]),
      flap: (() => {
        const g = triangle([
          [-W / 2, 0],
          [0, -FLAP],
          [W / 2, 0],
        ]);
        return g;
      })(),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(geometry).forEach((g) => g.dispose());
      textures.paper.dispose();
      textures.liner.dispose();
      textures.letter.dispose();
      textures.seal.color.dispose();
      textures.seal.metal.dispose();
    },
    [geometry, textures],
  );

  // Encuadre: el sobre siempre cabe a lo ancho, también en un móvil en vertical.
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const halfFov = (cam.fov * Math.PI) / 360;
    const fitWidth = (W * 0.62) / (Math.tan(halfFov) * aspect);
    const fitHeight = (H * 1.25) / Math.tan(halfFov);
    cam.position.set(0, 0.25, Math.max(fitWidth, fitHeight, 5.5));
    cam.lookAt(0, 0.15, 0);
  }, [camera, size]);

  useEffect(() => {
    controlsRef.current = {
      open: () => {
        if (startedAt.current !== null) return;
        unlockAudio();
        startedAt.current = -1; // se fija en el siguiente fotograma con el reloj de la escena
      },
      reset: () => {
        startedAt.current = null;
        opened.current = false;
      },
    };
  }, [controlsRef]);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    fps.current.frames += 1;
    if (now - fps.current.since >= 0.5) {
      onFps(Math.round(fps.current.frames / (now - fps.current.since)));
      fps.current = { frames: 0, since: now };
    }

    if (startedAt.current === -1) {
      startedAt.current = now;
      playSealCrack();
      haptic([8, 30, 14]);
      playPaper(0.7, 0.6);
      playPaper(0.9, 1.5);
    }
    const t = startedAt.current === null ? 0 : now - startedAt.current;

    // Inclinación suave con el puntero, más quieta cuando la carta ya está fuera.
    if (root.current) {
      const calm = 1 - seg(t, T.present) * 0.6;
      root.current.rotation.y = lerp(root.current.rotation.y, state.pointer.x * 0.22 * calm, 0.06);
      root.current.rotation.x = lerp(
        root.current.rotation.x,
        -state.pointer.y * 0.16 * calm - 0.08,
        0.06,
      );
    }

    // 1. Presión: el sobre cede un poco bajo el dedo.
    const press = Math.sin(seg(t, T.press) * Math.PI);
    if (body.current) body.current.scale.setScalar(1 - press * 0.025);

    // 2. Lacre: dos mitades que se separan y caen, más migas de cera.
    const crack = seg(t, T.crack);
    const fall = Math.max(0, t - T.crack[0]);
    halves.current.forEach((half, i) => {
      if (!half) return;
      const dir = i === 0 ? -1 : 1;
      half.position.set(
        dir * fall * 0.55,
        SEAL_Y - 2.2 * fall * fall,
        POCKET_Z + 0.05 + fall * 0.5,
      );
      half.rotation.set(fall * 1.6, 0, dir * (fall * 2.4));
      half.visible = crack < 1;
    });
    crumbs.current.forEach((crumb, i) => {
      const c = CRUMBS[i]!;
      if (!crumb) return;
      crumb.visible = t > T.crack[0] && crack < 1;
      crumb.position.set(
        c.vx * fall,
        SEAL_Y + c.vy * fall - 4.9 * fall * fall,
        POCKET_Z + 0.06 + c.vz * fall,
      );
      crumb.rotation.set(fall * c.spin, fall * c.spin * 0.7, 0);
    });

    // 3. Solapa: gira sobre la bisagra; pasa por detrás de la carta al superar los 90°.
    const flapK = easeInOut(seg(t, T.flap));
    if (flap.current) {
      // Algo más de 180°: la solapa abierta se recuesta hacia atrás y no tapa la carta.
      flap.current.rotation.x = -Math.PI * flapK * 1.04;
      flap.current.position.z = flapK > 0.5 ? 0.004 : POCKET_Z + 0.012;
    }
    // La cara exterior se oscurece cuando la solapa queda de canto a la luz.
    if (flapShade.current) {
      const edge = Math.sin(flapK * Math.PI);
      flapShade.current.color.setScalar(1 - edge * 0.28);
    }

    // 4. Carta: sale con fricción y una leve flexión que se endereza.
    const rise = easeOut(seg(t, T.letter));
    const present = easeInOut(seg(t, T.present));
    if (letter.current) {
      const bend = Math.sin(seg(t, T.letter) * Math.PI) * 0.06;
      letter.current.position.set(
        0,
        lerp(rise * H * 0.86, 0.3, present),
        lerp(0.015, 0.75, present),
      );
      letter.current.rotation.x = -bend + present * 0.04;
      letter.current.scale.setScalar(lerp(1, 1.04, present));
    }

    // 5. El cuerpo del sobre cae y se aparta.
    if (body.current) {
      body.current.position.y = -present * 4.6;
      body.current.visible = present < 1;
      body.current.rotation.z = present * 0.12;
    }

    if (!opened.current && t >= T.present[1]) {
      opened.current = true;
      onOpened();
    }
  });

  const paperProps = {
    map: textures.paper,
    bumpMap: textures.paper,
    bumpScale: 0.6,
    roughness: 0.92,
  };

  return (
    <group ref={root}>
      <group ref={body}>
        {/* Interior del sobre: forro algo más oscuro, visible al abrir. */}
        <mesh receiveShadow castShadow>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial map={textures.liner} roughness={0.95} side={DoubleSide} />
        </mesh>

        {/* Bolsillo delantero: tres pliegues con ligeras diferencias de altura y tono. */}
        <mesh geometry={geometry.left} position-z={POCKET_Z} castShadow receiveShadow>
          <meshStandardMaterial {...paperProps} color="#f3eee3" />
        </mesh>
        <mesh geometry={geometry.right} position-z={POCKET_Z} castShadow receiveShadow>
          <meshStandardMaterial {...paperProps} color="#f3eee3" />
        </mesh>
        <mesh geometry={geometry.bottom} position-z={POCKET_Z + 0.006} castShadow receiveShadow>
          <meshStandardMaterial {...paperProps} color="#fbf8f1" />
        </mesh>

        {/* Solapa articulada en el borde superior. */}
        <group ref={flap} position={[0, H / 2, POCKET_Z + 0.012]}>
          <mesh geometry={geometry.flap} castShadow receiveShadow>
            <meshStandardMaterial ref={flapShade} {...paperProps} side={FrontSide} />
          </mesh>
          <mesh geometry={geometry.flap}>
            <meshStandardMaterial map={textures.liner} roughness={0.95} side={BackSide} />
          </mesh>
        </group>

        {/* Lacre en dos mitades con el monograma dorado. */}
        {[0, 1].map((i) => (
          <group
            key={i}
            ref={(el) => {
              halves.current[i] = el;
            }}
            position={[0, SEAL_Y, POCKET_Z + 0.05]}
          >
            <mesh rotation-x={Math.PI / 2} castShadow>
              <cylinderGeometry
                args={[SEAL_R, SEAL_R * 1.04, 0.07, 40, 1, false, i === 0 ? Math.PI : 0, Math.PI]}
              />
              <meshStandardMaterial color="#5e1824" roughness={0.38} metalness={0.05} />
            </mesh>
            <mesh position-z={0.0355}>
              <circleGeometry
                args={[SEAL_R * 0.98, 40, i === 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI]}
              />
              <meshStandardMaterial
                map={textures.seal.color}
                bumpMap={textures.seal.metal}
                bumpScale={-2}
                metalnessMap={textures.seal.metal}
                metalness={1}
                roughness={0.34}
              />
            </mesh>
          </group>
        ))}
        {CRUMBS.map((c, i) => (
          <mesh
            key={i}
            ref={(el) => {
              crumbs.current[i] = el;
            }}
            visible={false}
          >
            <dodecahedronGeometry args={[c.size, 0]} />
            <meshStandardMaterial color="#5e1824" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* La carta va fuera del cuerpo para poder quedarse cuando el sobre se aparta. */}
      <group ref={letter} position={[0, 0, 0.015]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[W - 0.24, H - 0.2]} />
          <meshStandardMaterial
            map={textures.letter}
            bumpMap={textures.paper}
            bumpScale={0.3}
            roughness={0.9}
            side={DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function EnvelopeScene(props: {
  controlsRef: React.RefObject<SceneControls | null>;
  onOpened: () => void;
  onFps: (fps: number) => void;
  names: string;
  date: string;
  place: string;
}) {
  return (
    <Canvas
      aria-hidden
      shadows={{ type: PCFShadowMap }}
      dpr={[1, 2]}
      camera={{ fov: 35, near: 0.1, far: 60, position: [0, 0.25, 7] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#efebe1"]} />
      <hemisphereLight args={["#fffaf0", "#b9ab90", 1.6]} />
      <directionalLight
        position={[-2, 3.5, 8]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
        shadow-radius={8}
        shadow-intensity={0.4}
      />
      {/* Pared de fondo que recibe la sombra del sobre. */}
      <mesh position-z={-0.35} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#efebe1" roughness={1} />
      </mesh>
      <Envelope {...props} />
    </Canvas>
  );
}
