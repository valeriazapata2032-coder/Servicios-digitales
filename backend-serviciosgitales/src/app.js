import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './config/db.js'
import authRoutes from './routes/auth.js'
import serviciosRoutes from './routes/servicios.js'
import pedidosRoutes from './routes/pedidos.js'
import encuestasRoutes from './routes/encuestas.js'
import adminRoutes from './routes/admin.js'
import contactoRoutes from './routes/contacto.js'

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
)
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, service: 'innova-digital-api', db: 'connected' })
  } catch (error) {
    res.status(503).json({
      ok: false,
      service: 'innova-digital-api',
      db: 'disconnected',
      message: error.message,
    })
  }
})

app.get('/api', (_req, res) => {
  res.json({
    name: 'Innova Digital API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/categorias',
      '/api/servicios',
      '/api/pedidos',
      '/api/encuestas',
      '/api/admin',
      '/api/contacto',
    ],
  })
})

app.get('/api/categorias', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, activa FROM categorias WHERE activa = 1 ORDER BY nombre'
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar categorías', detail: error.message })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/servicios', serviciosRoutes)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/encuestas', encuestasRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contacto', contactoRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Error interno' })
})

export default app
