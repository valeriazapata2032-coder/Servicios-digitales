import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api, formatCOP } from '../lib/api'

export default function Carrito() {
  const { items, removeItem, updateQty, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [metodo, setMetodo] = useState('transferencia')
  const [briefing, setBriefing] = useState({
    nombre_negocio: '',
    objetivos: '',
    publico_objetivo: '',
    redes_actuales: '',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function checkout(e) {
    e.preventDefault()
    setError('')
    setMsg('')

    if (!user) {
      navigate('/login', { state: { from: '/carrito' } })
      return
    }

    if (!briefing.nombre_negocio.trim()) {
      setError('Completa el diagnóstico: nombre del negocio')
      return
    }

    setLoading(true)
    try {
      const data = await api.crearPedido({
        items: items.map((i) => ({
          id_servicio: i.id_servicio,
          id_paquete: i.id_paquete,
          cantidad: i.cantidad,
        })),
        metodo_pago: metodo,
        briefing,
      })
      clear()
      setMsg(`Pedido creado (${data.pedidos?.length || 1}). Revisa tu panel.`)
      setTimeout(() => navigate('/panel/cliente'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !msg) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted">Explora el catálogo y agrega el servicio que necesitas.</p>
        <Link
          to="/servicios"
          className="mt-6 inline-flex h-[46px] items-center rounded-xl bg-blue px-6 text-sm font-semibold text-white"
        >
          Ver servicios
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface pb-16">
      <div className="border-b border-border bg-white px-4 py-4 sm:px-8 lg:px-[72px]">
        <h1 className="text-lg font-bold text-ink sm:text-xl">Carrito y checkout</h1>
      </div>

      <form
        onSubmit={checkout}
        className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-[72px]"
      >
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={`${item.id_servicio}-${item.id_paquete}`}
              className="flex gap-3 rounded-[18px] border border-border bg-white p-3.5 shadow-card"
            >
              {item.imagen ? (
                <img src={item.imagen} alt="" className="h-20 w-20 rounded-xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-soft text-xs text-navy">
                  ID
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">{item.titulo}</p>
                <p className="text-[11px] text-muted">
                  {item.vendedor} · {item.paquete}
                </p>
                <p className="mt-1 text-sm font-semibold text-navy">{formatCOP(item.precio)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-border p-1"
                    onClick={() => updateQty(item.id_servicio, item.id_paquete, item.cantidad - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm">{item.cantidad}</span>
                  <button
                    type="button"
                    className="rounded-lg border border-border p-1"
                    onClick={() => updateQty(item.id_servicio, item.id_paquete, item.cantidad + 1)}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-muted"
                    onClick={() => removeItem(item.id_servicio, item.id_paquete)}
                    aria-label="Quitar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          <section className="rounded-[18px] border border-border bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-ink">Diagnóstico inicial</h2>
            <p className="mt-1 text-xs text-muted">
              Ayuda al vendedor a entender tu negocio (RF-16).
            </p>
            <div className="mt-4 space-y-3">
              <input
                required
                value={briefing.nombre_negocio}
                onChange={(e) => setBriefing({ ...briefing, nombre_negocio: e.target.value })}
                placeholder="Nombre del negocio"
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
              <textarea
                value={briefing.objetivos}
                onChange={(e) => setBriefing({ ...briefing, objetivos: e.target.value })}
                placeholder="Objetivos"
                rows={2}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
              <textarea
                value={briefing.publico_objetivo}
                onChange={(e) => setBriefing({ ...briefing, publico_objetivo: e.target.value })}
                placeholder="Público objetivo"
                rows={2}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
              <input
                value={briefing.redes_actuales}
                onChange={(e) => setBriefing({ ...briefing, redes_actuales: e.target.value })}
                placeholder="Redes actuales (IG, FB…)"
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[18px] border border-border bg-white p-5 shadow-card">
          <h2 className="text-base font-bold text-ink">Resumen</h2>
          <p className="mt-4 flex justify-between text-sm">
            <span className="text-muted">Total</span>
            <span className="font-bold text-navy">{formatCOP(total)}</span>
          </p>

          <label className="mt-4 block text-sm font-medium">
            Método de pago
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-blue"
            >
              <option value="transferencia">Transferencia</option>
              <option value="nequi">Nequi</option>
              <option value="efectivo">Efectivo / contraentrega</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {msg && <p className="mt-3 text-sm text-green">{msg}</p>}

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="mt-5 w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Confirmando…' : 'Confirmar pedido'}
          </button>
          {!user && (
            <p className="mt-3 text-center text-xs text-muted">
              Necesitas <Link to="/login" className="font-semibold text-navy">iniciar sesión</Link> para
              comprar.
            </p>
          )}
        </aside>
      </form>
    </div>
  )
}
