"""Sobre fotorrealista en Blender: renderiza la secuencia de apertura y exporta las esquinas
de la tarjeta, el bolsillo y la punta de la solapa en coordenadas de pantalla (fracciones).

Uso: python sobre.py <carpeta_salida> [frames separados por comas | all] [muestras]
"""
import json
import math
import os
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

OUT = sys.argv[1]
WHICH = sys.argv[2] if len(sys.argv) > 2 else "all"
SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 64
HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.environ.get("TEXTURAS", os.path.join(HERE, "..", "tex"))
os.makedirs(OUT, exist_ok=True)

# --- Medidas (metros) ---------------------------------------------------------------------
# Sobre vertical (como los de las invitaciones): la carta completa cabe dentro.
W, H = 0.15, 0.215
CY = -0.09  # centro del sobre en la mesa
TOP = CY + H / 2  # bisagra de la solapa
FLAP = H * 0.42
TIP_Y = TOP - H * 0.40  # punta del bolsillo
CARD_W, CARD_H = W - 0.01, H - 0.01
N_FLAP = 18  # fotogramas de la solapa
N_CARD = 22  # fotogramas de la tarjeta
FRAMES = N_FLAP + N_CARD

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
# Criterio de iluminación de producto: pocos rebotes y sin cáusticas (rápido y limpio).
scene.cycles.max_bounces = 3
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.render.resolution_x = 720
scene.render.resolution_y = 1280
scene.render.image_settings.file_format = "PNG"
# Khronos PBR Neutral respeta los colores de producto (AgX desvía el marfil hacia el gris).
scene.view_settings.view_transform = "Khronos PBR Neutral"
scene.view_settings.exposure = -0.15



def image(path, color=True):
    img = bpy.data.images.load(path)
    if not color:
        img.colorspace_settings.name = "Non-Color"
    return img


def add_bsdf(nt, base, roughness=0.8, normal=None, normal_strength=0.6, color_img=None,
             scale=(1, 1), tint=None, sheen=0.0):
    """Añade a un árbol de nodos un BSDF con textura de color, tinte y relieve."""
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Roughness"].default_value = roughness
    if sheen:
        bsdf.inputs["Sheen Weight"].default_value = sheen
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale[0], scale[1], 1)
    nt.links.new(coord.outputs["UV"], mapping.inputs["Vector"])
    if color_img:
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = color_img
        nt.links.new(mapping.outputs["Vector"], tex.inputs["Vector"])
        if tint:
            mix = nt.nodes.new("ShaderNodeMix")
            mix.data_type = "RGBA"
            mix.blend_type = "MULTIPLY"
            mix.inputs["Factor"].default_value = 1.0
            nt.links.new(tex.outputs["Color"], mix.inputs[6])
            mix.inputs[7].default_value = (*tint, 1)
            nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
        else:
            nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    else:
        bsdf.inputs["Base Color"].default_value = (*base, 1)
    if normal:
        ntex = nt.nodes.new("ShaderNodeTexImage")
        ntex.image = normal
        nmap = nt.nodes.new("ShaderNodeNormalMap")
        nmap.inputs["Strength"].default_value = normal_strength
        nt.links.new(mapping.outputs["Vector"], ntex.inputs["Vector"])
        nt.links.new(ntex.outputs["Color"], nmap.inputs["Color"])
        nt.links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
    return bsdf


def material(name, *args, **kwargs):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    bsdf = add_bsdf(nt, *args, **kwargs)
    nt.links.new(bsdf.outputs["BSDF"], nt.nodes["Material Output"].inputs["Surface"])
    return mat


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


paper_n = image(os.path.join(TEX, "Paper002", "Paper002_1K-JPG_NormalGL.jpg"), False)
linen_c = image(os.path.join(TEX, "Fabric036", "Fabric036_1K-JPG_Color.jpg"))
linen_n = image(os.path.join(TEX, "Fabric036", "Fabric036_1K-JPG_NormalGL.jpg"), False)
liner_c = image(os.path.join(HERE, "forro.png"))

