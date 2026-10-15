import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BRAND } from '../data/brand'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, panelPath } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(correo, password)
      const dest =
        location.state?.from ||
        (user.rol === 'administrador'
          ? '/panel/admin'
          : user.rol === 'vendedor'
            ? '/panel/vendedor'
            : '/panel/cliente')
      navigate(dest, { replace: true })
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
      <h1 className="mt-4 text-3xl font-bold text-ink">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-muted">Accede para gestionar pedidos y servicios.</p>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-ink">
          Correo
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="tu@correo.com"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-muted">
        Demo: cliente@innovadigital.co / Cliente123
      </p>

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-semibold text-navy hover:text-blue">
          Regístrate
        </Link>
      </p>
      <button
        type="button"
        className="mt-2 text-center text-xs text-blue"
        onClick={() => navigate(panelPath())}
      >
        Ir a mi panel
      </button>
    </div>
  )
}
