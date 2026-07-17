'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Blog', href: '/blog' },
]

export default function NavbarLinks() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center gap-8">
      {links.map(({ label, href }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm font-nunito font-semibold transition-colors ${
              active
                ? 'text-[#2A3828] border-b-2 border-[#7EA87F] pb-0.5'
                : 'text-[#9A9488] hover:text-[#2A3828]'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}