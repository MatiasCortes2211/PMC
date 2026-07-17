'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

type Props = {
  isAdmin: boolean
  userName: string | null
  isLoggedIn: boolean
}

const links = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Blog', href: '/blog' },
]

export default function NavbarMobile({ isAdmin, userName, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-[#2A3828] p-1"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[#F5F2EC] border-b border-[rgba(42,56,40,0.1)] px-6 py-4 space-y-4 z-50">
          {links.map(({ label, href }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block font-nunito font-semibold transition-colors ${
                  active ? 'text-[#2A3828]' : 'text-[#9A9488] hover:text-[#2A3828]'
                }`}
              >
                {active && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7EA87F] mr-2 mb-0.5" />}
                {label}
              </Link>
            )
          })}

          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block font-nunito font-semibold text-[#5A6854] hover:text-[#2A3828] transition-colors"
                >
                  Admin
                </Link>
              )}
              {userName && (
                <p className="font-nunito text-sm text-[#2A3828] font-semibold">{userName}</p>
              )}
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
                className="block font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </div>
  )
}