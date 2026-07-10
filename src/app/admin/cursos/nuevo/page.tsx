import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NuevoCursoForm from './NuevoCursoForm'
import NavbarAdmin from '@/components/NavbarAdmin'

export default async function NuevoCursoPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/cursos')

  const categorias = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <NavbarAdmin backHref="/admin" backLabel="Volver al panel" />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-8">Nuevo curso</h1>
        <NuevoCursoForm categorias={categorias} />
      </div>
    </main>
  )
}