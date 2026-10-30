'use client'

import { useState } from 'react'
import { generateReactHelpers } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export type PdfAttachment = {
  id?: string
  name: string
  url: string
}

type Props = {
  files: PdfAttachment[]
  onChange: (files: PdfAttachment[]) => void
  label?: string
  maxFiles?: number
}

export default function PdfUploader({
  files,
  onChange,
  label = 'Material PDF adjunto (hasta 3 archivos de 16MB)',
  maxFiles = 3,
}: Props) {
  const [error, setError] = useState('')
  const [manualName, setManualName] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [showManual, setShowManual] = useState(false)

  const { startUpload, isUploading } = useUploadThing('pdfUploader', {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const newFiles: PdfAttachment[] = res.map((f) => ({
          name: f.name,
          url: (f as any).ufsUrl || f.url,
        }))
        const combined = [...files, ...newFiles].slice(0, maxFiles)
        onChange(combined)
        setError('')
      }
    },
    onUploadError: (err) => {
      setError(err.message || 'Error al subir el archivo PDF')
    },
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) return
    setError('')

    const availableSlots = maxFiles - files.length
    if (selectedFiles.length > availableSlots) {
      setError(`Solo podés agregar hasta ${maxFiles} archivos en total.`)
      return
    }

    // Verify they are PDFs
    const invalid = selectedFiles.find(f => !f.type.includes('pdf') && !f.name.toLowerCase().endsWith('.pdf'))
    if (invalid) {
      setError('Solo se admiten archivos en formato PDF.')
      return
    }

    await startUpload(selectedFiles)
    e.target.value = ''
  }

  function handleRemove(index: number) {
    const updated = files.filter((_, i) => i !== index)
    onChange(updated)
  }

  function handleAddManual() {
    if (!manualUrl.trim()) return
    if (files.length >= maxFiles) {
      setError(`Límite máximo de ${maxFiles} archivos alcanzado.`)
      return
    }
    const name = manualName.trim() || 'Documento PDF'
    onChange([...files, { name, url: manualUrl.trim() }])
    setManualName('')
    setManualUrl('')
    setShowManual(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-nunito text-[#2A3828]">
          {label}
        </label>
        <span className="text-xs font-nunito text-[#9A9488]">
          {files.length}/{maxFiles}
        </span>
      </div>

      {/* Lista de archivos actuales */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={file.id || file.url || idx}
              className="flex items-center justify-between gap-3 bg-[#F5F2EC] border border-[#D4CABC] rounded-lg px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-red-500 font-bold text-xs uppercase px-1.5 py-0.5 bg-red-100 rounded">
                  PDF
                </span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-nunito text-[#2A3828] hover:text-[#7EA87F] hover:underline truncate max-w-xs md:max-w-md text-xs sm:text-sm"
                  title={file.name}
                >
                  {file.name}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-[#9A9488] hover:text-red-500 p-1 transition-colors text-xs"
                title="Eliminar archivo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón de subida si no superó el límite */}
      {files.length < maxFiles && (
        <div className="space-y-2">
          <label
            className={`flex items-center justify-center gap-2 border-2 border-dashed border-[#D4CABC] rounded-lg py-3 cursor-pointer hover:border-[#7EA87F] transition-colors ${
              isUploading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFile}
              disabled={isUploading}
              className="hidden"
            />
            <span className="text-sm font-nunito text-[#5A6854]">
              {isUploading
                ? 'Subiendo archivo(s)...'
                : '📄 Subir PDF desde tu equipo'}
            </span>
          </label>

          {!showManual ? (
            <button
              type="button"
              onClick={() => setShowManual(true)}
              className="text-xs font-nunito text-[#7EA87F] hover:underline"
            >
              + O ingresar URL manual
            </button>
          ) : (
            <div className="p-3 bg-white border border-[#D4CABC] rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Nombre del documento (ej: Guía de estudio)"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full border border-[#D4CABC] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7EA87F]"
              />
              <input
                type="url"
                placeholder="URL del PDF (https://...)"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="w-full border border-[#D4CABC] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7EA87F]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddManual}
                  disabled={!manualUrl.trim()}
                  className="bg-[#2A3828] text-white px-3 py-1 rounded text-xs hover:bg-[#3a4f38] transition-colors disabled:opacity-50"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setShowManual(false)}
                  className="text-xs text-[#9A9488] hover:text-[#2A3828]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

