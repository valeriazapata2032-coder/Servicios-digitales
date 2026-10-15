import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, ShoppingCart } from 'lucide-react'
import { api, formatCOP } from '../lib/api'
import { useCart } from '../context/CartContext'
import { CATALOGO } from '../data/brand'

export default function ServicioDetalle() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [servicio, setServicio] = useState(null)
  const [paqueteId, setPaqueteId] = useState(null)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .servicio(id)
      .then((data) => {
        if (!alive) return
        setServicio(data)
        setPaqueteId(data.paquetes?.[0]?.id_paquete || null)
      })
      .catch(() => {
        // Fallback demo si la API no está disponible
        const local = CATALOGO.find((c) => String(c.id) === String(id))
        if (local && alive) {
          setServicio({
            id_servicio: local.id,
            titulo: local.titulo,
            descripcion:
              'Paquete diseñado para impulsar la presencia digital de tu emprendimiento con entregables claros y acompañamiento.',
            precio_base: Number(String(local.precio).replace(/\D/g, '')) || 0,
            dias_entrega: 7,
            categoria: local.categoria,
            vendedor: local.vendedor,
            imagen_url: local.imagen,
            paquetes: [
              {
                id_paquete: 1,
                nombre: 'Básico',
                precio: Number(String(local.precio).replace(/\D/g, '')) || 0,
                dias_entrega: 7,
              },
            ],
            _local: true,
          })
          setPaqueteId(1)
        } else if (alive) {
          setError('No se pudo cargar el servicio')
        }
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return <p className="px-4 py-20 text-center text-muted">Cargando servicio…</p>
  }

  if (error || !servicio) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-muted">{error || 'Servicio no encontrado'}</p>
        <Link to="/servicios" className="mt-4 inline-block font-semibold text-blue">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const pack = servicio.paquetes?.find((p) => p.id_paquete === paqueteId)
  const precio = pack ? Number(pack.precio) : Number(servicio.precio_base)

  function agregar() {
    addItem({
      id_servicio: servicio.id_servicio,
      id_paquete: paqueteId,
      titulo: servicio.titulo,
      vendedor: servicio.vendedor,
      paquete: pack?.nombre || 'Base',
      precio,
      imagen: servicio.imagen_url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-surface pb-16">
      <div className="border-b border-border bg-white px-4 py-4 sm:px-8 lg:px-[72px]">
        <Link to="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
          <ArrowLeft size={18} />
          Catálogo
        </Link>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:px-[72px]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          {servicio.imagen_url ? (
            <img
              src={servicio.imagen_url}
              alt=""
              className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-soft text-navy sm:h-80">
              Innova Digital
            </div>
          )}
        </div>

        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-soft px-2.5 py-1.5 text-[11px] font-semibold text-blue">
            {servicio.categoria}
          </span>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{servicio.titulo}</h1>
          <p className="text-sm text-muted">por {servicio.vendedor}</p>
          <p className="leading-relaxed text-muted">{servicio.descripcion}</p>

          <div className="flex items-center gap-2 text-sm text-ink">
            <Clock size={16} className="text-blue" />
            Entrega en {pack?.dias_entrega || servicio.dias_entrega} días
          </div>

          {servicio.paquetes?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">Elige un paquete</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {servicio.paquetes.map((p) => (
                  <button
                    key={p.id_paquete}
                    type="button"
                    onClick={() => setPaqueteId(p.id_paquete)}
                    className={`rounded-xl border p-3 text-left transition ${
                      paqueteId === p.id_paquete
                        ? 'border-blue bg-soft'
                        : 'border-border bg-white'
                    }`}
                  >
                    <p className="text-sm font-bold text-ink">{p.nombre}</p>
                    <p className="mt-1 text-xs text-muted">{formatCOP(p.precio)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] text-muted">Total</p>
              <p className="text-2xl font-bold text-navy">{formatCOP(precio)}</p>
            </div>
            <button
              type="button"
              onClick={agregar}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-blue px-6 text-sm font-semibold text-white"
            >
              <ShoppingCart size={18} />
              {added ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          </div>

          <Link to="/carrito" className="block text-center text-sm font-semibold text-navy sm:text-left">
            Ir al carrito →
          </Link>
        </div>
      </div>
    </div>
  )
}
