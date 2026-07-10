import Link from 'next/link'

type Props = {
  backHref?: string
  backLabel?: string
}

export default function NavbarAdmin({ backHref, backLabel }: Props) {
  return (
    <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
      <span className="font-playfair font-semibold text-[#2A3828]">
        Pequeños Momentos de Calma · Admin
      </span>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm font-nunito text-[#5A6854] hover:text-[#2A3828] transition-colors">
          Ver sitio
        </Link>
        {backHref ? (
          <Link href={backHref} className="text-sm font-nunito text-[#7EA87F] hover:underline">
            ← {backLabel ?? 'Volver'}
          </Link>
        ) : (
          <Link href="/admin" className="text-sm font-nunito text-[#7EA87F] hover:underline">
            ← Panel
          </Link>
        )}
      </div>
    </nav>
  )
}