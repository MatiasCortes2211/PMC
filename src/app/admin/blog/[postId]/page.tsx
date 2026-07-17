import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import EditarPostForm from './EditarPostForm'
import NavbarAdmin from '@/components/NavbarAdmin'

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/cursos')

  const { postId } = await params

  const [post, categorias] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id: postId } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#F5F2EC] pt-16">
      <NavbarAdmin backHref="/admin" backLabel="Volver al panel" />

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <EditarPostForm post={post} categorias={categorias} />
      </div>
    </main>
  )
}