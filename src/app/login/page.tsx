'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/cursos')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F5F2EC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#7EA87F] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-[#2A3828]">Bienvenido</h1>
          <p className="font-nunito text-[#9A9488] mt-1 text-sm">Ingresá para acceder a tus cursos</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[rgba(42,56,40,0.1)] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="tu@correo.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors"
              />
            </div>
            <div>
              <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 font-nunito text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#7EA87F] text-[#F5F2EC] font-nunito font-bold rounded-xl hover:bg-[#5A6854] transition-colors text-base disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center mt-4 text-xs font-nunito text-[#9A9488]">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-[#7EA87F] font-bold hover:underline">
              Registrate gratis
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="block text-center mt-5 text-sm font-nunito text-[#9A9488] hover:text-[#2A3828] transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}