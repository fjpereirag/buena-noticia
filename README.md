# Una buena noticia para ti · Navidad 2026

Felicitación de Navidad interactiva de la **Parroquia de Santa Casilda** (Carabanchel, Madrid).

- Quien **envía** escribe el nombre, elige una buena noticia y una escena, cierra la carta con el lacre de la parroquia y la ve volar sobre Tierra Santa hasta Belén. Después la comparte por WhatsApp.
- Quien **recibe** abre el enlace, rompe el lacre, lee su carta y escucha la voz de Álvaro con «Noche de paz» de fondo. Al final, la invitación de la parroquia y el botón para enviar otra.

Web: https://fjpereirag.github.io/buena-noticia/

## Cómo publicarla (una sola vez)

1. En GitHub, crea un repositorio público llamado **buena-noticia**.
2. Sube todo el contenido de esta carpeta (arrastrando los archivos en «Add file → Upload files»).
3. En *Settings → Pages*, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
4. En un par de minutos estará en `https://fjpereirag.github.io/buena-noticia/`.

Si usas otro nombre de repositorio, cambia la dirección de `og:image` y `og:url` en `index.html` (es la imagen que muestra WhatsApp al compartir).

## Enlace de cada carta

`…/buena-noticia/?para=Carmen&de=Fj&m=2&e=3&n=Me%20acuerdo%20de%20ti`

| Parámetro | Qué es |
|---|---|
| `para`, `de` | Nombres (máx. 30 caracteres) |
| `m` | Buena noticia: 1 luces y sombras · 2 te está esperando · 3 no hace falta tenerlo todo en orden · 4 una rendija al corazón |
| `e` | Escena: 3 ángel · 6 pesebre · 7 camino de Belén · 9 la luz |
| `n` | Nota personal (opcional, máx. 140) |

No hay servidor ni base de datos: la carta viaja entera dentro del enlace.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html`, `estilo.css`, `app.js` | La web |
| `vendor/three.min.js` | Three.js (licencia MIT) para el mapa 3D |
| `assets/terreno.jpg`, `assets/altura.js` | Relieve ilustrado de Tierra Santa |
| `img/` | Ilustraciones (IA) y foto de la parroquia |
| `audio/` | Voz de Álvaro (edge-tts) y «Noche de paz» (dominio público) |
| `og.jpg` | Vista previa al compartir |
