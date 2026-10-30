import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const dataId = searchParams.get('data.id')

  let id = dataId
  if (!id) {
    const body = await req.json().catch(() => ({}))
    id = body?.data?.id
  }

  if (type !== 'payment' || !id) {
    return NextResponse.json({ ok: true })
  }

  try {
    const payment = new Payment(client)
    const data = await payment.get({ id })

    const status = data.status
    const ref = data.external_reference

    if (!ref) return NextResponse.json({ ok: true })

    if (ref.startsWith('cart|')) {
      const [, userId, cursosStr] = ref.split('|')
      const cursoIds = cursosStr.split(',')

      if (status === 'approved') {
        await Promise.all([
          ...cursoIds.map(async (courseId) => {
            const course = await prisma.course.findUnique({
              where: { id: courseId },
              select: { accessDurationDays: true },
            })
            const expiresAt = course?.accessDurationDays
              ? new Date(Date.now() + course.accessDurationDays * 86400000)
              : null

            return prisma.purchase.updateMany({
              where: { userId, courseId },
              data: {
                status: 'APPROVED',
                mpPaymentId: String(id),
                expiresAt,
              },
            })
          }),
          prisma.cartItem.deleteMany({ where: { userId } }),
        ])
      } else if (status === 'rejected') {
        await Promise.all(
          cursoIds.map((courseId) =>
            prisma.purchase.updateMany({
              where: { userId, courseId },
              data: { status: 'REJECTED' },
            })
          )
        )
      }
    } else {
      const [userId, courseId] = ref.split('|')

      if (status === 'approved') {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: { accessDurationDays: true },
        })
        const expiresAt = course?.accessDurationDays
          ? new Date(Date.now() + course.accessDurationDays * 86400000)
          : null

        await prisma.purchase.updateMany({
          where: { userId, courseId },
          data: {
            status: 'APPROVED',
            mpPaymentId: String(id),
            expiresAt,
          },
        })
      } else if (status === 'rejected') {
        await prisma.purchase.updateMany({
          where: { userId, courseId },
          data: { status: 'REJECTED' },
        })
      }
    }
  } catch (e) {
    console.error('Webhook error:', e)
  }

  return NextResponse.json({ ok: true })
}
