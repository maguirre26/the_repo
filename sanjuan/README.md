# Listas compartidas de San Juan

Versión con backend: las dos listas (lugares turísticos y bodegas) se guardan
en una base de datos compartida. Cualquiera que abra el link ve y edita
las mismas listas, en tiempo casi real (se actualiza solo cada 8 segundos,
y hay un botón "Actualizar ahora").

## Estructura

```
index.html      → la app (frontend), se sirve como página estática
api/data.js     → función serverless que lee/escribe en Redis (Upstash)
package.json    → dependencia @upstash/redis
```

## Pasos para publicarlo

### 1. Subir estos archivos a GitHub

Podés pedirle a Claude Code que copie esta carpeta a un repo nuevo, o
agregarla a `the_repo` en una carpeta propia, por ejemplo `san-juan-compartido/`.
Si la agregás dentro de `the_repo`, al importar el proyecto en Vercel vas
a tener que indicar esa carpeta como "Root Directory" (paso 2).

### 2. Importar el proyecto en Vercel

1. Andá a [vercel.com/new](https://vercel.com/new)
2. Elegí "Import Git Repository" y seleccioná el repo
3. Si el proyecto está en una subcarpeta del repo, configurá **Root Directory**
   con esa ruta (ej: `san-juan-compartido`)
4. Framework Preset: dejalo en **Other** (no hace falta build)
5. Deploy

El primer deploy va a funcionar a medias: la página va a cargar, pero
la API todavía no tiene base de datos conectada. Eso se arregla en el
siguiente paso.

### 3. Conectar una base de datos (Upstash Redis)

1. Dentro del proyecto ya creado en Vercel, andá a la pestaña **Storage**
2. Elegí **Create Database** → buscá **Upstash** → **Redis**
3. Seguí el asistente: podés dejar que Vercel administre la cuenta de
   Upstash por vos (más simple) y elegir la región más cercana
   (por ejemplo, la de AWS más cercana a Argentina: `us-east-1` o similar)
4. Conectá la base al proyecto cuando te lo pida (esto agrega las
   variables de entorno automáticamente: `UPSTASH_REDIS_REST_URL` y
   `UPSTASH_REDIS_REST_TOKEN`, o sus equivalentes `KV_REST_API_URL` /
   `KV_REST_API_TOKEN`)

### 4. Redeploy

Después de conectar la base, Vercel normalmente pide un **redeploy**
para que la función tome las nuevas variables de entorno. Se hace desde
la pestaña **Deployments** → los tres puntitos del último deploy →
**Redeploy**.

### 5. ¡Listo!

Abrí la URL que te da Vercel (algo como `https://tu-proyecto.vercel.app`)
y compartila con quien quieras. La primera vez que alguien la abre,
la app "siembra" la base de datos con las listas originales; a partir
de ahí, todos los cambios (arrastrar, etiquetas, notas, lugares nuevos)
quedan guardados y se comparten.

## Notas

- El plan gratuito ("Hobby") de Vercel y el tier gratuito de Upstash
  alcanzan de sobra para este uso (unas pocas personas revisando y
  editando la lista de vez en cuando).
- Si en algún momento querés "resetear" la base compartida por completo
  (por ejemplo, si algo queda en mal estado), lo más simple es entrar a
  la consola de Upstash, abrir la base, y borrar las claves
  `sanjuan:turismo` y `sanjuan:bodegas`. La próxima vez que alguien
  abra la página, se vuelven a sembrar con las listas originales.
