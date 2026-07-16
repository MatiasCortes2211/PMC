'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LogoPrincipal from '@/img/LogoPrincipal.jpg'

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

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F5F2EC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src={LogoPrincipal} alt="Logo" className="w-28 h-28 rounded-full bg-[#7EA87F] flex items-center justify-center mx-auto mb-4" />
          <h1 className="font-playfair text-3xl font-bold text-[#2A3828]">Pequeños Momentos de Calma</h1>
          <h1 className="font-playfair text-3xl text-[#2A3828]">Bienvenido</h1>
          <p className="font-nunito text-[#9A9488] mt-1 text-sm">Ingresá para acceder a tus cursos</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[rgba(42,56,40,0.1)] shadow-sm space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 border border-[#D4CABC] rounded-xl py-2.5 font-nunito text-sm font-semibold text-[#2A3828] hover:bg-[#F5F2EC] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D4CABC]" />
            <span className="font-nunito text-xs text-[#9A9488]">o</span>
            <div className="flex-1 h-px bg-[#D4CABC]" />
          </div>

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
              className="w-full py-3.5 bg-[#2A3828] text-[#F5F2EC] font-nunito font-bold rounded-xl hover:bg-[#5A6854] transition-colors text-base disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-xs font-nunito text-[#9A9488]">
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