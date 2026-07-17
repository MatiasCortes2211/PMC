'use client'

import { useRouter } from 'next/navigation'

export default function BotonVolver() {
  const router = useRouter()

  return (
    <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-nunito font-semibold text-[#5A6854] hover:text-[#2A3828] bg-[#EDE8DF] hover:bg-[#D4CABC] px-3 py-1.5 rounded-lg transition-colors"
    >
        ← Volver
    </button>
  )
}