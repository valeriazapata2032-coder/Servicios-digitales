import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

const ROL_CLIENTE = 3
const ROL_VENDEDOR = 2

router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, password, telefono, rol = 'cliente' } = req.body

    if (!nombre?.trim() || !correo?.trim() || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
    }

    const idRol = rol === 'vendedor' ? ROL_VENDEDOR : ROL_CLIENTE
    const password_hash = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      `INSERT INTO usuarios (id_rol, nombre, correo, password_hash, telefono)
       VALUES (?, ?, ?, ?, ?)`,
      [idRol, nombre.trim(), correo.trim().toLowerCase(), password_hash, telefono || null]
    )

    const user = {
      id_usuario: result.insertId,
      id_rol: idRol,
      rol: idRol === ROL_VENDEDOR ? 'vendedor' : 'cliente',
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
    }

    res.status(201).json({ token: signToken(user), user })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Este correo ya está registrado' })
    }
    res.status(500).json({ message: 'Error al registrar', detail: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' })
    }

    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.id_rol, u.nombre, u.correo, u.password_hash, u.activo, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.correo = ?`,
      [correo.trim().toLowerCase()]
    )

    const row = rows[0]
    if (!row || !row.activo) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const ok = await bcrypt.compare(password, row.password_hash)
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const user = {
      id_usuario: row.id_usuario,
      id_rol: row.id_rol,
      rol: row.rol,
      nombre: row.nombre,
      correo: row.correo,
    }

    res.json({ token: signToken(user), user })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', detail: error.message })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.id_rol, u.nombre, u.correo, u.telefono, u.canal_contacto, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.id_usuario = ? AND u.activo = 1`,
      [req.user.id_usuario]
    )
    if (!rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', detail: error.message })
  }
})

export default router
