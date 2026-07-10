import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Promise<{ cursoId?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { cursoId } = await searchParams

  if (cursoId) {
    const userId = (session.user as any).id
    await prisma.purchase.updateMany({
      where: { userId, courseId: cursoId, status: 'PENDING' },
      data: { status: 'APPROVED' },
    })
  }

  return (
    <main className="min-h-screen bg-[#F5F2EC] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-[#D4CABC] p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-[#D4E4C8] flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-2">
          ¡Pago exitoso!
        </h1>
        <p className="font-nunito text-[#5A6854] mb-8">
          Ya tenés acceso a tu curso. ¡Que lo disfrutes!
        </p>
        {cursoId && (
          <Link
            href={`/cursos/${cursoId}`}
            className="block w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-3 font-nunito font-bold hover:bg-[#3a4f38] transition-colors mb-3"
          >
            Ir al curso
          </Link>
        )}
        <Link
          href="/cursos"
          className="block w-full text-[#7EA87F] font-nunito text-sm hover:underline"
        >
          Ver todos los cursos
        </Link>
      </div>
    </main>
  )
}