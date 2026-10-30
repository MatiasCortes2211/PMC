import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { searchParams } = new URL(req.url)
  const cursoId = searchParams.get('cursoId')

  if (!cursoId) {
    return NextResponse.redirect(new URL('/cursos', req.url))
  }

  const curso = await prisma.course.findUnique({
    where: { id: cursoId, published: true },
  })

  if (!curso) {
    return NextResponse.redirect(new URL('/cursos', req.url))
  }

  // Check if course enrollment is closed due to limited time availability
  if (curso.availableUntil && new Date(curso.availableUntil) <= new Date()) {
    return NextResponse.redirect(new URL(`/cursos/${cursoId}?error=disponibilidad_finalizada`, req.url))
  }

  const userId = (session.user as any).id

  const compraExistente = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: cursoId } },
  })

  // If purchase is approved and not expired, user already has access
  const tieneAccesoValido =
    compraExistente?.status === 'APPROVED' &&
    (!compraExistente.expiresAt || new Date(compraExistente.expiresAt) > new Date())

  if (tieneAccesoValido) {
    return NextResponse.redirect(new URL(`/cursos/${cursoId}`, req.url))
  }

  // If course is free, redirect to course page (they can enroll directly with 1 click)
  if (curso.isFree || curso.price === 0) {
    return NextResponse.redirect(new URL(`/cursos/${cursoId}`, req.url))
  }

  const preference = new Preference(client)

  const result = await preference.create({
    body: {
      items: [
        {
          id: curso.id,
          title: curso.title,
          quantity: 1,
          unit_price: curso.price,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/pago-exitoso?cursoId=${cursoId}`,
        failure: `${process.env.NEXTAUTH_URL}/pago-fallido?cursoId=${cursoId}`,
        pending: `${process.env.NEXTAUTH_URL}/pago-exitoso?cursoId=${cursoId}`,
      },
      external_reference: `${userId}|${cursoId}`,
      notification_url: `${process.env.NEXTAUTH_URL}/api/pagos/webhook`,
    },
  })

  if (compraExistente) {
    await prisma.purchase.update({
      where: { id: compraExistente.id },
      data: { status: 'PENDING', amount: curso.price },
    })
  } else {
    await prisma.purchase.create({
      data: {
        userId,
        courseId: cursoId,
        amount: curso.price,
        status: 'PENDING',
      },
    })
  }

  return NextResponse.redirect(result.init_point!)
}
