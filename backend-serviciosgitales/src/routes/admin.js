import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth, requireRole('administrador'))

router.get('/metrics', async (_req, res) => {
  try {
    const [[ventas]] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS total FROM pedidos WHERE estado NOT IN ('cancelado')`
    )
    const [[pedidos]] = await pool.query(`SELECT COUNT(*) AS n FROM pedidos`)
    const [[usuarios]] = await pool.query(`SELECT COUNT(*) AS n FROM usuarios WHERE activo = 1`)
    const [[servicios]] = await pool.query(
      `SELECT COUNT(*) AS n FROM servicios WHERE estado = 'aprobado'`
    )
    const [pendientes] = await pool.query(
      `SELECT s.id_servicio, s.titulo, s.precio_base, u.nombre AS vendedor
       FROM servicios s
       JOIN usuarios u ON u.id_usuario = s.id_vendedor
       WHERE s.estado = 'pendiente'
       ORDER BY s.creado_en DESC
       LIMIT 20`
    )

    res.json({
      ventas: Number(ventas.total),
      pedidos: Number(pedidos.n),
      usuarios: Number(usuarios.n),
      servicios: Number(servicios.n),
      pendientes,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener métricas', detail: error.message })
  }
})

router.patch('/servicios/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body
    if (!['aprobado', 'rechazado', 'pausado', 'pendiente'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' })
    }

    const [result] = await pool.query(
      'UPDATE servicios SET estado = ? WHERE id_servicio = ?',
      [estado, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' })
    }
    res.json({ ok: true, estado })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar servicio', detail: error.message })
  }
})

router.get('/usuarios', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.activo, u.creado_en, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       ORDER BY u.creado_en DESC`
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', detail: error.message })
  }
})

export default router
