import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const catStyle: Record<string, string> = {
  Aromaterapia: 'bg-[#D4E4C8] text-[#2A3828]',
  Respiración: 'bg-[#A8C4A2] text-[#2A3828]',
  Crianza: 'bg-[#EDE8DF] text-[#5A6854]',
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id: postId, published: true },
  })

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <Navbar />

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-nunito text-[#7EA87F] hover:underline">
            ← Volver a blogs
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className={`text-xs font-nunito font-semibold px-2.5 py-1 rounded-full ${catStyle[post.category] ?? 'bg-[#EDE8DF] text-[#5A6854]'}`}>
                {post.category}
              </span>
            )}
            <span className="text-xs text-[#9A9488] font-nunito">🕐 {post.readTime} lectura</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#2A3828] leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-10 text-sm text-[#9A9488] font-nunito">
            <span>{post.author}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          {post.imageUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-[#D4CABC] mb-10">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="font-nunito text-[#2A3828] leading-[1.9] text-[1.05rem] space-y-5">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[rgba(42,56,40,0.1)]">
            <Link href="/cursos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7EA87F] text-[#F5F2EC] font-nunito font-bold rounded-full hover:bg-[#5A6854] transition-colors">
              Explorar cursos →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}