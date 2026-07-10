'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string | null
  imageUrl: string | null
  readTime: string
  published: boolean
  [key: string]: any
}

export default function EditarPostForm({ post }: { post: Post }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [data, setData] = useState({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: post.category ?? '',
    imageUrl: post.imageUrl ?? '',
    readTime: post.readTime,
    published: post.published,
  })

  const inputCls = "w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"

  async function guardar() {
    setLoading(true)
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        category: data.category || null,
        imageUrl: data.imageUrl || null,
      }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    }
    setLoading(false)
  }

  async function eliminar() {
    if (!confirm('¿Eliminar este artículo?')) return
    await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D4CABC] p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-2xl font-bold text-[#2A3828]">Editar artículo</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-nunito text-[#5A6854] cursor-pointer">
            <input type="checkbox" checked={data.published}
              onChange={e => setData({ ...data, published: e.target.checked })}
              className="accent-[#7EA87F]" />
            Publicado
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Título</label>
        <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Descripción corta</label>
        <textarea value={data.excerpt} onChange={e => setData({ ...data, excerpt: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Contenido</label>
        <textarea value={data.content} onChange={e => setData({ ...data, content: e.target.value })} rows={10} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Autor</label>
        <input value={data.author} onChange={e => setData({ ...data, author: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Categoría</label>
        <select value={data.category} onChange={e => setData({ ...data, category: e.target.value })} className={`${inputCls} bg-white`}>
          <option value="">Sin categoría</option>
          <option value="Aromaterapia">Aromaterapia</option>
          <option value="Respiración">Respiración</option>
          <option value="Crianza">Crianza</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Tiempo de lectura</label>
        <input value={data.readTime} onChange={e => setData({ ...data, readTime: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">URL imagen <span className="text-[#9A9488]">(opcional)</span></label>
        <input value={data.imageUrl} onChange={e => setData({ ...data, imageUrl: e.target.value })} className={inputCls} />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={guardar} disabled={loading}
          className="flex-1 bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60">
          {saved ? '¡Guardado!' : loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button onClick={eliminar}
          className="px-4 py-2.5 border border-red-200 text-red-400 rounded-lg text-sm font-nunito hover:bg-red-50 transition-colors">
          Eliminar
        </button>
      </div>
    </div>
  )
}