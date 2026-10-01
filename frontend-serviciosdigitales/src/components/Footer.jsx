import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { BRAND } from '../data/brand'

export default function Footer() {
  return (
    <footer className="bg-navy text-sky-text">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-[72px] lg:py-16">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={BRAND.symbol} alt="" width={40} height={40} className="h-10 w-10" />
            <p className="text-lg font-bold">
              <span className="text-white">{BRAND.nameStart}</span>
              <span className="text-green-bright">{BRAND.nameEnd}</span>
            </p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{BRAND.slogan}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Nosotros</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/#nosotros" className="hover:text-white">
                Misión y visión
              </a>
            </li>
            <li>
              <Link to="/portafolio" className="hover:text-white">
                Portafolio
              </Link>
            </li>
            <li>
              <Link to="/encuesta" className="hover:text-white">
                Encuesta
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Compañía</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/servicios" className="hover:text-white">
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/registro" className="hover:text-white">
                Crear cuenta
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Acceder
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Rionegro, Antioquia</li>
            <li>
              <a href={`https://wa.me/${BRAND.whatsapp}`} className="hover:text-white">
                WhatsApp Business
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={BRAND.instagram} aria-label="Instagram" className="text-white hover:text-green-bright">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={BRAND.facebook} aria-label="Facebook" className="text-white hover:text-green-bright">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs sm:px-8 lg:px-[72px]">
        <p className="flex flex-wrap items-center justify-center gap-1">
          © {new Date().getFullYear()} InnovaDigital · Hecho con
          <Heart size={12} className="fill-green-bright text-green-bright" /> en Colombia
        </p>
      </div>
    </footer>
  )
}
