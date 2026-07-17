import Link from 'next/link'

type Props = {
  email?: string
  instagram?: string
}

export default function Footer({
  email = 'hola@pequenosmomentoscalma.com',
  instagram = '@pmc.calma',
}: Props) {
  return (
    <footer className="bg-[#2A3828] py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#7EA87F] flex items-center justify-center">
                <span className="text-[#F5F2EC] text-xs">🌿</span>
              </div>
              <span className="font-playfair font-semibold text-[#D4E4C8] text-sm">
                Pequeños Momentos de Calma
              </span>
            </div>
            <p className="font-nunito text-[#A8C4A2]/70 text-sm max-w-xs leading-relaxed text-center md:text-left">
              Crianza consciente a través de la aromaterapia y la respiración holística.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-nunito text-[#D4E4C8] font-bold text-sm mb-4">Explorar</h4>
              <div className="flex flex-col items-center md:items-start gap-2.5">
                {[
                  { label: 'Inicio', href: '/' },
                  { label: 'Cursos', href: '/cursos' },
                  { label: 'Blog', href: '/blog' },
                ].map(({ label, href }) => (
                  <Link key={href} href={href} className="font-nunito text-sm text-[#A8C4A2]/60 hover:text-[#D4E4C8] transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-nunito text-[#D4E4C8] font-bold text-sm mb-4">Contacto</h4>
              <div className="flex flex-col items-center md:items-start gap-3">
                <a href={`mailto:${email}`} className="font-nunito text-sm text-[#A8C4A2]/60 hover:text-[#D4E4C8] transition-colors">
                  {email}
                </a>
                
                <a href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-nunito text-sm text-[#A8C4A2]/60 hover:text-[#D4E4C8] transition-colors"
                >
                  {instagram}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#D4E4C8]/10 pt-6 text-center text-[#A8C4A2]/40 font-nunito text-xs">
          © {new Date().getFullYear()} Pequeños Momentos de Calma. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}