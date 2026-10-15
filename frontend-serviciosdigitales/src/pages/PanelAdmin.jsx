import { useEffect, useState } from 'react'
import { Check, Users, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api, formatCOP } from '../lib/api'

export default function PanelAdmin() {
  const { user, logout } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try {
      const [m, u] = await Promise.all([api.adminMetrics(), api.adminUsuarios()])
      setMetrics(m)
      setUsuarios(u)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function decidir(id, estado) {
    try {
      await api.aprobarServicio(id, estado)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const cards = metrics
    ? [
        ['Ventas', formatCOP(metrics.ventas)],
        ['Pedidos', metrics.pedidos],
        ['Usuarios', metrics.usuarios],
        ['Servicios activos', metrics.servicios],
      ]
    : []

  return (
    <div className="min-h-[70vh] bg-surface">
      <div className="border-b border-border bg-white px-4 py-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-green">Panel del administrador</p>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">
              Operaciones · {user?.nombre}
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="h-10 rounded-xl border border-border px-4 text-sm font-semibold text-navy"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-8 lg:px-[72px]">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value]) => (
            <article
              key={label}
              className="rounded-[18px] border border-border bg-white p-5 shadow-card"
            >
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[18px] border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-ink">Aprobaciones de servicios</h2>
            <p className="mt-1 text-xs text-muted">Revisa publicaciones pendientes de vendedores</p>
            <ul className="mt-4 space-y-3">
              {(metrics?.pendientes || []).map((s) => (
                <li
                  key={s.id_servicio}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.titulo}</p>
                    <p className="text-[11px] text-muted">
                      {s.vendedor} · {formatCOP(s.precio_base)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => decidir(s.id_servicio, 'rechazado')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"
                      aria-label="Rechazar"
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => decidir(s.id_servicio, 'aprobado')}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft-green text-green"
                      aria-label="Aprobar"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </li>
              ))}
              {metrics && metrics.pendientes?.length === 0 && (
                <li className="text-sm text-muted">No hay servicios pendientes.</li>
              )}
            </ul>
          </section>

          <section className="rounded-[18px] border border-border bg-white p-5 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
              <Users size={18} className="text-blue" />
              Usuarios
            </h2>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {usuarios.map((u) => (
                <li
                  key={u.id_usuario}
                  className="rounded-xl border border-border px-3 py-2.5 text-sm"
                >
                  <p className="font-semibold text-ink">{u.nombre}</p>
                  <p className="text-[11px] text-muted">
                    {u.correo} · {u.rol}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
