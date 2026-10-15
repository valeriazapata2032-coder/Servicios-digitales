# Despliegue en Vercel — Innova Digital

**Repo GitHub:** https://github.com/valeriazapata2032-coder/Servicios-digitales

## Recomendación: 2 proyectos en Vercel

Ve a [vercel.com/new](https://vercel.com/new) → inicia sesión con GitHub → Importa `Servicios-digitales`.

### 1) Frontend (`frontend-serviciosdigitales`) — créalo PRIMERO o SEGUNDO (da igual el orden, pero conecta URLs al final)
1. **Project Name:** `innova-digital` (o el que prefieras)
2. **Root Directory:** `frontend-serviciosdigitales` (Edit → selecciona esa carpeta)
3. Framework: Vite (automático)
4. Build: `npm run build` · Output: `dist`
5. Por ahora deja `VITE_API_URL` vacío y despliega
6. Después de tener la URL del backend, agrega:
   - `VITE_API_URL` = `https://TU-API.vercel.app` (sin `/` final)
7. Redeploy el frontend (Deployments → Redeploy)

### 2) Backend (`backend-serviciosgitales`)
1. En Vercel: **Add New… → Project** → mismo repo otra vez
2. **Project Name:** `innova-digital-api`
3. **Root Directory:** `backend-serviciosgitales`
4. Variables de entorno (Clever Cloud + auth):

| Variable | Valor |
|----------|--------|
| `MYSQL_ADDON_HOST` | host de Clever Cloud |
| `MYSQL_ADDON_DB` | nombre DB |
| `MYSQL_ADDON_USER` | usuario |
| `MYSQL_ADDON_PORT` | `3306` |
| `MYSQL_ADDON_PASSWORD` | contraseña |
| `JWT_SECRET` | texto largo aleatorio |
| `CORS_ORIGIN` | URL del frontend (ej. `https://innova-digital.vercel.app`) |
| `MYSQL_SSL` | `true` |

5. Deploy → copia la URL → pégala en `VITE_API_URL` del frontend y redeploy

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
