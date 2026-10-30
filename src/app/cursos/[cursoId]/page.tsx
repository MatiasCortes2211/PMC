import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
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
  const { cursoId } = await params

  const curso = await prisma.course.findUnique({
    where: { id: cursoId, published: true },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { attachments: true },
      },
    },
  })

  if (!curso) notFound()

  const userId = (session?.user as any)?.id
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const compra = userId
    ? await prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: cursoId,
          },
        },
      })
    : null

  const tieneAccesoValido =
    compra?.status === 'APPROVED' &&
    (!compra.expiresAt || new Date(compra.expiresAt) > new Date())

  const tieneAcceso = tieneAccesoValido || isAdmin

  const estaExpirado = Boolean(
    compra?.status === 'APPROVED' &&
      compra.expiresAt &&
      new Date(compra.expiresAt) <= new Date()
  )

  const disponibilidadCerrada = Boolean(
    curso.availableUntil && new Date(curso.availableUntil) <= new Date()
  )

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 space-y-8">
        <Link
          href="/cursos"
          className="inline-flex items-center gap-2 text-sm font-nunito text-[#7EA87F] hover:underline"
        >
          ← Volver a cursos
        </Link>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h1 className="font-playfair text-3xl font-bold text-[#2A3828]">
              {curso.title}
            </h1>
            {curso.isFree && (
              <span className="bg-[#D4E4C8] text-[#2A3828] text-xs font-nunito font-bold px-2.5 py-0.5 rounded-full">
                Gratis
              </span>
            )}
          </div>
          <p className="font-nunito text-[#5A6854] whitespace-pre-line">{curso.description}</p>
        </div>

        {/* Banner de estado de abono / suscripción si tiene acceso */}
        {tieneAcceso && compra?.expiresAt && (
          <div className="bg-[#EDE8DF] border border-[#D4CABC] rounded-xl p-4 flex items-center justify-between text-xs font-nunito text-[#5A6854]">
            <p>
              📅 Tu acceso adquirido es válido hasta el{' '}
              <strong className="text-[#2A3828]">
                {new Date(compra.expiresAt).toLocaleDateString('es-AR', {
                  timeZone: 'America/Argentina/Buenos_Aires',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>
              .
            </p>
          </div>
        )}

        {!tieneAcceso ? (
          <div className="bg-white rounded-2xl border border-[#D4CABC] p-8 text-center space-y-4">
            {estaExpirado && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm font-nunito">
                ⚠️ Tu período de acceso a este curso venció el{' '}
                {new Date(compra!.expiresAt!).toLocaleDateString('es-AR', {
                  timeZone: 'America/Argentina/Buenos_Aires',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}.
                Podés renovarlo a continuación para continuar disfrutando de las clases.
              </div>
            )}

            <div className="space-y-1">
              <p className="font-playfair text-[#2A3828] font-bold text-3xl">
                {curso.isFree ? 'Gratis' : `$${curso.price.toLocaleString('es-AR')}`}
              </p>
              {curso.accessDurationDays && (
                <p className="text-xs font-nunito text-[#9A9488]">
                  Abono con acceso durante {curso.accessDurationDays} días tras la inscripción
                </p>
              )}
              {curso.availableUntil && (
                <p className="text-xs font-nunito text-[#7EA87F] font-semibold">
                  ⏳ Disponible para inscripción hasta el{' '}
                  {new Date(curso.availableUntil).toLocaleDateString('es-AR', {
                    timeZone: 'America/Argentina/Buenos_Aires',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })} hs
                </p>
              )}
            </div>

            <p className="font-nunito text-[#5A6854] text-sm">
              {curso.isFree
                ? 'Inscribite gratis para acceder a todo el material y videos.'
                : 'Accedé a todas las clases y material descargable.'}
            </p>

            <AgregarAlCarrito
              cursoId={cursoId}
              isFree={curso.isFree}
              estaExpirado={estaExpirado}
              disponibilidadCerrada={disponibilidadCerrada}
            />
          </div>
        ) : (
          <div className="space-y-6">
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
                  className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-4 border-b border-[#D4CABC]">
                    <p className="text-[#2A3828] font-medium text-lg">
                      {leccion.order}. {leccion.title}
                    </p>
                    {leccion.description && (
                      <p className="font-nunito text-[#5A6854] text-sm mt-1">
                        {leccion.description}
                      </p>
                    )}
                  </div>

                  {videoId && (
                    <div className="aspect-video bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* PDFs adjuntos a la lección */}
                  {leccion.attachments && leccion.attachments.length > 0 && (
                    <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#D4CABC] space-y-2">
                      <p className="text-xs font-nunito font-bold text-[#5A6854] uppercase tracking-wider">
                        Archivos descargables ({leccion.attachments.length}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {leccion.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center justify-between gap-3 bg-white border border-[#D4CABC] hover:border-[#7EA87F] p-3 rounded-xl transition-all hover:shadow-sm group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-red-600 bg-red-100 font-bold text-[10px] px-2 py-0.5 rounded">
                                PDF
                              </span>
                              <span className="font-nunito text-xs font-semibold text-[#2A3828] group-hover:text-[#7EA87F] truncate">
                                {att.name}
                              </span>
                            </div>
                            <span className="text-xs text-[#7EA87F] font-nunito font-bold shrink-0">
                              Descargar ↓
                            </span>
                          </a>
                        ))}
                      </div>
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
