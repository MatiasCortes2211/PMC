import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const session = await auth()

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/cursos')
  }

  const totalCursos = await prisma.course.count()
  const totalUsuarios = await prisma.user.count()
  const totalVentas = await prisma.purchase.count({
    where: { status: 'APPROVED' },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="text-[#2A3828] font-semibold">
          pequeños momentos de calma · Admin
        </span>
        <Link href="/cursos" className="text-sm text-[#7EA87F] hover:underline">
          Ver sitio
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-[#2A3828] mb-8">
          Panel de administración
        </h1>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Cursos publicados', value: totalCursos },
            { label: 'Usuarios registrados', value: totalUsuarios },
            { label: 'Ventas aprobadas', value: totalVentas },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#D4CABC]">
              <p className="text-[#5A6854] text-sm mb-1">{stat.label}</p>
              <p className="text-4xl font-semibold text-[#2A3828]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2A3828]">Cursos</h2>
          <Link
            href="/admin/cursos/nuevo"
            className="bg-[#2A3828] text-[#F5F2EC] px-4 py-2 rounded-lg text-sm hover:bg-[#3a4f38] transition-colors"
          >
            + Nuevo curso
          </Link>
        </div>

        <AdminCursosList />
      </div>
    </main>
  )
}

async function AdminCursosList() {
  const cursos = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { lessons: true, purchases: true } } },
  })

  if (cursos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#D4CABC]">
        <p className="text-[#5A6854]">No hay cursos todavía.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden">
      {cursos.map((curso, i) => (
        <div
          key={curso.id}
          className={`flex items-center justify-between px-6 py-4 ${
            i !== cursos.length - 1 ? 'border-b border-[#D4CABC]' : ''
          }`}
        >
          <div>
            <p className="text-[#2A3828] font-medium">{curso.title}</p>
            <p className="text-sm text-[#5A6854]">
              {curso._count.lessons} clases · {curso._count.purchases} ventas ·{' '}
              <span className={curso.published ? 'text-[#7EA87F]' : 'text-[#9A9488]'}>
                {curso.published ? 'Publicado' : 'Borrador'}
              </span>
            </p>
          </div>
          <Link
            href={`/admin/cursos/${curso.id}`}
            className="text-sm text-[#7EA87F] hover:underline"
          >
            Editar
          </Link>
        </div>
      ))}
    </div>
  )
}