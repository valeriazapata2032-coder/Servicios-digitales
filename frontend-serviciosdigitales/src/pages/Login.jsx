import { Link } from 'react-router-dom'
import { BRAND } from '../data/brand'

export default function Login() {
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

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block text-sm font-medium text-ink">
          Correo
          <input
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="tu@correo.com"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Contraseña
          <input
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-semibold text-navy hover:text-blue">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
