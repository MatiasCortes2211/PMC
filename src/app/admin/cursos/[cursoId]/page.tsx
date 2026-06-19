import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LeccionesEditor from './LeccionesEditor'

export default async function EditarCursoPage({
  params,
}: {
  params: Promise<{ cursoId: string }>
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/cursos')

  const { cursoId } = await params

  const curso = await prisma.course.findUnique({
    where: { id: cursoId },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })

  if (!curso) notFound()

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="text-[#2A3828] font-semibold">
          pequeños momentos de calma · Admin
        </span>
        <Link href="/admin" className="text-sm text-[#7EA87F] hover:underline">
          ← Volver
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#2A3828] mb-1">
            {curso.title}
          </h1>
          <p className="text-[#5A6854] text-sm">{curso.description}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D4CABC] p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5A6854]">Precio</p>
            <p className="text-2xl font-semibold text-[#2A3828]">
              ${curso.price.toLocaleString('es-AR')}
            </p>
          </div>
          <PublishButton cursoId={cursoId} published={curso.published} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#2A3828] mb-4">Clases</h2>
          <LeccionesEditor cursoId={cursoId} lecciones={curso.lessons} />
        </div>
      </div>
    </main>
  )
}

function PublishButton({
  cursoId,
  published,
}: {
  cursoId: string
  published: boolean
}) {
  return (
    <form
      action={async () => {
        'use server'
        await prisma.course.update({
          where: { id: cursoId },
          data: { published: !published },
        })
        const { revalidatePath } = await import('next/cache')
        revalidatePath(`/admin/cursos/${cursoId}`)
      }}
    >
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          published
            ? 'bg-[#D4CABC] text-[#2A3828] hover:bg-[#c4baac]'
            : 'bg-[#7EA87F] text-white hover:bg-[#6a9a6a]'
        }`}
      >
        {published ? 'Despublicar' : 'Publicar'}
      </button>
    </form>
  )
}