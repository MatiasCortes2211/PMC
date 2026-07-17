import Link from 'next/link'
import { auth } from '@/lib/auth'
import Carrito from './Carrito'
import SignOutButton from './SignOutButton'
import NavbarMobile from './NavbarMobile'
import Image from 'next/image'
import LogoPrincipal from '../img/LogoPrincipal.jpg'
import NavbarLinks from './NavbarLinks'

export default async function Navbar() {
  const session = await auth()
  const user = session?.user as any

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC] backdrop-blur-sm border-b border-[#D4CABC]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Image src={LogoPrincipal} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-playfair font-semibold text-[#2A3828] text-[15px] leading-tight tracking-wide">
            Pequeños Momentos de Calma
          </span>
        </Link>

        {/* Desktop - links */}
        <NavbarLinks />

        {/* Desktop - acciones */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors border border-[#D4CABC] px-3 py-1.5 rounded-lg hover:bg-[#EDE8DF]"
                >
                  Admin
                </Link>
              )}
              <Carrito />
             <Link
              href="/perfil"
              className="text-sm font-nunito font-semibold text-[#2A3828] hover:text-[#7EA87F] transition-colors"
            >
              {user?.name ?? user?.email}
            </Link>
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

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          {session && <Carrito />}
          <NavbarMobile
            isAdmin={user?.role === 'ADMIN'}
            userName={user?.name ?? user?.email ?? null}
            isLoggedIn={!!session}
          />
        </div>
      </div>
    </nav>
  )
}