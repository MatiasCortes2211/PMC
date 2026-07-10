'use client'

import { useState } from 'react'

type Props = { content: Record<string, string> }

const inputCls = "w-full border border-[#D4CABC] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
const textareaCls = `${inputCls} resize-none`

export default function ContenidoEditor({ content }: Props) {
  const [data, setData] = useState(content)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (key: string, value: string) => setData(d => ({ ...d, [key]: value }))

  async function guardar() {
    setLoading(true)
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
        <h2 className="font-playfair text-xl font-bold text-[#2A3828]">Hero principal</h2>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Subtítulo</label>
          <textarea rows={2} value={data.hero_subtitulo} onChange={e => set('hero_subtitulo', e.target.value)} className={textareaCls} />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">URL imagen de fondo</label>
          <input value={data.hero_imagen} onChange={e => set('hero_imagen', e.target.value)} className={inputCls} />
        </div>
      </section>

      {/* Sobre mí */}
      <section className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
        <h2 className="font-playfair text-xl font-bold text-[#2A3828]">Sobre mí</h2>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Nombre</label>
          <input value={data.sobre_nombre} onChange={e => set('sobre_nombre', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Primer párrafo</label>
          <textarea rows={3} value={data.sobre_bio1} onChange={e => set('sobre_bio1', e.target.value)} className={textareaCls} />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Segundo párrafo</label>
          <textarea rows={3} value={data.sobre_bio2} onChange={e => set('sobre_bio2', e.target.value)} className={textareaCls} />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">URL foto de perfil</label>
          <input value={data.sobre_foto} onChange={e => set('sobre_foto', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Familias acompañadas</label>
          <input value={data.sobre_familias} onChange={e => set('sobre_familias', e.target.value)} className={inputCls} />
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-6">
        <h2 className="font-playfair text-xl font-bold text-[#2A3828]">Testimonios</h2>
        {[1, 2, 3].map(n => (
          <div key={n} className="space-y-3 pb-6 border-b border-[#D4CABC] last:border-0 last:pb-0">
            <p className="text-sm font-nunito font-semibold text-[#5A6854]">Testimonio {n}</p>
            <div>
              <label className="block text-sm font-nunito text-[#2A3828] mb-1">Nombre</label>
              <input value={data[`testimonio${n}_nombre`]} onChange={e => set(`testimonio${n}_nombre`, e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-nunito text-[#2A3828] mb-1">Texto</label>
              <textarea rows={2} value={data[`testimonio${n}_texto`]} onChange={e => set(`testimonio${n}_texto`, e.target.value)} className={textareaCls} />
            </div>
            <div>
              <label className="block text-sm font-nunito text-[#2A3828] mb-1">Curso</label>
              <input value={data[`testimonio${n}_curso`]} onChange={e => set(`testimonio${n}_curso`, e.target.value)} className={inputCls} />
            </div>
          </div>
        ))}
      </section>

      {/* Contacto */}
      <section className="bg-white rounded-2xl border border-[#D4CABC] p-6 space-y-4">
        <h2 className="font-playfair text-xl font-bold text-[#2A3828]">Contacto</h2>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Email</label>
          <input value={data.contacto_email} onChange={e => set('contacto_email', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-nunito text-[#2A3828] mb-1">Instagram</label>
          <input value={data.contacto_instagram} onChange={e => set('contacto_instagram', e.target.value)} className={inputCls} />
        </div>
      </section>

      <button
        onClick={guardar}
        disabled={loading}
        className="w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-3 font-nunito font-bold hover:bg-[#3a4f38] transition-colors disabled:opacity-60"
      >
        {saved ? '¡Guardado!' : loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  )
}