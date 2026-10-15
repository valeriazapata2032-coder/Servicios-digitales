import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BRAND } from '../data/brand'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const { registro } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'cliente',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await registro(form)
      navigate(user.rol === 'vendedor' ? '/panel/vendedor' : '/panel/cliente', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <div className="flex items-center gap-2">
        <img src={BRAND.symbol} alt="" width={40} height={40} />
        <p className="text-xl font-bold">
          <span className="text-navy">{BRAND.nameStart}</span>
          <span className="text-green">{BRAND.nameEnd}</span>
        </p>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-ink">Crear cuenta</h1>
      <p className="mt-2 text-sm text-muted">
        Regístrate para solicitar servicios o vender en Innova Digital.
      </p>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-ink">
          Nombre
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="Tu nombre"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Correo
          <input
            type="email"
            required
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="tu@correo.com"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Contraseña
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="Mínimo 8 caracteres"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Quiero registrarme como
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
          >
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </label>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" required className="mt-1 accent-blue" />
          Acepto el tratamiento de datos personales (Ley 1581 de 2012).
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Creando…' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-navy hover:text-blue">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
