import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './config/db.js'

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
    version: '0.1.0',
    endpoints: ['/api/health', '/api/categorias', '/api/servicios', '/api/auth'],
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

export default app
