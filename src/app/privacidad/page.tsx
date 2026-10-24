import type { Metadata } from "next";
import { Clause, Datum, LegalPage } from "@/features/sales/legal-page";
import { isIndexable, legalComplete, legalInfo } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "Política de privacidad",
    robots: isIndexable() ? { index: true, follow: true } : undefined,
  };
}

/** Política de privacidad (art. 13 del RGPD). Borrador: lo revisa el titular. */
export default function PrivacyPage() {
  const info = legalInfo();
  return (
    <LegalPage
      title="Política de privacidad"
      updated="22 de octubre de 2026"
      complete={legalComplete(info)}
    >
      <Clause title="Responsable">
        <p>
          <Datum info={info} field="holder" label="nombre o razón social" />, con NIF{" "}
          <Datum info={info} field="taxId" label="NIF" /> y domicilio en{" "}
          <Datum info={info} field="address" label="domicilio" />. Contacto:{" "}
          <Datum info={info} field="email" label="correo de contacto" />.
        </p>
      </Clause>

      <Clause title="Qué datos tratamos y para qué">
        <ul className="grid list-disc gap-2 pl-5">
          <li>
            <strong className="font-medium text-ink">Formulario «Pedid la vuestra»</strong>:
            nombres, correo, fecha de la boda y mensaje. Los usamos para responderos y preparar
            vuestra invitación. Base: aplicar medidas precontractuales a petición vuestra (art.
            6.1.b del RGPD).
          </li>
          <li>
            <strong className="font-medium text-ink">Cuenta de la pareja</strong>: correo y
            contraseña (guardada cifrada), y el contenido de la invitación. Los usamos para prestar
            el servicio contratado (art. 6.1.b del RGPD).
          </li>
          <li>
            <strong className="font-medium text-ink">Invitados</strong>: los nombres, teléfonos,
            respuestas, menús, alergias, reservas de regalos y fotos que se guardan en cada evento.
            Aquí la pareja decide qué datos se recogen y para qué; nosotros los tratamos por su
            cuenta, como encargados del tratamiento (art. 28 del RGPD), solo para que la invitación
            funcione.
          </li>
        </ul>
        <p>
          Las alergias pueden revelar datos de salud. Solo se piden para que el catering las tenga
          en cuenta y solo las ve la pareja.
        </p>
      </Clause>

      <Clause title="Cuánto tiempo">
        <p>
          Las solicitudes del formulario, el tiempo necesario para responderos y, si no llegamos a
          trabajar juntos, como mucho un año. Los datos de una cuenta y de sus eventos, mientras la
          cuenta exista: al borrar un evento se borra todo lo suyo, fotos incluidas. Después los
          conservamos bloqueados solo durante los plazos que exija la ley.
        </p>
      </Clause>

      <Clause title="Con quién se comparten">
        <p>
          No vendemos ni cedemos datos. Usamos dos proveedores que los tratan por nuestra cuenta:
          Supabase, que guarda la base de datos y las fotos en servidores de la Unión Europea
          (París), y Vercel, que sirve la web. Si algún proveedor accede a los datos desde fuera del
          Espacio Económico Europeo, lo hace con las garantías que exige el RGPD, como las cláusulas
          contractuales tipo o el Marco de Privacidad de Datos UE-EE. UU.
        </p>
      </Clause>

      <Clause title="Vuestros derechos">
        <p>
          Podéis pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de
          vuestros datos escribiendo a{" "}
          <Datum info={info} field="email" label="correo de contacto" />. Si los datos son de un
          invitado, también podéis dirigiros a la pareja que os invitó. Si creéis que no los
          tratamos bien, podéis reclamar ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
      </Clause>

      <Clause title="Cookies y almacenamiento del navegador">
        <p>
          Solo usamos lo imprescindible para que el sitio funcione: la cookie de sesión de quien
          entra en su panel y el almacenamiento del navegador para recordar, por ejemplo, que ya
          abriste el sobre o tu respuesta mientras la envías. No hay cookies de publicidad ni de
          analítica, así que no hace falta pediros permiso para ellas.
        </p>
      </Clause>
    </LegalPage>
  );
}
