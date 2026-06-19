import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CursosPage() {
  const session = await auth()

  if (!session) redirect('/login')

  const cursos = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="text-[#2A3828] font-semibold">
          pequeños momentos de calma
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5A6854]">{session.user?.email}</span>
          <Link
            href="/api/auth/signout"
            className="text-sm text-[#7EA87F] hover:underline"
          >
            Salir
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-[#2A3828] mb-2">
          Cursos
        </h1>
        <p className="text-[#5A6854] mb-8">
          Explorá nuestros cursos de bienestar para la primera infancia
        </p>

        {cursos.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#D4CABC]">
            <p className="text-[#5A6854]">
              Próximamente nuevos cursos disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <Link key={curso.id} href={`/cursos/${curso.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden border border-[#D4CABC] hover:shadow-md transition-shadow">
                  {curso.imageUrl && (
                    <img
                      src={curso.imageUrl}
                      alt={curso.title}
                      className="w-full h-44 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h2 className="text-[#2A3828] font-semibold text-lg mb-1">
                      {curso.title}
                    </h2>
                    <p className="text-[#5A6854] text-sm mb-4 line-clamp-2">
                      {curso.description}
                    </p>
                    <span className="text-[#2A3828] font-semibold">
                      ${curso.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}