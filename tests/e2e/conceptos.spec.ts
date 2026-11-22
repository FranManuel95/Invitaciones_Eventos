import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/*
 * Plantillas de concepto de la ronda 20. Para todas: los nombres en el título, la fecha siempre en
 * la página, sin fallos graves de accesibilidad, el botón que abre y el rótulo de sección propio.
 * Después, la interacción de cada una.
 */
const CONCEPTS = [
  { id: "vinilo", names: /Nuria.*Dani/, date: "2 de octubre de 2027", opening: "concepto" },
  { id: "pasaporte", names: /Paula.*Íker/, date: "26/06/2027", opening: "concepto" },
  { id: "carta", names: /Rocío y Manu/, date: "29 de mayo de 2027", opening: "concepto" },
  { id: "mapa", names: /Aitana y Bruno/, date: "24 de julio de 2027", opening: "concepto" },
  {
    id: "constelacion",
    names: /Lola & Samuel/,
    date: "11 de diciembre de 2027",
    opening: "concepto",
  },
  { id: "comic", names: /Valeria y Jorge/, date: "05/06/27", opening: "concepto" },
  {
    id: "cosecha",
    names: /Blanca.*Rodrigo/,
    date: "25 de septiembre de 2027",
    opening: "concepto",
  },
  { id: "tarot", names: /Abril & Óscar/, date: "20 de noviembre de 2027", opening: "concepto" },
  { id: "arcade", names: /Leire.*Marc/, date: "3 de julio de 2027", opening: "concepto" },
  {
    id: "semillas",
    names: /Amor de Olivia y Tomás/,
    date: "17 de abril de 2027",
    opening: "concepto",
  },
  { id: "instantanea", names: /Carla & Hugo/, date: "11·09·27", opening: "concepto" },
  { id: "abanico", names: /Inma y Curro/, date: "24 de abril de 2027", opening: "concepto" },
  { id: "cerillas", names: /Marta & Quique/, date: "16 de octubre de 2027", opening: "concepto" },
  { id: "galleta", names: /Inés y Bruno/, date: "19 de junio de 2027", opening: "concepto" },
  { id: "casete", names: /Alba & Darío/, date: "17 de julio de 2027", opening: "concepto" },
  { id: "botella", names: /Noa y Leo/, date: "28 de agosto de 2027", opening: "concepto" },
  { id: "crucigrama", names: /Sara y Iván/, date: "15 de mayo de 2027", opening: "concepto" },
  { id: "tren", names: /Paula y Gael/, date: "25/09/27", opening: "concepto" },
  { id: "receta", names: /Elsa y Mateo/, date: "2 de octubre de 2027", opening: "concepto" },
  { id: "concierto", names: /Vega & Marcos/, date: "10.07.27", opening: "concepto" },
  { id: "feria", names: /Macarena y Rafa/, date: "8 de mayo de 2027", opening: "concepto" },
  { id: "biblioteca", names: /Clara y Martín/, date: "23 de abril de 2027", opening: "concepto" },
  { id: "llave", names: /Julia y Andrés/, date: "12 de junio de 2027", opening: "concepto" },
  { id: "partitura", names: /Nerea y Pol/, date: "23 de octubre de 2027", opening: "concepto" },
  { id: "brujula", names: /Lara y Diego/, date: "14 de agosto de 2027", opening: "concepto" },
  { id: "lacre", names: /Aurora y Gonzalo/, date: "18 de septiembre de 2027", opening: "concepto" },
  { id: "poker", names: /Mireia y Joel/, date: "6 de noviembre de 2027", opening: "concepto" },
  { id: "adviento", names: /Laura y Íñigo/, date: "11 de diciembre de 2027", opening: "concepto" },
  { id: "horoscopo", names: /Candela y Rubén/, date: "5 de junio de 2027", opening: "concepto" },
  { id: "metro", names: /Ainhoa y Raúl/, date: "29 de mayo de 2027", opening: "concepto" },
  { id: "equipaje", names: /Berta y Nico/, date: "4 de septiembre de 2027", opening: "concepto" },
  { id: "fidelidad", names: /Gema y Álex/, date: "20 de marzo de 2027", opening: "concepto" },
  { id: "diploma", names: /Marina y Adrián/, date: "26 de junio de 2027", opening: "concepto" },
  { id: "cromos", names: /Cris y Dani/, date: "3 de julio de 2027", opening: "concepto" },
  { id: "bombones", names: /Olga y Sergi/, date: "13 de febrero de 2027", opening: "concepto" },
  { id: "telefono", names: /Pilar y Héctor/, date: "10 de abril de 2027", opening: "concepto" },
  { id: "radio", names: /Silvia y Javier/, date: "9 de octubre de 2027", opening: "concepto" },
  { id: "maquina", names: /Carmen y Lluís/, date: "1 de mayo de 2027", opening: "concepto" },
  { id: "puzle", names: /Ane y Tomás/, date: "19 de junio de 2027", opening: "concepto" },
  { id: "tarta", names: /Rosa y Julián/, date: "22 de mayo de 2027", opening: "concepto" },
  { id: "taquilla", names: /Amaia y Lucas/, date: "20 de noviembre de 2027", opening: "concepto" },
  { id: "globo", names: /Eva y Marco/, date: "11 de septiembre de 2027", opening: "concepto" },
  { id: "nieve", names: /Irene y Pau/, date: "23 de enero de 2027", opening: "concepto" },
  { id: "brindis", names: /Lidia y Óscar/, date: "31 de diciembre de 2027", opening: "concepto" },
  { id: "cometa", names: /Ariadna y Ciro/, date: "12 de junio de 2027", opening: "concepto" },
  { id: "reloj", names: /Miriam y Saúl/, date: "9 de octubre de 2027", opening: "concepto" },
  { id: "faro", names: /Estela y Unai/, date: "21 de agosto de 2027", opening: "concepto" },
  { id: "musica", names: /Celia y Bosco/, date: "24 de abril de 2027", opening: "concepto" },
  { id: "farolillo", names: /Lorena y Iñaki/, date: "17 de julio de 2027", opening: "concepto" },
  { id: "barco", names: /Maite y Fermín/, date: "25 de septiembre de 2027", opening: "concepto" },
  { id: "prensado", names: /Noelia y Arturo/, date: "23 de octubre de 2027", opening: "concepto" },
  { id: "cartas", names: /Ruth y Gabriel/, date: "15 de mayo de 2027", opening: "concepto" },
  { id: "ramo", names: /Patricia y Simón/, date: "26 de junio de 2027", opening: "concepto" },
  { id: "anillos", names: /Alicia y Ramiro/, date: "13 de noviembre de 2027", opening: "concepto" },
  { id: "baile", names: /Mar y Ismael/, date: "12 de febrero de 2027", opening: "concepto" },
  { id: "capsula", names: /Elisa y Jacobo/, date: "29 de mayo de 2027", opening: "concepto" },
  { id: "sellos", names: /Nora y Fidel/, date: "4 de septiembre de 2027", opening: "concepto" },
  { id: "disco", names: /Valentina y Joaquín/, date: "7 de agosto de 2027", opening: "concepto" },
  { id: "cuaderno", names: /Ángela y Hernán/, date: "2 de octubre de 2027", opening: "concepto" },
  { id: "pinata", names: /Jimena y Mauro/, date: "3 de julio de 2027", opening: "concepto" },
  { id: "arroz", names: /Raquel y Eloy/, date: "18 de septiembre de 2027", opening: "concepto" },
  { id: "vela", names: /Sonia y Tristán/, date: "11 de diciembre de 2027", opening: "concepto" },
  { id: "columpio", names: /Leonor y Teodoro/, date: "5 de junio de 2027", opening: "concepto" },
  { id: "semaforo", names: /Irati y Mikel/, date: "10 de julio de 2027", opening: "concepto" },
  {
    id: "paraguas",
    names: /Carolina y Damián/,
    date: "16 de octubre de 2027",
    opening: "concepto",
  },
  { id: "cascanueces", names: /Adela y Gil/, date: "18 de diciembre de 2027", opening: "concepto" },
  { id: "hamaca", names: /Begoña y Ulises/, date: "28 de agosto de 2027", opening: "concepto" },
  { id: "picnic", names: /Mónica y Aitor/, date: "19 de junio de 2027", opening: "concepto" },
  { id: "molinillo", names: /Celeste y Lisandro/, date: "8 de mayo de 2027", opening: "concepto" },
  {
    id: "candado",
    names: /Marisa y Germán/,
    date: "11 de septiembre de 2027",
    opening: "concepto",
  },
  { id: "gramola", names: /Rebeca y Nacho/, date: "24 de julio de 2027", opening: "concepto" },
  { id: "huellas", names: /Ariana y Enzo/, date: "12 de junio de 2027", opening: "concepto" },
  { id: "nevera", names: /Natalia y Lucio/, date: "17 de abril de 2027", opening: "concepto" },
  { id: "tetera", names: /Esther y Pelayo/, date: "30 de octubre de 2027", opening: "concepto" },
  { id: "pompas", names: /Abigail y Fausto/, date: "22 de mayo de 2027", opening: "concepto" },
  {
    id: "herradura",
    names: /Yolanda y Ángel/,
    date: "25 de septiembre de 2027",
    opening: "concepto",
  },
  { id: "grulla", names: /Miren y Rómulo/, date: "10 de abril de 2027", opening: "concepto" },
  { id: "campanas", names: /Iris y Matías/, date: "9 de octubre de 2027", opening: "concepto" },
  { id: "hilo", names: /Greta y Eneko/, date: "26 de junio de 2027", opening: "concepto" },
  { id: "pajarera", names: /Alma y Jaime/, date: "15 de mayo de 2027", opening: "concepto" },
  { id: "persiana", names: /Lorea y Rafael/, date: "19 de junio de 2027", opening: "concepto" },
  { id: "cuco", names: /Sabela y Ezequiel/, date: "4 de septiembre de 2027", opening: "concepto" },
  { id: "tiza", names: /Victoria y Telmo/, date: "17 de julio de 2027", opening: "concepto" },
] as const;

