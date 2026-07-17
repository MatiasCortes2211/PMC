import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NavbarAdmin from '@/components/NavbarAdmin'

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
    <main className="min-h-screen bg-[#F5F2EC] pt-16">
      <NavbarAdmin />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-6">
          Panel de administración
        </h1>

        <div className="flex gap-4 mb-10">
          <Link
            href="/admin/contenido"
            className="bg-[#2A3828] text-[#F5F2EC] rounded-xl px-5 py-3 text-sm font-nunito font-semibold hover:bg-[#5A6854] transition-colors"
          >
            ✏️ Editar contenido del sitio
          </Link>
          <Link
            href="/admin/categorias"
            className="bg-[#2A3828] text-[#F5F2EC] rounded-xl px-5 py-3 text-sm font-nunito font-semibold hover:bg-[#5A6854] transition-colors"
          >
            🏷️ Categorías
          </Link>
          <Link
            href="/admin/usuarios"
            className="bg-[#2A3828] text-[#F5F2EC] rounded-xl px-5 py-3 text-sm font-nunito font-semibold hover:bg-[#5A6854] transition-colors"
          >
            👥 Usuarios
          </Link>
        </div>

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
            className="bg-[#2A3828] text-[#F5F2EC] rounded-xl px-5 py-3 text-sm font-nunito font-semibold hover:bg-[#5A6854] transition-colors"
          >
            + Nuevo curso
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden max-h-[400px] overflow-y-auto">
          <AdminCursosList />
        </div>

        <div className="flex justify-between items-center mb-4 mt-10">
          <h2 className="text-xl font-semibold text-[#2A3828]">Blog</h2>
          <Link
            href="/admin/blog/nuevo"
            className="bg-[#2A3828] text-[#F5F2EC] rounded-xl px-5 py-3 text-sm font-nunito font-semibold hover:bg-[#5A6854] transition-colors"
          >
            + Nuevo artículo
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden max-h-[400px] overflow-y-auto">
          <AdminBlogList />
        </div>
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


async function AdminBlogList() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#D4CABC]">
        <p className="text-[#5A6854]">No hay artículos todavía.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D4CABC] overflow-hidden">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className={`flex items-center justify-between px-6 py-4 ${i !== posts.length - 1 ? 'border-b border-[#D4CABC]' : ''}`}
        >
          <div>
            <p className="text-[#2A3828] font-medium">{post.title}</p>
            <p className="text-sm text-[#5A6854]">
              {post.category ?? 'Sin categoría'} · {post.readTime} ·{' '}
              <span className={post.published ? 'text-[#7EA87F]' : 'text-[#9A9488]'}>
                {post.published ? 'Publicado' : 'Borrador'}
              </span>
            </p>
          </div>
          <Link href={`/admin/blog/${post.id}`} className="text-sm text-[#7EA87F] hover:underline">
            Editar
          </Link>
        </div>
      ))}
    </div>
  )
}