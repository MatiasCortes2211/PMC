import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import NavbarAdmin from '@/components/NavbarAdmin'
import UsuariosEditor from './UsuariosEditor'

export default async function UsuariosPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/cursos')
  const currentUserId = (session.user as any).id

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      purchases: {
        where: { status: 'APPROVED' },
        include: { course: true },
      },
    },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC] pt-16">
      <NavbarAdmin backHref="/admin" backLabel="Volver al panel" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-2">Usuarios</h1>
        <p className="font-nunito text-[#5A6854] text-sm mb-8">
          Listado de usuarios registrados y sus cursos comprados.
        </p>
        <UsuariosEditor usuarios={usuarios} currentUserId={currentUserId} />
      </div>
    </main>
  )
}