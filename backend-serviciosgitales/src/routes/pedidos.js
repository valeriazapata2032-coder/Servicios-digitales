import { Router } from 'express'
import { pool } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, requireRole('cliente', 'administrador'), async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { items, metodo_pago = 'transferencia', briefing } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' })
    }

    await conn.beginTransaction()

    const serviceIds = items.map((i) => i.id_servicio)
    const [servicios] = await conn.query(
      `SELECT id_servicio, id_vendedor, precio_base, titulo, estado
       FROM servicios WHERE id_servicio IN (?)`,
      [serviceIds]
    )

    if (servicios.length !== serviceIds.length) {
      throw Object.assign(new Error('Uno o más servicios no existen'), { status: 400 })
    }

    const noAprobados = servicios.filter((s) => s.estado !== 'aprobado')
    if (noAprobados.length) {
      throw Object.assign(new Error('Hay servicios no disponibles'), { status: 400 })
    }

    // Agrupar por vendedor (HU-07)
    const porVendedor = new Map()
    for (const item of items) {
      const servicio = servicios.find((s) => s.id_servicio === item.id_servicio)
      const list = porVendedor.get(servicio.id_vendedor) || []
      list.push({ ...item, servicio })
      porVendedor.set(servicio.id_vendedor, list)
    }

    const pedidosCreados = []

    for (const [idVendedor, grupo] of porVendedor) {
      let total = 0
      const lineas = []

      for (const item of grupo) {
        let precio = Number(item.servicio.precio_base)
        let idPaquete = item.id_paquete || null

        if (idPaquete) {
          const [packs] = await conn.query(
            'SELECT precio FROM paquetes_servicio WHERE id_paquete = ? AND id_servicio = ?',
            [idPaquete, item.id_servicio]
          )
          if (packs[0]) precio = Number(packs[0].precio)
        }

        const cantidad = Math.max(1, Number(item.cantidad) || 1)
        total += precio * cantidad
        lineas.push({
          id_servicio: item.id_servicio,
          id_paquete: idPaquete,
          cantidad,
          precio_unitario: precio,
        })
      }

      const [pedidoResult] = await conn.query(
        `INSERT INTO pedidos (id_cliente, id_vendedor, total, metodo_pago, estado)
         VALUES (?, ?, ?, ?, 'pendiente')`,
        [req.user.id_usuario, idVendedor, total, metodo_pago]
      )

      const idPedido = pedidoResult.insertId

      for (const linea of lineas) {
        await conn.query(
          `INSERT INTO items_pedido (id_pedido, id_servicio, id_paquete, cantidad, precio_unitario)
           VALUES (?, ?, ?, ?, ?)`,
          [idPedido, linea.id_servicio, linea.id_paquete, linea.cantidad, linea.precio_unitario]
        )
      }

      if (briefing?.nombre_negocio) {
        await conn.query(
          `INSERT INTO briefings (id_pedido, nombre_negocio, objetivos, publico_objetivo, redes_actuales)
           VALUES (?, ?, ?, ?, ?)`,
          [
            idPedido,
            briefing.nombre_negocio,
            briefing.objetivos || null,
            briefing.publico_objetivo || null,
            briefing.redes_actuales || null,
          ]
        )
      }

      pedidosCreados.push({ id_pedido: idPedido, id_vendedor: idVendedor, total })
    }

    await conn.commit()
    res.status(201).json({ pedidos: pedidosCreados })
  } catch (error) {
    await conn.rollback()
    res.status(error.status || 500).json({
      message: error.message || 'Error al crear pedido',
      detail: error.message,
    })
  } finally {
    conn.release()
  }
})

router.get('/mios', requireAuth, async (req, res) => {
  try {
    const { rol, id_usuario } = req.user
    let sql
    let params

    if (rol === 'cliente') {
      sql = `
        SELECT p.*, u.nombre AS vendedor
        FROM pedidos p
        JOIN usuarios u ON u.id_usuario = p.id_vendedor
        WHERE p.id_cliente = ?
        ORDER BY p.creado_en DESC`
      params = [id_usuario]
    } else if (rol === 'vendedor') {
      sql = `
        SELECT p.*, u.nombre AS cliente
        FROM pedidos p
        JOIN usuarios u ON u.id_usuario = p.id_cliente
        WHERE p.id_vendedor = ?
        ORDER BY p.creado_en DESC`
      params = [id_usuario]
    } else {
      sql = `
        SELECT p.*, c.nombre AS cliente, v.nombre AS vendedor
        FROM pedidos p
        JOIN usuarios c ON c.id_usuario = p.id_cliente
        JOIN usuarios v ON v.id_usuario = p.id_vendedor
        ORDER BY p.creado_en DESC`
      params = []
    }

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar pedidos', detail: error.message })
  }
})

router.patch('/:id/estado', requireAuth, requireRole('vendedor', 'administrador'), async (req, res) => {
  try {
    const { estado } = req.body
    const validos = ['pendiente', 'en_proceso', 'entregado', 'ajustes', 'cerrado', 'cancelado']
    if (!validos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' })
    }

    const [result] = await pool.query(
      `UPDATE pedidos SET estado = ?
       WHERE id_pedido = ? AND (id_vendedor = ? OR ? = 'administrador')`,
      [estado, req.params.id, req.user.id_usuario, req.user.rol]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    res.json({ ok: true, estado })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pedido', detail: error.message })
  }
})

export default router
