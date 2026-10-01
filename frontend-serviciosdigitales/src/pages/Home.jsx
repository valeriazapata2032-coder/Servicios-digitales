import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Clapperboard,
  Eye,
  HeartHandshake,
  Megaphone,
  MessagesSquare,
  Monitor,
  Palette,
  PenTool,
  Search,
  Share2,
  Target,
} from 'lucide-react'
import { useState } from 'react'
import {
  BRAND,
  CATEGORIAS,
  IMAGES,
  MISION,
  PASOS,
  SERVICIOS_DESTACADOS,
  VALORES_TEXTO,
  VISION,
} from '../data/brand'

const icons = {
  Share2,
  Palette,
  Clapperboard,
  PenTool,
  Monitor,
  Megaphone,
  MessagesSquare,
}

const ENCUESTA_OPTS = [
  'No sé por dónde empezar',
  'Me falta identidad y contenido',
  'Necesito más clientes online',
]

export default function Home() {
  const [opt, setOpt] = useState(ENCUESTA_OPTS[0])
  const [enviado, setEnviado] = useState(false)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-hero-from to-hero-to">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:flex-row lg:gap-16 lg:px-[90px] lg:py-[74px]">
          <div className="animate-fade-up flex-1 space-y-6">
            <span className="inline-flex rounded-full bg-soft-green px-2.5 py-1.5 text-[11px] font-semibold text-green">
              Talento digital verificado en Colombia
            </span>
            <h1 className="text-balance text-[2rem] font-extrabold leading-[1.06] text-ink sm:text-5xl lg:text-[56px]">
              Haz crecer tu negocio con{' '}
              <span className="text-blue">servicios digitales</span> que sí entregan.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:text-[19px]">
              Encuentra especialistas, compara paquetes y lleva cada idea de la estrategia a la
              entrega, con acompañamiento en un solo lugar.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/servicios"
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-blue px-[18px] text-sm font-semibold text-white"
              >
                <Search size={18} />
                Explorar servicios
              </Link>
              <Link
                to="/registro"
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border border-border bg-white px-[18px] text-sm font-semibold text-navy"
              >
                <Briefcase size={18} />
                Quiero vender
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 text-[13px]">
              <p className="text-ink">
                ★ 4,9/5 <span className="text-muted">en 1.240 proyectos</span>
              </p>
              <p className="text-muted">✓ Pagos protegidos</p>
              <p className="text-muted">✓ Soporte humano</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Instalable', 'Offline parcial', 'Notificaciones'].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-soft px-2.5 py-1.5 text-[11px] font-medium text-navy"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-[570px] shrink-0 overflow-hidden rounded-3xl shadow-hero lg:h-[500px]">
            <img
              src={IMAGES.heroTeam}
              alt="Equipo creativo colaborando"
              className="h-64 w-full object-cover sm:h-80 lg:h-full"
            />
            <div className="absolute bottom-4 right-4 w-[min(100%-2rem,230px)] rounded-[18px] bg-white p-4 shadow-card sm:bottom-[22px] sm:right-[22px]">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] text-muted">Proyecto entregado</p>
                <span className="rounded-full bg-soft-green px-2.5 py-1 text-[11px] font-semibold text-green">
                  A tiempo
                </span>
              </div>
              <p className="mt-2 text-[15px] font-bold text-ink">Nueva tienda de Amaru</p>
              <p className="mt-1 text-xs text-green">+38% conversión en 30 días</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="servicios" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-[90px]">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-bold uppercase text-green">Todo lo que tu negocio necesita</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-[32px]">
            Encuentra el impulso correcto
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Servicios especializados para cada etapa de tu crecimiento digital.
          </p>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {CATEGORIAS.map((cat) => {
              const Icon = icons[cat.icon]
              return (
                <Link
                  key={cat.id}
                  to={`/servicios#${cat.id}`}
                  className="flex min-h-[160px] flex-col gap-3.5 rounded-[18px] border border-border bg-surface p-[18px] transition hover:border-blue/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-blue">
                    <Icon size={20} />
                  </span>
                  <p className="text-[15px] font-bold text-ink">{cat.titulo}</p>
                  <p className="text-xs leading-snug text-muted">{cat.descripcion}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-navy px-4 py-14 text-white sm:px-8 sm:py-20 lg:px-[90px]">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-bold uppercase text-green-bright">Simple, seguro y acompañado</p>
          <h2 className="mt-2 text-2xl font-normal sm:text-[34px]">
            De una necesidad a un resultado claro
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PASOS.map((paso) => (
              <article key={paso.n} className="rounded-[18px] bg-navy-card p-6">
                <p className="text-xs font-bold text-green-bright">{paso.n}</p>
                <h3 className="mt-4 text-lg font-bold sm:text-[19px]">{paso.titulo}</h3>
                <p className="mt-4 text-sm leading-relaxed text-sky-text">{paso.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-surface px-4 py-14 sm:px-8 sm:py-20 lg:px-[90px]">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-bold uppercase text-green">Elegidos por la comunidad</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-[32px]">Servicios destacados</h2>
          <p className="mt-2 text-muted">
            Talento verificado, entregables definidos y precios transparentes en COP.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_DESTACADOS.map((s) => (
              <Link
                key={s.id}
                to="/servicios"
                className="overflow-hidden rounded-[18px] border border-border bg-white shadow-card transition hover:border-blue/30"
              >
                <img src={s.imagen} alt="" className="h-[180px] w-full object-cover sm:h-[220px]" />
                <div className="space-y-2.5 p-5">
                  <span className="inline-flex rounded-full bg-soft px-2.5 py-1.5 text-[11px] font-semibold text-blue">
                    {s.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{s.titulo}</h3>
                  <p className="text-xs text-muted">
                    por {s.vendedor} · ★ {s.rating} · {s.reseñas} reseñas
                  </p>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[11px] text-muted">Desde</span>
                    <span className="text-xl text-navy">{s.precio}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portafolio */}
      <section className="px-4 py-14 sm:px-8 sm:py-20 lg:px-[90px]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 lg:flex-row lg:gap-14">
          <div className="w-full max-w-md shrink-0 space-y-6">
            <p className="text-xs font-bold uppercase text-green">Portafolio</p>
            <h2 className="text-2xl font-bold text-ink sm:text-[32px]">
              Trabajo real, impacto visible
            </h2>
            <p className="text-muted">
              Conoce proyectos creados junto a emprendimientos que decidieron dar el siguiente paso.
            </p>
            <div className="flex gap-6">
              {[
                ['320+', 'proyectos'],
                ['91%', 'recomienda'],
                ['24 h', 'respuesta'],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl text-blue">{v}</p>
                  <p className="text-[11px] text-muted">{l}</p>
                </div>
              ))}
            </div>
            <Link
              to="/portafolio"
              className="inline-flex h-[46px] items-center gap-2 rounded-xl border border-border bg-white px-[18px] text-sm font-semibold text-navy"
            >
              <ArrowRight size={18} />
              Ver portafolio completo
            </Link>
          </div>
          <div className="flex w-full flex-1 gap-4">
            <img
              src={IMAGES.case1}
              alt="Caso de estudio"
              className="h-64 w-1/2 rounded-3xl object-cover sm:h-[430px]"
            />
            <div className="flex w-1/2 flex-col gap-4">
              <img
                src={IMAGES.case2}
                alt="Caso de estudio"
                className="h-1/2 min-h-28 flex-1 rounded-[18px] object-cover"
              />
              <img
                src={IMAGES.case3}
                alt="Caso de estudio"
                className="h-1/2 min-h-28 flex-1 rounded-[18px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="bg-soft px-4 py-14 sm:px-8 sm:py-20 lg:px-[90px]">
        <div className="mx-auto max-w-[1440px] text-center">
          <p className="text-xs font-bold uppercase text-green">Quiénes somos</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-[32px]">
            Tecnología con propósito emprendedor
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted">
            Conectamos capacidades digitales con negocios que merecen crecer en Latinoamérica.
          </p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            {[
              [Target, 'Misión', MISION],
              [Eye, 'Visión', VISION],
              [HeartHandshake, 'Valores', VALORES_TEXTO],
            ].map(([Icon, title, text]) => (
              <article key={title} className="rounded-[18px] bg-white p-6 sm:p-[26px]">
                <Icon className="text-green" size={26} />
                <h3 className="mt-3.5 text-xl font-bold text-navy">{title}</h3>
                <p className="mt-3.5 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonio + encuesta */}
      <section className="px-4 py-14 sm:px-8 sm:py-20 lg:px-[90px]">
        <div className="mx-auto grid max-w-[1440px] gap-7 lg:grid-cols-2">
          <article className="flex min-h-[280px] flex-col gap-5 rounded-3xl bg-navy p-7 text-white sm:p-[34px]">
            <p className="text-4xl text-green-bright">“</p>
            <p className="text-xl font-semibold leading-snug sm:text-2xl">
              Pasamos de publicar por intuición a tener una estrategia, una identidad y resultados
              que podemos medir.
            </p>
            <div>
              <p className="text-sm font-bold">Laura Jiménez · Fundadora, Kōra Café</p>
              <p className="text-xs text-sky-text">Cliente InnovaDigital</p>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h3 className="text-xl font-bold text-ink">¿Qué frena hoy tu crecimiento digital?</h3>
            <p className="mt-2 text-sm text-muted">Responde sin crear cuenta.</p>
            {enviado ? (
              <p className="mt-6 font-semibold text-green">¡Gracias! Tu respuesta nos ayuda a mejorar.</p>
            ) : (
              <form
                className="mt-6 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  setEnviado(true)
                }}
              >
                {ENCUESTA_OPTS.map((o) => (
                  <label
                    key={o}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                      opt === o ? 'border-blue bg-soft text-navy' : 'border-border text-ink'
                    }`}
                  >
                    <input
                      type="radio"
                      name="encuesta"
                      checked={opt === o}
                      onChange={() => setOpt(o)}
                      className="accent-blue"
                    />
                    {o}
                  </label>
                ))}
                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white"
                >
                  Enviar respuesta
                </button>
                <Link to="/encuesta" className="block text-center text-sm font-semibold text-navy">
                  Ir a la encuesta completa →
                </Link>
              </form>
            )}
          </article>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-navy px-4 py-14 text-center text-white sm:px-8 lg:px-[90px]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Tu próxima gran idea merece avanzar hoy.
          </h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/registro"
              className="inline-flex h-[46px] items-center justify-center rounded-xl bg-green-bright px-6 text-sm font-semibold text-navy"
            >
              Crear cuenta gratis
            </Link>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[46px] items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-surface px-4 py-14 sm:px-8 sm:py-16 lg:px-[90px]">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-green">Contacto</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-[32px]">Hablemos de tu proyecto</h2>
            <p className="mt-3 text-muted">
              Escríbenos o déjanos un mensaje. Respuesta en menos de 24 horas hábiles.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li>Rionegro, Antioquia · Colombia</li>
              <li>WhatsApp Business disponible</li>
            </ul>
          </div>
          <form
            className="space-y-4 rounded-[18px] border border-border bg-white p-6 shadow-card"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="block text-sm font-medium">
              Nombre
              <input
                required
                className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
                placeholder="Tu nombre"
              />
            </label>
            <label className="block text-sm font-medium">
              Correo
              <input
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
                placeholder="tu@correo.com"
              />
            </label>
            <label className="block text-sm font-medium">
              Mensaje
              <textarea
                required
                rows={4}
                className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
                placeholder="Cuéntanos qué necesitas"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
