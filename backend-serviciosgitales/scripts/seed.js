import bcrypt from 'bcryptjs'
import { pool } from '../src/config/db.js'

async function main() {
  const password_hash = await bcrypt.hash('Admin1234', 10)
  const vendedorHash = await bcrypt.hash('Vendedor123', 10)
  const clienteHash = await bcrypt.hash('Cliente123', 10)

  await pool.query(
    `INSERT INTO usuarios (id_rol, nombre, correo, password_hash, telefono)
     VALUES (1, 'Admin Innova', 'admin@innovadigital.co', ?, '3000000001')
     ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`
  , [password_hash])

  await pool.query(
    `INSERT INTO usuarios (id_rol, nombre, correo, password_hash, telefono)
     VALUES (2, 'Nómada Studio', 'vendedor@innovadigital.co', ?, '3000000002')
     ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`
  , [vendedorHash])

  await pool.query(
    `INSERT INTO usuarios (id_rol, nombre, correo, password_hash, telefono)
     VALUES (3, 'Laura Jiménez', 'cliente@innovadigital.co', ?, '3000000003')
     ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`
  , [clienteHash])

  const [[vendedor]] = await pool.query(
    `SELECT id_usuario FROM usuarios WHERE correo = 'vendedor@innovadigital.co'`
  )

  const [cats] = await pool.query(`SELECT id_categoria, nombre FROM categorias`)
  const cat = (name) => cats.find((c) => c.nombre.includes(name.split(' ')[0]))?.id_categoria

  const serviciosSeed = [
    {
      cat: cat('Redes'),
      titulo: 'Plan de redes que sí convierte',
      descripcion:
        'Estrategia mensual de contenido, calendario editorial y community management básico para Instagram y Facebook.',
      precio: 480000,
      dias: 14,
    },
    {
      cat: cat('Diseño'),
      titulo: 'Identidad visual para tu marca',
      descripcion:
        'Logo, paleta, tipografía y kit de marca listo para redes, papelería y web.',
      precio: 690000,
      dias: 10,
    },
    {
      cat: cat('Páginas'),
      titulo: 'Landing page lista para vender',
      descripcion:
        'Landing responsive con formulario de contacto, SEO básico y despliegue en Vercel.',
      precio: 1250000,
      dias: 21,
    },
    {
      cat: cat('Edición'),
      titulo: 'Video vertical para tu campaña',
      descripcion:
        'Edición de 1 video vertical (Reels/TikTok/Shorts) con subtítulos y música libre.',
      precio: 350000,
      dias: 5,
    },
  ]

  for (const s of serviciosSeed) {
    if (!s.cat || !vendedor) continue
    const [existing] = await pool.query(
      `SELECT id_servicio FROM servicios WHERE titulo = ? AND id_vendedor = ? LIMIT 1`,
      [s.titulo, vendedor.id_usuario]
    )
    if (existing.length) continue

    const [result] = await pool.query(
      `INSERT INTO servicios
       (id_vendedor, id_categoria, titulo, descripcion, precio_base, dias_entrega, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'aprobado')`,
      [vendedor.id_usuario, s.cat, s.titulo, s.descripcion, s.precio, s.dias]
    )

    await pool.query(
      `INSERT INTO paquetes_servicio (id_servicio, nombre, precio, dias_entrega, descripcion) VALUES
       (?, 'Básico', ?, ?, 'Entregable esencial'),
       (?, 'Estándar', ?, ?, 'Alcance recomendado'),
       (?, 'Premium', ?, ?, 'Máximo acompañamiento')`,
      [
        result.insertId,
        s.precio,
        s.dias,
        result.insertId,
        Math.round(s.precio * 1.4),
        s.dias + 3,
        result.insertId,
        Math.round(s.precio * 1.9),
        s.dias + 7,
      ]
    )
  }

  console.log('Seed OK')
  console.log('Cuentas demo:')
  console.log('  admin@innovadigital.co / Admin1234')
  console.log('  vendedor@innovadigital.co / Vendedor123')
  console.log('  cliente@innovadigital.co / Cliente123')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
