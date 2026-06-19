import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export default async function CursoPage({
  params,
}: {
  params: Promise<{ cursoId: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { cursoId } = await params

  const curso = await prisma.course.findUnique({
    where: { id: cursoId, published: true },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })

  if (!curso) notFound()

  const compra = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: (session.user as any).id,
        courseId: cursoId,
      },
    },
  })

  const tieneAcceso =
    compra?.status === 'APPROVED' || (session.user as any).role === 'ADMIN'

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <Link href="/cursos" className="text-[#2A3828] font-semibold">
          pequeños momentos de calma
        </Link>
        <Link href="/cursos" className="text-sm text-[#7EA87F] hover:underline">
          volver a cursos
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#2A3828] mb-2">
            {curso.title}
          </h1>
          <p className="text-[#5A6854]">{curso.description}</p>
        </div>

        {!tieneAcceso ? (
          <div className="bg-white rounded-2xl border border-[#D4CABC] p-8 text-center space-y-4">
            <p className="text-[#2A3828] font-semibold text-xl">
              ${curso.price.toLocaleString('es-AR')}
            </p>
            <p className="text-[#5A6854] text-sm">
              Compra el curso para acceder a todas las clases
            </p>
            <a
              href={`/api/pagos/crear?cursoId=${cursoId}`}
              className="inline-block bg-[#2A3828] text-[#F5F2EC] px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#3a4f38] transition-colors"
            >
              Comprar curso
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {curso.lessons.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 text-center">
                <p className="text-[#5A6854] text-sm">
                  Proximamente se agregaran clases.
                </p>
              </div>
            )}
            {curso.lessons.map((leccion) => {
              const videoId = leccion.videoUrl
                ? getYouTubeId(leccion.videoUrl)
                : null

              return (
                <div
                  key={leccion.id}
                  className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-[#D4CABC]">
                    <p className="text-[#2A3828] font-medium">
                      {leccion.order}. {leccion.title}
                    </p>
                  </div>
                  {videoId && (
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}