import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Mi perfil',
}

const fmt = (p: number) => `$${p.toLocaleString('es-AR')}`

export default async function PerfilPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const user = session.user as any

  const compras = await prisma.purchase.findMany({
    where: { userId: user.id, status: 'APPROVED' },
    include: { course: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#D4CABC] p-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#D4E4C8] flex items-center justify-center flex-shrink-0">
              <span className="font-playfair text-2xl font-bold text-[#2A3828]">
                {(user.name ?? user.email ?? '?')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-[#2A3828]">
                {user.name ?? 'Sin nombre'}
              </h1>
              <p className="font-nunito text-[#9A9488] text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Cursos comprados */}
        <div>
          <h2 className="font-playfair text-xl font-bold text-[#2A3828] mb-4">
            Mis cursos
          </h2>

          {compras.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#D4CABC] p-10 text-center">
              <p className="font-nunito text-[#9A9488] mb-4">Todavía no compraste ningún curso.</p>
              <Link
                href="/cursos"
                className="inline-block px-6 py-3 bg-[#7EA87F] text-[#F5F2EC] font-nunito font-bold rounded-full hover:bg-[#5A6854] transition-colors text-sm"
              >
                Ver cursos disponibles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {compras.map(compra => (
                <Link key={compra.id} href={`/cursos/${compra.courseId}`}>
                  <div className="bg-white rounded-2xl border border-[#D4CABC] p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    {compra.course.imageUrl && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#D4CABC] flex-shrink-0">
                        <img
                          src={compra.course.imageUrl}
                          alt={compra.course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair font-semibold text-[#2A3828] leading-snug">
                        {compra.course.title}
                      </h3>
                      {compra.course.category && (
                        <span className="font-nunito text-xs text-[#9A9488]">
                          {compra.course.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-nunito text-sm font-bold text-[#7EA87F]">
                        {fmt(compra.course.price)}
                      </span>
                      <span className="text-sm text-[#7EA87F] font-nunito font-bold">
                        Ir al curso →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}