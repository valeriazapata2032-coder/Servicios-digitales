import { useState } from 'react'
import { api } from '../lib/api'

const PREGUNTAS = [
  {
    id: 1,
    enunciado: '¿Qué tipo de servicio digital necesitas con más urgencia?',
    opciones: [
      'Redes sociales',
      'Diseño gráfico',
      'Página web',
      'Publicidad en línea',
      'Asesoría / estrategia',
    ],
  },
  {
    id: 2,
    enunciado: '¿Cuál es tu canal preferido para contactar proveedores?',
    opciones: ['WhatsApp', 'Instagram', 'Correo', 'Llamada', 'Página web'],
  },
  {
    id: 3,
    enunciado: '¿Qué es más importante al elegir un servicio digital?',
    opciones: ['Calidad', 'Precio', 'Tiempo de entrega', 'Atención personalizada'],
  },
]

export default function Encuesta() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [correo, setCorreo] = useState('')
  const [consentimiento, setConsentimiento] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pregunta = PREGUNTAS[paso]
  const total = PREGUNTAS.length

  function seleccionar(opcion) {
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: opcion }))
  }

  function siguiente() {
    if (paso < total - 1) setPaso((p) => p + 1)
  }

  async function enviar(e) {
    e.preventDefault()
    if (!consentimiento) return
    setError('')
    setLoading(true)
    try {
      await api.enviarEncuesta(1, {
        correo: correo || null,
        consentimiento: true,
        respuestas,
      })
      setEnviado(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-3xl font-bold text-navy">¡Gracias!</p>
        <p className="mt-3 text-muted">
          Tu respuesta nos ayuda a mejorar la oferta de Innova Digital para emprendimientos y
          empresas.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-green">
        Investigación de mercado
      </p>
      <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
        Encuesta de servicios digitales
      </h1>
      <p className="mt-3 text-muted">
        No necesitas cuenta. Tus datos se tratan según la Ley 1581 de 2012.
      </p>

      <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-soft">
        <div
          className="h-full rounded-full bg-green-bright transition-all duration-300"
          style={{ width: `${((paso + 1) / total) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        Pregunta {paso + 1} de {total}
      </p>

      <form onSubmit={enviar} className="mt-8 space-y-6">
        <fieldset>
          <legend className="text-xl font-bold text-ink">{pregunta.enunciado}</legend>
          <div className="mt-4 space-y-2">
            {pregunta.opciones.map((op) => {
              const activa = respuestas[pregunta.id] === op
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => seleccionar(op)}
                  className={`block w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    activa
                      ? 'border-blue bg-soft text-navy'
                      : 'border-border bg-white text-ink hover:border-blue/40'
                  }`}
                >
                  {op}
                </button>
              )
            })}
          </div>
        </fieldset>

        {paso < total - 1 ? (
          <button
            type="button"
            disabled={!respuestas[pregunta.id]}
            onClick={siguiente}
            className="w-full rounded-xl bg-blue py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        ) : (
          <div className="space-y-4 border-t border-border pt-6">
            <label className="block text-sm font-medium text-ink">
              Correo (opcional)
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
                placeholder="tu@correo.com"
              />
            </label>
            <label className="flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={consentimiento}
                onChange={(e) => setConsentimiento(e.target.checked)}
                className="mt-1 accent-blue"
                required
              />
              Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={!respuestas[pregunta.id] || !consentimiento || loading}
              className="w-full rounded-xl bg-green py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Enviando…' : 'Enviar respuestas'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
