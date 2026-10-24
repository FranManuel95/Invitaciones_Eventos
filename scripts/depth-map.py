"""Genera el mapa de profundidad de la foto de portada (efecto «foto 3D»).

Usa MiDaS v2.1 small (Intel ISL, licencia MIT) en ONNX. El modelo no se guarda en el repositorio
(66 MB); se descarga de https://github.com/isl-org/MiDaS/releases/download/v2_1/model-small.onnx

Uso:
    python3 scripts/depth-map.py <modelo.onnx> public/fotos/portada.jpg public/fotos/portada-profundidad.png [horizonte]

`horizonte` es la altura del horizonte como fracción de la foto (0 = arriba). Por encima, todo
es cielo y se fija como lo más lejano: MiDaS confunde los cielos luminosos con objetos cercanos.

Salida: PNG en escala de grises, blanco = cerca y negro = lejos, con el mismo tamaño que la foto.
Solo se ejecuta al cambiar la foto; el resultado es un archivo estático más.
"""

import sys

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def main(model_path: str, photo_path: str, out_path: str, horizon: float = 0.45) -> None:
    photo = Image.open(photo_path).convert("RGB")
    size = 256
    x = np.asarray(photo.resize((size, size), Image.BICUBIC), dtype=np.float32) / 255.0
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]

    session = ort.InferenceSession(model_path)
    (depth,) = session.run(None, {session.get_inputs()[0].name: x})
    depth = depth[0]

    # MiDaS devuelve profundidad inversa: valores altos = cerca. Se normaliza solo con el suelo
    # (bajo el horizonte) y con percentiles, para que el cielo y los extremos no aplanen el resto.
    rows = np.linspace(0, 1, size, dtype=np.float32)[:, None]
    ground = rows >= horizon
    lo, hi = np.percentile(depth[np.broadcast_to(ground, depth.shape)], [2, 98])
    depth = np.clip((depth - lo) / (hi - lo), 0, 1)
    # Lo de abajo suele estar más cerca: un 30 % de esa pista refuerza el primer plano.
    prior = np.clip((rows - horizon) / (1 - horizon), 0, 1)
    depth = 0.7 * depth + 0.3 * prior
    # Cielo lejano, con una transición corta para que el horizonte no se rasgue.
    sky = np.clip((rows - horizon) / 0.04, 0, 1)
    depth = depth * sky

    out = Image.fromarray((depth * 255).astype(np.uint8), "L").resize(photo.size, Image.BICUBIC)
    # Suavizado: los bordes duros producen «desgarros» al desplazar los píxeles.
    out = out.filter(ImageFilter.GaussianBlur(radius=max(photo.size) / 300))
    out.save(out_path, optimize=True)
    print(f"{out_path}: {out.size[0]}×{out.size[1]}")


if __name__ == "__main__":
    if len(sys.argv) not in (4, 5):
        sys.exit(__doc__)
    main(*sys.argv[1:4], *(float(a) for a in sys.argv[4:5]))
