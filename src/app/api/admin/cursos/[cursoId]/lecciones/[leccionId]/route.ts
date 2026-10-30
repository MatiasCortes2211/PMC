import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cursoId: string; leccionId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { leccionId } = await params
  const data = await req.json()

  if (data.attachments !== undefined) {
    await prisma.lessonAttachment.deleteMany({ where: { lessonId: leccionId } })
    if (Array.isArray(data.attachments) && data.attachments.length > 0) {
      await prisma.lessonAttachment.createMany({
        data: data.attachments.map((a: { name: string; url: string }) => ({
          lessonId: leccionId,
          name: a.name,
          url: a.url,
        })),
      })
    }
  }

  const leccion = await prisma.lesson.update({
    where: { id: leccionId },
    data: {
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
    },
    include: {
      attachments: true,
    },
  })

  return NextResponse.json(leccion)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ cursoId: string; leccionId: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { leccionId } = await params

  await prisma.lesson.delete({ where: { id: leccionId } })

  return NextResponse.json({ ok: true })
}
