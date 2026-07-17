'use client'

import { useState, useEffect } from 'react'

type CartItem = {
  id: string
  courseId: string
  course: {
    id: string
    title: string
    price: number
    imageUrl: string | null
  }
}

const fmt = (p: number) => `$${p.toLocaleString('es-AR')}`

export default function Carrito() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [checkingOut, setCheckingOut] = useState(false)

  async function fetchCarrito() {
    const res = await fetch('/api/carrito')
    if (res.ok) {
      const data = await res.json()
      setItems(data)
    }
  }

  useEffect(() => {
    fetchCarrito()
    window.addEventListener('carrito-updated', fetchCarrito)
    return () => window.removeEventListener('carrito-updated', fetchCarrito)
  }, [])

  async function eliminar(cursoId: string) {
    await fetch('/api/carrito/' + cursoId, { method: 'DELETE' })
    setItems(items.filter(i => i.courseId !== cursoId))
    window.dispatchEvent(new Event('carrito-updated'))
  }

  async function checkout() {
    setCheckingOut(true)
    const res = await fetch('/api/carrito/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
    setCheckingOut(false)
  }

  const total = items.reduce((acc, i) => acc + i.course.price, 0)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-1.5 text-[#9A9488] hover:text-[#2A3828] transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#7EA87F] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 bg-white rounded-2xl border border-[#D4CABC] shadow-xl w-80">
            <div className="p-4 border-b border-[#D4CABC]">
              <h3 className="font-playfair font-bold text-[#2A3828]">Mi carrito</h3>
            </div>

            {items.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-nunito text-[#9A9488] text-sm">El carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-4 border-b border-[#D4CABC] last:border-0">
                      {item.course.imageUrl && (
                        <img
                          src={item.course.imageUrl}
                          alt={item.course.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-nunito font-semibold text-[#2A3828] text-sm truncate">
                          {item.course.title}
                        </p>
                        <p className="font-nunito text-[#7EA87F] text-sm font-bold">
                          {fmt(item.course.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => eliminar(item.courseId)}
                        className="text-[#9A9488] hover:text-red-400 transition-colors text-xs flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-[#D4CABC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-nunito text-sm text-[#5A6854]">Total</span>
                    <span className="font-playfair font-bold text-[#2A3828]">{fmt(total)}</span>
                  </div>
                  <button
                    onClick={checkout}
                    disabled={checkingOut}
                    className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
                  >
                    {checkingOut ? 'Procesando...' : 'Pagar ahora'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}