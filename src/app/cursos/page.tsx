import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const catStyle: Record<string, string> = {
  Aromaterapia: 'bg-[#D4E4C8] text-[#2A3828]',
  Respiración: 'bg-[#A8C4A2] text-[#2A3828]',
  Crianza: 'bg-[#EDE8DF] text-[#5A6854]',
}

const fmt = (p: number) => `$${p.toLocaleString('es-AR')}`

export default async function CursosPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const cursos = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
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
            <Link href="/cursos" className="text-sm font-nunito font-semibold text-[#7EA87F]">Cursos</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-nunito text-[#9A9488]">{session.user?.email}</span>
            <Link href="/api/auth/signout" className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">
              Salir
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="font-playfair text-5xl font-bold text-[#2A3828] mb-4">Nuestros Cursos</h1>
            <p className="font-nunito text-[#9A9488] text-lg max-w-xl mx-auto">
              Aprende a tu ritmo con guías especializadas en crianza holística
            </p>
          </div>

          {cursos.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-[rgba(42,56,40,0.1)]">
              <p className="font-nunito text-[#9A9488]">Próximamente nuevos cursos disponibles.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {cursos.map((c) => (
                <Link key={c.id} href={`/cursos/${c.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(42,56,40,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group">
                    {c.imageUrl && (
                      <div className="h-44 bg-[#D4CABC] overflow-hidden">
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {c.category && (
                        <span className={`self-start text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full mb-3 ${catStyle[c.category] ?? 'bg-[#EDE8DF] text-[#5A6854]'}`}>
                          {c.category}
                        </span>
                      )}
                      <h3 className="font-playfair text-[#2A3828] font-semibold text-lg leading-snug mb-2">
                        {c.title}
                      </h3>
                      <p className="text-[#9A9488] font-nunito text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                        {c.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-[rgba(42,56,40,0.07)]">
                        <span className="font-playfair font-bold text-[#2A3828] text-xl">
                          {fmt(c.price)}
                        </span>
                        <span className="flex items-center gap-1.5 text-[#7EA87F] font-nunito font-bold text-sm group-hover:gap-2.5 transition-all">
                          Ver curso →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}