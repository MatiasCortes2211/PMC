import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ContenidoEditor from './ContenidoEditor'

const DEFAULTS: Record<string, string> = {
  hero_titulo: 'Pequeños Momentos de Calma',
  hero_subtitulo: 'Un camino de crianza consciente a través de la aromaterapia, la respiración y la filosofía holística.',
  hero_imagen: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&h=1080&fit=crop&auto=format',
  sobre_nombre: 'Eugenia',
  sobre_bio1: 'Soy terapeuta holística, instructora certificada de aromaterapia y respiración consciente. Llevo más de ocho años acompañando a familias en el camino hacia una crianza más presente y conectada con lo esencial.',
  sobre_bio2: 'Pequeños Momentos de Calma nació de mi propia experiencia como madre y del deseo de que cada familia tenga acceso a estas herramientas, desde casa, a su propio ritmo.',
  sobre_foto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&h=900&fit=crop&auto=format',
  sobre_familias: '500',
  testimonio1_nombre: 'Catalina S.',
  testimonio1_texto: 'La respiración 4-7-8 cambió por completo las noches en casa. Mi hijo de 5 años la pide solo antes de dormir.',
  testimonio1_curso: 'Respiración Consciente',
  testimonio2_nombre: 'Rodrigo M.',
  testimonio2_texto: 'Nunca pensé que los aceites esenciales fueran algo para mí, pero el curso me mostró cómo integrarlos con sentido.',
  testimonio2_curso: 'Aromaterapia',
  testimonio3_nombre: 'Fernanda L.',
  testimonio3_texto: 'El enfoque holístico me dio un marco de referencia que cambió mi manera de ver a mi hija. No solo sus conductas, sino a ella entera.',
  testimonio3_curso: 'Crianza Holística',
  contacto_email: 'hola@pequenosmomentoscalma.com',
  contacto_instagram: '@pmc.calma',
}

export default async function ContenidoPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/cursos')

  const rows = await prisma.siteContent.findMany()
  const saved: Record<string, string> = {}
  rows.forEach((r) => { saved[r.key] = r.value })

  const content: Record<string, string> = { ...DEFAULTS, ...saved }

  return (
    <main className="min-h-screen bg-[#F5F2EC]">
      <nav className="bg-white border-b border-[#D4CABC] px-6 py-4 flex justify-between items-center">
        <span className="font-playfair font-semibold text-[#2A3828]">
          pequeños momentos de calma · Admin
        </span>
        <Link href="/admin" className="text-sm font-nunito text-[#7EA87F] hover:underline">
          ← Volver
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-2">
          Contenido del sitio
        </h1>
        <p className="font-nunito text-[#5A6854] text-sm mb-8">
          Editá el contenido que aparece en la página principal.
        </p>
        <ContenidoEditor content={content} />
      </div>
    </main>
  )
}