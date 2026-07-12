import Link from 'next/link'
import { auth } from '@/lib/auth'
import Carrito from './Carrito'
import SignOutButton from './SignOutButton'

export default async function Navbar() {
  const session = await auth()
  const user = session?.user as any

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC]/95 backdrop-blur-sm border-b border-[rgba(42,56,40,0.1)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#7EA87F] flex items-center justify-center">
            <span className="text-[#F5F2EC] text-xs">🌿</span>
          </div>
          <span className="font-playfair font-semibold text-[#2A3828] text-[13px] leading-tight tracking-wide">
            Pequeños<br />Momentos
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">Inicio</Link>
          <Link href="/cursos" className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">Cursos</Link>
          <Link href="/blog" className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-sm font-nunito font-semibold text-[#5A6854] hover:text-[#2A3828] transition-colors border border-[#D4CABC] px-3 py-1.5 rounded-lg hover:bg-[#EDE8DF]"
                >
                  Admin
                </Link>
              )}
              <Carrito />
              <span className="text-sm font-nunito font-semibold text-[#2A3828]">
                {user?.name ?? user?.email}
              </span>
              
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}