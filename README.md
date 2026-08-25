# Mi Zona de Poder — prototipo del quiz

Sitio para Netlify: páginas estáticas (HTML/CSS/JS) + una función serverless
que conecta con Systeme.io para el envío automático del PDF por correo.

## Qué incluye

- Pantalla de contraseña (código: `poder2026`)
- Pantalla de entrada + instrucciones
- Quiz de 6 preguntas con navegación lineal y botón "atrás"
- Cálculo automático del arquetipo (Dispersión / Precio / Sistema / Visibilidad)
- Pantalla de resultado con ícono, nombre del bloqueo y descripción
- Descarga inmediata de un PDF de diagnóstico en el navegador (jsPDF, no depende de internet)
- Captura de email guardada en dos lugares en paralelo:
  1. **Netlify Forms** — respaldo simple, siempre queda un registro aquí
  2. **Systeme.io** (vía la función `subscribe`) — crea/actualiza el contacto con sus
     campos `bloqueo` y `pdf_link`, y le asigna la etiqueta `MiZonaDePoderLead`, que
     dispara tu automatización existente de correo con el PDF
- Botón de CTA final, personalizado por arquetipo
- 4 PDFs de diagnóstico ya generados en `assets/pdfs/` (uno por arquetipo), con link
  público estable — son los que Systeme manda por correo

## ⚠️ Importante: esta versión necesita subirse con la CLI de Netlify (no arrastrar y soltar)

La conexión automática con Systeme corre en una "función serverless" (un pedacito de
código que vive en el servidor de Netlify, no en el navegador de la usuaria). Ese tipo
de función **no se activa** si subes la carpeta arrastrándola a
[app.netlify.com/drop](https://app.netlify.com/drop) — esa vía solo sirve para archivos
estáticos. Necesitas usar la CLI (línea de comandos) o conectar un repositorio de Git.

### Opción A — Netlify CLI (la más simple para actualizar lo que ya tienes)

1. Instala Node.js si no lo tienes ([nodejs.org](https://nodejs.org), descarga la versión LTS)
2. Abre una terminal (en Windows: busca "cmd" o "PowerShell"; en Mac: "Terminal")
3. Instala la herramienta de Netlify (solo la primera vez):
   ```
   npm install -g netlify-cli
   ```
4. Inicia sesión (se abre tu navegador para autorizar):
   ```
   netlify login
   ```
5. Entra a la carpeta del proyecto:
   ```
   cd ruta/a/mi-zona-de-poder
   ```
6. Conecta esta carpeta con el sitio que ya existe (elige "mizonadepoder" de la lista cuando te pregunte):
   ```
   netlify link
   ```
7. Publica:
   ```
   netlify deploy --prod
   ```

### Opción B — Conectar un repositorio de Git (mejor a largo plazo)

Si en algún momento vas a seguir iterando seguido, conviene subir esta carpeta a GitHub
y conectar Netlify a ese repositorio ("Add new site" → "Import an existing project").
Así cada cambio que subas a GitHub se publica solo. Dímelo si quieres que te ayude a
armar esto cuando llegue el momento.

## Configurar la conexión con Systeme.io (un solo paso, una sola vez)

1. En tu panel de Netlify, entra al sitio **mizonadepoder**
2. Ve a **Site configuration → Environment variables**
3. Agrega una variable nueva:
   - **Key:** `SYSTEME_API_KEY`
   - **Value:** tu clave de API de Systeme (Configuración de Systeme → "MCP & API keys" → Public API keys)
4. Guarda, y vuelve a publicar el sitio (`netlify deploy --prod`) para que tome la variable

La clave nunca queda visible en el código del sitio — vive únicamente en la configuración
de Netlify y solo la lee la función del servidor.

## Dónde llegan los leads

- **Netlify:** Site configuration → Forms (registro simple de respaldo)
- **Systeme.io:** el contacto se crea/actualiza automáticamente y dispara tu automatización
  existente ("cuando se asigna la etiqueta MiZonaDePoderLead → enviar correo 'Diagnóstico
  Mi Zona De Poder'"). Ahí es donde le llega el PDF por correo a la persona.

## Antes de lanzarlo, falta decidir

1. **La oferta final del CTA.** Hoy el botón final apunta a un link de WhatsApp de ejemplo
   (`https://wa.me/5210000000000?...`). Búscalo en `script.js`, constante `CTA_LINK`
   (arriba del todo), y cámbialo por tu link real de Calendly o WhatsApp.
2. **Renombrar el arquetipo "La Especialista sin Precio"** (mencionaste un posible nuevo
   nombre, "La Experiencia que se Regala" — falta confirmar el texto final). Está en dos
   lugares: el objeto `ARCHETYPES` en `script.js` (para la pantalla en vivo) y en
   `build-pdfs` (para el PDF) — avísame cuando lo confirmes y te regenero ambos.
3. **Desempate en el puntaje.** Si dos arquetipos quedan empatados, hoy gana el primero en
   este orden: Dispersión → Precio → Sistema → Visibilidad.
4. Revisar el texto del PDF y del CTA con calma antes de la campaña.

## Estructura de archivos

```
mi-zona-de-poder/
├── index.html                    → estructura de las 7 pantallas
├── style.css                      → paleta de colores y tipografía de marca
├── script.js                       → lógica del quiz, puntaje, PDF y envío de leads
├── netlify.toml                     → configuración de Netlify (incluye la carpeta de funciones)
├── netlify/functions/
│   └── subscribe.js                → conecta con la API de Systeme.io (crea contacto + etiqueta)
└── assets/
    ├── jspdf.umd.min.js            → librería para el PDF instantáneo en el navegador
    └── pdfs/
        ├── dispersion.pdf          → PDF que Systeme manda por correo a este arquetipo
        ├── precio.pdf
        ├── sistema.pdf
        └── visibilidad.pdf
```

## Cómo editar el contenido

- **Preguntas y respuestas:** array `QUESTIONS` en `script.js`
- **Textos de cada arquetipo (pantalla en vivo):** objeto `ARCHETYPES` en `script.js`
- **Textos de cada arquetipo (dentro del PDF):** hay que regenerar los PDFs — avísame y lo hago
- **Contraseña de acceso:** constante `ACCESS_CODE` en `script.js`
- **Colores:** variables al inicio de `style.css` (`:root`)
- **Nombre de la etiqueta de Systeme:** constante `SYSTEME_TAG_NAME` en `netlify/functions/subscribe.js`