PAPER = srgb("#efe4cf")
paper = material("papel", PAPER, 0.72, paper_n, 0.8, scale=(3, 3), sheen=0.15)
paper_side = material("papel-lateral", srgb("#e8dcc4"), 0.74, paper_n, 0.8, scale=(3, 3), sheen=0.15)
card = material("cartulina", srgb("#f8f2e6"), 0.7, paper_n, 0.3, scale=(3, 3), sheen=0.2)
linen = material("lino", None, 0.95, linen_n, 1.0, linen_c, scale=(14, 14),
                 tint=srgb("#b39e82"))
# Ondas suaves de la tela: un mantel nunca está perfectamente liso.
lnt = linen.node_tree
noise = lnt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 7
noise.inputs["Detail"].default_value = 3
bump = lnt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.12
lnt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
lin_bsdf = next(n for n in lnt.nodes if n.type == "BSDF_PRINCIPLED")
lin_nmap = next(n for n in lnt.nodes if n.type == "NORMAL_MAP")
lnt.links.new(lin_nmap.outputs["Normal"], bump.inputs["Normal"])
lnt.links.new(bump.outputs["Normal"], lin_bsdf.inputs["Normal"])
liner = material("forro", None, 0.6, None, color_img=liner_c, scale=(2, 2))

# Solapa: papel por fuera y forro por dentro (cara trasera).
flap_mat = bpy.data.materials.new("solapa")
flap_mat.use_nodes = True
nt = flap_mat.node_tree
nt.nodes.remove(nt.nodes["Principled BSDF"])
geo = nt.nodes.new("ShaderNodeNewGeometry")
mixs = nt.nodes.new("ShaderNodeMixShader")
outer = add_bsdf(nt, PAPER, 0.72, paper_n, 0.8, scale=(3, 3), sheen=0.15)
inner = add_bsdf(nt, None, 0.6, None, color_img=liner_c, scale=(2, 2))
nt.links.new(geo.outputs["Backfacing"], mixs.inputs["Fac"])
nt.links.new(outer.outputs["BSDF"], mixs.inputs[1])
nt.links.new(inner.outputs["BSDF"], mixs.inputs[2])
nt.links.new(mixs.outputs[0], nt.nodes["Material Output"].inputs["Surface"])


