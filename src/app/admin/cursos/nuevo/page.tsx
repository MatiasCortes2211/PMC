'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevoCursoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value
    const price = (form.elements.namedItem('price') as HTMLInputElement).value
    const imageUrl = (form.elements.namedItem('imageUrl') as HTMLInputElement).value
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value

    const res = await fetch('/api/admin/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Ocurrió un error')
      setLoading(false)
      return
    }

    router.push(`/admin/cursos/${data.id}`)
  }

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="font-playfair font-semibold text-[#2A3828]">
          pequeños momentos de calma · Admin
        </span>
        <Link href="/admin" className="text-sm font-nunito text-[#7EA87F] hover:underline">
          ← Volver
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-8">Nuevo curso</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D4CABC] p-8 space-y-5">
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Título</label>
            <input
              name="title"
              type="text"
              required
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
            />
          </div>

          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Descripción</label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Precio (ARS)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
            />
          </div>

          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Categoría</label>
            <select
              name="category"
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F] bg-white"
            >
              <option value="">Sin categoría</option>
              <option value="Aromaterapia">Aromaterapia</option>
              <option value="Respiración">Respiración</option>
              <option value="Crianza">Crianza</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">
              URL de imagen de portada <span className="text-[#9A9488]">(opcional)</span>
            </label>
            <input
              name="imageUrl"
              type="url"
              className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Crear curso'}
          </button>
        </form>
      </div>
    </main>
  )
}