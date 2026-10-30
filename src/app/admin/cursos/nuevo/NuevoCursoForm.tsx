'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

type Categoria = { id: string; name: string; color: string }

function parseBuenosAiresDatetime(inputStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(inputStr)) {
    return new Date(`${inputStr}:00-03:00`).toISOString()
  }
  return new Date(inputStr).toISOString()
}

export default function NuevoCursoForm({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isFree, setIsFree] = useState(false)

  const inputCls = "w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value

    const availableUntilVal = getValue('availableUntil')
    const accessDurationVal = getValue('accessDurationDays')

    const res = await fetch('/api/admin/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: getValue('title'),
        description: getValue('description'),
        price: isFree ? 0 : parseFloat(getValue('price') || '0'),
        imageUrl: imageUrl || null,
        category: getValue('category') || null,
        isFree,
        availableUntil: availableUntilVal ? parseBuenosAiresDatetime(availableUntilVal) : null,
        accessDurationDays: accessDurationVal ? parseInt(accessDurationVal, 10) : null,
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#D4CABC] p-8 space-y-5">
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Título</label>
        <input name="title" type="text" required className={inputCls} />
      </div>

      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">Descripción</label>
        <textarea name="description" required rows={4} className={`${inputCls} resize-none`} />
      </div>

      {/* Opción curso gratis */}
      <div className="bg-[#F5F2EC] p-4 rounded-xl border border-[#D4CABC] space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="w-4 h-4 text-[#7EA87F] rounded focus:ring-[#7EA87F]"
          />
          <span className="text-sm font-semibold text-[#2A3828]">
            Publicar este curso como gratuito (sin costo)
          </span>
        </label>
        <p className="text-xs text-[#5A6854] pl-6">
          Los alumnos podrán acceder inscribiéndose sin pagar.
        </p>
      </div>

      {!isFree && (
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Precio (ARS)</label>
          <input name="price" type="number" min="0" step="0.01" required={!isFree} className={inputCls} />
        </div>
      )}

      {/* Disponibilidad por tiempo limitado */}
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">
          Disponible por tiempo limitado hasta <span className="text-[#9A9488]">(hora de Argentina GMT-3)</span>
        </label>
        <input name="availableUntil" type="datetime-local" className={inputCls} />
        <p className="text-xs text-[#9A9488] mt-1">
          Si establecés una fecha y hora, el curso solo se podrá adquirir hasta ese momento.
        </p>
      </div>

      {/* Duración de acceso */}
      <div>
        <label className="block text-sm font-nunito text-[#2A3828] mb-1">
          Duración del abono / acceso en días <span className="text-[#9A9488]">(opcional)</span>
        </label>
        <input
          name="accessDurationDays"
          type="number"
          min="1"
          placeholder="Ej: 30, 90, 365 (en blanco = acceso ilimitado)"
          className={inputCls}
        />
        <p className="text-xs text-[#9A9488] mt-1">
          Plazo tras el cual el alumno deberá volver a comprar para renovar su acceso.
        </p>
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

      <ImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        label="Imagen de portada (opcional)"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-2.5 text-sm font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60">
        {loading ? 'Guardando...' : 'Crear curso'}
      </button>
    </form>
  )
}
