import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import AgregarAlCarrito from './AgregarAlCarrito'
import { Metadata } from 'next'
import Footer from '@/components/Footer'

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cursoId: string }>
}): Promise<Metadata> {
  const { cursoId } = await params
  const curso = await prisma.course.findUnique({
    where: { id: cursoId },
    select: { title: true, description: true },
  })

  return {
    title: curso?.title ?? 'Curso',
    description: curso?.description ?? '',
  }
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
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 space-y-8">
        <Link href="/cursos" className="inline-flex items-center gap-2 text-sm font-nunito text-[#7EA87F] hover:underline">
          ← Volver a cursos
        </Link>

        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-2">
            {curso.title}
          </h1>
          <p className="font-nunito text-[#5A6854]">{curso.description}</p>
        </div>

        {!tieneAcceso ? (
          <div className="bg-white rounded-2xl border border-[#D4CABC] p-8 text-center space-y-4">
            <p className="font-playfair text-[#2A3828] font-bold text-2xl">
              ${curso.price.toLocaleString('es-AR')}
            </p>
            <p className="font-nunito text-[#5A6854] text-sm">
              Comprá el curso para acceder a todas las clases
            </p>
            <AgregarAlCarrito cursoId={cursoId} />
          </div>
        ) : (
          <div className="space-y-4">
            {curso.lessons.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 text-center">
                <p className="font-nunito text-[#5A6854] text-sm">
                  Próximamente se agregarán clases.
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
                    {leccion.description && (
                      <p className="font-nunito text-[#5A6854] text-sm mt-1">
                        {leccion.description}
                      </p>
                    )}
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
      <Footer />
    </main>
  )
}