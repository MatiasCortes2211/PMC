import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const userId = (session.user as any).id

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
  })

  if (items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
  }

  const preference = new Preference(client)

  const result = await preference.create({
    body: {
      items: items.map((item) => ({
        id: item.course.id,
        title: item.course.title,
        quantity: 1,
        unit_price: item.course.price,
        currency_id: 'ARS',
      })),
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/pago-exitoso`,
        failure: `${process.env.NEXTAUTH_URL}/pago-fallido`,
        pending: `${process.env.NEXTAUTH_URL}/pago-exitoso`,
      },
      external_reference: `cart|${userId}|${items.map(i => i.courseId).join(',')}`,
      notification_url: `${process.env.NEXTAUTH_URL}/api/pagos/webhook`,
    },
  })

  await Promise.all(
    items.map((item) =>
      prisma.purchase.upsert({
        where: { userId_courseId: { userId, courseId: item.courseId } },
        update: { status: 'PENDING' },
        create: {
          userId,
          courseId: item.courseId,
          amount: item.course.price,
          status: 'PENDING',
        },
      })
    )
  )

  return NextResponse.json({ url: result.init_point })
}