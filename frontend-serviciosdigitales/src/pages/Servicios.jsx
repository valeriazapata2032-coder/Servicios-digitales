import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react'
import { CATALOGO } from '../data/brand'
import { api, formatCOP } from '../lib/api'
import { useCart } from '../context/CartContext'

const FILTROS = ['Todos', 'Redes', 'Diseño', 'Video', 'Web']

export default function Servicios() {
  const { count } = useCart()
  const [filtro, setFiltro] = useState('Todos')
  const [q, setQ] = useState('')
  const [listaApi, setListaApi] = useState(null)

  useEffect(() => {
    api
      .servicios(q ? { q } : {})
      .then(setListaApi)
      .catch(() => setListaApi(null))
  }, [q])

  const lista = useMemo(() => {
    if (listaApi && listaApi.length > 0) {
      return listaApi
        .filter((item) => {
          if (filtro === 'Todos') return true
          return String(item.categoria || '')
            .toLowerCase()
            .includes(filtro.toLowerCase().slice(0, 4))
        })
        .map((item) => ({
          id: item.id_servicio,
          categoria: item.categoria,
          titulo: item.titulo,
          vendedor: item.vendedor,
          rating: '4,9',
          precio: formatCOP(item.precio_base),
          imagen: item.imagen_url,
          fromApi: true,
        }))
    }

    return CATALOGO.filter((item) => {
      const byCat = filtro === 'Todos' || item.categoria === filtro
      const byQ =
        !q ||
        item.titulo.toLowerCase().includes(q.toLowerCase()) ||
        item.vendedor.toLowerCase().includes(q.toLowerCase())
      return byCat && byQ
    })
  }, [filtro, q, listaApi])

  return (
    <div className="min-h-[70vh] bg-surface pb-10">
      <div className="border-b border-border bg-white px-4 py-4 sm:px-8 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-ink sm:text-xl">Explorar servicios</h1>
          <Link to="/carrito" className="relative text-navy" aria-label="Carrito">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
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
                filtro === f ? 'bg-soft text-blue' : 'border border-border bg-white text-muted'
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

        <div className="grid gap-3.5 sm:grid-cols-2">
          {lista.map((item) => (
            <Link
              key={item.id}
              to={`/servicios/${item.id}`}
              className="flex overflow-hidden rounded-[18px] border border-border bg-white shadow-card transition hover:border-blue/30"
            >
              {item.imagen ? (
                <img
                  src={item.imagen}
                  alt=""
                  className="h-[148px] w-[112px] shrink-0 object-cover sm:w-[128px]"
                />
              ) : (
                <div className="flex h-[148px] w-[112px] shrink-0 items-center justify-center bg-soft text-xs font-semibold text-navy sm:w-[128px]">
                  Innova
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-blue">
                    {item.categoria}
                  </span>
                  <span className="text-muted" aria-hidden>
                    <Heart size={17} />
                  </span>
                </div>
                <h2 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                  {item.titulo}
                </h2>
                <p className="text-[10px] text-muted">
                  {item.vendedor} · ★ {item.rating}
                </p>
                <p className="mt-auto text-[15px] text-navy">{item.precio}</p>
              </div>
            </Link>
          ))}
        </div>

        {lista.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No hay servicios con ese filtro.</p>
        )}
      </div>
    </div>
  )
}
