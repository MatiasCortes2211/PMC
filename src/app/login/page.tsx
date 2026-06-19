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
    <main className="min-h-screen flex items-center justify-center bg-[#F5F2EC]">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[#2A3828] mb-1">
          Bienvenida
        </h1>
        <p className="text-[#5A6854] text-sm mb-6">
          Ingresá a tu cuenta para acceder a los cursos
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#2A3828] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#2A3828] mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-medium hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm text-[#5A6854] mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/register" className="text-[#7EA87F] hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  )
}
