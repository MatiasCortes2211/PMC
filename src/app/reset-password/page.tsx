'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LogoPrincipal from '@/img/LogoPrincipal.jpg'

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/reset-password/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Ocurrió un error')
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  if (!token) {
    return (
      <div className="text-center py-4">
        <p className="font-nunito text-red-500 text-sm">Link inválido.</p>
        <Link href="/forgot-password" className="text-[#7EA87F] font-nunito text-sm font-bold hover:underline mt-2 block">
          Solicitá uno nuevo
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#D4E4C8] flex items-center justify-center mx-auto">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="font-playfair text-xl font-bold text-[#2A3828]">¡Contraseña actualizada!</h2>
        <p className="font-nunito text-[#9A9488] text-sm">Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-[#2A3828] mb-1">Nueva contraseña</h2>
        <p className="text-[#5A6854] text-sm">Ingresá tu nueva contraseña.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9488] hover:text-[#2A3828]"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
            Confirmar contraseña
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors"
          />
        </div>

        {error && <p className="text-red-500 font-nunito text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#2A3828] text-[#F5F2EC] font-nunito font-bold rounded-xl hover:bg-[#5A6854] transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F5F2EC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src={LogoPrincipal} alt="Logo" className="w-28 h-28 rounded-full mx-auto mb-4" />
          <h1 className="font-playfair text-3xl font-bold text-[#2A3828]">Pequeños Momentos de Calma</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[rgba(42,56,40,0.1)] shadow-sm space-y-4">
          <Suspense fallback={null}>
            <ResetForm />
          </Suspense>
        </div>

        <Link href="/login" className="block text-center mt-5 text-sm font-nunito text-[#9A9488] hover:text-[#2A3828] transition-colors">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}