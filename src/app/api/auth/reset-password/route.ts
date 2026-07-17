import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return NextResponse.json({ ok: true })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

  await prisma.passwordResetToken.deleteMany({ where: { email } })
  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Recuperar contraseña - Pequeños Momentos de Calma',
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Hacé click en el siguiente link para crear una nueva contraseña. El link expira en 1 hora.</p>
      <a href="${resetUrl}" style="background:#2A3828;color:#F5F2EC;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">
        Restablecer contraseña
      </a>
      <p>Si no solicitaste esto, ignorá este email.</p>
    `,
  })

  return NextResponse.json({ ok: true })
}