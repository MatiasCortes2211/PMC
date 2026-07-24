import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import FormularioContacto from '@/components/FormularioContacto'
import Footer from '@/components/Footer'
import { Droplets, Wind, Heart, Leaf } from 'lucide-react'

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
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const rows = await prisma.siteContent.findMany()
  const saved: Record<string, string> = {}
  rows.forEach((r) => { saved[r.key] = r.value })

  const c = {
    hero_subtitulo: saved.hero_subtitulo ?? 'Un camino de crianza consciente a través de la aromaterapia, la respiración y la filosofía holística.',
    hero_imagen: saved.hero_imagen ?? 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&h=1080&fit=crop&auto=format',
    sobre_nombre: saved.sobre_nombre ?? 'Eugenia',
    sobre_bio1: saved.sobre_bio1 ?? 'Soy terapeuta holística, instructora certificada de aromaterapia y respiración consciente. Llevo más de ocho años acompañando a familias en el camino hacia una crianza más presente y conectada con lo esencial.',
    sobre_bio2: saved.sobre_bio2 ?? 'Pequeños Momentos de Calma nació de mi propia experiencia como madre y del deseo de que cada familia tenga acceso a estas herramientas, desde casa, a su propio ritmo.',
    sobre_foto: saved.sobre_foto ?? 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&h=900&fit=crop&auto=format',
    sobre_familias: saved.sobre_familias ?? '500',
    testimonio1_nombre: saved.testimonio1_nombre ?? 'Catalina S.',
    testimonio1_texto: saved.testimonio1_texto ?? 'La respiración 4-7-8 cambió por completo las noches en casa. Mi hijo de 5 años la pide solo antes de dormir.',
    testimonio1_curso: saved.testimonio1_curso ?? 'Respiración Consciente',
    testimonio2_nombre: saved.testimonio2_nombre ?? 'Rodrigo M.',
    testimonio2_texto: saved.testimonio2_texto ?? 'Nunca pensé que los aceites esenciales fueran algo para mí, pero el curso me mostró cómo integrarlos con sentido.',
    testimonio2_curso: saved.testimonio2_curso ?? 'Aromaterapia',
    testimonio3_nombre: saved.testimonio3_nombre ?? 'Fernanda L.',
    testimonio3_texto: saved.testimonio3_texto ?? 'El enfoque holístico me dio un marco de referencia que cambió mi manera de ver a mi hija. No solo sus conductas, sino a ella entera.',
    testimonio3_curso: saved.testimonio3_curso ?? 'Crianza Holística',
    contacto_email: saved.contacto_email ?? 'hola@pequenosmomentoscalma.com',
    contacto_instagram: saved.contacto_instagram ?? '@pmc.calma',
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] pt-16">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2A3828]">
          <img
            src={c.hero_imagen}
            alt="Naturaleza serena"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A3828]/65 via-[#2A3828]/40 to-[#F5F2EC]" />
        </div>
        <div className="relative text-center px-6 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-[#D4E4C8]/25 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4E4C8]/40">
              <span className="text-sm font-nunito text-[#D4E4C8] font-semibold">Crianza Holística</span>
            </div>
          </div>
          <h1 className="font-playfair text-5xl md:text-[5.5rem] font-bold text-[#F5F2EC] leading-[1.08] mb-6"
            style={{ textShadow: '0 2px 24px rgba(42,56,40,0.55)' }}>
            Pequeños<br /><em className="italic text-[#D4E4C8]">Momentos</em><br />de Calma
          </h1>
          <p className="font-nunito text-lg md:text-xl text-[#F5F2EC] mb-10 leading-relaxed max-w-xl mx-auto"
            style={{ textShadow: '0 1px 8px rgba(42,56,40,0.5)' }}>
            {c.hero_subtitulo}
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
              Hola, soy <em className="italic text-[#5A6854]">{c.sobre_nombre}</em>
            </h2>
            <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-4">
              {c.sobre_bio1}
            </p>
            <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-8">
              {c.sobre_bio2}
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
                src={c.sobre_foto}
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
                  <div className="font-playfair text-lg font-bold text-[#2A3828]">+{c.sobre_familias}</div>
                  <div className="text-[#9A9488] font-nunito text-xs">familias acompañadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: <Droplets className="w-6 h-6 text-[#5A6854]" />,
              title: 'Aromaterapia',
              desc: 'Aceites esenciales cuidadosamente seleccionados para crear ambientes de calma y fortalecer el vínculo familiar.'
            },
            {
              icon: <Wind className="w-6 h-6 text-[#5A6854]" />,
              title: 'Respiración Consciente',
              desc: 'Técnicas adaptadas para cada etapa del desarrollo que regulan el sistema nervioso y cultivan la presencia.'
            },
            {
              icon: <Heart className="w-6 h-6 text-[#5A6854]" />,
              title: 'Crianza Holística',
              desc: 'Una filosofía que ve al niño como un ser completo: cuerpo, mente, emoción y espíritu.'
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-[#EDE8DF]/60 rounded-2xl p-6 border border-[rgba(42,56,40,0.07)]">
              <div className="w-12 h-12 rounded-full bg-[#D4E4C8] flex items-center justify-center mb-4">
                {icon}
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
                      {c.category && (
                        <span className={`self-start text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full mb-3 ${
                          c.category === 'Aromaterapia' ? 'bg-[#D4E4C8] text-[#2A3828]' :
                          c.category === 'Respiración' ? 'bg-[#A8C4A2] text-[#2A3828]' :
                          'bg-[#EDE8DF] text-[#5A6854]'
                        }`}>
                          {c.category}
                        </span>
                      )}
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
            { name: c.testimonio1_nombre, text: c.testimonio1_texto, course: c.testimonio1_curso },
            { name: c.testimonio2_nombre, text: c.testimonio2_texto, course: c.testimonio2_curso },
            { name: c.testimonio3_nombre, text: c.testimonio3_texto, course: c.testimonio3_curso },
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

      {/* Blog */}
      <section className="py-24 bg-[#EDE8DF]/40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-px bg-[#5A6854]" />
                <span className="text-[#5A6854] font-nunito text-sm font-bold uppercase tracking-widest">Artículos</span>
              </div>
              <h2 className="font-playfair text-4xl font-bold text-[#2A3828]">Del blog</h2>
            </div>
            <Link href="/blog" className="flex items-center gap-2 text-[#7EA87F] font-nunito font-bold hover:gap-3 transition-all">
              Ver todos →
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-nunito text-[#9A9488]">Próximamente nuevos artículos.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(42,56,40,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                    {p.imageUrl && (
                      <div className="h-44 bg-[#D4CABC] overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {p.category && (
                          <span className={`text-xs font-nunito font-semibold px-2.5 py-0.5 rounded-full ${
                            p.category === 'Aromaterapia' ? 'bg-[#D4E4C8] text-[#2A3828]' :
                            p.category === 'Respiración' ? 'bg-[#A8C4A2] text-[#2A3828]' :
                            'bg-[#EDE8DF] text-[#5A6854]'
                          }`}>
                            {p.category}
                          </span>
                        )}
                        <span className="text-xs text-[#9A9488] font-nunito">🕐 {p.readTime} lectura</span>
                      </div>
                      <h3 className="font-playfair text-[#2A3828] font-semibold text-base leading-snug mb-2 flex-1">
                        {p.title}
                      </h3>
                      <p className="text-[#9A9488] font-nunito text-sm leading-relaxed mb-3 line-clamp-2">
                        {p.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#9A9488] font-nunito">
                        <span>{p.author}</span>
                        <span>{new Date(p.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Formulario de contacto */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#7EA87F]" />
                <span className="text-[#7EA87F] font-nunito text-sm font-bold uppercase tracking-widest">Contacto</span>
              </div>
              <h2 className="font-playfair text-4xl font-bold text-[#2A3828] leading-tight mb-5">
                ¿Tenés alguna<br /><em className="italic text-[#5A6854]">pregunta?</em>
              </h2>
              <p className="font-nunito text-[#9A9488] text-base leading-relaxed mb-8">
                Si tenés dudas sobre los cursos, querés saber si este camino es para vos, o simplemente querés decir hola — escribinos. Respondemos con cariño y sin apuro.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="font-nunito text-xs font-bold text-[#9A9488] uppercase tracking-widest mb-0.5">Correo</div>
                  <a href={`mailto:${c.contacto_email}`} className="font-nunito text-[#2A3828] text-sm font-semibold hover:text-[#7EA87F] transition-colors">
                    {c.contacto_email}
                  </a>
                </div>
                <div>
                  <div className="font-nunito text-xs font-bold text-[#9A9488] uppercase tracking-widest mb-0.5">Instagram</div>
                  <a href={`https://instagram.com/${c.contacto_instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="font-nunito text-[#2A3828] text-sm font-semibold hover:text-[#7EA87F] transition-colors">
                    {c.contacto_instagram}
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[rgba(42,56,40,0.1)] shadow-sm">
              <FormularioContacto />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-[#2A3828] rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10 text-[#D4E4C8]">
            <Leaf className="w-32 h-32" />
          </div>
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
      <Footer email={c.contacto_email} instagram={c.contacto_instagram} />
    </div>
  )
}