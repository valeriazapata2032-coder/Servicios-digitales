import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'innova_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  function addItem(item) {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.id_servicio === item.id_servicio && p.id_paquete === item.id_paquete
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + (item.cantidad || 1) }
        return next
      }
      return [...prev, { ...item, cantidad: item.cantidad || 1 }]
    })
  }

  function removeItem(id_servicio, id_paquete) {
    setItems((prev) =>
      prev.filter((p) => !(p.id_servicio === id_servicio && p.id_paquete === id_paquete))
    )
  }

  function updateQty(id_servicio, id_paquete, cantidad) {
    setItems((prev) =>
      prev.map((p) =>
        p.id_servicio === id_servicio && p.id_paquete === id_paquete
          ? { ...p, cantidad: Math.max(1, cantidad) }
          : p
      )
    )
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.precio) * Number(i.cantidad), 0),
    [items]
  )

  const count = useMemo(() => items.reduce((sum, i) => sum + i.cantidad, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
