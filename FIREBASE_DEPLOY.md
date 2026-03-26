# Despliegue en Firebase

Este proyecto ya quedó preparado para desplegarse en **Firebase Hosting** como una SPA de `React + Vite`.

## Archivos preparados

- `firebase.json`
- `.firebaseignore`
- `.firebaserc.example`

## Qué publica Firebase

Firebase servirá esta carpeta:

```text
frontend/dist
```

Además, ya quedó configurado:

- `rewrite` global a `/index.html` para que funcionen las rutas de React Router
- exclusión de archivos innecesarios
- headers de cache para assets estáticos

## Pasos para desplegar

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Iniciar sesión

```bash
firebase login
```

### 3. Crear o seleccionar tu proyecto en Firebase

Si aún no tienes proyecto, créalo en:

[https://console.firebase.google.com/](https://console.firebase.google.com/)

### 4. Vincular este proyecto

Copia `.firebaserc.example` a `.firebaserc` y reemplaza el valor por tu `projectId`.

Ejemplo:

```json
{
  "projects": {
    "default": "asegurazion-demo"
  }
}
```

### 5. Construir el frontend

```bash
cd frontend
npm install
npm run build
```

### 6. Desplegar

Desde la raíz del proyecto:

```bash
firebase deploy --only hosting
```

## Alternativa sin `.firebaserc`

También puedes desplegar especificando el proyecto directamente:

```bash
firebase deploy --only hosting --project TU_PROJECT_ID
```

## Notas

- Si cambias el logo o assets en `frontend/public`, vuelve a ejecutar `npm run build`.
- Si agregas nuevas rutas en React Router, no necesitas cambiar Firebase mientras siga siendo una SPA.
- Si luego quieres usar dominio propio, SSL o previews, eso se configura desde Firebase Hosting.
