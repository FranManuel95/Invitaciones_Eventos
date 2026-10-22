import type { Metadata } from "next";
import Link from "next/link";
import { Clause, Datum, LegalPage } from "@/features/sales/legal-page";
import { isIndexable, legalComplete, legalInfo } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "Aviso legal",
    robots: isIndexable() ? { index: true, follow: true } : undefined,
  };
}

/** Aviso legal (art. 10 de la Ley 34/2002, LSSI). Borrador: lo revisa el titular. */
export default function LegalNoticePage() {
  const info = legalInfo();
  return (
    <LegalPage title="Aviso legal" updated="22 de octubre de 2026" complete={legalComplete(info)}>
      <Clause title="Quién está detrás">
        <p>
          Este sitio web es de <Datum info={info} field="holder" label="nombre o razón social" />,
          con NIF <Datum info={info} field="taxId" label="NIF" /> y domicilio en{" "}
          <Datum info={info} field="address" label="domicilio" />. Podéis escribirnos a{" "}
          <Datum info={info} field="email" label="correo de contacto" />.
        </p>
      </Clause>
      <Clause title="Para qué sirve">
        <p>
          Desde aquí se presentan y se gestionan invitaciones digitales para bodas: la página de
          venta, las invitaciones que reciben los invitados y el panel en el que las parejas las
          preparan y siguen las respuestas.
        </p>
      </Clause>
      <Clause title="Uso del sitio">
        <p>
          Quien usa el sitio se compromete a hacerlo de buena fe y conforme a la ley, sin dañarlo ni
          impedir que otras personas lo usen. Las parejas son responsables de lo que publican en sus
          invitaciones (textos, fotos, vídeos y música) y de contar con los permisos necesarios para
          usarlo.
        </p>
      </Clause>
      <Clause title="Propiedad intelectual">
        <p>
          El diseño, el código y los textos del sitio pertenecen a su titular o se usan con
          licencia. Las tipografías son de licencia abierta (SIL Open Font License). Los contenidos
          que suben las parejas siguen siendo suyos.
        </p>
      </Clause>
      <Clause title="Responsabilidad">
        <p>
          Cuidamos que el sitio funcione y que la información sea correcta, pero no podemos
          garantizar que no haya interrupciones o errores. Los enlaces a otras webs (por ejemplo,
          una tienda de la lista de regalos) se ofrecen por comodidad y no dependen de nosotros.
        </p>
      </Clause>
      <Clause title="Datos personales">
        <p>
          Cómo tratamos vuestros datos se explica en la{" "}
          <Link
            href="/privacidad"
            className="text-ink underline decoration-gold underline-offset-4"
          >
            política de privacidad
          </Link>
          .
        </p>
      </Clause>
      <Clause title="Ley aplicable">
        <p>
          Este aviso se rige por la ley española. Si sois consumidores, podéis acudir a los juzgados
          de vuestro domicilio.
        </p>
      </Clause>
    </LegalPage>
  );
}
