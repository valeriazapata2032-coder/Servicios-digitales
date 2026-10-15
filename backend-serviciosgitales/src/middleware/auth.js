import jwt from 'jsonwebtoken'

export function signToken(user) {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      id_rol: user.id_rol,
      rol: user.rol,
      nombre: user.nombre,
      correo: user.correo,
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  )
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado para este recurso' })
    }
    next()
  }
}
