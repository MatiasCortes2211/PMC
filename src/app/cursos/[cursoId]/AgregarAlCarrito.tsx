'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AgregarAlCarrito({ cursoId }: { cursoId: string }) {
  const [loading, setLoading] = useState(false)
  const [enCarrito, setEnCarrito] = useState(false)

  useEffect(() => {
    fetch('/api/carrito')
      .then(res => res.json())
      .then(items => {
        if (Array.isArray(items)) {
          setEnCarrito(items.some((i: any) => i.courseId === cursoId))
        }
      })
  }, [cursoId])

  async function agregar() {
    setLoading(true)
    const res = await fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cursoId }),
    })
    if (res.ok) {
      setEnCarrito(true)
      window.dispatchEvent(new Event('carrito-updated'))
    }
    setLoading(false)
  }

  const url = '/api/pagos/crear?cursoId=' + cursoId

  return (
    <div className="space-y-3">
      {enCarrito ? (
        <div className="w-full bg-[#D4E4C8] text-[#2A3828] rounded-lg py-3 font-nunito font-bold text-center text-sm">
          ✓ Ya está en tu carrito
        </div>
      ) : (
        <button
          onClick={agregar}
          disabled={loading}
          className="w-full bg-[#7EA87F] text-white rounded-lg py-3 font-nunito font-bold hover:bg-[#5A6854] transition-colors disabled:opacity-60"
        >
          {loading ? 'Agregando...' : '🛒 Agregar al carrito'}
        </button>
      )}
      <Link
        href={url}
        className="block w-full text-center bg-[#2A3828] text-[#F5F2EC] rounded-lg py-3 font-nunito font-bold hover:bg-[#3a4f38] transition-colors"
      >
        Comprar ahora
      </Link>
    </div>
  )
}