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

    const [userId, courseId] = ref.split('|')

    if (status === 'approved') {
      await prisma.purchase.updateMany({
        where: { userId, courseId },
        data: { status: 'APPROVED', mpPaymentId: String(id) },
      })
    } else if (status === 'rejected') {
      await prisma.purchase.updateMany({
        where: { userId, courseId },
        data: { status: 'REJECTED' },
      })
    }
  } catch (e) {
    console.error('Webhook error:', e)
  }

  return NextResponse.json({ ok: true })
}