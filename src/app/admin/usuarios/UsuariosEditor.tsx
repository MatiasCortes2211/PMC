'use client'

import { useState, useMemo } from 'react'

type Purchase = {
  id: string
  status: string
  course: { id: string; title: string; price: number }
}

type Usuario = {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: Date
  purchases: Purchase[]
}

const fmt = (p: number) => `$${p.toLocaleString('es-AR')}`
const SUPERADMIN_EMAIL = 'matiasycortes@gmail.com'

export default function UsuariosEditor({ usuarios, currentUserId }: { usuarios: Usuario[], currentUserId: string }) {
  const [lista, setLista] = useState(usuarios)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return lista
      .filter(u =>
        (u.name?.toLowerCase().includes(q) ?? false) ||
        (u.email?.toLowerCase().includes(q) ?? false)
      )
      .sort((a, b) => {
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1
        const nombreA = (a.name ?? a.email ?? '').toLowerCase()
        const nombreB = (b.name ?? b.email ?? '').toLowerCase()
        return nombreA.localeCompare(nombreB, 'es')
        })
  }, [lista, busqueda])

  async function toggleRole(usuario: Usuario) {
    const nuevoRol = usuario.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`¿Cambiar el rol de ${usuario.name ?? usuario.email} a ${nuevoRol}?`)) return

    setLoadingId(usuario.id)
    const res = await fetch(`/api/admin/usuarios/${usuario.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nuevoRol }),
    })

    if (res.ok) {
      setLista(lista.map(u => u.id === usuario.id ? { ...u, role: nuevoRol } : u))
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full border border-[#D4CABC] rounded-xl px-4 py-2.5 text-sm font-nunito text-[#2A3828] focus:outline-none focus:ring-2 focus:ring-[#7EA87F] bg-white"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9488] hover:text-[#2A3828] text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#D4CABC]">
          <p className="font-nunito text-[#9A9488]">No se encontraron usuarios.</p>
        </div>
      ) : (
        filtrados.map(usuario => (
          <div key={usuario.id} className="bg-white rounded-2xl border border-[#D4CABC] p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 min-w-0">
                  <p className="font-nunito font-bold text-[#2A3828] truncate max-w-[180px]">
                    {usuario.name ?? 'Sin nombre'}
                  </p>
                  <span className={`text-xs font-nunito font-semibold px-2 py-0.5 rounded-full ${
                    usuario.role === 'ADMIN'
                      ? 'bg-[#2A3828] text-[#F5F2EC]'
                      : 'bg-[#EDE8DF] text-[#5A6854]'
                  }`}>
                    {usuario.role}
                  </span>
                </div>
                <p className="font-nunito text-[#9A9488] text-sm truncate max-w-[220px]">{usuario.email}</p>
                <p className="font-nunito text-[#D4CABC] text-xs mt-1">
                  Registrado el {new Date(usuario.createdAt).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => toggleRole(usuario)}
                disabled={
                  loadingId === usuario.id ||
                  usuario.id === currentUserId ||
                  usuario.email === SUPERADMIN_EMAIL
                }
                title={
                  usuario.email === SUPERADMIN_EMAIL
                    ? 'Este usuario no puede ser modificado'
                    : usuario.id === currentUserId
                    ? 'No podés cambiar tu propio rol'
                    : ''
                }
                className={`text-xs font-nunito font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  usuario.role === 'ADMIN'
                    ? 'border-red-200 text-red-400 hover:bg-red-50'
                    : 'border-[#7EA87F] text-[#7EA87F] hover:bg-[#D4E4C8]'
                }`}
              >
                {loadingId === usuario.id
                  ? 'Cambiando...'
                  : usuario.role === 'ADMIN' ? 'Quitar Admin' : 'Hacer Admin'}
              </button>
            </div>

            {usuario.purchases.length > 0 ? (
              <div>
                <p className="font-nunito text-xs font-bold text-[#9A9488] uppercase tracking-widest mb-2">
                  Cursos comprados ({usuario.purchases.length})
                </p>
                <div className="space-y-1.5">
                  {usuario.purchases.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-[#F5F2EC] rounded-lg px-3 py-2">
                      <span className="font-nunito text-sm text-[#2A3828]">{p.course.title}</span>
                      <span className="font-nunito text-sm text-[#7EA87F] font-bold">{fmt(p.course.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-nunito text-xs text-[#D4CABC]">Sin cursos comprados</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}