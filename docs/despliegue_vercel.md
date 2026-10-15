# Despliegue en Vercel — Innova Digital

## Recomendación: 2 proyectos en Vercel

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
   - `JWT_SECRET` (genera uno seguro)
   - `CORS_ORIGIN` = URL del frontend (ej. `https://innova-digital.vercel.app`)
   - `MYSQL_SSL=true` (recomendado en Vercel)

> No subas el archivo `.env` a Git. Configura las variables solo en el panel de Vercel.

## Base de datos (Clever Cloud)

Si tu red local bloquea el puerto **3306** (común en colegios/universidades):

1. Abre el add-on MySQL en Clever Cloud → **phpMyAdmin** o consola SQL
2. Pega y ejecuta el contenido de `backend-serviciosgitales/sql/schema_pmv.sql`
3. Desde una red que permita 3306 (o desde un job en Vercel) ejecuta:
   ```bash
   cd backend-serviciosgitales
   npm run seed
   ```

Cuentas demo tras el seed:
- `admin@innovadigital.co` / `Admin1234`
- `vendedor@innovadigital.co` / `Vendedor123`
- `cliente@innovadigital.co` / `Cliente123`

## Local
```bash
# Terminal 1 — API
cd backend-serviciosgitales
npm run migrate   # si el puerto 3306 está abierto
npm run seed
npm run dev

# Terminal 2 — PWA
cd frontend-serviciosdigitales
npm run dev
```

## Nota sobre el nombre de carpeta
La carpeta del backend actual es `backend-serviciosgitales` (typo histórico). Si quieres renombrarla a `backend-serviciosdigitales`, cierra las terminales que la usen y renómbrala; luego actualiza el Root Directory en Vercel.
