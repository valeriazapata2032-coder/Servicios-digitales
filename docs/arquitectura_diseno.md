# Arquitectura Innova Digital (PWA)

## Stack
- **Frontend:** React + Vite PWA + Tailwind CSS
- **Backend:** Node.js + Express (API REST)
- **BD:** MySQL en Clever Cloud

## Roles
Visitante · Cliente · Vendedor · Administrador

## Pantallas públicas (diseño UI listo)
| Ruta | Propósito |
|------|-----------|
| `/` | Landing: marca, misión/visión, servicios, portafolio, CTA encuesta |
| `/servicios` | Catálogo por categorías |
| `/portafolio` | Trabajos realizados |
| `/encuesta` | Encuesta sin cuenta + consentimiento Ley 1581 |
| `/login` · `/registro` | Autenticación cliente |

## Identidad visual
- Azul marca `#0A4D8C` · Verde acento `#10B981` · Superficie `#F4F8FB`
- Tipografías: **Syne** (títulos) · **Outfit** (cuerpo)
- PWA: nombre `Innova Digital`, theme `#0A4D8C`

## Estructura frontend
```
src/
  components/   Navbar, Footer, WhatsApp, Layout
  pages/        Home, Servicios, Portafolio, Encuesta, Login, Registro
  data/         brand.js (copy y categorías)
```

## Estructura backend
```
src/
  index.js
  config/db.js   pool MySQL (connectionLimit: 5)
sql/
  schema_pmv.sql tablas PMV + seeds
```

## Próximos módulos (prioridad A del PMV)
1. Auth JWT (registro/login)
2. CRUD categorías/servicios + aprobación admin
3. Carrito → pedidos + briefing
4. Entregables y estados de pedido
5. Encuesta persistida + resultados admin
