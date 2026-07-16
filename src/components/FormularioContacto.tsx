'use client'

import { useState } from 'react'

export default function FormularioContacto() {
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-[rgba(42,56,40,0.15)] font-nunito text-sm text-[#2A3828] bg-white focus:outline-none focus:border-[#7EA87F] transition-colors"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSent(true)
      setData({ name: '', email: '', message: '' })
    } else {
      setError('Hubo un error al enviar el mensaje. Intentá de nuevo.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#D4E4C8] flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="font-playfair text-xl font-bold text-[#2A3828] mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="font-nunito text-[#9A9488] text-sm leading-relaxed mb-6">
          Gracias por escribirnos. Te responderemos a la brevedad.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm font-nunito text-[#7EA87F] font-bold hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
          Tu nombre
        </label>
        <input
          type="text"
          placeholder="María García"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
          required
          className={inputCls}
        />
      </div>
      <div>
        <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="tu@correo.com"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
          required
          className={inputCls}
        />
      </div>
      <div>
        <label className="block font-nunito text-sm font-bold text-[#2A3828] mb-1.5">
          Tu mensaje
        </label>
        <textarea
          placeholder="Escribe aquí tu consulta..."
          value={data.message}
          onChange={e => setData({ ...data, message: e.target.value })}
          required
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </div>
      {error && <p className="text-red-500 font-nunito text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#2A3828] text-[#F5F2EC] font-nunito font-bold rounded-xl hover:bg-[#5A6854] transition-colors disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}