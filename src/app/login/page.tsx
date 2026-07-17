'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LogoPrincipal from '@/img/LogoPrincipal.jpg'

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked: 'Ya existe una cuenta con ese email. Ingresá con tu contraseña.',
  CredentialsSignin: 'Email o contraseña incorrectos.',
}

function ErrorMessage() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  if (!errorParam || !errorMessages[errorParam]) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <p className="text-red-500 font-nunito text-sm">{errorMessages[errorParam]}</p>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    // Verificar si el email existe y tiene contraseña
    const check = await fetch('/api/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const checkData = await check.json()

    if (checkData.exists && !checkData.hasPassword) {
      setError('Esta cuenta usa Google para iniciar sesión. Usá el botón "Continuar con Google".')
      setLoading(false)
      return
    }

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
          <div>
            <h2 className="text-2xl font-semibold text-[#2A3828] mb-1">Iniciar sesión</h2>
            <p className="text-[#5A6854] text-sm">Ingresá para acceder a tus cursos</p>
          </div>

          <Suspense fallback={null}>
            <ErrorMessage />
          </Suspense>

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
            <span className="font-nunito text-xs text-[#9A9488]">o iniciá sesión con email</span>
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
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9488] hover:text-[#2A3828] transition-colors"
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
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs font-nunito text-[#7EA87F] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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