import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api, formatCOP } from '../lib/api'

export default function PanelVendedor() {
  const { user, logout } = useAuth()
  const [servicios, setServicios] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    id_categoria: '',
    titulo: '',
    descripcion: '',
    precio_base: '',
    dias_entrega: 7,
  })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      const [s, p, c] = await Promise.all([
        api.misServicios(),
        api.misPedidos(),
        api.categorias(),
      ])
      setServicios(s)
      setPedidos(p)
      setCategorias(c)
      if (c[0] && !form.id_categoria) {
        setForm((f) => ({ ...f, id_categoria: String(c[0].id_categoria) }))
      }
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function crear(e) {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await api.crearServicio({
        id_categoria: Number(form.id_categoria),
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio_base: Number(form.precio_base),
        dias_entrega: Number(form.dias_entrega),
        paquetes: [
          {
            nombre: 'Básico',
            precio: Number(form.precio_base),
            dias_entrega: Number(form.dias_entrega),
          },
        ],
      })
      setMsg('Servicio enviado a revisión del administrador')
      setForm((f) => ({ ...f, titulo: '', descripcion: '', precio_base: '' }))
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function cambiarEstado(id, estado) {
    try {
      await api.actualizarPedido(id, estado)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[70vh] bg-surface">
      <div className="border-b border-border bg-white px-4 py-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-green">Panel del vendedor</p>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">{user?.nombre}</h1>
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

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-8 lg:grid-cols-2 lg:px-[72px]">
        <section className="rounded-[18px] border border-border bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-ink">Publicar servicio</h2>
          <form onSubmit={crear} className="mt-4 space-y-3">
            <select
              value={form.id_categoria}
              onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm"
              required
            >
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <input
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm"
            />
            <textarea
              required
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción"
              rows={3}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="number"
                min="1"
                value={form.precio_base}
                onChange={(e) => setForm({ ...form, precio_base: e.target.value })}
                placeholder="Precio COP"
                className="rounded-xl border border-border px-4 py-2.5 text-sm"
              />
              <input
                type="number"
                min="1"
                value={form.dias_entrega}
                onChange={(e) => setForm({ ...form, dias_entrega: e.target.value })}
                placeholder="Días"
                className="rounded-xl border border-border px-4 py-2.5 text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {msg && <p className="text-sm text-green">{msg}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white"
            >
              Enviar a aprobación
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-[18px] border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-ink">Mis servicios</h2>
            <ul className="mt-3 space-y-2">
              {servicios.map((s) => (
                <li
                  key={s.id_servicio}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5 text-sm"
                >
                  <span className="font-medium text-ink">{s.titulo}</span>
                  <span className="text-[11px] capitalize text-muted">{s.estado}</span>
                </li>
              ))}
              {servicios.length === 0 && (
                <li className="text-sm text-muted">Aún no has publicado servicios.</li>
              )}
            </ul>
          </div>

          <div className="rounded-[18px] border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-ink">Pedidos recibidos</h2>
            <ul className="mt-3 space-y-3">
              {pedidos.map((p) => (
                <li key={p.id_pedido} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <p className="font-semibold">#{p.id_pedido} · {p.cliente}</p>
                    <p className="font-bold text-navy">{formatCOP(p.total)}</p>
                  </div>
                  <p className="mt-1 text-[11px] capitalize text-muted">{p.estado}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['en_proceso', 'entregado', 'ajustes'].map((est) => (
                      <button
                        key={est}
                        type="button"
                        onClick={() => cambiarEstado(p.id_pedido, est)}
                        className="rounded-lg bg-soft px-2.5 py-1 text-[11px] font-semibold text-blue"
                      >
                        {est.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
              {pedidos.length === 0 && (
                <li className="text-sm text-muted">Sin pedidos por ahora.</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
