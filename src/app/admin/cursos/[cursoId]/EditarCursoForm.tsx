'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

type Curso = {
  id: string
  title: string
  description: string
  price: number
  category: string | null
  imageUrl: string | null
  isFree?: boolean
  availableUntil?: Date | string | null
  accessDurationDays?: number | null
  lessons?: any[]
  published?: boolean
  createdAt?: Date
  updatedAt?: Date
}

type Categoria = { id: string; name: string; color: string }

function toBuenosAiresDatetimeInput(dateStr?: Date | string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(d)
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '00'
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}`
}

function parseBuenosAiresDatetime(inputStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(inputStr)) {
    return new Date(`${inputStr}:00-03:00`).toISOString()
  }
  return new Date(inputStr).toISOString()
}

export default function EditarCursoForm({
  curso,
  categorias,
}: {
  curso: Curso
  categorias: Categoria[]
}) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    title: curso.title,
    description: curso.description,
    price: curso.price,
    category: curso.category ?? '',
    imageUrl: curso.imageUrl ?? '',
    isFree: Boolean(curso.isFree),
    availableUntil: toBuenosAiresDatetimeInput(curso.availableUntil),
    accessDurationDays: curso.accessDurationDays ?? '',
  })

  async function guardar() {
    setLoading(true)
    const res = await fetch(`/api/admin/cursos/${curso.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        price: data.isFree ? 0 : parseFloat(String(data.price) || '0'),
        category: data.category || null,
        imageUrl: data.imageUrl || null,
        isFree: data.isFree,
        availableUntil: data.availableUntil ? parseBuenosAiresDatetime(data.availableUntil) : null,
        accessDurationDays: data.accessDurationDays ? parseInt(String(data.accessDurationDays), 10) : null,
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
      <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-semibold text-[#2A3828]">
                {curso.title}
              </h1>
              {curso.isFree && (
                <span className="bg-[#D4E4C8] text-[#2A3828] text-xs font-nunito font-bold px-2 py-0.5 rounded-full">
                  Gratuito
                </span>
              )}
            </div>
            <p className="text-[#5A6854] text-sm whitespace-pre-line">{curso.description}</p>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="text-sm font-semibold text-[#7EA87F] hover:underline shrink-0"
          >
            Editar curso
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#D4CABC] text-xs font-nunito text-[#5A6854]">
          <div>
            <span className="block text-[#9A9488]">Precio actual:</span>
            <span className="font-bold text-[#2A3828] text-sm">
              {curso.isFree ? 'Gratis' : `$${curso.price.toLocaleString('es-AR')}`}
            </span>
          </div>
          <div>
            <span className="block text-[#9A9488]">Disponibilidad (Arg):</span>
            <span className="font-medium text-[#2A3828]">
              {curso.availableUntil
                ? `Hasta el ${new Date(curso.availableUntil).toLocaleDateString('es-AR', {
                    timeZone: 'America/Argentina/Buenos_Aires',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })} hs`
                : 'Permanente'}
            </span>
          </div>
          <div>
            <span className="block text-[#9A9488]">Duración de abono:</span>
            <span className="font-medium text-[#2A3828]">
              {curso.accessDurationDays
                ? `${curso.accessDurationDays} días tras la compra`
                : 'Acceso para siempre'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-5">
      <h2 className="text-[#2A3828] font-medium text-lg">Editar curso</h2>

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

      {/* Opción de curso gratis */}
      <div className="bg-[#F5F2EC] p-4 rounded-xl border border-[#D4CABC] space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isFree}
            onChange={(e) => setData({ ...data, isFree: e.target.checked })}
            className="w-4 h-4 text-[#7EA87F] rounded focus:ring-[#7EA87F]"
          />
          <span className="text-sm font-semibold text-[#2A3828]">
            Publicar este curso como gratuito (sin costo)
          </span>
        </label>
        <p className="text-xs text-[#5A6854] pl-6">
          Los alumnos podrán inscribirse sin necesidad de abonar mediante MercadoPago.
        </p>
      </div>

      {!data.isFree && (
        <div>
          <label className="block text-sm text-[#2A3828] mb-1">Precio (ARS)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.price}
            onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) || 0 })}
            className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
          />
        </div>
      )}

      {/* Disponibilidad por tiempo limitado */}
      <div>
        <label className="block text-sm text-[#2A3828] mb-1">
          Disponible por tiempo limitado hasta <span className="text-[#9A9488]">(hora de Argentina GMT-3)</span>
        </label>
        <input
          type="datetime-local"
          value={data.availableUntil}
          onChange={(e) => setData({ ...data, availableUntil: e.target.value })}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
        />
        <p className="text-xs text-[#9A9488] mt-1">
          El curso solo podrá ser adquirido hasta esa fecha y hora (hora de Buenos Aires). Pasado ese momento, se cerrará la inscripción.
        </p>
      </div>

      {/* Duración del abono/acceso */}
      <div>
        <label className="block text-sm text-[#2A3828] mb-1">
          Duración del abono / acceso en días <span className="text-[#9A9488]">(opcional)</span>
        </label>
        <input
          type="number"
          min="1"
          placeholder="Ej: 30, 90, 365 (vacío = acceso permanente)"
          value={data.accessDurationDays}
          onChange={(e) =>
            setData({
              ...data,
              accessDurationDays: e.target.value ? parseInt(e.target.value, 10) : '',
            })
          }
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
        />
        <p className="text-xs text-[#9A9488] mt-1">
          Si establecés una duración (ej. 30 días), el acceso del alumno expirará cumplido ese plazo y deberá volver a adquirirlo. Si lo dejás en blanco, tendrá acceso ilimitado.
        </p>
      </div>

      <div className="bg-[#EDE8DF] p-3 rounded-lg text-xs text-[#5A6854]">
        ℹ️ <strong>Protección de compras existentes:</strong> Modificar el precio o las condiciones de este curso no afectará a los alumnos que ya lo hayan adquirido previamente; mantendrán su acceso según su compra.
      </div>

      <div>
        <label className="block text-sm text-[#2A3828] mb-1">Categoría</label>
        <select
          value={data.category ?? ''}
          onChange={(e) => setData({ ...data, category: e.target.value })}
          className="w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F] bg-white"
        >
          <option value="">Sin categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUploader
        value={data.imageUrl}
        onChange={(url) => setData({ ...data, imageUrl: url })}
        label="Imagen de portada"
      />

      <div className="flex gap-2 pt-1">
        <button
          onClick={guardar}
          disabled={loading}
          className="bg-[#2A3828] text-[#F5F2EC] px-4 py-2 rounded-lg text-sm hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
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
