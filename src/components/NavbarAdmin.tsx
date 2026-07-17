import Link from 'next/link'
import Image from 'next/image'
import LogoPrincipal from '../img/LogoPrincipal.jpg'
import BotonVolver from './BotonVolver'

type Props = {
  backHref?: string
  backLabel?: string
}

export default function NavbarAdmin({ backHref, backLabel }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC] backdrop-blur-sm border-b border-[#D4CABC]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Image src={LogoPrincipal} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-playfair font-semibold text-[#2A3828] text-[15px] leading-tight tracking-wide">
            Pequeños Momentos de Calma · Admin
          </span>
        </Link>

        <div className="flex items-center gap-6 mr-10">
          <Link href="/" className="text-sm font-nunito text-[#5A6854] hover:text-[#2A3828] transition-colors">
            Inicio
          </Link>
          {backHref && (
            <BotonVolver />
          )}
        </div>
      </div>
    </nav>
  )
}