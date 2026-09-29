import React, { useEffect, useRef, useState } from 'react'
import { CUSTOM_SIZES, CUSTOM_POSTER_TYPES, getSizePrice } from '../assets/assets'
import { UploadIcon, WhatsappIcon, CloseIcon, CheckIcon } from './icons/NavIcons'

export const WHATSAPP_NUMBER = '918870333236'

// Printable area in inches, used to work out the true DPI of the artwork.
const SIZE_INCHES = {
  A6: [4.13, 5.83], A5: [5.83, 8.27], A4: [8.27, 11.69], A3: [11.69, 16.54], 'A3+': [12.99, 18.37],
}

// Files go to the studio exactly as the shopper picked them — never resized,
// re-encoded or cropped — so nothing is lost: no softening, no colour shift, and
// an animated GIF keeps every frame.
const CustomPosterSender = ({ defaultSize = 'A4', compact = false }) => {

  const [type, setType] = useState(CUSTOM_POSTER_TYPES[0])
  const [picks, setPicks] = useState([])          // { file, url, dimensions }
  const [size, setSize] = useState(defaultSize)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const needed = type.images
  const ready = picks.length === needed

  // Object URLs are revoked as soon as they are replaced — nothing is kept.
  const revokeAll = (list) => list.forEach(p => URL.revokeObjectURL(p.url))
  useEffect(() => () => revokeAll(picks), [picks])

  const measure = (pick) => {
    const probe = new Image()
    probe.onload = () => setPicks(prev => prev.map(p => (
      p.url === pick.url ? { ...p, dimensions: { width: probe.naturalWidth, height: probe.naturalHeight } } : p
    )))
    probe.src = pick.url
  }

  const pickFiles = (e) => {
    const chosen = Array.from(e.target.files || [])
    e.target.value = ''
    if (chosen.length === 0) return

    setSent(false)
    setError('')
    setPicks(prev => {
      const room = Math.max(0, needed - prev.length)
      const added = chosen.slice(0, room).map(file => ({ file, url: URL.createObjectURL(file), dimensions: null }))
      added.forEach(measure)
      if (chosen.length > room) setError(`${type.name} takes ${needed} image${needed > 1 ? 's' : ''} — the extra ones were left out.`)
      return [...prev, ...added]
    })
  }

  const removeAt = (index) => {
    setPicks(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
    setSent(false)
  }

  const chooseType = (next) => {
    if (next.id === type.id) return
    setType(next)
    setSent(false)
    setError('')
    // Keep as many images as the new kind can use.
    setPicks(prev => {
      const keep = prev.slice(0, next.images)
      revokeAll(prev.slice(next.images))
      return keep
    })
  }

  // The sharpest-to-softest read across every picked image.
  const quality = (() => {
    const measured = picks.filter(p => p.dimensions)
    if (measured.length === 0) return null
    const [wIn, hIn] = SIZE_INCHES[size] || SIZE_INCHES.A4
    const dpi = Math.min(...measured.map(({ dimensions }) => {
      const longEdge = Math.max(dimensions.width, dimensions.height)
      const shortEdge = Math.min(dimensions.width, dimensions.height)
      return Math.floor(Math.min(shortEdge / wIn, longEdge / hIn))
    }))
    if (dpi >= 300) return { dpi, tone: 'good', label: `Print-ready — ${dpi} DPI at ${size}` }
    if (dpi >= 180) return { dpi, tone: 'ok', label: `Usable — ${dpi} DPI at ${size}, slightly soft up close` }
    return { dpi, tone: 'poor', label: `Low resolution — ${dpi} DPI at ${size}. A bigger file prints sharper.` }
  })()

  const buildMessage = () => {
    const { price } = getSizePrice(size, 'Single')
    return [
      `Hi Sketchover! I would like to order a ${type.name}:`,
      '',
      `• Type: ${type.name}`,
      `• Size: ${size}`,
      `• Price: ₹${price}`,
      ...picks.map((p, i) => `• Image ${i + 1}: ${p.file.name}${p.dimensions ? ` (${p.dimensions.width} × ${p.dimensions.height} px)` : ''}`),
      '',
    ].join('\n')
  }

  // Each download gets its own short-lived URL. Reusing the preview URL risks
  // it being revoked while the browser is still writing the file out.
  const downloadOriginals = () => {
    picks.forEach((pick) => {
      const url = URL.createObjectURL(pick.file)
      const link = document.createElement('a')
      link.href = url
      link.download = pick.file.name
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    })
  }

  const send = async () => {
    if (!ready) return
    setError('')
    const text = buildMessage()
    const files = picks.map(p => p.file)
    const shareData = { files, title: `Sketchover ${type.name}`, text }

    // Phones can hand WhatsApp the original files directly.
    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        setSent(true)
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
        setError('Sharing was blocked — sending the files the other way instead.')
      }
    }

    // Everywhere else: hand over the untouched files, then open the chat.
    downloadOriginals()
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text + `Attaching the ${needed > 1 ? 'images' : 'image'} I just saved.`)}`,
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
            Pick what you want made, add your photos, and send them straight to Sketchover on WhatsApp. Files go
            across exactly as they are — full resolution, original frames — so nothing is lost before it is printed.
          </p>
        </>
      )}

      {/* What kind of personalised print */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5'>
        {CUSTOM_POSTER_TYPES.map(option => {
          const active = option.id === type.id
          return (
            <button
              key={option.id}
              type='button'
              onClick={() => chooseType(option)}
              aria-pressed={active}
              className={`text-left px-3 py-3 border transition-colors ${
                active ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
              }`}
            >
              <p className='text-xs sm:text-sm font-medium flex items-center gap-1.5'>
                {option.name}
                {active && <CheckIcon className='w-3.5 h-3.5 ml-auto' />}
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-1 leading-snug ${active ? 'text-white/75' : 'text-gray-500'}`}>
                {option.blurb}
              </p>
              <p className={`text-[10px] mt-1.5 ${active ? 'text-white/60' : 'text-gray-400'}`}>
                {option.images} image{option.images > 1 ? 's' : ''}
              </p>
            </button>
          )
        })}
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        multiple={needed > 1}
        hidden
        onChange={pickFiles}
      />

      {picks.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          className='w-full border-2 border-dashed border-gray-300 hover:border-black transition-colors py-10 flex flex-col items-center gap-3 text-gray-500 hover:text-black'
        >
          <UploadIcon className='w-7 h-7' />
          <span className='text-sm'>
            {needed > 1 ? `Choose your ${needed} images` : 'Choose your image'}
          </span>
          <span className='text-[11px] text-gray-400'>JPG, PNG, WEBP or GIF — the original file is sent, untouched</span>
        </button>
      ) : (
        <div className='border border-gray-300'>
          <div className='p-5'>
            <div className='flex flex-wrap gap-3'>
              {picks.map((pick, index) => (
                <div key={pick.url} className='relative w-24 sm:w-28'>
                  <img src={pick.url} alt={pick.file.name} className='w-full aspect-[333/461] object-cover bg-gray-100' />
                  <button
                    onClick={() => removeAt(index)}
                    aria-label={`Remove ${pick.file.name}`}
                    className='absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 text-gray-600 hover:text-brand flex items-center justify-center'
                  >
                    <CloseIcon className='w-3 h-3' />
                  </button>
                  {needed > 1 && (
                    <span className='absolute bottom-0 left-0 bg-black text-white text-[10px] px-2 py-0.5'>{index + 1}</span>
                  )}
                  <p className='text-[10px] text-gray-500 mt-1 truncate'>{pick.file.name}</p>
                </div>
              ))}

              {picks.length < needed && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className='w-24 sm:w-28 aspect-[333/461] border-2 border-dashed border-gray-300 hover:border-black transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-black'
                >
                  <UploadIcon className='w-5 h-5' />
                  <span className='text-[10px] text-center px-1'>
                    {needed - picks.length} more
                  </span>
                </button>
              )}
            </div>

            <div className='mt-5 flex flex-wrap items-end gap-x-8 gap-y-4'>
              <div>
                <p className='text-[11px] text-gray-500 mb-1.5'>Print size</p>
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
              </div>

              <div className='flex items-center gap-2'>
                {originalPrice > price && <span className='text-xs text-gray-400 line-through'>RS.{originalPrice}</span>}
                <span className='text-sm'>RS.{price}.00</span>
              </div>
            </div>

            {quality && (
              <p className={`text-[11px] mt-3 ${
                quality.tone === 'good' ? 'text-green-700' : quality.tone === 'ok' ? 'text-gray-600' : 'text-brand'
              }`}>
                {quality.label}
              </p>
            )}
          </div>

          <div className='px-5 pb-5'>
            {sent ? (
              <div className='flex items-center gap-3 border border-green-600 bg-green-50 px-4 py-3'>
                <CheckIcon className='w-4 h-4 text-green-700 shrink-0' />
                <div className='text-sm'>
                  <p className='text-green-800'>{type.name} sent to Sketchover on WhatsApp.</p>
                  <button onClick={() => setPicks([])} className='text-green-700/80 text-xs underline mt-0.5'>Send another</button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={send}
                  disabled={!ready}
                  className='w-full bg-whatsapp text-white py-3 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  <WhatsappIcon className='w-4 h-4' />
                  {ready
                    ? `Send ${type.name} on WhatsApp`
                    : `Add ${needed - picks.length} more image${needed - picks.length > 1 ? 's' : ''}`}
                </button>
                <p className='text-[11px] text-gray-400 mt-2 text-center'>
                  On a phone the {needed > 1 ? 'images are' : 'image is'} attached for you. On a computer
                  {needed > 1 ? ' they download' : ' it downloads'} first, then attach in the chat.
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
