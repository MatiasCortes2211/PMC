import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const catStyle: Record<string, string> = {
  Aromaterapia: 'bg-[#D4E4C8] text-[#2A3828]',
  Respiración: 'bg-[#A8C4A2] text-[#2A3828]',
  Crianza: 'bg-[#EDE8DF] text-[#5A6854]',
}

const fmt = (p: number) => `$${p.toLocaleString('es-AR')}`

export default async function HomePage() {
  const session = await auth()
  const cursos = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EC]/95 backdrop-blur-sm border-b border-[rgba(42,56,40,0.1)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#7EA87F] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#F5F2EC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3s2 0 7 8c5-8 7-8 7-8M12 11v10" />
              </svg>
            </div>
            <span className="font-playfair font-semibold text-[#2A3828] text-[13px] leading-tight tracking-wide">
              Pequeños<br />Momentos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Cursos', href: '/cursos' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/cursos"
                className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">
                Mis cursos
              </Link>
            ) : (
              <Link href="/login"
                className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2A3828]">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&h=1080&fit=crop&auto=format"
            alt="Naturaleza serena"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A3828]/65 via-[#2A3828]/40 to-[#F5F2EC]" />
        </div>
        <div className="relative text-center px-6 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-[#D4E4C8]/25 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4E4C8]/40">
              <span className="text-sm font-nunito text-[#D4E4C8] font-semibold">🌿 Crianza Holística</span>
            </div>
          </div>
          <h1 className="font-playfair text-5xl md:text-[5.5rem] font-bold text-[#F5F2EC] leading-[1.08] mb-6"
            style={{ textShadow: '0 2px 24px rgba(42,56,40,0.55)' }}>
            Pequeños<br /><em className="italic text-[#D4E4C8]">Momentos</em><br />de Calma
          </h1>
          <p className="font-nunito text-lg md:text-xl text-[#F5F2EC] mb-10 leading-relaxed max-w-xl mx-auto"
            style={{ textShadow: '0 1px 8px rgba(42,56,40,0.5)' }}>
            Un camino de crianza consciente a través de la aromaterapia, la respiración y la filosofía holística.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cursos"
              className="px-8 py-3.5 bg-[#7EA87F] text-[#F5F2EC] font-nunito font-bold rounded-full hover:bg-[#5A6854] transition-colors text-base shadow-lg">
              Ver cursos
            </Link>
            <a href="#about"
              className="px-8 py-3.5 bg-[#D4E4C8]/20 backdrop-blur-sm text-[#F5F2EC] font-nunito font-semibold rounded-full hover:bg-[#D4E4C8]/30 transition-colors text-base border border-[#D4E4C8]/40">
              Conocer más
            </a>
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section id="about" className="pt-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#7EA87F]" />
            <span className="text-[#7EA87F] font-nunito text-sm font-bold uppercase tracking-widest">Nuestra filosofía</span>
            <div className="w-8 h-px bg-[#7EA87F]" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2A3828] leading-tight mb-6">
            ¿Qué es <em className="italic text-[#5A6854]">Pequeños<br />Momentos de Calma</em>?
          </h2>
          <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-4">
            Somos un espacio de aprendizaje y acompañamiento para familias que buscan criar desde la consciencia. Nuestra propuesta integra la sabiduría de la filosofía holística con herramientas prácticas como la aromaterapia y la respiración consciente.
          </p>
          <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-8">
            Creemos que los pequeños momentos cotidianos — el ritual de la noche, el abrazo de la mañana, la respiración compartida — son la verdadera base de una crianza amorosa y conectada.
          </p>
          <Link href="/cursos"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#7EA87F] text-[#F5F2EC] font-nunito font-bold rounded-full hover:bg-[#5A6854] transition-colors text-base shadow-sm">
            Explorar cursos →
          </Link>
        </div>

        <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden bg-[#D4CABC] mb-24">
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=700&fit=crop&auto=format"
            alt="Naturaleza y calma"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quién soy */}
        <div className="grid md:grid-cols-2 gap-16 items-center pb-24">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#5A6854]" />
              <span className="text-[#5A6854] font-nunito text-sm font-bold uppercase tracking-widest">Quién soy</span>
            </div>
            <h2 className="font-playfair text-4xl font-bold text-[#2A3828] leading-tight mb-5">
              Hola, soy <em className="italic text-[#5A6854]">Eugenia</em>
            </h2>
            <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-4">
              Soy terapeuta holística, instructora certificada de aromaterapia y respiración consciente. Llevo más de ocho años acompañando a familias en el camino hacia una crianza más presente y conectada con lo esencial.
            </p>
            <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-8">
              Pequeños Momentos de Calma nació de mi propia experiencia como madre y del deseo de que cada familia tenga acceso a estas herramientas, desde casa, a su propio ritmo.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Aromaterapia', 'Respiración consciente', 'Crianza holística'].map(tag => (
                <span key={tag} className="text-xs font-nunito font-semibold px-3 py-1.5 bg-[#D4E4C8] text-[#2A3828] rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-[#D4CABC]">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&h=900&fit=crop&auto=format"
                alt="Eugenia"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-4 shadow-xl border border-[rgba(42,56,40,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4E4C8] flex items-center justify-center">
                  <span className="text-[#5A6854]">♥</span>
                </div>
                <div>
                  <div className="font-playfair text-lg font-bold text-[#2A3828]">+500</div>
                  <div className="text-[#9A9488] font-nunito text-xs">familias acompañadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { emoji: '🌿', title: 'Aromaterapia', desc: 'Aceites esenciales cuidadosamente seleccionados para crear ambientes de calma y fortalecer el vínculo familiar.' },
            { emoji: '🌬️', title: 'Respiración Consciente', desc: 'Técnicas adaptadas para cada etapa del desarrollo que regulan el sistema nervioso y cultivan la presencia.' },
            { emoji: '✨', title: 'Crianza Holística', desc: 'Una filosofía que ve al niño como un ser completo: cuerpo, mente, emoción y espíritu.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-[#EDE8DF]/60 rounded-2xl p-6 border border-[rgba(42,56,40,0.07)]">
              <div className="w-12 h-12 rounded-full bg-[#D4E4C8] flex items-center justify-center mb-4 text-xl">
                {emoji}
              </div>
              <h3 className="font-playfair text-[#2A3828] text-xl font-semibold mb-2">{title}</h3>
              <p className="font-nunito text-[#9A9488] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cursos */}
      <section className="py-24 bg-[#EDE8DF]/40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-px bg-[#5A6854]" />
                <span className="text-[#5A6854] font-nunito text-sm font-bold uppercase tracking-widest">Aprende a tu ritmo</span>
              </div>
              <h2 className="font-playfair text-4xl font-bold text-[#2A3828]">Nuestros cursos</h2>
            </div>
            <Link href="/cursos" className="flex items-center gap-2 text-[#7EA87F] font-nunito font-bold hover:gap-3 transition-all">
              Ver todos →
            </Link>
          </div>
          {cursos.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-nunito text-[#9A9488]">Próximamente nuevos cursos disponibles.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {cursos.map(c => (
                <Link key={c.id} href={`/cursos/${c.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(42,56,40,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                    {c.imageUrl && (
                      <div className="h-44 bg-[#D4CABC] overflow-hidden">
                        <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-playfair text-[#2A3828] font-semibold text-lg leading-snug mb-2">{c.title}</h3>
                      <p className="text-[#9A9488] font-nunito text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{c.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-[rgba(42,56,40,0.07)]">
                        <span className="font-playfair font-bold text-[#2A3828] text-xl">{fmt(c.price)}</span>
                        <span className="flex items-center gap-1.5 text-[#7EA87F] font-nunito font-bold text-sm">
                          Ver curso →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#7EA87F]" />
            <span className="text-[#7EA87F] font-nunito text-sm font-bold uppercase tracking-widest">Testimonios</span>
            <div className="w-8 h-px bg-[#7EA87F]" />
          </div>
          <h2 className="font-playfair text-4xl font-bold text-[#2A3828]">Lo que dicen las familias</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Catalina S.', text: 'La respiración 4-7-8 cambió por completo las noches en casa. Mi hijo de 5 años la pide solo antes de dormir.', course: 'Respiración Consciente' },
            { name: 'Rodrigo M.', text: 'Nunca pensé que los aceites esenciales fueran algo para mí, pero el curso me mostró cómo integrarlos con sentido.', course: 'Aromaterapia' },
            { name: 'Fernanda L.', text: 'El enfoque holístico me dio un marco de referencia que cambió mi manera de ver a mi hija. No solo sus conductas, sino a ella entera.', course: 'Crianza Holística' },
          ].map(({ name, text, course }) => (
            <div key={name} className="bg-white rounded-2xl p-6 border border-[rgba(42,56,40,0.1)]">
              <div className="flex gap-0.5 mb-4">
                {Array(5).fill(0).map((_, i) => <span key={i} className="text-[#A8C4A2]">★</span>)}
              </div>
              <p className="font-nunito text-[#2A3828] text-sm leading-relaxed mb-4 italic">"{text}"</p>
              <div>
                <div className="font-nunito font-bold text-[#2A3828] text-sm">{name}</div>
                <div className="font-nunito text-[#9A9488] text-xs mt-0.5">{course}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-[#2A3828] rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10 text-[#D4E4C8] text-9xl font-playfair">🌿</div>
          <h2 className="font-playfair text-4xl font-bold text-[#D4E4C8] mb-4 relative">Comienza tu camino hoy</h2>
          <p className="font-nunito text-[#A8C4A2]/80 text-lg mb-8 relative max-w-xl mx-auto">
            Únete a cientos de familias que ya están transformando su forma de criar, un pequeño momento a la vez.
          </p>
          <Link href={session ? '/cursos' : '/register'}
            className="px-10 py-4 bg-[#7EA87F] text-[#F5F2EC] font-nunito font-bold rounded-full hover:bg-[#A8C4A2] transition-colors text-base shadow-lg relative inline-block">
            {session ? 'Ver cursos' : 'Crear cuenta gratis'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A3828] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#7EA87F] flex items-center justify-center">
                  <span className="text-[#F5F2EC] text-xs">🌿</span>
                </div>
                <span className="font-playfair font-semibold text-[#D4E4C8] text-sm">
                  Pequeños Momentos de Calma
                </span>
              </div>
              <p className="font-nunito text-[#A8C4A2]/70 text-sm max-w-xs leading-relaxed text-center md:text-left">
                Crianza consciente a través de la aromaterapia y la respiración holística.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center md:items-start">
                <h4 className="font-nunito text-[#D4E4C8] font-bold text-sm mb-4">Explorar</h4>
                <div className="flex flex-col items-center md:items-start gap-2.5">
                  {[{ label: 'Inicio', href: '/' }, { label: 'Cursos', href: '/cursos' }].map(({ label, href }) => (
                    <Link key={href} href={href} className="font-nunito text-sm text-[#A8C4A2]/60 hover:text-[#D4E4C8] transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h4 className="font-nunito text-[#D4E4C8] font-bold text-sm mb-4">Contacto</h4>
                <div className="flex flex-col items-center md:items-start gap-3">
                  <a href="mailto:hola@pequenosmomentoscalma.com"
                    className="font-nunito text-sm text-[#A8C4A2]/60 hover:text-[#D4E4C8] transition-colors">
                    hola@pequenosmomentoscalma.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#D4E4C8]/10 pt-6 text-center text-[#A8C4A2]/40 font-nunito text-xs">
            © 2026 Pequeños Momentos de Calma. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}