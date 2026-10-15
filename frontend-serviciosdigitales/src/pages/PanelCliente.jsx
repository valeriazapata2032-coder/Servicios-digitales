import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api, formatCOP } from '../lib/api'

const estadoColor = {
  pendiente: 'bg-amber-50 text-amber-700',
  en_proceso: 'bg-soft text-blue',
  entregado: 'bg-soft-green text-green',
  ajustes: 'bg-orange-50 text-orange-700',
  cerrado: 'bg-slate-100 text-slate-600',
  cancelado: 'bg-red-50 text-red-600',
}

export default function PanelCliente() {
  const { user, logout } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .misPedidos()
      .then(setPedidos)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="min-h-[70vh] bg-surface">
      <div className="border-b border-border bg-white px-4 py-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-green">Panel del cliente</p>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">Hola, {user?.nombre}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              to="/servicios"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue px-4 text-sm font-semibold text-white"
            >
              <ShoppingBag size={16} />
              Explorar
            </Link>
            <button
              type="button"
              onClick={logout}
              className="h-10 rounded-xl border border-border px-4 text-sm font-semibold text-navy"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-[72px]">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
          <Package size={20} className="text-blue" />
          Mis pedidos
        </h2>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {pedidos.length === 0 ? (
          <p className="rounded-[18px] border border-border bg-white p-8 text-center text-sm text-muted">
            Aún no tienes pedidos.{' '}
            <Link to="/servicios" className="font-semibold text-blue">
              Empieza aquí
            </Link>
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {pedidos.map((p) => (
              <article
                key={p.id_pedido}
                className="rounded-[18px] border border-border bg-white p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-ink">Pedido #{p.id_pedido}</p>
                    <p className="text-xs text-muted">Vendedor: {p.vendedor}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                      estadoColor[p.estado] || 'bg-slate-100'
                    }`}
                  >
                    {p.estado.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-4 text-xl font-bold text-navy">{formatCOP(p.total)}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {new Date(p.creado_en).toLocaleDateString('es-CO')}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
