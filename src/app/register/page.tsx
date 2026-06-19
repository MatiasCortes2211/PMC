'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Ocurrió un error')
      setLoading(false)
      return
    }

    router.push('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F2EC]">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[#2A3828] mb-1">
          Crear cuenta
        </h1>
        <p className="text-[#5A6854] text-sm mb-6">
          Registrate para acceder a los cursos
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#2A3828] mb-1">Nombre</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
            />
          </div>

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
              minLength={6}
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-[#5A6854] mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-[#7EA87F] hover:underline">
            Ingresá
          </Link>
        </p>
      </div>
    </main>
  )
}