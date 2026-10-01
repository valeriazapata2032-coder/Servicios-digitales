import { Link, NavLink } from 'react-router-dom'
import { Download, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BRAND } from '../data/brand'

const links = [
  { to: '/servicios', label: 'Servicios', hash: null },
  { to: '/#como-funciona', label: 'Cómo funciona', hash: 'como-funciona' },
  { to: '/portafolio', label: 'Portafolio', hash: null },
  { to: '/#nosotros', label: 'Nosotros', hash: 'nosotros' },
  { to: '/#contacto', label: 'Contacto', hash: 'contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[84px] sm:px-8 lg:px-[72px]">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={BRAND.symbol} alt="" width={46} height={46} className="h-10 w-10 sm:h-[46px] sm:w-[46px]" />
          <span className="min-w-0">
            <span className="block text-[17px] font-bold leading-tight sm:text-[19px]">
              <span className="text-navy">{BRAND.nameStart}</span>
              <span className="text-green">{BRAND.nameEnd}</span>
            </span>
            <span className="hidden text-[10px] text-muted sm:block">{BRAND.slogan}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] text-ink lg:flex">
          {links.map((link) =>
            link.hash ? (
              <a key={link.label} href={link.to} className="hover:text-blue">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => (isActive ? 'font-semibold text-blue' : 'hover:text-blue')}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            to="/login"
            className="inline-flex h-[46px] items-center rounded-xl px-[18px] text-sm font-semibold text-navy"
          >
            Acceder
          </Link>
          <Link
            to="/registro"
            className="inline-flex h-[46px] items-center rounded-xl border border-border bg-white px-[18px] text-sm font-semibold text-navy"
          >
            Crear cuenta
          </Link>
          <button
            type="button"
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-blue px-[18px] text-sm font-semibold text-white"
          >
            <Download size={18} />
            Instalar app
          </button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-navy lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-border bg-white px-4 py-3 shadow-card lg:hidden">
          {links.map((link) =>
            link.hash ? (
              <a
                key={link.label}
                href={link.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3.5 text-base text-ink"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3.5 text-base text-ink"
              >
                {link.label}
              </NavLink>
            )
          )}
          <div className="mt-2 space-y-2 border-t border-border pt-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-center text-sm font-semibold text-navy"
            >
              Acceder
            </Link>
            <Link
              to="/registro"
              onClick={() => setOpen(false)}
              className="block rounded-xl border border-border px-3 py-3 text-center text-sm font-semibold text-navy"
            >
              Crear cuenta
            </Link>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue px-3 py-3 text-sm font-semibold text-white"
            >
              <Download size={18} />
              Instalar app
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
