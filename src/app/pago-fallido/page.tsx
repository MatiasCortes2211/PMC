import Link from 'next/link'

export default async function PagoFallidoPage({
  searchParams,
}: {
  searchParams: Promise<{ cursoId?: string }>
}) {
  const { cursoId } = await searchParams

  return (
    <main className="min-h-screen bg-[#F5F2EC] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-[#D4CABC] p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✕</span>
        </div>
        <h1 className="font-playfair text-3xl font-bold text-[#2A3828] mb-2">
          El pago no se completó
        </h1>
        <p className="font-nunito text-[#5A6854] mb-8">
          Hubo un problema con el pago. Podés intentarlo de nuevo.
        </p>
        {cursoId && (
          <Link
            href={`/cursos/${cursoId}`}
            className="block w-full bg-[#2A3828] text-[#F5F2EC] rounded-lg py-3 font-nunito font-bold hover:bg-[#3a4f38] transition-colors mb-3"
          >
            Volver al curso
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