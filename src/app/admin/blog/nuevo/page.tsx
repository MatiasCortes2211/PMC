'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevoPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value

    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: getValue('title'),
        excerpt: getValue('excerpt'),
        content: getValue('content'),
        author: getValue('author'),
        category: getValue('category') || null,
        imageUrl: getValue('imageUrl') || null,
        readTime: getValue('readTime') || '5 min',
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Ocurrió un error')
      setLoading(false)
      return
    }

    router.push(`/admin/blog/${data.id}`)
  }

  const inputCls = "w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="font-playfair font-semibold text-[#2A3828]">pequeños momentos de calma · Admin</span>
        <Link href="/admin" className="text-sm font-nunito text-[#7EA87F] hover:underline">← Volver</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-8">Nuevo artículo</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D4CABC] p-8 space-y-5">
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Título</label>
            <input name="title" type="text" required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Descripción corta <span className="text-[#9A9488]">(se ve en la card)</span></label>
            <textarea name="excerpt" required rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Contenido completo</label>
            <textarea name="content" required rows={8} className={`${inputCls} resize-none`} placeholder="Separá los párrafos con una línea en blanco." />
          </div>
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Autor</label>
            <input name="author" type="text" defaultValue="Eugenia" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Categoría</label>
            <select name="category" className={`${inputCls} bg-white`}>
              <option value="">Sin categoría</option>
              <option value="Aromaterapia">Aromaterapia</option>
              <option value="Respiración">Respiración</option>
              <option value="Crianza">Crianza</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">Tiempo de lectura</label>
            <input name="readTime" type="text" defaultValue="5 min" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-nunito text-[#2A3828] mb-1">URL imagen de portada <span className="text-[#9A9488]">(opcional)</span></label>
            <input name="imageUrl" type="url" className={inputCls} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60">
            {loading ? 'Guardando...' : 'Crear artículo'}
          </button>
        </form>
      </div>
    </main>
  )
}