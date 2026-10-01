# Despliegue en Vercel — Innova Digital

## Recomendación: 2 proyectos en Vercel

Vercel sirve muy bien el frontend. El backend Express + MySQL también puede ir a Vercel como serverless, o quedarse en otro host. Lo más limpio:

### 1) Frontend (`frontend-serviciosdigitales`)
1. Importa el repo en [vercel.com](https://vercel.com)
2. **Root Directory:** `frontend-serviciosdigitales`
3. Framework: Vite (detectado automático)
4. Build: `npm run build` · Output: `dist`
5. Variable de entorno:
   - `VITE_API_URL` = URL del backend en Vercel (ej. `https://api-innova.vercel.app`)

### 2) Backend (`backend-serviciosgitales`)
1. Crea **otro** proyecto Vercel del mismo repo
2. **Root Directory:** `backend-serviciosgitales`
3. Variables de entorno (Clever Cloud):
   - `MYSQL_ADDON_HOST`
   - `MYSQL_ADDON_DB`
   - `MYSQL_ADDON_USER`
   - `MYSQL_ADDON_PORT`
   - `MYSQL_ADDON_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ORIGIN` = URL del frontend (ej. `https://innova-digital.vercel.app`)

> No subas el archivo `.env` a Git. Configura las variables solo en el panel de Vercel.

## Local
```bash
# Terminal 1 — API
cd backend-serviciosgitales
npm run migrate   # una vez
npm run dev

# Terminal 2 — PWA
cd frontend-serviciosdigitales
npm run dev
```

## Nota sobre el nombre de carpeta
La carpeta del backend actual es `backend-serviciosgitales` (typo histórico). Si quieres renombrarla a `backend-serviciosdigitales`, cierra las terminales que la usen y renómbrala; luego actualiza el Root Directory en Vercel.
