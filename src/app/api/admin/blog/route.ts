import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { title, excerpt, content, author, category, imageUrl, readTime } = await req.json()

  if (!title || !excerpt || !content) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const post = await prisma.blogPost.create({
    data: { title, excerpt, content, author, category, imageUrl, readTime },
  })

  return NextResponse.json(post)
}