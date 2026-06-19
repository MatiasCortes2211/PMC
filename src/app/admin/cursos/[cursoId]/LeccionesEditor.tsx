'use client'

import { useState } from 'react'

type Leccion = {
  id: string
  title: string
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
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function agregarLeccion() {
    if (!titulo.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin/cursos/${cursoId}/lecciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: titulo,
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
    setVideoUrl('')
    setLoading(false)
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
          className="bg-white rounded-2xl border border-[#D4CABC] px-6 py-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[#2A3828] font-medium">
              {leccion.order}. {leccion.title}
            </p>
            {leccion.videoUrl && (
              <p className="text-xs text-[#9A9488] mt-0.5 truncate max-w-sm">
                {leccion.videoUrl}
              </p>
            )}
          </div>
          <button
            onClick={() => eliminarLeccion(leccion.id)}
            className="text-sm text-red-400 hover:text-red-600"
          >
            Eliminar
          </button>
        </div>
      ))}

      <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
        <h3 className="text-[#2A3828] font-medium">Nueva clase</h3>

        <div>
          <label className="block text-sm text-[#2A3828] mb-1">Título</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            type="text"
            className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#2A3828] mb-1">
            URL del video de YouTube{' '}
            <span className="text-[#9A9488]">(opcional)</span>
          </label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={agregarLeccion}
          disabled={loading || !titulo.trim()}
          className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-medium hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : '+ Agregar clase'}
        </button>
      </div>
    </div>
  )
}