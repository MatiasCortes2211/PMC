'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Categoria = {
  id: string
  name: string
  color: string
}

const COLORES = [
  { label: 'Verde claro', value: 'bg-[#D4E4C8] text-[#2A3828]' },
  { label: 'Sage', value: 'bg-[#A8C4A2] text-[#2A3828]' },
  { label: 'Lino', value: 'bg-[#EDE8DF] text-[#5A6854]' },
  { label: 'Brote', value: 'bg-[#D4E4C8] text-[#5A6854]' },
  { label: 'Topo', value: 'bg-[#D4CABC] text-[#2A3828]' },
]

const inputCls = "w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"

export default function CategoriasEditor({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter()
  const [lista, setLista] = useState<Categoria[]>(categorias)
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState(COLORES[0].value)
  const [loading, setLoading] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ name: string; color: string }>({ name: '', color: '' })

  async function agregar() {
    if (!nombre.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombre, color }),
    })
    const data = await res.json()
    if (res.ok) {
      setLista([...lista, data])
      setNombre('')
      setColor(COLORES[0].value)
    }
    setLoading(false)
  }

  async function guardarEdicion(id: string) {
    const res = await fetch(`/api/admin/categorias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    const data = await res.json()
    if (res.ok) {
      setLista(lista.map(c => c.id === id ? data : c))
      setEditando(null)
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return
    const res = await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    if (res.ok) setLista(lista.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Lista */}
      <div className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden">
        {lista.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-nunito text-[#9A9488] text-sm">No hay categorías todavía.</p>
          </div>
        ) : (
          lista.map((cat, i) => (
            <div
              key={cat.id}
              className={`px-6 py-4 ${i !== lista.length - 1 ? 'border-b border-[#D4CABC]' : ''}`}
            >
              {editando === cat.id ? (
                <div className="space-y-3">
                  <input
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    className={inputCls}
                  />
                  <select
                    value={editData.color}
                    onChange={e => setEditData({ ...editData, color: e.target.value })}
                    className={`${inputCls} bg-white`}
                  >
                    {COLORES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => guardarEdicion(cat.id)}
                      className="bg-[#2A3828] text-[#F5F2EC] px-4 py-2 rounded-lg text-sm font-nunito hover:bg-[#3a4f38] transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="bg-[#D4CABC] text-[#2A3828] px-4 py-2 rounded-lg text-sm font-nunito hover:bg-[#c4baac] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full ${cat.color}`}>
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditando(cat.id)
                        setEditData({ name: cat.name, color: cat.color })
                      }}
                      className="text-sm font-nunito text-[#5A6854] hover:text-[#2A3828]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(cat.id)}
                      className="text-sm font-nunito text-red-400 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Nueva categoría */}
      <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
        <h2 className="font-playfair text-lg font-bold text-[#2A3828]">Nueva categoría</h2>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Meditación"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Color</label>
          <select
            value={color}
            onChange={e => setColor(e.target.value)}
            className={`${inputCls} bg-white`}
          >
            {COLORES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <div className="mt-2">
            <span className={`text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full ${color}`}>
              {nombre || 'Vista previa'}
            </span>
          </div>
        </div>
        <button
          onClick={agregar}
          disabled={loading || !nombre.trim()}
          className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : '+ Agregar categoría'}
        </button>
      </div>
    </div>
  )
}