import { Link } from 'react-router-dom'
import { BRAND } from '../data/brand'

export default function Registro() {
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
        Regístrate como cliente para solicitar servicios y seguir tus pedidos.
      </p>

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block text-sm font-medium text-ink">
          Nombre
          <input
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="Tu nombre"
          />
        </label>
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
            minLength={8}
            className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
            placeholder="Mínimo 8 caracteres"
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" required className="mt-1 accent-blue" />
          Acepto el tratamiento de datos personales (Ley 1581 de 2012).
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-green py-3 text-sm font-semibold text-white"
        >
          Registrarme
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
