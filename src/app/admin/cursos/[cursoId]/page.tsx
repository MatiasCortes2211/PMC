import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LeccionesEditor from './LeccionesEditor'
import EditarCursoForm from './EditarCursoForm'
import NavbarAdmin from '@/components/NavbarAdmin'

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

  const categorias = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  if (!curso) notFound()

  return (
    <main className="min-h-screen bg-[#F5F2EC] pt-16">
      <NavbarAdmin backHref="/admin" backLabel="Volver al panel" />

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <EditarCursoForm curso={curso} categorias={categorias} />

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