def mesh_object(name, verts, faces, mat, uv=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    uvl = me.uv_layers.new()
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            uvl.data[li].uv = uv(v) if uv else (v.x / W + 0.5, (v.y - CY) / H + 0.5)
    obj = bpy.data.objects.new(name, me)
    scene.collection.objects.link(obj)
    obj.data.materials.append(mat)
    for p in me.polygons:
        p.use_smooth = True
    return obj


def solidify(obj, thickness):
    mod = obj.modifiers.new("grosor", "SOLIDIFY")
    mod.thickness = thickness
    mod.offset = -1


# Mesa
mesh_object("mesa", [(-0.6, -0.6, 0), (0.6, -0.6, 0), (0.6, 0.6, 0), (-0.6, 0.6, 0)], [(0, 1, 2, 3)],
            linen, uv=lambda v: (v.x + 0.5, v.y + 0.5))

# Fondo interior del sobre (forro)
back = mesh_object("fondo", [(-W / 2, CY - H / 2, 0.0004), (W / 2, CY - H / 2, 0.0004),
                             (W / 2, TOP, 0.0004), (-W / 2, TOP, 0.0004)], [(0, 1, 2, 3)], liner)
solidify(back, 0.0003)

# Bolsillo: laterales y fondo
z = 0.0011
left = mesh_object("izq", [(-W / 2, TOP, z), (-W / 2, CY - H / 2, z), (0, TIP_Y, z)], [(0, 1, 2)], paper_side)
right = mesh_object("der", [(W / 2, TOP, z), (0, TIP_Y, z), (W / 2, CY - H / 2, z)], [(0, 1, 2)], paper_side)
bottom = mesh_object("abajo", [(-W / 2, CY - H / 2, z + 0.0003), (W / 2, CY - H / 2, z + 0.0003),
                               (0, TIP_Y + 0.008, z + 0.0003)], [(0, 1, 2)], paper)
for o in (left, right, bottom):
    solidify(o, 0.00025)

# Solapa: malla en filas que se estrecha hasta la punta (se dobla fila a fila).
ROWS, COLS = 30, 24


def flap_rows(angle):
    """(y, z) de cada fila desde la bisagra, con la punta retrasada mientras se levanta."""
    lag = 0.55 * math.sin(angle)
    step = FLAP / ROWS
    # Cerrada va por encima del bolsillo; abierta queda tendida en la mesa, por debajo de la tarjeta.
    k = min(1.0, angle / math.pi)
    hinge_z = 0.0018 - 0.00165 * (k * k * (3 - 2 * k))
    pts = [(TOP, hinge_z)]
    y, zz = TOP, hinge_z
    for i in range(ROWS):
        a = angle - lag * ((i + 0.5) / ROWS)
        y += -math.cos(a) * step
        zz += math.sin(a) * step
        pts.append((y, zz))
    return pts


flap_verts = []
flap_faces = []
for r in range(ROWS + 1):
    width = W * (1 - r / ROWS)
    for c in range(COLS + 1):
        flap_verts.append((-width / 2 + width * c / COLS, 0, 0))
for r in range(ROWS):
    for c in range(COLS):
        a = r * (COLS + 1) + c
        b = a + COLS + 1
        flap_faces.append((a, b, b + 1, a + 1))
flap = mesh_object("solapa", flap_verts, flap_faces, flap_mat,
                   uv=lambda v: (v.x / W + 0.5, 0.5))
flap_widths = [W * (1 - r / ROWS) for r in range(ROWS + 1)]


def pose_flap(angle):
    rows = flap_rows(angle)
    for r in range(ROWS + 1):
        y, zz = rows[r]
        w = flap_widths[r]
        for c in range(COLS + 1):
            flap.data.vertices[r * (COLS + 1) + c].co = (-w / 2 + w * c / COLS, y, zz)
    # UV por coordenadas de la solapa cerrada (para el grano del papel).
    flap.data.update()


# UV fijas de la solapa (como si estuviera cerrada)
uvl = flap.data.uv_layers[0]
for poly in flap.data.polygons:
    for li in poly.loop_indices:
        vi = flap.data.loops[li].vertex_index
        r, c = divmod(vi, COLS + 1)
        w = flap_widths[r]
        uvl.data[li].uv = ((-w / 2 + w * c / COLS) / W + 0.5, 1 - r / ROWS * 0.56)

# Tarjeta
card_obj = mesh_object("tarjeta", [(-CARD_W / 2, -CARD_H / 2, 0), (CARD_W / 2, -CARD_H / 2, 0),
                                   (CARD_W / 2, CARD_H / 2, 0), (-CARD_W / 2, CARD_H / 2, 0)],
                       [(0, 1, 2, 3)], card, uv=lambda v: (v.x / CARD_W + 0.5, v.y / CARD_H + 0.5))
solidify(card_obj, 0.0005)

# Luz de ventana (grande y cálida, desde arriba a la izquierda) y relleno suave.
bpy.ops.object.light_add(type="SUN", location=(-0.7, 0.45, 0.55))
key = bpy.context.object
key.data.energy = 4.6
key.data.angle = math.radians(3.5)
key.data.color = (1.0, 0.93, 0.84)
key.rotation_euler = (math.radians(-38), math.radians(-48), 0)
bpy.ops.object.light_add(type="AREA", location=(0.6, -0.5, 0.9))
fill = bpy.context.object
fill.data.energy = 22
fill.data.size = 1.5
fill.rotation_euler = (math.radians(30), math.radians(30), 0)
world = bpy.data.worlds.new("mundo")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.98, 0.94, 0.88, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.22
scene.world = world

# Cámara: un móvil mirando la mesa casi desde arriba.
bpy.ops.object.camera_add(location=(0, -0.16, 0.52))
cam = bpy.context.object
target = Vector((0, 0.0, 0))
cam.rotation_euler = (cam.location - target).to_track_quat("Z", "Y").to_euler()
cam.data.sensor_fit = "HORIZONTAL"
cam.data.lens = 58
scene.camera = cam
# Desenfoque de cámara: la mesa lejana se suaviza, como en una foto con poca profundidad de campo.
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (cam.location - Vector((0, CY, 0))).length
cam.data.dof.aperture_fstop = 2.2

# Sombra de ramas entrando por la ventana: una lámina recortada delante de la luz principal.
ramas = image(os.path.join(HERE, "ramas.png"), False)
gobo_mat = bpy.data.materials.new("ramas")
gobo_mat.use_nodes = True
gnt = gobo_mat.node_tree
gnt.nodes.remove(gnt.nodes["Principled BSDF"])
gtex = gnt.nodes.new("ShaderNodeTexImage")
gtex.image = ramas
gtr = gnt.nodes.new("ShaderNodeBsdfTransparent")
gdf = gnt.nodes.new("ShaderNodeBsdfDiffuse")
gdf.inputs["Color"].default_value = (0.02, 0.02, 0.02, 1)
gmix = gnt.nodes.new("ShaderNodeMixShader")
gnt.links.new(gtex.outputs["Color"], gmix.inputs["Fac"])
gnt.links.new(gtr.outputs["BSDF"], gmix.inputs[1])
gnt.links.new(gdf.outputs["BSDF"], gmix.inputs[2])
gnt.links.new(gmix.outputs[0], gnt.nodes["Material Output"].inputs["Surface"])
gobo = mesh_object("ramas", [(-0.35, -0.35, 0), (0.35, -0.35, 0), (0.35, 0.35, 0), (-0.35, 0.35, 0)],
                   [(0, 1, 2, 3)], gobo_mat, uv=lambda v: (v.x / 0.7 + 0.5, v.y / 0.7 + 0.5))
bpy.context.view_layer.update()
sun_dir = key.matrix_world.to_3x3() @ Vector((0, 0, -1))
gobo.rotation_euler = key.rotation_euler
gobo.location = Vector((0.03, 0.0, 0)) - sun_dir * 0.22
gobo.visible_camera = False


def ease_in_out(x):
    return 4 * x * x * x if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def ease_out(x):
    return 1 - (1 - x) ** 3


def pose(frame):
    if frame < N_FLAP:
        k = ease_in_out(frame / (N_FLAP - 1))
        pose_flap(math.pi * k)
        card_obj.location = (0, CY + 0.001, 0.0008)
        card_obj.rotation_euler = (0, 0, 0)
        return
    pose_flap(math.pi)
    k = ease_out((frame - N_FLAP + 1) / N_CARD)
    # La tarjeta sale hacia arriba, pasa por encima de la solapa abierta y se eleva un poco.
    y = CY + 0.001 + k * H * 1.0
    # Mientras su borde de abajo siga dentro, va entre el fondo y el bolsillo; al salir se eleva.
    out = (y - CARD_H / 2) - TOP
    lift = min(1.0, max(0.0, out / 0.008))
    lift = lift * lift * (3 - 2 * lift)
    zz = 0.0008 + lift * 0.014
    card_obj.location = (0, y, zz)
    card_obj.rotation_euler = (math.radians(-2.5) * lift, 0, math.radians(-1.2) * (1 - k))


def screen(p):
    v = world_to_camera_view(scene, cam, Vector(p))
    return [round(v.x, 5), round(1 - v.y, 5)]


meta = {"frames": FRAMES, "flapFrames": N_FLAP, "cards": [], "pocket": None, "seal": None}
meta["pocket"] = [screen((-W / 2, TOP, z)), screen((0, TIP_Y, z)), screen((W / 2, TOP, z))]
meta["envelope"] = [screen((-W / 2, TOP, 0)), screen((W / 2, TOP, 0)), screen((W / 2, CY - H / 2, 0)),
                    screen((-W / 2, CY - H / 2, 0))]
meta["seal"] = screen((0, TOP - FLAP, 0.002))
meta["sealSize"] = round(abs(screen((0.014, TOP - FLAP, 0.002))[0] - meta["seal"][0]) * 2, 5)

frames = range(FRAMES) if WHICH == "all" else [] if WHICH == "none" else [int(f) for f in WHICH.split(",")]
for f in range(FRAMES):
    pose(f)
    bpy.context.view_layer.update()
    mw = card_obj.matrix_world
    corners = [(-CARD_W / 2, CARD_H / 2), (CARD_W / 2, CARD_H / 2), (CARD_W / 2, -CARD_H / 2),
               (-CARD_W / 2, -CARD_H / 2)]
    meta["cards"].append([screen(mw @ Vector((x, y, 0.0005))) for x, y in corners])
    if f in frames:
        scene.render.filepath = os.path.join(OUT, f"f{f:02d}.png")
        bpy.ops.render.render(write_still=True)
        print("frame", f, flush=True)

with open(os.path.join(OUT, "meta.json"), "w") as fh:
    json.dump(meta, fh)
print("ok")
