import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getSizePrice, formatProductName, DEFAULT_SIZE } from '../assets/assets'

const PANEL_W = 300
const GAP = 16

// Amazon-style quick look: hovering a card floats an enlarged preview beside it.
// Pointer-precision only — touch devices never trigger it.
const HoverPreview = ({ product, anchorRect }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!anchorRect) return null

  // Prefer the right side; flip left when there isn't room.
  const fitsRight = anchorRect.right + GAP + PANEL_W < window.innerWidth
  const left = fitsRight ? anchorRect.right + GAP : anchorRect.left - GAP - PANEL_W
  const panelH = PANEL_W * 1.45
  const top = Math.min(
    Math.max(12, anchorRect.top + anchorRect.height / 2 - panelH / 2),
    window.innerHeight - panelH - 12
  )

  const { price, originalPrice } = getSizePrice(DEFAULT_SIZE, product.subCategory)

  return createPortal(
    <div
      className='fixed z-[60] pointer-events-none bg-white shadow-2xl border border-gray-200 overflow-hidden'
      style={{
        left, top, width: PANEL_W,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)',
        transition: 'opacity 160ms ease-out, transform 160ms ease-out',
      }}
    >
      <div className='aspect-[333/461] bg-gray-100'>
        <img src={product.image[0]} alt='' className='w-full h-full object-cover' />
      </div>
      <div className='p-3'>
        <p className='text-sm leading-snug line-clamp-2'>{formatProductName(product)}</p>
        <div className='flex items-center gap-2 mt-1.5'>
          {originalPrice > price && <span className='text-xs text-gray-400 line-through'>RS.{originalPrice}</span>}
          <span className='text-sm'>RS.{price}.00</span>
        </div>
        <p className='text-[11px] text-gray-400 mt-1'>{product.sizes?.join(' · ')}</p>
      </div>
    </div>,
    document.body
  )
}

// Wraps a card and supplies hover state + the anchor rectangle.
export const useHoverPreview = () => {
  const ref = useRef(null)
  const [rect, setRect] = useState(null)
  const timer = useRef(null)

  const supportsHover = typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const onEnter = () => {
    if (!supportsHover) return
    timer.current = setTimeout(() => {
      if (ref.current) setRect(ref.current.getBoundingClientRect())
    }, 320)
  }

  const onLeave = () => {
    clearTimeout(timer.current)
    setRect(null)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return { ref, rect, onEnter, onLeave }
}

export default HoverPreview
