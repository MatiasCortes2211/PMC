import type { Metadata } from 'next'
import { Playfair_Display, Nunito } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: {
    default: 'Pequeños Momentos de Calma',
    template: '%s | Pequeños Momentos de Calma',
  },
  description: 'Crianza consciente a través de la aromaterapia y la respiración holística. Cursos online para familias y educadores.',
  keywords: ['aromaterapia', 'crianza consciente', 'respiración', 'bienestar infantil', 'cursos online'],
  authors: [{ name: 'Pequeños Momentos de Calma' }],
  openGraph: {
    title: 'Pequeños Momentos de Calma',
    description: 'Crianza consciente a través de la aromaterapia y la respiración holística.',
    url: 'https://pmc-snowy.vercel.app',
    siteName: 'Pequeños Momentos de Calma',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${nunito.variable} bg-[#F5F2EC]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}