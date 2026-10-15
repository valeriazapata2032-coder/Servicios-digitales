import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { categoria, q } = req.query
    const params = []
    let sql = `
      SELECT s.id_servicio, s.titulo, s.descripcion, s.precio_base, s.dias_entrega,
             s.imagen_url, s.estado, c.nombre AS categoria,
             u.nombre AS vendedor, u.id_usuario AS id_vendedor
      FROM servicios s
      JOIN categorias c ON c.id_categoria = s.id_categoria
      JOIN usuarios u ON u.id_usuario = s.id_vendedor
      WHERE s.estado = 'aprobado'
    `

    if (categoria) {
      sql += ' AND c.nombre LIKE ?'
      params.push(`%${categoria}%`)
    }
    if (q) {
      sql += ' AND (s.titulo LIKE ? OR s.descripcion LIKE ? OR u.nombre LIKE ?)'
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }

    sql += ' ORDER BY s.creado_en DESC'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar servicios', detail: error.message })
  }
})

router.get('/vendedor/mios', requireAuth, requireRole('vendedor', 'administrador'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.nombre AS categoria
       FROM servicios s
       JOIN categorias c ON c.id_categoria = s.id_categoria
       WHERE s.id_vendedor = ?
       ORDER BY s.creado_en DESC`,
      [req.user.id_usuario]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tus servicios', detail: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.nombre AS categoria, u.nombre AS vendedor
       FROM servicios s
       JOIN categorias c ON c.id_categoria = s.id_categoria
       JOIN usuarios u ON u.id_usuario = s.id_vendedor
       WHERE s.id_servicio = ? AND s.estado = 'aprobado'`,
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ message: 'Servicio no encontrado' })

    const [paquetes] = await pool.query(
      'SELECT * FROM paquetes_servicio WHERE id_servicio = ? ORDER BY precio',
      [req.params.id]
    )

    res.json({ ...rows[0], paquetes })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicio', detail: error.message })
  }
})

router.post('/', requireAuth, requireRole('vendedor', 'administrador'), async (req, res) => {
  try {
    const { id_categoria, titulo, descripcion, precio_base, dias_entrega, imagen_url, paquetes } =
      req.body

    if (!id_categoria || !titulo || !descripcion || precio_base == null) {
      return res.status(400).json({ message: 'Datos incompletos del servicio' })
    }

    const estado = req.user.rol === 'administrador' ? 'aprobado' : 'pendiente'

    const [result] = await pool.query(
      `INSERT INTO servicios
       (id_vendedor, id_categoria, titulo, descripcion, precio_base, dias_entrega, imagen_url, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id_usuario,
        id_categoria,
        titulo,
        descripcion,
        precio_base,
        dias_entrega || 7,
        imagen_url || null,
        estado,
      ]
    )

    const idServicio = result.insertId

    if (Array.isArray(paquetes) && paquetes.length) {
      for (const p of paquetes) {
        await pool.query(
          `INSERT INTO paquetes_servicio (id_servicio, nombre, precio, dias_entrega, descripcion)
           VALUES (?, ?, ?, ?, ?)`,
          [idServicio, p.nombre, p.precio, p.dias_entrega || 7, p.descripcion || null]
        )
      }
    }

    res.status(201).json({ id_servicio: idServicio, estado })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear servicio', detail: error.message })
  }
})

export default router
