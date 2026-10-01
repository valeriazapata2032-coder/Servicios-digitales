import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react'
import { CATALOGO } from '../data/brand'

const FILTROS = ['Todos', 'Redes', 'Diseño', 'Video', 'Web']

export default function Servicios() {
  const [filtro, setFiltro] = useState('Todos')
  const [q, setQ] = useState('')

  const lista = useMemo(() => {
    return CATALOGO.filter((item) => {
      const byCat = filtro === 'Todos' || item.categoria === filtro
      const byQ =
        !q ||
        item.titulo.toLowerCase().includes(q.toLowerCase()) ||
        item.vendedor.toLowerCase().includes(q.toLowerCase())
      return byCat && byQ
    })
  }, [filtro, q])

  return (
    <div className="min-h-[70vh] bg-surface pb-10">
      <div className="border-b border-border bg-white px-4 py-4 sm:px-8 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-ink sm:text-xl">Explorar servicios</h1>
          <Link to="/registro" className="text-navy" aria-label="Carrito / pedidos">
            <ShoppingBag size={22} />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] space-y-4 px-4 py-5 sm:px-8 lg:px-[72px]">
        <label className="flex h-12 items-center gap-2.5 rounded-xl border border-border bg-white px-3.5">
          <Search size={20} className="shrink-0 text-muted-light" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="¿Qué necesita tu negocio?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-light"
          />
          <SlidersHorizontal size={20} className="shrink-0 text-muted" />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {['Instalable', 'Offline parcial', 'Notificaciones'].map((t) => (
            <span
              key={t}
              className="rounded-full bg-white px-2 py-1.5 text-[10px] font-medium text-navy sm:text-[11px]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTROS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                filtro === f
                  ? 'bg-soft text-blue'
                  : 'border border-border bg-white text-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <p className="text-ink">{lista.length} servicios</p>
          <p className="text-[11px] text-muted">Precio: cualquier valor</p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-2">
          {lista.map((item) => (
            <article
              key={item.id}
              className="flex overflow-hidden rounded-[18px] border border-border bg-white shadow-card"
            >
              <img
                src={item.imagen}
                alt=""
                className="h-[148px] w-[112px] shrink-0 object-cover sm:w-[128px]"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-blue">
                    {item.categoria}
                  </span>
                  <button type="button" aria-label="Favorito" className="text-muted">
                    <Heart size={17} />
                  </button>
                </div>
                <h2 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                  {item.titulo}
                </h2>
                <p className="text-[10px] text-muted">
                  {item.vendedor} · ★ {item.rating}
                </p>
                <p className="mt-auto text-[15px] text-navy">{item.precio}</p>
              </div>
            </article>
          ))}
        </div>

        {lista.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No hay servicios con ese filtro.</p>
        )}
      </div>
    </div>
  )
}
