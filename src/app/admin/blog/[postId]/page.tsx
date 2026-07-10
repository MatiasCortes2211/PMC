import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import EditarPostForm from './EditarPostForm'

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/cursos')

  const { postId } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
  })

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="font-playfair font-semibold text-[#2A3828]">pequeños momentos de calma · Admin</span>
        <Link href="/admin" className="text-sm font-nunito text-[#7EA87F] hover:underline">← Volver</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <EditarPostForm post={post} />
      </div>
    </main>
  )
}