const cover = (page: Page, id: string) => page.locator(`[data-cover='${id}']`);

/** Tras la portada llega el sobre de la plantilla (a pantalla completa o sobre la mesa). */
async function expectOpened(page: Page) {
  await expect(page.locator("#envelope-title")).toBeAttached();
}

test.describe("plantillas de concepto (segunda tanda)", () => {
  test("la apertura de concepto, elegida a mano, trae la carta en el objeto", async ({ page }) => {
    await page.goto("/i/elena-y-pablo?plantilla=telegrama&apertura=concepto");
    await cover(page, "telegrama")
      .getByRole("button", { name: /toca para abrir/i })
      .click();
    const opening = page.locator("[data-opening='concepto']");
    await expect(opening.getByText("Servicio de telégrafos · Urgente")).toBeVisible();
    await expect(opening.getByRole("heading", { name: "Elena y Pablo" })).toBeVisible();
    await page.getByRole("button", { name: "Abrir el telegrama" }).click();
    await expect(page.getByRole("heading", { name: /^Hola, Elena y Pablo/ })).toBeVisible();
    // La carta lleva el membrete y la despedida del concepto.
    await expect(page.locator("article[data-layout] .concept-letterhead").first()).toHaveText(
      "Telegrama · Texto completo",
    );
    await expect(page.locator("article[data-layout] .concept-signoff").first()).toHaveText(
      "Fin del mensaje STOP",
    );
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id),
    ).toEqual([]);
  });

  test("en pantallas bajas el botón de abrir queda siempre a la vista", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();
    for (const id of [...CONCEPTS.map((c) => c.id), "telegrama", "postal"]) {
      await page.goto(`/i/familia-garcia?plantilla=${id}`);
      const open = cover(page, id)
        .getByRole("button", { name: /toca para abrir/i })
        .last();
      await expect(open).toBeInViewport({ ratio: 1 });
    }
    await context.close();
  });

  test("el pase del invitado se viste del concepto sin perder lo importante", async ({ page }) => {
    await page.goto("/i/elena-y-pablo?plantilla=embarque");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const next = page.getByRole("button", { name: /^(Siguiente|Revisar)/ });
    await page.getByRole("button", { name: "Sí, asistiré" }).click();
    await next.click();
    await page.getByText("No, iremos por nuestra cuenta").click();
    await page
      .getByRole("group", { name: /plazas en vuestro coche/ })
      .getByText("No", { exact: true })
      .click();
    await next.click();
    for (const name of ["Elena Vidal", "Pablo Serra"]) {
      await page
        .getByRole("group", { name: `Menú para ${name}` })
        .getByText("Pescado")
        .click();
    }
    await next.click();
    await next.click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    const pass = page.locator("#pase article");
    await expect(pass.getByText("Tarjeta de embarque")).toBeVisible();
    await expect(pass.getByRole("heading", { name: "Pase de Elena y Pablo" })).toBeVisible();
    await expect(pass.getByText("Pasajeros")).toBeVisible();
    // Las etiquetas que importan siguen diciendo mesa y autobús.
    await expect(pass.getByText("Asiento (mesa)")).toBeVisible();
    await expect(pass.getByText("Conexión en autobús")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include("#pase").analyze();
    expect(
      violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id),
    ).toEqual([]);
  });

  for (const concept of CONCEPTS) {
    test(`${concept.id}: portada accesible, se abre y el interior lleva su rótulo`, async ({
      page,
    }) => {
      await page.goto(`/i/familia-garcia?plantilla=${concept.id}`);
      const stage = cover(page, concept.id);
      await expect(stage.getByRole("heading", { level: 1, name: concept.names })).toBeAttached();
      await expect(stage.getByText(concept.date).first()).toBeAttached();
      // Con las animaciones de entrada ya asentadas.
      await page.waitForTimeout(1500);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
      await stage.getByRole("button", { name: /toca para abrir/i }).click();
      await expectOpened(page);
      await page.getByRole("button", { name: "Saltar intro" }).click();
      await expect(page.locator(`[data-motif='${concept.id}']`)).toBeAttached();
      const sprig = page.locator("#fecha .motif-sprig");
      await expect(sprig).toBeVisible();
      const label = await sprig.evaluate(
        (el) => getComputedStyle(el, "::before").content + getComputedStyle(el, "::after").content,
      );
      expect(label.replaceAll("none", "").replaceAll('""', "")).not.toBe("");
      const { violations: inside } = await new AxeBuilder({ page }).include("#fecha").analyze();
      expect(
        inside.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id),
      ).toEqual([]);
    });
  }

  test("pasaporte: al abrirlo, la hoja de datos va a nombre del invitado", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=pasaporte");
    const stage = cover(page, "pasaporte");
    const book = stage.locator("[data-side]");
    await expect(book).toHaveAttribute("data-side", "tapa");
    await stage.getByRole("button", { name: "Abrir el pasaporte" }).click();
    await expect(book).toHaveAttribute("data-side", "datos");
    await expect(stage.getByText("Familia García", { exact: true })).toBeVisible();
    await expect(stage.getByText("ADMITIDO")).toBeVisible();
    await expect(stage.getByRole("button", { name: "Cerrar el pasaporte" })).toBeVisible();
  });

  test("carta: la campana se levanta con el botón y la fecha queda a la vista", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=carta");
    const stage = cover(page, "carta");
    const cloche = stage.locator("[data-cloche]");
    await expect(cloche).toHaveAttribute("data-cloche", "puesta");
    await stage.getByRole("button", { name: "Destapar" }).click();
    await expect(cloche).toHaveAttribute("data-cloche", "levantada");
    await expect(stage.getByRole("button", { name: "Destapar" })).toHaveCount(0);
    // Los platos son el programa, con su hora.
    await expect(stage.getByText("Ceremonia")).toBeVisible();
    await expect(stage).toBeVisible();
  });

  test("tarot: la carta se gira y es la de los enamorados", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=tarot");
    const stage = cover(page, "tarot");
    const card = stage.locator("[data-side]");
    await expect(card).toHaveAttribute("data-side", "dorso");
    await stage.getByRole("button", { name: "Dar la vuelta a la carta" }).click();
    await expect(card).toHaveAttribute("data-side", "cara");
    await expect(stage.getByText("Los enamorados")).toBeVisible();
    await expect(stage.getByText("XX · XI · MMXXVII")).toBeVisible();
  });

  test("mapa: seguir la ruta con el puntero hasta la X abre la invitación", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=mapa");
    const stage = cover(page, "mapa");
    const map = stage.locator("svg[data-route]");
    await expect(map).toHaveAttribute("data-route", "pendiente");
    const box = (await map.boundingBox())!;
    // El dibujo mide 360 × 500 y se ajusta centrado dentro de su hueco.
    const scale = Math.min(box.width / 360, box.height / 500);
    const left = box.x + (box.width - 360 * scale) / 2;
    const top = box.y + (box.height - 500 * scale) / 2;
    const route = [
      [52, 452],
      [83, 398],
      [96, 344],
      [118, 322],
      [174, 322],
      [222, 308],
      [232, 290],
      [208, 236],
      [200, 186],
      [214, 170],
      [268, 164],
      [302, 132],
      [306, 112],
    ];
    await page.mouse.move(left + 52 * scale, top + 452 * scale);
    await page.mouse.down();
    for (const [x, y] of route) {
      await page.mouse.move(left + x! * scale, top + y! * scale, { steps: 6 });
    }
    await page.mouse.up();
    await expect(map).toHaveAttribute("data-route", "hecha");
    await expectOpened(page);
  });

  test("constelación: cada toque une una estrella y, al completarla, se abre", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=constelacion");
    const stage = cover(page, "constelacion");
    const sky = stage.locator("svg[data-stars]");
    await expect(sky).toHaveAttribute("data-stars", "sueltas");
    // Los actos del programa dan nombre a las estrellas.
    await expect(sky.getByText("Ceremonia")).toBeVisible();
    for (let i = 0; i < 3; i += 1) await sky.click();
    await expect(sky).toHaveAttribute("data-stars", "unidas");
    await expectOpened(page);
  });

  test("cómic: las viñetas se pasan con los botones y la última trae la fecha", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=comic");
    const stage = cover(page, "comic");
    await expect(stage.getByText("¡Estáis invitados!")).toBeVisible();
    await expect(stage.getByRole("button", { name: "Viñeta anterior" })).toBeDisabled();
    await stage.getByRole("button", { name: "Viñeta siguiente" }).click();
    await expect(stage.getByText(/Mientras tanto, en/)).toBeVisible();
    await stage.getByRole("button", { name: "Viñeta siguiente" }).click();
    await expect(stage.getByText("5 de junio de 2027")).toBeVisible();
    await expect(stage.getByRole("button", { name: "Viñeta siguiente" })).toBeDisabled();
    // Pasar viñetas no levanta la portada.
    await expect(stage).toBeVisible();
  });

  test("semillas: al sembrar brotan las flores y el botón queda hecho", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=semillas");
    const stage = cover(page, "semillas");
    const bed = stage.locator("[data-sown]");
    await expect(bed).toHaveAttribute("data-sown", "no");
    await stage.getByRole("button", { name: "Sembrar", exact: true }).click();
    await expect(bed).toHaveAttribute("data-sown", "si");
    await expect(stage.getByRole("button", { name: "Sembrado" })).toBeDisabled();
  });

  test("instantánea: frotar la foto la revela, y también el botón", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=instantanea");
    const stage = cover(page, "instantanea");
    const photo = stage.locator("[data-developed]");
    await expect(photo).toHaveAttribute("data-developed", "no");
    // Frotar con el dedo no levanta la portada.
    const box = (await photo.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(box.x + box.width - 20, box.y + 30 + i * 30, { steps: 4 });
      await page.mouse.move(box.x + 20, box.y + 45 + i * 30, { steps: 4 });
    }
    await page.mouse.up();
    // Frotando se revela del todo, sin levantar la portada.
    await expect(photo).toHaveAttribute("data-developed", "si");
    await expect(stage).toBeVisible();
    await expect(stage.getByRole("button", { name: "Revelada" })).toBeDisabled();
    // Sin frotar, el botón hace lo mismo.
    await page.reload();
    await cover(page, "instantanea").getByRole("button", { name: "Revelar la foto" }).click();
    await expect(cover(page, "instantanea").locator("[data-developed]")).toHaveAttribute(
      "data-developed",
      "si",
    );
  });

  test("abanico: se despliega con el botón y con el dedo", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=abanico");
    const stage = cover(page, "abanico");
    const fan = stage.locator("[data-fan]");
    await expect(fan).toHaveAttribute("data-fan", "cerrado");
    const box = (await fan.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.6);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 180, box.y + box.height * 0.6, { steps: 10 });
    await page.mouse.up();
    await expect(fan).toHaveAttribute("data-fan", "abierto");
    await expect(stage.getByRole("button", { name: "Abanico abierto" })).toBeDisabled();
    await expect(stage).toBeVisible();
  });

  test("cerillas: al sacar una cerilla se enciende", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cerillas");
    const stage = cover(page, "cerillas");
    await expect(stage.locator("[data-box]")).toHaveAttribute("data-box", "cerrada");
    await stage.getByRole("button", { name: "Sacar una cerilla" }).click();
    await expect(stage.locator("[data-box]")).toHaveAttribute("data-box", "abierta");
    await expect(stage.locator("[data-lit]")).toBeAttached();
    await expect(stage.getByRole("button", { name: "Cerilla encendida" })).toBeDisabled();
  });

  test("galleta: se parte con el dedo y aparece la fortuna", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=galleta");
    const stage = cover(page, "galleta");
    const cookie = stage.locator("[data-cookie]");
    await expect(cookie).toHaveAttribute("data-cookie", "entera");
    const box = (await cookie.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    await expect(cookie).toHaveAttribute("data-cookie", "partida");
    await expect(stage.getByText(/Números de la suerte/)).toBeVisible();
    await expect(stage).toBeVisible();
  });

  test("casete: se rebobina con el botón y la lista es el programa", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=casete");
    const stage = cover(page, "casete");
    await expect(stage.getByText("1. Ceremonia")).toBeAttached();
    await stage.getByRole("button", { name: "Rebobinar la cinta" }).click();
    await expect(stage.locator("[data-tape]")).toHaveAttribute("data-tape", "rebobinada");
    await expect(stage.getByRole("button", { name: "Lista para sonar" })).toBeDisabled();
  });

  test("botella: al quitar el corcho sale el mensaje", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=botella");
    const stage = cover(page, "botella");
    const bottle = stage.locator("[data-bottle]");
    const box = (await bottle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 30);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 200, { steps: 10 });
    await page.mouse.up();
    await expect(bottle).toHaveAttribute("data-bottle", "abierta");
    await expect(stage.getByRole("button", { name: "Mensaje leído" })).toBeDisabled();
    await expect(stage).toBeVisible();
  });

  test("crucigrama: tocar una casilla escribe su letra y resolver da los nombres", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=crucigrama");
    const stage = cover(page, "crucigrama");
    const grid = stage.locator("[data-solved]");
    await grid.locator("button").first().click();
    await expect(grid.locator("button").first()).not.toHaveText("");
    await stage.getByRole("button", { name: "Resolver el crucigrama" }).click();
    await expect(grid).toHaveAttribute("data-solved", "si");
    await expect(stage.getByRole("heading", { level: 1, name: "Sara y Iván" })).toBeVisible();
  });

  test("tren: cada toque pica el billete, sin levantar la portada", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=tren");
    const stage = cover(page, "tren");
    const ticket = stage.locator("[data-punched]");
    await ticket.click({ position: { x: 40, y: 40 } });
    await expect(ticket).toHaveAttribute("data-punched", "1");
    await expect(stage).toBeVisible();
    await stage.getByRole("button", { name: "Picar el billete" }).click();
    await expect(ticket).toHaveAttribute("data-punched", "3");
    await expect(stage.getByRole("button", { name: "Billete picado" })).toBeDisabled();
  });

  test("receta: se tachan los ingredientes y queda lista", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=receta");
    const stage = cover(page, "receta");
    await stage.getByRole("checkbox", { name: /Dos novios/ }).check();
    await expect(stage.getByRole("checkbox", { name: /Dos novios/ })).toBeChecked();
    await stage.getByRole("button", { name: "Tenerlo todo" }).click();
    await expect(stage.locator("[data-recipe]")).toHaveAttribute("data-recipe", "lista");
    await expect(stage.getByRole("button", { name: "¡Listo para servir!" })).toBeDisabled();
  });

  test("concierto: la entrada se escanea y queda válida", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=concierto");
    const stage = cover(page, "concierto");
    await stage.getByRole("button", { name: "Escanear la entrada" }).click();
    await expect(stage.locator("[data-scan]")).toHaveAttribute("data-scan", "valida");
    await expect(stage.getByRole("button", { name: "Entrada válida" })).toBeDisabled();
  });

  test("feria: cada farolillo se enciende al tocarlo y el botón los enciende todos", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=feria");
    const stage = cover(page, "feria");
    const garland = stage.locator("[data-lit]");
    await garland.locator("button").first().click();
    await expect(garland).toHaveAttribute("data-lit", "apagados");
    await expect(stage).toBeVisible();
    await stage.getByRole("button", { name: "Encender los farolillos" }).click();
    await expect(garland).toHaveAttribute("data-lit", "todos");
  });

  test("biblioteca: tocar la ficha sella la fecha de la boda", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=biblioteca");
    const stage = cover(page, "biblioteca");
    const row = stage.locator("[data-stamped]");
    await expect(row).toHaveAttribute("data-stamped", "no");
    await stage.getByRole("heading", { level: 1 }).click();
    await expect(row).toHaveAttribute("data-stamped", "si");
    await expect(stage.getByRole("button", { name: "Fecha sellada" })).toBeDisabled();
    await expect(stage).toBeVisible();
  });

  test("llave: se gira en la cerradura con el dedo", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=llave");
    const stage = cover(page, "llave");
    const lock = stage.locator("[data-lock]");
    const box = (await lock.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 180, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    await expect(lock).toHaveAttribute("data-lock", "abierta");
    await expect(stage.getByRole("button", { name: "Puerta abierta" })).toBeDisabled();
    await expect(stage).toBeVisible();
  });

  test("partitura: cada nota suena al tocarla y el botón toca la melodía", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=partitura");
    const stage = cover(page, "partitura");
    await stage.locator("[data-note]").first().click();
    await expect(stage.locator("[data-note]").first()).toHaveAttribute("data-note", "sonada");
    await stage.getByRole("button", { name: "Tocar la melodía" }).click();
    await expect(stage.locator("[data-score]")).toHaveAttribute("data-score", "tocada");
    await expect(stage).toBeVisible();
  });

  test("brújula: la aguja encuentra el rumbo y enseña las coordenadas", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=brujula");
    const stage = cover(page, "brujula");
    await expect(stage.getByText(/42° 53′ N/)).toBeVisible();
    await stage.getByRole("button", { name: "Buscar el rumbo" }).click();
    await expect(stage.locator("[data-compass]")).toHaveAttribute("data-compass", "encontrado");
  });

  test("lacre: el sello se estampa con el vídeo y quedan las iniciales", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=lacre");
    const stage = cover(page, "lacre");
    const wax = stage.locator("[data-stamp]");
    await expect(wax).toHaveAttribute("data-stamp", "listo");
    await stage.getByRole("button", { name: "Estampar el sello" }).click();
    await expect(wax).toHaveAttribute("data-stamp", "sellado", { timeout: 15_000 });
    await expect(stage.getByRole("button", { name: "Carta sellada" })).toBeDisabled();
  });

  test("póker: se destapan las cartas y sale escalera de color", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=poker");
    const stage = cover(page, "poker");
    await stage.getByRole("button", { name: "Destapar las cartas" }).click();
    await expect(stage.locator("[data-hand]")).toHaveAttribute("data-hand", "escalera");
    await expect(stage.getByRole("button", { name: "¡Escalera de color!" })).toBeDisabled();
  });

  test("calendario de puertas: se abre la puerta del día de la boda", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=adviento");
    const stage = cover(page, "adviento");
    const doors = stage.locator("[data-door]");
    await doors.locator("button").first().click();
    await expect(stage).toBeVisible();
    await stage.getByRole("button", { name: "Abrir la puerta del 11" }).click();
    await expect(doors).toHaveAttribute("data-door", "abierta");
  });

  test("horóscopo: el signo es el del día y la predicción se lee al tocarla", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=horoscopo");
    const stage = cover(page, "horoscopo");
    await expect(stage.getByText("Géminis")).toBeVisible();
    await stage.locator("[data-read]").click();
    await expect(stage.locator("[data-read]")).toHaveAttribute("data-read", "si");
    await expect(stage.getByRole("button", { name: "Predicción leída" })).toBeDisabled();
  });

  test("metro: el tren recorre las paradas del programa", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=metro");
    const stage = cover(page, "metro");
    await expect(stage.getByText("Ceremonia")).toBeVisible();
    await stage.getByRole("button", { name: "Subir al tren" }).click();
    await expect(stage.locator("[data-metro]")).toHaveAttribute("data-metro", "llegada");
  });

  test("equipaje: la etiqueta se da la vuelta y enseña la fecha", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=equipaje");
    const stage = cover(page, "equipaje");
    const tag = stage.locator("[data-tag]");
    await tag.click();
    await expect(tag).toHaveAttribute("data-tag", "detras");
    await expect(stage).toBeVisible();
    await stage.getByRole("button", { name: "Ver los pasajeros" }).click();
    await expect(tag).toHaveAttribute("data-tag", "delante");
  });

  test("fidelidad: el último sello da la boda gratis", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=fidelidad");
    const stage = cover(page, "fidelidad");
    await stage.getByRole("button", { name: "Poner el último sello" }).click();
    await expect(stage.locator("[data-card]")).toHaveAttribute("data-card", "completa");
    await expect(stage.getByRole("button", { name: "¡Boda gratis!" })).toBeDisabled();
  });

  test("diploma: se desenrolla tirando del rodillo", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=diploma");
    const stage = cover(page, "diploma");
    const scroll = stage.locator("[data-diploma]");
    const box = (await scroll.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 10);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 330, { steps: 10 });
    await page.mouse.up();
    await expect(scroll).toHaveAttribute("data-diploma", "abierto");
    await expect(stage.getByText("Licenciados en quererse")).toBeVisible();
    await expect(stage).toBeVisible();
  });

  test("cromos: al abrir el sobre salen los cromos", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cromos");
    const stage = cover(page, "cromos");
    await stage.getByRole("button", { name: "Rasgar el sobre" }).click();
    await expect(stage.locator("[data-pack]")).toHaveAttribute("data-pack", "abierto");
    await expect(stage.getByRole("button", { name: "¡Los tengo todos!" })).toBeDisabled();
  });

  test("bombones: cada bombón dice un dato del día", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=bombones");
    const stage = cover(page, "bombones");
    const box = stage.locator("[data-box]");
    await box.locator("button").nth(1).click();
    await expect(stage.getByText("Relleno de lugar")).toBeVisible();
    await expect(stage.getByText("Vic", { exact: true })).toBeVisible();
    await expect(stage).toBeVisible();
  });

  test("teléfono: se marca la fecha en el disco", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=telefono");
    const stage = cover(page, "telefono");
    await stage.getByRole("button", { name: "Marcar la fecha" }).click();
    await expect(stage.locator("[data-phone]")).toHaveAttribute("data-phone", "llamando", {
      timeout: 15_000,
    });
  });

  test("radio: la aguja se sintoniza en la emisora de la boda", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=radio");
    const stage = cover(page, "radio");
    await stage.getByRole("button", { name: /^Sintonizar/ }).click();
    await expect(stage.locator("[data-radio]")).toHaveAttribute("data-radio", "sintonizada");
    await expect(stage.getByText(/En antena: la boda de Silvia y Javier/)).toBeVisible();
  });

  test("máquina de escribir: las teclas escriben los nombres", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=maquina");
    const stage = cover(page, "maquina");
    const title = stage.getByRole("heading", { level: 1 });
    await expect(title).toHaveAttribute("data-typed", "no");
    await stage.getByRole("button", { name: "Escribir los nombres" }).click();
    await expect(title).toHaveAttribute("data-typed", "si");
    await expect(title).toHaveText(/Carmen y Lluís/);
  });

  test("puzle: girar las piezas las encaja", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=puzle");
    const stage = cover(page, "puzle");
    const board = stage.locator("[data-puzzle]");
    await board.locator("button").first().click();
    await expect(board).toHaveAttribute("data-puzzle", "revuelto");
    await stage.getByRole("button", { name: "Encajar las piezas" }).click();
    await expect(board).toHaveAttribute("data-puzzle", "completo");
    await expect(stage).toBeVisible();
  });

  test("tarta: al cortar la porción se leen los pisos", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=tarta");
    const stage = cover(page, "tarta");
    await stage.getByRole("button", { name: "Cortar la tarta" }).click();
    await expect(stage.locator("[data-cake]")).toHaveAttribute("data-cake", "servida");
    await expect(stage.getByText("Astorga")).toBeVisible();
  });

  test("cine: tocar la entrada arranca la matriz", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=taquilla");
    const stage = cover(page, "taquilla");
    const ticket = stage.locator("[data-ticket]");
    await ticket.click();
    await expect(ticket).toHaveAttribute("data-ticket", "arrancada");
    await expect(stage).toBeVisible();
  });

  test("globo: al soltar el lastre sube", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=globo");
    const stage = cover(page, "globo");
    await stage.getByRole("button", { name: "Soltar el lastre" }).click();
    await expect(stage.locator("[data-balloon]")).toHaveAttribute("data-balloon", "volando");
  });

  test("bola de nieve: al agitarla nieva y después se posa", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=nieve");
    const stage = cover(page, "nieve");
    const globe = stage.locator("[data-globe]");
    await globe.click();
    await expect(globe).toHaveAttribute("data-globe", "nevando");
    await expect(globe).toHaveAttribute("data-globe", "posada");
    await expect(stage).toBeVisible();
  });

  test("brindis: las copas chocan", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=brindis");
    const stage = cover(page, "brindis");
    await stage.getByRole("button", { name: "Brindar" }).click();
    await expect(stage.locator("[data-toast]")).toHaveAttribute("data-toast", "chin-chin");
  });

  test("cometa: al tirar del hilo, vuela", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cometa");
    const stage = cover(page, "cometa");
    await stage.getByRole("button", { name: "Tirar del hilo" }).click();
    await expect(stage.locator("[data-kite]")).toHaveAttribute("data-kite", "volando");
  });

  test("reloj: al darle la vuelta cae la arena", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=reloj");
    const stage = cover(page, "reloj");
    await stage.getByRole("button", { name: "Dar la vuelta al reloj" }).click();
    await expect(stage.locator("[data-hourglass]")).toHaveAttribute("data-hourglass", "vacio", {
      timeout: 8000,
    });
    await expect(stage.getByText("¡Se acabó la espera!")).toBeVisible();
  });

  test("caja de música: con tres vueltas de cuerda suena", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=musica");
    const stage = cover(page, "musica");
    for (const n of [0, 1, 2]) {
      await stage.getByRole("button", { name: `Dar cuerda (${n}/3)` }).click();
    }
    await expect(stage.locator("[data-musicbox]")).toHaveAttribute("data-musicbox", "sonando");
    await expect(stage.getByText(/En Úbeda, a bailar/)).toBeVisible();
  });

  test("farolillo: se enciende y sube", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=farolillo");
    const stage = cover(page, "farolillo");
    await stage.getByRole("button", { name: "Encender el farolillo" }).click();
    await expect(stage.locator("[data-lantern]")).toHaveAttribute("data-lantern", "en-el-cielo", {
      timeout: 8000,
    });
  });

  test("barco: navega hasta el muelle", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=barco");
    const stage = cover(page, "barco");
    await expect(stage.getByText("Pazo do Peirao")).toBeVisible();
    await stage.getByRole("button", { name: "Soltar el barco" }).click();
    await expect(stage.locator("[data-boat]")).toHaveAttribute("data-boat", "en-puerto", {
      timeout: 8000,
    });
    await expect(stage.getByText(/Ha llegado a Combarro/)).toBeVisible();
  });

  test("rama prensada: al pasar la tapa se lee la etiqueta", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=prensado");
    const stage = cover(page, "prensado");
    await stage.getByRole("button", { name: "Pasar la tapa" }).click();
    await expect(stage.locator("[data-prensado]")).toHaveAttribute("data-prensado", "abierto");
    await expect(stage.getByText("Baena")).toBeVisible();
  });

  test("cartas: al tirar del lazo se abren en abanico", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cartas");
    const stage = cover(page, "cartas");
    await stage.getByRole("button", { name: "Tirar del lazo" }).click();
    await expect(stage.locator("[data-cartas]")).toHaveAttribute("data-cartas", "sueltas");
    await expect(stage.getByText(/A las 18:00, en Catedral de Sigüenza/)).toBeVisible();
  });

  test("ramo: se lanza y lo coges", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=ramo");
    const stage = cover(page, "ramo");
    await stage.getByRole("button", { name: "Lanzar el ramo" }).click();
    await expect(stage.locator("[data-ramo]")).toHaveAttribute("data-ramo", "cogido", {
      timeout: 8000,
    });
    await expect(stage.getByText(/Lo has cogido/)).toBeVisible();
  });

  test("anillos: el estuche se abre y la fecha va grabada", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=anillos");
    const stage = cover(page, "anillos");
    await stage.getByRole("button", { name: "Abrir el estuche" }).click();
    await expect(stage.locator("[data-anillos]")).toHaveAttribute("data-anillos", "abierto");
    await expect(stage.getByText(/Grabado por dentro/)).toBeVisible();
    await expect(stage.getByText("13/11/2027", { exact: false })).toBeVisible();
  });

  test("carné de baile: el invitado se apunta a la rumba", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=baile");
    const stage = cover(page, "baile");
    await stage.getByRole("button", { name: "Apuntarme al baile" }).click();
    await expect(stage.locator("[data-baile]")).toHaveAttribute("data-baile", "apuntado");
    await expect(stage.getByText("Familia García", { exact: true })).toBeVisible();
  });

  test("cápsula del tiempo: se desentierra", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=capsula");
    const stage = cover(page, "capsula");
    await stage.getByRole("button", { name: "Desenterrar la cápsula" }).click();
    await expect(stage.locator("[data-capsula]")).toHaveAttribute("data-capsula", "desenterrada", {
      timeout: 8000,
    });
    await expect(stage.getByText(/nos vemos en Ronda/)).toBeVisible();
  });

  test("sellos: se arranca uno y lleva el matasellos", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=sellos");
    const stage = cover(page, "sellos");
    await stage.getByRole("button", { name: "Arrancar un sello" }).click();
    await expect(stage.locator("[data-sellos]")).toHaveAttribute("data-sellos", "arrancado");
    await expect(stage.getByText(/Matasellado en Ourense/)).toBeVisible();
  });

  test("bola de discoteca: se enciende", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=disco");
    const stage = cover(page, "disco");
    await stage.getByRole("button", { name: "Encender la bola" }).click();
    await expect(stage.locator("[data-disco]")).toHaveAttribute("data-disco", "encendida");
    await expect(stage.getByText("¡A la pista!")).toBeVisible();
  });

  test("cuaderno de viaje: se hojea hasta el destino", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cuaderno");
    const stage = cover(page, "cuaderno");
    for (const n of [1, 2, 3]) {
      await stage.getByRole("button", { name: `Pasar página (${n}/4)` }).click();
    }
    await expect(stage.locator("[data-cuaderno]")).toHaveAttribute("data-cuaderno", "llegada");
    await expect(stage.getByText("Te esperamos")).toBeVisible();
  });

  test("piñata: tres golpes y se rompe", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=pinata");
    const stage = cover(page, "pinata");
    for (const n of [0, 1, 2]) {
      await stage.getByRole("button", { name: `Golpear la piñata (${n}/3)` }).click();
    }
    await expect(stage.locator("[data-pinata]")).toHaveAttribute("data-pinata", "rota");
    await expect(stage.getByText(/Recoge tu caramelo/)).toBeVisible();
  });

  test("lluvia de arroz: se lanza", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=arroz");
    const stage = cover(page, "arroz");
    await stage.getByRole("button", { name: "Lanzar el arroz" }).click();
    await expect(stage.locator("[data-arroz]")).toHaveAttribute("data-arroz", "lanzado");
    await expect(stage.getByText(/Arroz para los novios/)).toBeVisible();
  });

  test("vela: se sopla y se pide un deseo", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=vela");
    const stage = cover(page, "vela");
    await stage.getByRole("button", { name: "Soplar la vela" }).click();
    await expect(stage.locator("[data-vela]")).toHaveAttribute("data-vela", "apagada");
    await expect(stage.getByText(/Deseo pedido/)).toBeVisible();
  });

  test("columpio: se empuja", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=columpio");
    const stage = cover(page, "columpio");
    await stage.getByRole("button", { name: "Empujar el columpio" }).click();
    await expect(stage.locator("[data-columpio]")).toHaveAttribute("data-columpio", "en-marcha");
  });

  test("semáforo: de rojo a verde", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=semaforo");
    const stage = cover(page, "semaforo");
    await expect(stage.getByText("Guarda la fecha")).toBeVisible();
    await stage.getByRole("button", { name: "Cambiar de color" }).click();
    await expect(stage.getByText("Confirma que vienes")).toBeVisible();
    await stage.getByRole("button", { name: "Cambiar de color" }).click();
    await expect(stage.locator("[data-semaforo]")).toHaveAttribute("data-semaforo", "verde");
    await expect(stage.getByText("¡A la fiesta!")).toBeVisible();
  });

  test("paraguas: se abre y deja de llover", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=paraguas");
    const stage = cover(page, "paraguas");
    await stage.getByRole("button", { name: "Abrir el paraguas" }).click();
    await expect(stage.locator("[data-paraguas]")).toHaveAttribute("data-paraguas", "abierto");
    await expect(stage.getByText(/Ya no llueve/)).toBeVisible();
  });

  test("cascanueces: parte la nuez", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cascanueces");
    const stage = cover(page, "cascanueces");
    await stage.getByRole("button", { name: "Partir la nuez" }).click();
    await expect(stage.locator("[data-cascanueces]")).toHaveAttribute(
      "data-cascanueces",
      "abierta",
    );
    await expect(stage.getByText(/Dentro de la nuez/)).toBeVisible();
  });

  test("hamaca: se mece", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=hamaca");
    const stage = cover(page, "hamaca");
    await stage.getByRole("button", { name: "Mecer la hamaca" }).click();
    await expect(stage.locator("[data-hamaca]")).toHaveAttribute("data-hamaca", "meciendose");
  });

  test("cesta de pícnic: dentro está el menú", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=picnic");
    const stage = cover(page, "picnic");
    await stage.getByRole("button", { name: "Levantar la tapa" }).click();
    await expect(stage.locator("[data-picnic]")).toHaveAttribute("data-picnic", "abierta");
    await expect(stage.getByText("Bonito en escabeche")).toBeVisible();
  });

  test("molinillo: se sopla y gira", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=molinillo");
    const stage = cover(page, "molinillo");
    await stage.getByRole("button", { name: "Soplar el molinillo" }).click();
    await expect(stage.locator("[data-molinillo]")).toHaveAttribute("data-molinillo", "girando");
  });

  test("candado: se cierra y la llave cae al río", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=candado");
    const stage = cover(page, "candado");
    await stage.getByRole("button", { name: "Cerrar el candado" }).click();
    await expect(stage.locator("[data-candado]")).toHaveAttribute("data-candado", "cerrado");
    await expect(stage.getByText(/la llave, al río/)).toBeVisible();
  });

  test("gramola: con una moneda suena el primer baile", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=gramola");
    const stage = cover(page, "gramola");
    await stage.getByRole("button", { name: "Echar una moneda" }).click();
    await expect(stage.locator("[data-gramola]")).toHaveAttribute("data-gramola", "sonando");
    await expect(stage.getByText(/Suena «El primer baile»/)).toBeVisible();
  });

  test("huellas: caminan juntas hasta la orilla", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=huellas");
    const stage = cover(page, "huellas");
    await stage.getByRole("button", { name: "Echar a andar" }).click();
    await expect(stage.locator("[data-huellas]")).toHaveAttribute("data-huellas", "en-la-orilla", {
      timeout: 8000,
    });
    await expect(stage.getByText(/Hasta la orilla de Ciudadela/)).toBeVisible();
  });

  test("nevera: dentro está la tarta", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=nevera");
    const stage = cover(page, "nevera");
    await stage.getByRole("button", { name: "Abrir la nevera" }).click();
    await expect(stage.locator("[data-nevera]")).toHaveAttribute("data-nevera", "abierta");
    await expect(stage.getByText(/La tarta ya está lista/)).toBeVisible();
  });

  test("tetera: se sirve el té y hablan los posos", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=tetera");
    const stage = cover(page, "tetera");
    await stage.getByRole("button", { name: "Servir el té" }).click();
    await expect(stage.locator("[data-tetera]")).toHaveAttribute("data-tetera", "servida");
    await expect(stage.getByText(/Los posos no mienten/)).toBeVisible();
  });

  test("pompas: salen con los datos de la boda", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=pompas");
    const stage = cover(page, "pompas");
    await stage.getByRole("button", { name: "Soplar pompas" }).click();
    await expect(stage.locator("[data-pompas]")).toHaveAttribute("data-pompas", "en-el-aire");
    await expect(stage.getByText("¡Sí, quiero!")).toBeVisible();
  });

  test("herradura: se cuelga sobre la puerta", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=herradura");
    const stage = cover(page, "herradura");
    await stage.getByRole("button", { name: "Colgar la herradura" }).click();
    await expect(stage.locator("[data-herradura]")).toHaveAttribute("data-herradura", "colgada");
    await expect(stage.getByText(/la suerte no se escapa/)).toBeVisible();
  });

  test("grulla: tres pliegues y vuela", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=grulla");
    const stage = cover(page, "grulla");
    for (const n of [0, 1, 2]) {
      await stage.getByRole("button", { name: `Doblar (${n}/3)` }).click();
    }
    await expect(stage.locator("[data-grulla]")).toHaveAttribute("data-grulla", "doblada");
    await expect(stage.getByText(/mil grullas cumplen un deseo/)).toBeVisible();
  });

  test("campanas: repican al tirar de la cuerda", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=campanas");
    const stage = cover(page, "campanas");
    await stage.getByRole("button", { name: "Tirar de la cuerda" }).click();
    await expect(stage.locator("[data-campanas]")).toHaveAttribute("data-campanas", "repicando");
    await expect(stage.getByText(/Din, don/)).toBeVisible();
  });

  test("hilo rojo: se ata de un meñique al otro", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=hilo");
    const stage = cover(page, "hilo");
    await stage.getByRole("button", { name: "Atar el hilo" }).click();
    await expect(stage.locator("[data-hilo]")).toHaveAttribute("data-hilo", "unido", {
      timeout: 8000,
    });
  });

  test("pajarera: se abre y salen los pájaros", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=pajarera");
    const stage = cover(page, "pajarera");
    await stage.getByRole("button", { name: "Abrir la pajarera" }).click();
    await expect(stage.locator("[data-pajarera]")).toHaveAttribute("data-pajarera", "abierta");
    await expect(stage.getByText(/Libres y juntos/)).toBeVisible();
  });

  test("persiana: se sube y amanece", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=persiana");
    const stage = cover(page, "persiana");
    await stage.getByRole("button", { name: "Subir la persiana" }).click();
    await expect(stage.locator("[data-persiana]")).toHaveAttribute("data-persiana", "subida", {
      timeout: 8000,
    });
    await expect(stage.getByText(/Amanece el día de nuestra boda/)).toBeVisible();
  });

  test("reloj de cuco: canta la hora de la ceremonia", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cuco");
    const stage = cover(page, "cuco");
    await stage.getByRole("button", { name: "Tirar de la pesa" }).click();
    await expect(stage.locator("[data-cuco]")).toHaveAttribute("data-cuco", "cantando");
    await expect(stage.getByText(/A las 13:00 del/)).toBeVisible();
  });

  test("pizarra: se escribe la lección", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=tiza");
    const stage = cover(page, "tiza");
    await stage.getByRole("button", { name: "Escribir con tiza" }).click();
    await expect(stage.locator("[data-pizarra]")).toHaveAttribute("data-pizarra", "escrita");
    await expect(stage.getByText("Lugar: Morella")).toBeVisible();
  });

  test("faro: se enciende", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=faro");
    const stage = cover(page, "faro");
    await stage.getByRole("button", { name: "Encender el faro" }).click();
    await expect(stage.locator("[data-lighthouse]")).toHaveAttribute(
      "data-lighthouse",
      "encendido",
    );
    await expect(stage.getByText(/Rumbo a Comillas/)).toBeVisible();
  });

  test("con movimiento reducido las portadas se abren sin esperar animaciones", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const id of ["vinilo", "cosecha", "arcade"] as const) {
      await page.goto(`/i/familia-garcia?plantilla=${id}`);
      await cover(page, id)
        .getByRole("button", { name: /toca para abrir/i })
        .click();
      await expectOpened(page);
    }
    await context.close();
  });
});
