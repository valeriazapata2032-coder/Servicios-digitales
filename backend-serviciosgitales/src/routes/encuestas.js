import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.post('/:id/respuestas', async (req, res) => {
  try {
    const { correo, consentimiento, respuestas } = req.body
    const idEncuesta = Number(req.params.id) || 1

    if (!consentimiento) {
      return res.status(400).json({ message: 'Debes aceptar el tratamiento de datos' })
    }
    if (!respuestas || typeof respuestas !== 'object') {
      return res.status(400).json({ message: 'Respuestas inválidas' })
    }

    if (correo) {
      const [dup] = await pool.query(
        `SELECT id_respuesta FROM respuestas_encuesta
         WHERE id_encuesta = ? AND correo = ? LIMIT 1`,
        [idEncuesta, correo.trim().toLowerCase()]
      )
      if (dup.length) {
        return res.status(409).json({ message: 'Ya respondiste esta encuesta con ese correo' })
      }
    }

    await pool.query(
      `INSERT INTO respuestas_encuesta (id_encuesta, correo, consentimiento, respuestas_json)
       VALUES (?, ?, 1, ?)`,
      [idEncuesta, correo ? correo.trim().toLowerCase() : null, JSON.stringify(respuestas)]
    )

    res.status(201).json({ ok: true, message: '¡Gracias por tu respuesta!' })
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar encuesta', detail: error.message })
  }
})

router.get('/:id/resultados', requireAuth, requireRole('administrador'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT respuestas_json FROM respuestas_encuesta WHERE id_encuesta = ?`,
      [req.params.id]
    )

    const counts = {}
    for (const row of rows) {
      const data =
        typeof row.respuestas_json === 'string'
          ? JSON.parse(row.respuestas_json)
          : row.respuestas_json
      for (const [pregunta, valor] of Object.entries(data || {})) {
        if (!counts[pregunta]) counts[pregunta] = {}
        counts[pregunta][valor] = (counts[pregunta][valor] || 0) + 1
      }
    }

    const total = rows.length
    const resultados = Object.entries(counts).map(([pregunta, opciones]) => ({
      pregunta,
      opciones: Object.entries(opciones).map(([label, n]) => ({
        label,
        n,
        percent: total ? Math.round((n / total) * 100) : 0,
      })),
    }))

    res.json({ total, resultados })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resultados', detail: error.message })
  }
})

export default router
