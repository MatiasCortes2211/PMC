'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

type Categoria = { id: string; name: string; color: string }

export default function NuevoPostForm({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const inputCls = "w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"

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
        imageUrl: imageUrl || null,
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D4CABC] p-8 space-y-5">
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Título</label>
        <input name="title" type="text" required className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">
          Descripción corta <span className="text-[#9A9488]">(se ve en la card)</span>
        </label>
        <textarea name="excerpt" required rows={2} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Contenido completo</label>
        <textarea name="content" required rows={8} className={`${inputCls} resize-none`}
          placeholder="Separá los párrafos con una línea en blanco." />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Autor</label>
        <input name="author" type="text" defaultValue="Eugenia" className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Categoría</label>
        <select name="category" className={`${inputCls} bg-white`}>
          <option value="">Sin categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Tiempo de lectura</label>
        <input name="readTime" type="text" defaultValue="5 min" className={inputCls} />
      </div>

      <ImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        label="Imagen de portada (opcional)"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60">
        {loading ? 'Guardando...' : 'Crear artículo'}
      </button>
    </form>
  )
}