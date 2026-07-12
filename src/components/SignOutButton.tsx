'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-nunito font-semibold text-[#9A9488] hover:text-[#2A3828] transition-colors"
    >
      Cerrar sesión
    </button>
  )
}