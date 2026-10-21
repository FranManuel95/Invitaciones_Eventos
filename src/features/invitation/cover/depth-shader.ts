import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";

/**
 * Portada «foto 3D»: un único triángulo a pantalla completa con un shader que
 * - desplaza cada píxel según el mapa de profundidad (paralaje real con la inclinación y al
 *   levantar la portada),
 * - acerca la foto muy despacio (Ken Burns),
 * - añade grano de película, una viñeta y un destello de luz cálida que cruza una sola vez.
 * Este módulo solo se descarga en la portada (importación dinámica) y nunca con movimiento reducido.
 */

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  uniform vec2 uOffset;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    // object-fit: cover
    float screen = uResolution.x / uResolution.y;
    float image = uImageSize.x / uImageSize.y;
    vec2 scale = screen > image ? vec2(1.0, image / screen) : vec2(screen / image, 1.0);
    // Las texturas se suben con flipY: y = 0 es el borde inferior de la foto.
    vec2 uv = (vUv - 0.5) * scale + 0.5;

    // Ken Burns: de 1.12 a 1.05 en 14 s, hacia la masía.
    float push = 1.12 - 0.07 * smoothstep(0.0, 14.0, uTime);
    uv = (uv - vec2(0.6, 0.42)) / push + vec2(0.6, 0.42);

    // Paralaje: lo cercano se desplaza más que lo lejano.
    float depth = texture2D(uDepth, uv).r;
    uv += uOffset * (depth - 0.35);

    vec3 color = texture2D(uImage, uv).rgb;

    // Destello cálido que cruza de izquierda a derecha entre los segundos 1.4 y 4.4.
    float t = clamp((uTime - 1.4) / 3.0, 0.0, 1.0);
    float leak = smoothstep(0.0, 0.25, t) * (1.0 - smoothstep(0.65, 1.0, t));
    vec2 leakCenter = vec2(mix(-0.3, 1.3, t), 0.35);
    float glow = exp(-distance(vUv * vec2(screen, 1.0), leakCenter * vec2(screen, 1.0)) * 2.6);
    color += vec3(1.0, 0.62, 0.32) * glow * leak * 0.45;

    // Viñeta suave.
    float vignette = smoothstep(1.05, 0.35, distance(vUv, vec2(0.5, 0.48)));
    color *= mix(0.72, 1.0, vignette);

    // Grano de película (cambia 24 veces por segundo, como la película).
    float grain = hash(vUv * uResolution + floor(uTime * 24.0)) - 0.5;
    color += grain * 0.06;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export interface DepthScene {
  /** Desplazamiento de paralaje en unidades de textura (≈ ±0.02). */
  setOffset: (x: number, y: number) => void;
  destroy: () => void;
}

export async function createDepthScene(
  container: HTMLElement,
  photo: string,
  depthMap: string,
): Promise<DepthScene> {
  const [image, depthImage] = await Promise.all([loadImage(photo), loadImage(depthMap)]);

  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: false });
  const gl = renderer.gl;
  gl.canvas.setAttribute("aria-hidden", "true");
  gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  container.appendChild(gl.canvas);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uImage: { value: new Texture(gl, { image, generateMipmaps: false }) },
      uDepth: { value: new Texture(gl, { image: depthImage, generateMipmaps: false }) },
      uResolution: { value: [1, 1] },
      uImageSize: { value: [image.naturalWidth, image.naturalHeight] },
      uOffset: { value: [0, 0] },
      uTime: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  let frame = 0;
  let start = 0;
  const render = (now: number) => {
    frame = requestAnimationFrame(render);
    // En una pestaña oculta el navegador ya pausa requestAnimationFrame.
    start ||= now;
    program.uniforms.uTime.value = (now - start) / 1000;
    renderer.render({ scene: mesh });
  };
  frame = requestAnimationFrame(render);

  return {
    setOffset: (x, y) => {
      program.uniforms.uOffset.value = [x, y];
    },
    destroy: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    },
  };
}
