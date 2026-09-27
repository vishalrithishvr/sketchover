import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { CloseIcon, CheckIcon } from './icons/NavIcons'

const HIDDEN_ON = ['/cart', '/shipping', '/place-order', '/order-placed']

// Standing basket bar. It appears as soon as the first poster goes in and
// follows the shopper around the catalogue: what they have picked, how close
// the next combo is, and the way to the cart — so posters can be chosen from
// the listing pages instead of only in the cart.
const ComboProgress = () => {
  const {
    getCartCount, getCartAmount, getComboQty, getActiveComboTier, getNextComboTier,
    getComboDiscount, getNextComboSaving, currency, productsLoaded,
  } = useContext(ShopContext)
  const location = useLocation()

  const count = getCartCount()
  // Dismissing hides the bar until the basket changes again.
  const [dismissedAt, setDismissedAt] = useState(null)
  useEffect(() => {
    if (dismissedAt !== null && count !== dismissedAt) setDismissedAt(null)
  }, [count, dismissedAt])

  const hidden = !productsLoaded || count === 0 || dismissedAt !== null || HIDDEN_ON.includes(location.pathname)

  // "View cart" is the obvious next step — have its chunk ready.
  useEffect(() => { if (!hidden) import('../pages/Cart') }, [hidden])

  // Keep the page clear of the bar, and lift the WhatsApp button above it.
  useEffect(() => {
    const height = hidden ? '0px' : '74px'
    document.documentElement.style.setProperty('--cart-bar-h', height)
    document.body.style.paddingBottom = height
    return () => {
      document.documentElement.style.setProperty('--cart-bar-h', '0px')
      document.body.style.paddingBottom = ''
    }
  }, [hidden])

  if (hidden) return null

  const posters = getComboQty()
  const tier = getActiveComboTier()
  const next = getNextComboTier()
  const discount = getComboDiscount()
  const remaining = next ? next.get - posters : 0
  const pct = next ? Math.min(100, Math.round((posters / next.get) * 100)) : 100
  const nextSaving = getNextComboSaving()

  return createPortal(
    <div className='fixed bottom-0 inset-x-0 z-[75] bg-neutral-950 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.25)]'>
      <div className='h-1 bg-white/15'>
        <div
          className={`h-full transition-all duration-500 ${discount > 0 ? 'bg-green-500' : 'bg-brand'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className='px-4 sm:px-[5vw] lg:px-[9vw] py-2.5 flex items-center gap-3 sm:gap-5'>
        <div className='min-w-0 flex-1'>
          <p className='text-xs sm:text-sm font-medium truncate flex items-center gap-1.5'>
            {discount > 0 && <CheckIcon className='w-3.5 h-3.5 text-green-400 shrink-0' />}
            {count} {count === 1 ? 'poster' : 'posters'} in your cart
            <span className='text-white/60 font-normal'>· {currency}{getCartAmount() - discount}</span>
          </p>
          <p className={`text-[11px] ${discount > 0 ? 'text-green-400' : 'text-white/60'}`}>
            {discount > 0
              ? `Buy ${tier.buy} Get ${tier.get} applied — ${tier.get - tier.buy} free${next ? `. Add ${remaining} more for Buy ${next.buy} Get ${next.get}.` : ''}`
              : next
                ? `Add ${remaining} more and ${next.get - next.buy} come free${nextSaving > 0 ? ` — about ${currency}${nextSaving} off` : ''}`
                : 'Every combo unlocked'}
          </p>
        </div>

        <Link
          to='/cart'
          className={`shrink-0 text-xs sm:text-sm px-4 sm:px-6 py-2 transition-colors ${
            discount > 0 ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white text-black hover:bg-brand hover:text-white'
          }`}
        >
          View cart
        </Link>

        <button
          onClick={() => setDismissedAt(count)}
          aria-label='Hide basket bar'
          className='shrink-0 p-2 -mr-2 text-white/50 hover:text-white'
        >
          <CloseIcon className='w-4 h-4' />
        </button>
      </div>
    </div>,
    document.body
  )
}

export default ComboProgress
