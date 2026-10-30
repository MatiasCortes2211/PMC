'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type Props = {
  cursoId: string
  isFree?: boolean
  estaExpirado?: boolean
  disponibilidadCerrada?: boolean
}

export default function AgregarAlCarrito({
  cursoId,
  isFree,
  estaExpirado,
  disponibilidadCerrada,
}: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enCarrito, setEnCarrito] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session || isFree) return
    fetch('/api/carrito')
      .then((res) => res.json())
      .then((items) => {
        if (Array.isArray(items)) {
          setEnCarrito(items.some((i: any) => i.courseId === cursoId))
        }
      })
  }, [cursoId, session, isFree])

  async function inscribirseGratis() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/cursos/${cursoId}/inscribirse-gratis`, {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok) {
        router.refresh()
      } else {
        setError(data.error || 'Error al inscribirse')
      }
    } catch {
      setError('Error al procesar la inscripción')
    } finally {
      setLoading(false)
    }
  }

  async function agregar() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cursoId }),
    })
    const data = await res.json()
    if (res.ok) {
      setEnCarrito(true)
      window.dispatchEvent(new Event('carrito-updated'))
    } else {
      setError(data.error || 'Error al agregar al carrito')
    }
    setLoading(false)
  }

  const url = '/api/pagos/crear?cursoId=' + cursoId

  if (disponibilidadCerrada) {
    return (
      <div className="bg-[#F5F2EC] border border-[#D4CABC] p-4 rounded-xl text-center">
        <p className="font-nunito font-semibold text-[#5A6854] text-sm">
          ⏳ Las inscripciones para este curso han finalizado.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="space-y-3">
        <Link
          href={`/login?callbackUrl=/cursos/${cursoId}`}
          className="block w-full bg-[#7EA87F] text-white rounded-lg py-3 font-nunito font-bold hover:bg-[#5A6854] transition-colors text-center"
        >
          {isFree ? 'Iniciar sesión para acceder gratis' : 'Iniciar sesión para comprar'}
        </Link>
        <Link
          href={`/register?callbackUrl=/cursos/${cursoId}`}
          className="block w-full text-center border border-[#D4CABC] text-[#2A3828] rounded-lg py-3 font-nunito font-semibold hover:bg-[#EDE8DF] transition-colors text-sm"
        >
          Crear cuenta gratis
        </Link>
      </div>
    )
  }

  if (isFree) {
    return (
      <div className="space-y-3">
        <button
          onClick={inscribirseGratis}
          disabled={loading}
          className="w-full bg-[#7EA87F] text-white rounded-lg py-3.5 font-nunito font-bold hover:bg-[#5A6854] transition-colors disabled:opacity-60 text-base shadow-sm"
        >
          {loading ? 'Inscribiendo...' : '✨ Inscribirme gratis ahora'}
        </button>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

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
        {estaExpirado ? 'Renovar abono ahora' : 'Comprar ahora'}
      </Link>
    </div>
  )
}
