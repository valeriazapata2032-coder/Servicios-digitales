import { useState } from 'react'

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

  const pregunta = PREGUNTAS[paso]
  const total = PREGUNTAS.length

  function seleccionar(opcion) {
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: opcion }))
  }

  function siguiente() {
    if (paso < total - 1) setPaso((p) => p + 1)
  }

  function enviar(e) {
    e.preventDefault()
    if (!consentimiento) return
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="font-display text-3xl font-bold text-brand-700">¡Gracias!</p>
        <p className="mt-3 text-muted">
          Tu respuesta nos ayuda a mejorar la oferta de Innova Digital para
          emprendimientos y empresas.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
        Investigación de mercado
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-ink">
        Encuesta de servicios digitales
      </h1>
      <p className="mt-3 text-muted">
        No necesitas cuenta. Tus datos se tratan según la Ley 1581 de 2012.
      </p>

      <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-accent-500 transition-all duration-300"
          style={{ width: `${((paso + 1) / total) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        Pregunta {paso + 1} de {total}
      </p>

      <form onSubmit={enviar} className="mt-8 space-y-6">
        <fieldset>
          <legend className="font-display text-xl font-bold text-ink">
            {pregunta.enunciado}
          </legend>
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
                      ? 'border-accent-500 bg-accent-50 text-brand-800'
                      : 'border-brand-100 bg-white text-ink hover:border-brand-300'
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
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        ) : (
          <div className="space-y-4 border-t border-brand-100 pt-6">
            <label className="block text-sm font-medium text-ink">
              Correo (opcional)
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                placeholder="tu@correo.com"
              />
            </label>
            <label className="flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={consentimiento}
                onChange={(e) => setConsentimiento(e.target.checked)}
                className="mt-1 accent-brand-600"
                required
              />
              Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de
              2012.
            </label>
            <button
              type="submit"
              disabled={!respuestas[pregunta.id] || !consentimiento}
              className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-brand-900 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enviar respuestas
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
