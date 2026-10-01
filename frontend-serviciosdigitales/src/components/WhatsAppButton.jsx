import { MessageCircle } from 'lucide-react'
import { BRAND } from '../data/brand'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
        'Hola InnovaDigital, quiero información sobre sus servicios.'
      )}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:h-14 sm:w-14"
    >
      <MessageCircle size={26} strokeWidth={2.2} />
    </a>
  )
}
