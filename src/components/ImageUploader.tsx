'use client'

import { useState } from 'react'
import { generateReactHelpers } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label = 'Imagen' }: Props) {
  const [error, setError] = useState('')

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
        if (res?.[0]?.ufsUrl) {
        onChange(res[0].ufsUrl)
        }
    },
    onUploadError: () => {
      setError('Error al subir la imagen')
    },
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    await startUpload([file])
  }

  return (
    <div>
      <label className="block text-sm font-nunito text-[#2A3828] mb-1">{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[#D4CABC]">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#9A9488] hover:text-red-500 border border-[#D4CABC] text-xs"
            >
              ✕
            </button>
          </div>
        )}
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-[#D4CABC] rounded-lg py-3 cursor-pointer hover:border-[#7EA87F] transition-colors ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={isUploading}
            className="hidden"
          />
          <span className="text-sm font-nunito text-[#5A6854]">
            {isUploading ? 'Subiendo...' : '📷 Subir imagen'}
          </span>
        </label>
        <div>
          <label className="block text-xs font-nunito text-[#9A9488] mb-1">O pegá una URL</label>
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full border border-[#D4CABC] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7EA87F]"
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  )
}