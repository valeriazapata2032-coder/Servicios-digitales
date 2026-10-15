import { Router } from 'express'
import { pool } from '../config/db.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body
    if (!nombre?.trim() || !correo?.trim() || !mensaje?.trim()) {
      return res.status(400).json({ message: 'Nombre, correo y mensaje son obligatorios' })
    }

    await pool.query(
      `INSERT INTO mensajes_contacto (nombre, correo, mensaje) VALUES (?, ?, ?)`,
      [nombre.trim(), correo.trim().toLowerCase(), mensaje.trim()]
    )

    res.status(201).json({ ok: true, message: 'Mensaje recibido. Te contactaremos pronto.' })
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar mensaje', detail: error.message })
  }
})

export default router
