import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre crianza consciente, aromaterapia y respiración para familias.',
}

const catStyle: Record<string, string> = {
  Aromaterapia: 'bg-[#D4E4C8] text-[#2A3828]',
  Respiración: 'bg-[#A8C4A2] text-[#2A3828]',
  Crianza: 'bg-[#EDE8DF] text-[#5A6854]',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC] pt-16">
      <Navbar />

      <div className="pt-12 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="font-playfair text-5xl font-bold text-[#2A3828] mb-4">Blog</h1>
            <p className="font-nunito text-[#9A9488] text-lg">
              Reflexiones, guías y herramientas para la crianza consciente
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-[rgba(42,56,40,0.1)]">
              <p className="font-nunito text-[#9A9488]">Próximamente nuevos artículos.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(42,56,40,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                    {p.imageUrl && (
                      <div className="h-44 bg-[#D4CABC] overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {p.category && (
                          <span className={`text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full ${catStyle[p.category] ?? 'bg-[#EDE8DF] text-[#5A6854]'}`}>
                            {p.category}
                          </span>
                        )}
                        <span className="text-xs text-[#9A9488] font-nunito">🕐 {p.readTime} lectura</span>
                      </div>
                      <h3 className="font-playfair text-[#2A3828] font-semibold text-base leading-snug mb-2 flex-1">
                        {p.title}
                      </h3>
                      <p className="text-[#9A9488] font-nunito text-sm leading-relaxed mb-3 line-clamp-2">
                        {p.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#9A9488] font-nunito">
                        <span>{p.author}</span>
                        <span>{new Date(p.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}