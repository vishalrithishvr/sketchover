import React, { useEffect, useRef, useState } from 'react'
import { CUSTOM_SIZES, getSizePrice } from '../assets/assets'
import { UploadIcon, WhatsappIcon, CloseIcon, CheckIcon } from './icons/NavIcons'

export const WHATSAPP_NUMBER = '918870333236'

// Printable area in inches, used to work out the true DPI of the artwork.
const SIZE_INCHES = {
  A6: [4.13, 5.83], A5: [5.83, 8.27], A4: [8.27, 11.69], A3: [11.69, 16.54], 'A3+': [12.99, 18.37],
}

// The file goes to the studio exactly as the shopper picked it — never resized,
// re-encoded or cropped — so nothing is lost: no softening, no colour shift, and
// an animated GIF keeps every frame.
const CustomPosterSender = ({ defaultSize = 'A4', compact = false }) => {

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [dimensions, setDimensions] = useState(null)
  const [size, setSize] = useState(defaultSize)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  // Object URLs are revoked as soon as they are replaced — nothing is kept.
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const pick = (e) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(picked)
    setFile(picked)
    setPreviewUrl(url)
    setDimensions(null)
    setSent(false)
    setError('')

    // Raster images report their pixel size; anything else just skips the check.
    const probe = new Image()
    probe.onload = () => setDimensions({ width: probe.naturalWidth, height: probe.naturalHeight })
    probe.src = url
  }

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')
    setDimensions(null)
    setSent(false)
    setError('')
  }

  // How sharp this file will print at the chosen size.
  const quality = (() => {
    if (!dimensions) return null
    const [wIn, hIn] = SIZE_INCHES[size] || SIZE_INCHES.A4
    const longEdge = Math.max(dimensions.width, dimensions.height)
    const shortEdge = Math.min(dimensions.width, dimensions.height)
    const dpi = Math.floor(Math.min(shortEdge / wIn, longEdge / hIn))
    if (dpi >= 300) return { dpi, tone: 'good', label: `Print-ready — ${dpi} DPI at ${size}` }
    if (dpi >= 180) return { dpi, tone: 'ok', label: `Usable — ${dpi} DPI at ${size}, slightly soft up close` }
    return { dpi, tone: 'poor', label: `Low resolution — ${dpi} DPI at ${size}. A bigger file prints sharper.` }
  })()

  const buildMessage = () => {
    const { price } = getSizePrice(size, 'Single')
    return [
      'Hi Sketchover! I would like to order a custom poster:',
      '',
      `• Artwork: ${file.name}`,
      `• Size: ${size}`,
      `• Price: ₹${price}`,
      dimensions ? `• Image: ${dimensions.width} × ${dimensions.height} px` : '',
      '',
    ].filter(Boolean).join('\n')
  }

  const downloadOriginal = () => {
    const link = document.createElement('a')
    link.href = previewUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const send = async () => {
    if (!file) return
    setError('')
    const text = buildMessage()
    const shareData = { files: [file], title: 'Sketchover custom poster', text }

    // Phones can hand WhatsApp the original file directly.
    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        setSent(true)
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
        setError('Sharing was blocked — sending the file the other way instead.')
      }
    }

    // Everywhere else: hand over the untouched file, then open the chat.
    downloadOriginal()
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text + 'Attaching the image I just saved.')}`,
      '_blank'
    )
    setSent(true)
  }

  const { price, originalPrice } = getSizePrice(size, 'Single')

  return (
    <div className={compact ? '' : 'my-16'}>
      {!compact && (
        <>
          <p className='heading-font uppercase tracking-[0.06em] text-2xl sm:text-3xl text-center'>Send us your artwork</p>
          <p className='text-center text-xs sm:text-sm text-gray-500 mt-2 mb-8 max-w-xl mx-auto'>
            Pick your image and send it straight to Sketchover on WhatsApp. The file goes across exactly as
            it is — full resolution, original frames — so nothing is lost between your screen and the print.
          </p>
        </>
      )}

      <input ref={inputRef} type='file' accept='image/*' hidden onChange={pick} />

      {!file ? (
        <button
          onClick={() => inputRef.current?.click()}
          className='w-full border-2 border-dashed border-gray-300 hover:border-black transition-colors py-10 flex flex-col items-center gap-3 text-gray-500 hover:text-black'
        >
          <UploadIcon className='w-7 h-7' />
          <span className='text-sm'>Choose your image</span>
          <span className='text-[11px] text-gray-400'>JPG, PNG, WEBP or GIF — the original file is sent, untouched</span>
        </button>
      ) : (
        <div className='border border-gray-300'>
          <div className='flex flex-col sm:flex-row gap-5 p-5'>
            <div className='relative w-full sm:w-40 shrink-0'>
              <img src={previewUrl} alt={file.name} className='w-full aspect-[333/461] object-cover bg-gray-100' />
              <button
                onClick={clear}
                aria-label='Remove image'
                className='absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:text-brand flex items-center justify-center'
              >
                <CloseIcon className='w-3.5 h-3.5' />
              </button>
            </div>

            <div className='flex-1 min-w-0'>
              <p className='text-sm truncate'>{file.name}</p>
              <p className='text-[11px] text-gray-500 mt-1'>
                {(file.size / (1024 * 1024)).toFixed(1)} MB
                {dimensions && ` · ${dimensions.width} × ${dimensions.height} px`}
              </p>

              <p className='text-[11px] text-gray-500 mt-4 mb-1.5'>Print size</p>
              <div className='flex flex-wrap gap-2'>
                {CUSTOM_SIZES.map(option => (
                  <button
                    key={option}
                    onClick={() => setSize(option)}
                    className={`min-w-[52px] py-1.5 px-4 text-sm border transition-colors ${
                      option === size ? 'bg-gray-500 border-gray-500 text-white' : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className='flex items-center gap-2 mt-3'>
                {originalPrice > price && <span className='text-xs text-gray-400 line-through'>RS.{originalPrice}</span>}
                <span className='text-sm'>RS.{price}.00</span>
              </div>

              {quality && (
                <p className={`text-[11px] mt-3 ${
                  quality.tone === 'good' ? 'text-green-700' : quality.tone === 'ok' ? 'text-gray-600' : 'text-brand'
                }`}>
                  {quality.label}
                </p>
              )}
            </div>
          </div>

          <div className='px-5 pb-5'>
            {sent ? (
              <div className='flex items-center gap-3 border border-green-600 bg-green-50 px-4 py-3'>
                <CheckIcon className='w-4 h-4 text-green-700 shrink-0' />
                <div className='text-sm'>
                  <p className='text-green-800'>Sent to Sketchover on WhatsApp.</p>
                  <button onClick={clear} className='text-green-700/80 text-xs underline mt-0.5'>Send another image</button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={send}
                  className='w-full bg-whatsapp text-white py-3 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity'
                >
                  <WhatsappIcon className='w-4 h-4' />
                  Send to Sketchover on WhatsApp
                </button>
                <p className='text-[11px] text-gray-400 mt-2 text-center'>
                  On a phone the image is attached for you. On a computer it downloads first, then attach it in the chat.
                </p>
              </>
            )}
            {error && <p className='text-[11px] text-brand mt-2 text-center'>{error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomPosterSender
