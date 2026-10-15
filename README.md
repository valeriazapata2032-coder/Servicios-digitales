# Innova Digital — Servicios digitales

PWA para una empresa de servicios digitales que ofrece soluciones tecnológicas y creativas para mejorar la presencia digital, comunicación y promoción de emprendimientos y empresas.

**Eslogan:** Conectamos ideas, impulsamos resultados.

## Stack
- Frontend: React + Vite PWA + Tailwind CSS → **Vercel**
- Backend: Node.js + Express → **Vercel** (serverless)
- Base de datos: MySQL (**Clever Cloud**)

## Carpetas
- `frontend-serviciosdigitales` — interfaz PWA (responsive móvil / tablet / desktop)
- `backend-serviciosgitales` — API REST
- `docs` — requisitos, ER, arquitectura y guía Vercel

## Rutas principales
| Ruta | Descripción |
|------|-------------|
| `/` | Landing (Figma) |
| `/servicios` | Catálogo |
| `/servicios/:id` | Detalle + paquetes |
| `/carrito` | Checkout + diagnóstico |
| `/encuesta` | Encuesta pública |
| `/login` · `/registro` | Auth JWT |
| `/panel/cliente` | Pedidos del cliente |
| `/panel/vendedor` | Servicios y pedidos |
| `/panel/admin` | Métricas y aprobaciones |

## Arranque rápido

### Frontend
```bash
cd frontend-serviciosdigitales
npm install
npm run dev
```

### Backend
```bash
cd backend-serviciosgitales
npm install
cp .env.example .env   # completar credenciales Clever Cloud
npm run migrate        # crea tablas PMV
npm run seed           # datos demo
npm run dev
```

### Despliegue
Ver `docs/despliegue_vercel.md` (2 proyectos Vercel + variables de entorno).

## Responsive
- **Móvil:** menú hamburguesa, CTAs a ancho completo, tipografía y paddings compactos
- **Tablet:** grillas 2 columnas, menú hamburguesa hasta `lg`
- **Escritorio:** navegación horizontal, grillas 3 columnas, hero amplio
