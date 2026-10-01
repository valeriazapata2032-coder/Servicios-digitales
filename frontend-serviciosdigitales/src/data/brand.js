import brandSymbol from '../assets/figma/brand-symbol.svg'
import heroTeam from '../assets/figma/hero-team.png'
import service1 from '../assets/figma/service-1.png'
import service2 from '../assets/figma/service-2.png'
import service3 from '../assets/figma/service-3.png'
import case1 from '../assets/figma/case-1.png'
import case2 from '../assets/figma/case-2.png'
import case3 from '../assets/figma/case-3.png'
import catalog1 from '../assets/figma/catalog-1.png'
import catalog2 from '../assets/figma/catalog-2.png'
import catalog3 from '../assets/figma/catalog-3.png'
import catalog4 from '../assets/figma/catalog-4.png'

export const BRAND = {
  nameStart: 'Innova',
  nameEnd: 'Digital',
  slogan: 'Conectamos ideas, impulsamos resultados.',
  whatsapp: '573000000000',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  symbol: brandSymbol,
}

export const CATEGORIAS = [
  {
    id: 'redes',
    titulo: 'Redes sociales',
    descripcion: 'Estrategia, diseño y comunidad',
    icon: 'Share2',
  },
  {
    id: 'diseno',
    titulo: 'Diseño gráfico',
    descripcion: 'Identidades que se recuerdan',
    icon: 'Palette',
  },
  {
    id: 'video',
    titulo: 'Edición de video',
    descripcion: 'Historias listas para publicar',
    icon: 'Clapperboard',
  },
  {
    id: 'contenido',
    titulo: 'Creación de contenido',
    descripcion: 'Ideas que conectan y convierten',
    icon: 'PenTool',
  },
  {
    id: 'web',
    titulo: 'Páginas web',
    descripcion: 'Experiencias rápidas y claras',
    icon: 'Monitor',
  },
  {
    id: 'publicidad',
    titulo: 'Publicidad en línea',
    descripcion: 'Campañas con foco en resultados',
    icon: 'Megaphone',
  },
  {
    id: 'asesoria',
    titulo: 'Asesoría',
    descripcion: 'Decisiones digitales con respaldo',
    icon: 'MessagesSquare',
  },
]

export const SERVICIOS_DESTACADOS = [
  {
    id: 1,
    categoria: 'Redes sociales',
    titulo: 'Plan de redes que sí convierte',
    vendedor: 'Nómada Studio',
    rating: '4,9',
    reseñas: 84,
    precio: '$480.000 COP',
    imagen: service1,
  },
  {
    id: 2,
    categoria: 'Diseño gráfico',
    titulo: 'Identidad visual para tu marca',
    vendedor: 'Línea Clara',
    rating: '4,8',
    reseñas: 62,
    precio: '$690.000 COP',
    imagen: service2,
  },
  {
    id: 3,
    categoria: 'Páginas web',
    titulo: 'Landing page lista para vender',
    vendedor: 'Sur Digital',
    rating: '5,0',
    reseñas: 37,
    precio: '$1.250.000 COP',
    imagen: service3,
  },
]

export const CATALOGO = [
  {
    id: 1,
    categoria: 'Diseño',
    titulo: 'Identidad visual para marcas con propósito',
    vendedor: 'Línea Clara',
    rating: '4,8',
    precio: 'Desde $690.000 COP',
    imagen: catalog1,
  },
  {
    id: 2,
    categoria: 'Redes',
    titulo: 'Plan de contenido para 30 días',
    vendedor: 'Nómada Studio',
    rating: '4,9',
    precio: 'Desde $480.000 COP',
    imagen: catalog2,
  },
  {
    id: 3,
    categoria: 'Web',
    titulo: 'Landing page que convierte',
    vendedor: 'Sur Digital',
    rating: '5,0',
    precio: 'Desde $1.250.000 COP',
    imagen: catalog3,
  },
  {
    id: 4,
    categoria: 'Video',
    titulo: 'Video vertical para tu campaña',
    vendedor: 'Faro Films',
    rating: '4,9',
    precio: 'Desde $350.000 COP',
    imagen: catalog4,
  },
]

export const IMAGES = {
  heroTeam,
  case1,
  case2,
  case3,
}

export const PASOS = [
  {
    n: '01',
    titulo: 'Cuéntanos tu reto',
    texto: 'Responde un diagnóstico breve para dar contexto real.',
  },
  {
    n: '02',
    titulo: 'Elige tu servicio',
    texto: 'Compara alcance, tiempos, reseñas y precio final.',
  },
  {
    n: '03',
    titulo: 'Trabaja acompañado',
    texto: 'Conversa, revisa hitos y recibe tus entregables.',
  },
]

export const MISION =
  'Democratizar el acceso a servicios digitales confiables y medibles.'
export const VISION =
  'Ser el aliado digital preferido de los emprendimientos latinoamericanos.'
export const VALORES_TEXTO =
  'Claridad, empatía, calidad, colaboración y mejora continua.'
