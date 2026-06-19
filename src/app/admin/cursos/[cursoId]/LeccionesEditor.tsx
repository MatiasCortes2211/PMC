'use client'

import { useState } from 'react'

type Leccion = {
  id: string
  title: string
  description: string | null
  videoUrl: string | null
  order: number
}

export default function LeccionesEditor({
  cursoId,
  lecciones,
}: {
  cursoId: string
  lecciones: Leccion[]
}) {
  const [lista, setLista] = useState<Leccion[]>(lecciones)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Leccion>>({})

  async function agregarLeccion() {
    if (!titulo.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin/cursos/${cursoId}/lecciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titulo,
        description: descripcion || null,
        videoUrl: videoUrl || null,
        order: lista.length + 1,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al guardar')
      setLoading(false)
      return
    }

    setLista([...lista, data])
    setTitulo('')
    setDescripcion('')
    setVideoUrl('')
    setLoading(false)
  }

  async function guardarEdicion(id: string) {
    const res = await fetch(
      `/api/admin/cursos/${cursoId}/lecciones/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      }
    )
    const data = await res.json()
    if (res.ok) {
      setLista(lista.map((l) => (l.id === id ? data : l)))
      setEditando(null)
      setEditData({})
    }
  }

  async function eliminarLeccion(id: string) {
    const res = await fetch(
      `/api/admin/cursos/${cursoId}/lecciones/${id}`,
      { method: 'DELETE' }
    )
    if (res.ok) setLista(lista.filter((l) => l.id !== id))
  }

  return (
    <div className="space-y-4">
      {lista.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 text-center">
          <p className="text-[#5A6854] text-sm">No hay clases todavía.</p>
        </div>
      )}

      {lista.map((leccion) => (
        <div
          key={leccion.id}
          className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden"
        >
          {editando === leccion.id ? (
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-sm text-[#2A3828] mb-1">Título</label>
                <input
                  value={editData.title ?? leccion.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2A3828] mb-1">Descripción</label>
                <textarea
                  value={editData.description ?? leccion.description ?? ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2A3828] mb-1">URL de YouTube</label>
                <input
                  value={editData.videoUrl ?? leccion.videoUrl ?? ''}
                  onChange={(e) => setEditData({ ...editData, videoUrl: e.target.value })}
                  className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => guardarEdicion(leccion.id)}
                  className="bg-[#2A3828] text-[#F5F2EC] px-4 py-2 rounded-lg text-sm hover:bg-[#3a4f38] transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => { setEditando(null); setEditData({}) }}
                  className="bg-[#D4CABC] text-[#2A3828] px-4 py-2 rounded-lg text-sm hover:bg-[#c4baac] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[#2A3828] font-medium">
                  {leccion.order}. {leccion.title}
                </p>
                {leccion.description && (
                  <p className="text-sm text-[#5A6854] mt-0.5">{leccion.description}</p>
                )}
                {leccion.videoUrl && (
                  <p className="text-xs text-[#9A9488] mt-0.5 truncate max-w-sm">
                    {leccion.videoUrl}
                  </p>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => { setEditando(leccion.id); setEditData({}) }}
                  className="text-sm text-[#5A6854] hover:text-[#2A3828]"
                >
                  Editar
                </button>
                <button