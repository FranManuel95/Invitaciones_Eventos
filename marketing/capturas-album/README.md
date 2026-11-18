# Capturas para la publicación del álbum de los invitados

Capturas de la demo, tomadas el 18/11/2026 desde la rama `claude/exciting-franklin-43k083`.
Todos los datos son ficticios: la boda de María y Daniel. La app no se ha cambiado. Solo durante
la captura se ocultaron el distintivo «Demo con datos ficticios», «Saltar intro» y las notas
«Demo: …» del panel. El menú del panel sale completo, con «Regalos».

## Carpetas

| Carpeta         | Qué hay                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------- |
| `movil/`        | Móvil 390×844 a @3x (1170×2532)                                                              |
| `escritorio/`   | Ordenador 1440×900 a @2x (2880×1800)                                                         |
| `carrusel-4x5/` | Todas en un lienzo de 1080×1350 (4:5) sobre papel, listas para Instagram: `movil_*` y `pc_*` |

## Lo que ve el invitado

| Archivo                       | Qué muestra                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01_invitacion_seccion_album` | Solo móvil. En la invitación, antes de la boda: «El álbum de la boda», con tres fotos en abanico, y «Abrir el álbum». Avisa de que las mesas tendrán un QR |
| `02_despues_de_la_boda`       | Solo móvil. Desde el día siguiente, la invitación da las gracias y enlaza al álbum: «Si te queda alguna en el móvil, aún puedes subirla»                   |
| `03_album_portada`            | El álbum: «El álbum de María & Daniel», con «Elegir fotos» y «Hacer una foto»                                                                              |
| `04_album_fotos`              | Solo móvil. «Las fotos de todos»: la galería de fotos aprobadas                                                                                            |
| `05_subir_fotos`              | Después de subir una foto: «1 foto enviada. ¡Gracias! Aparecerán cuando María y Daniel las revisen», con la foto marcada «Pendiente de revisar»            |
| `06_pase_de_fotos`            | El pase de fotos a pantalla completa, con anterior, pausa y siguiente                                                                                      |

## Lo que ven los novios

| Archivo                      | Qué muestra                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `07_panel_album_por_revisar` | Panel, «Álbum de los invitados»: fotos por revisar con «Aprobar», «Ocultar» y borrar, y «Descargar 4 fotos en un zip». En el ordenador, al lado, el QR para las mesas |
| `08_panel_album_aprobadas`   | Las fotos aprobadas, que ya ven todos los invitados                                                                                                                   |
| `09_panel_qr_mesas`          | Solo móvil. «QR para las mesas», con «Imprimir» y «Abrir el álbum»                                                                                                    |
| `10_imprimir_carteles_qr`    | Imprimir → «Carteles del álbum»: un cartel por mesa con «Comparte tus fotos de hoy», el QR y el nombre de la mesa                                                     |

## Lo que hace de verdad el álbum

Comprobado en el código. Que no se prometa nada más.

- **Subir fotos sin instalar nada**: el invitado escanea el QR de su mesa o abre el enlace de la
  invitación. Puede elegir fotos del móvil (hasta 10 a la vez) o hacer una foto con la cámara.
- **Privacidad**: antes de enviarlas, las fotos se reducen y se les quitan los datos de ubicación.
- **Los novios deciden qué se ve**: cada foto llega «por revisar». Los novios la aprueban, la
  ocultan o la borran. Los invitados solo ven las aprobadas.
- **Pase de fotos**: las fotos aprobadas se ven en un pase a pantalla completa.
- **Descarga**: los novios descargan todas las fotos aprobadas en un zip.
- **QR para las mesas**: el panel da el QR del álbum y, en Imprimir, un cartel por mesa listo para
  imprimir o guardar en PDF.
- **En la invitación**: antes de la boda anuncia el álbum; desde el día siguiente da las gracias y
  enlaza al álbum para subir las fotos que falten.

Solo hay fotos: no se suben vídeos al álbum.
