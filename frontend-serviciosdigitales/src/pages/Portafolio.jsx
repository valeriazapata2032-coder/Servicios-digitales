import { Link } from 'react-router-dom'
import { IMAGES } from '../data/brand'

const CASOS = [
  { img: IMAGES.case1, titulo: 'Identidad y empaque', categoria: 'Diseño gráfico' },
  { img: IMAGES.case2, titulo: 'App de pedidos', categoria: 'Producto digital' },
  { img: IMAGES.case3, titulo: 'Landing comercial', categoria: 'Páginas web' },
]

export default function Portafolio() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14 lg:px-[72px]">
      <p className="text-xs font-bold uppercase text-green">Trabajos realizados</p>
      <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Portafolio</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        Proyectos reales con impacto visible para marcas y emprendimientos.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASOS.map((c) => (
          <article key={c.titulo} className="overflow-hidden rounded-[18px] border border-border bg-white shadow-card">
            <img src={c.img} alt={c.titulo} className="h-56 w-full object-cover sm:h-64" />
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue">{c.categoria}</p>
              <h2 className="mt-2 text-xl font-bold text-ink">{c.titulo}</h2>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link to="/servicios" className="text-sm font-semibold text-blue hover:underline">
          Explorar servicios →
        </Link>
      </div>
    </div>
  )
}
