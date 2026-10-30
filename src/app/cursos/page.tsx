import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Explorá nuestros cursos de aromaterapia, respiración consciente y crianza holística.',
}

const catStyle: Record<string, string> = {
  Aromaterapia: 'bg-[#D4E4C8] text-[#2A3828]',
  Respiración: 'bg-[#A8C4A2] text-[#2A3828]',
  Crianza: 'bg-[#EDE8DF] text-[#5A6854]',
}

const fmt = (p: number) => `$${p.toLocaleString('es-AR')}`

export default async function CursosPage() {
  const cursos = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  const now = new Date()

  return (
    <main className="min-h-screen bg-[#F5F2EC] pt-16">
      <Navbar />

      <div className="pt-12 pb-24 px-6">
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
              {cursos.map((c) => {
                const cerrada = c.availableUntil ? new Date(c.availableUntil) <= now : false

                return (
                  <Link key={c.id} href={`/cursos/${c.id}`}>
                    <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(42,56,40,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group h-full">
                      {c.imageUrl && (
                        <div className="h-44 bg-[#D4CABC] overflow-hidden relative">
                          <img
                            src={c.imageUrl}
                            alt={c.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {cerrada && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="bg-white/90 text-[#2A3828] font-nunito font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                                Inscripción finalizada
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {c.category && (
                            <span className={`text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full ${catStyle[c.category] ?? 'bg-[#EDE8DF] text-[#5A6854]'}`}>
                              {c.category}
                            </span>
                          )}
                          {c.isFree && (
                            <span className="bg-[#D4E4C8] text-[#2A3828] text-xs font-nunito font-bold px-2 py-0.5 rounded-full">
                              Gratis
                            </span>
                          )}
                          {c.availableUntil && !cerrada && (
                            <span className="bg-amber-100 text-amber-800 text-xs font-nunito font-semibold px-2 py-0.5 rounded-full">
                              ⏳ Tiempo limitado
                            </span>
                          )}
                        </div>

                        <h3 className="font-playfair text-[#2A3828] font-semibold text-lg leading-snug mb-2">
                          {c.title}
                        </h3>
                        <p className="text-[#9A9488] font-nunito text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                          {c.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(42,56,40,0.07)]">
                          <div>
                            <span className="font-playfair font-bold text-[#2A3828] text-xl">
                              {c.isFree ? 'Gratis' : fmt(c.price)}
                            </span>
                            {c.accessDurationDays && (
                              <p className="text-[10px] font-nunito text-[#9A9488]">
                                Abono por {c.accessDurationDays} días
                              </p>
                            )}
                          </div>
                          <span className="flex items-center gap-1.5 text-[#7EA87F] font-nunito font-bold text-sm group-hover:gap-2.5 transition-all">
                            Ver curso →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
