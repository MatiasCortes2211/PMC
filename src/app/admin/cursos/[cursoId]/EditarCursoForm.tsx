'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Curso = {
  id: string
  title: string
  description: string
  price: number
  category: string | null
  imageUrl: string | null
  lessons?: any[]
  published?: boolean
  createdAt?: Date
  updatedAt?: Date
}

type Categoria = { id: string; name: string; color: string }

export default function EditarCursoForm({ curso, categorias }: { curso: Curso; categorias: Categoria[] }) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    title: curso.title,
    description: curso.description,
    price: curso.price,
    category: curso.category ?? '',
    imageUrl: curso.imageUrl ?? '',
  })

  async function guardar() {
    setLoading(true)
    const res = await fetch(`/api/admin/cursos/${curso.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        price: parseFloat(String(data.price)),
        category: data.category || null,
        imageUrl: data.imageUrl || null,
      }),
    })
    if (res.ok) {
      setEditando(false)
      router.refresh()
    }
    setLoading(false)
  }

  if (!editando) {
    return (
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#2A3828] mb-1">
            {curso.title}
          </h1>
          <p className="text-[#5A6854] text-sm">{curso.description}</p>
        </div>
        <button
          onClick={() => setEditando(true)}
          className="text-sm text-[#7EA87F] hover:underline shrink-0"
        >
          Editar
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
      <h2 className="text-[#2A3828] font-medium">Editar curso</h2>

      <div>
        <label className="block text-sm text-[#2A3828] mb-1">Título</label>
        <input
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
        />
      </div>

      <div>
        <label className="block text-sm text-[#2A3828] mb-1">Descripción</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={3}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#2A3828] mb-1">Precio (ARS)</label>
        <input
          type="number"
          value={data.price}
          onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) })}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
        />
      </div>

      <div>
        <label className="block text-sm text-[#2A3828] mb-1">Categoría</label>
        <select
          value={data.category ?? ''}
          onChange={(e) => setData({ ...data, category: e.target.value })}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F] bg-white"
        >
          <option value="">Sin categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-[#2A3828] mb-1">
          URL de imagen <span className="text-[#9A9488]">(opcional)</span>
        </label>
        <input
          value={data.imageUrl}
          onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={guardar}
          disabled={loading}
          className="bg-[#2A3828] text-[#F5F2EC] px-4 py-2 rounded-lg text-sm hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="bg-[#D4CABC] text-[#2A3828] px-4 py-2 rounded-lg text-sm hover:bg-[#c4baac] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}