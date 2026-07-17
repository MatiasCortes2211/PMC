'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LogoPrincipal from '@/img/LogoPrincipal.jpg'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F5F2EC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src={LogoPrincipal} alt="Logo" className="w-28 h-28 rounded-full mx-auto mb-4" />
          <h1 className="font-playfair text-3xl font-bold text-[#2A3828]">Pequeños Momentos de Calma</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[rgba(42,56,40,0.1)] shadow-sm space-y-4">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#D4E4C8] flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="font-playfair text-xl font-bold text-[#2A3828]">¡Email enviado!</h2>
              <p className="font-nunito text-[#9A9488] text-sm leading-relaxed">
                Si existe una cuenta con ese email, vas a recibir un link para restablecer tu contraseña. Revisá tu bandeja de entrada.
              </p>
              <Link href="/login" className="block text-center text-sm font-nunito text-[#7EA87F] font-bold hover:underline mt-4">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-semibold text-[#2A3828] mb-1">Recuperar contraseña</h2>
                <p className="text-[#5A6854] text-sm">Ingresá tu email y te enviamos un link para restablecer tu contraseña.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#2A3828] text-[#F5F2EC] font-nunito font-bold rounded-xl hover:bg-[#5A6854] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                </button>
              </form>
            </>
          )}
        </div>

        <Link href="/login" className="block text-center mt-5 text-sm font-nunito text-[#9A9488] hover:text-[#2A3828] transition-colors">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}