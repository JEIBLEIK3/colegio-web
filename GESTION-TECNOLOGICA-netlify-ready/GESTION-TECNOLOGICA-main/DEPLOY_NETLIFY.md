# Cómo desplegar en Netlify

Este proyecto ya está listo para Netlify (se agregaron `netlify.toml` y `_redirects`).

## Opción A (recomendada, sin instalar nada en tu computador)

1. Sube esta carpeta a un repositorio de GitHub (o GitLab/Bitbucket).
2. Entra a https://app.netlify.com → **Add new site → Import an existing project**.
3. Conecta tu repositorio.
4. Netlify va a detectar automáticamente el archivo `netlify.toml` con esta configuración:
   - Base directory: `colegio-web`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist/colegio-web/browser`
5. Dale a **Deploy site**. Netlify instala dependencias y compila el proyecto por ti.

## Opción B (arrastrar y soltar un ZIP, sin usar Git)

Si prefieres el método de "arrastrar el archivo" en https://app.netlify.com/drop, Netlify solo acepta ahí una carpeta **ya compilada** (HTML/CSS/JS estático), no el código fuente. Necesitas Node.js instalado en tu computador:

1. Instala Node.js (versión 22) si no lo tienes: https://nodejs.org
2. Abre una terminal dentro de la carpeta `colegio-web` de este proyecto.
3. Ejecuta:
   ```
   npm install
   npm run build
   ```
4. Se genera la carpeta `dist/colegio-web/browser`.
5. Ve a https://app.netlify.com/drop y arrastra esa carpeta (`browser`) completa.

## Notas

- El proyecto usa Supabase como backend y las llaves públicas (anon key) ya están configuradas en `src/environments/environment.prod.ts`, así que no necesitas variables de entorno adicionales en Netlify.
- El archivo `_redirects` (dentro de `public/`) asegura que las rutas de Angular (como `/matriculas`, `/notas`, etc.) funcionen al recargar la página en vez de dar error 404.
