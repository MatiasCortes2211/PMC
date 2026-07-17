'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

type Props = {
  name: string
}

export default function NavbarUserMenu({ name }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-sm font-nunito font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg max-w-[160px] ${
            open
            ? 'bg-[#2A3828] text-[#F5F2EC]'
            : 'text-[#2A3828] hover:bg-[#EDE8DF]'
        }`}
        >
        <span className="truncate">{name}</span>
        <svg
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`absolute right-0 top-10 bg-white rounded-xl border border-[#D4CABC] shadow-lg w-44 z-50 overflow-hidden transition-all duration-200 ${
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <Link
          href="/perfil"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-4 py-3 text-sm font-nunito text-[#2A3828] hover:bg-[#F5F2EC] transition-colors"
        >
          <svg className="w-4 h-4 text-[#9A9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi perfil
        </Link>
        <div className="border-t border-[#D4CABC]" />
        <button
          onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
          className="flex items-center gap-2.5 px-4 py-3 text-sm font-nunito text-[#9A9488] hover:bg-[#F5F2EC] transition-colors w-full text-left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}