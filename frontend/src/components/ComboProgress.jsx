import React, { useContext } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { findComboTier } from '../assets/assets'
import { CloseIcon } from './icons/NavIcons'

// Sticky tracker for the combo the shopper picked: how many posters are in,
// how many are left, and a way straight back to the catalogue.
const ComboProgress = () => {
  const { activeCombo, clearCombo, getComboQty, currency } = useContext(ShopContext)
  const location = useLocation()

  if (!activeCombo) return null
  // Stay out of the way during checkout.
  if (['/cart', '/shipping', '/place-order', '/order-placed'].includes(location.pathname)) return null

  const qty = getComboQty()
  const remaining = Math.max(0, activeCombo.get - qty)
  const pct = Math.min(100, Math.round((qty / activeCombo.get) * 100))
  const done = remaining === 0
  const effective = activeCombo.effective || findComboTier(activeCombo.get)?.effective

  return createPortal(
    <div className='fixed bottom-0 inset-x-0 z-[75] bg-neutral-950 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.25)]'>
      <div className='h-1 bg-white/15'>
        <div
          className={`h-full transition-all duration-500 ${done ? 'bg-green-500' : 'bg-brand'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className='px-4 sm:px-[5vw] lg:px-[9vw] py-2.5 flex items-center gap-3 sm:gap-5'>
        <div className='min-w-0 flex-1'>
          <p className='text-xs sm:text-sm font-medium truncate'>
            Buy {activeCombo.buy} &rarr; Get {activeCombo.get}
            <span className='text-white/60 font-normal'> · {qty} of {activeCombo.get} added</span>
          </p>
          <p className={`text-[11px] ${done ? 'text-green-400' : 'text-white/60'}`}>
            {done
              ? `Combo unlocked — ${activeCombo.get - activeCombo.buy} posters free at checkout`
              : `Pick ${remaining} more at about ₹${effective} each`}
          </p>
        </div>

        <Link
          to={done ? '/cart' : '/collection'}
          className={`shrink-0 text-xs sm:text-sm px-4 sm:px-6 py-2 transition-colors ${
            done ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white text-black hover:bg-brand hover:text-white'
          }`}
        >
          {done ? 'View cart' : 'Add posters'}
        </Link>

        <button onClick={clearCombo} aria-label='Cancel combo' className='shrink-0 p-2 -mr-2 text-white/50 hover:text-white'>
          <CloseIcon className='w-4 h-4' />
        </button>
      </div>
    </div>,
    document.body
  )
}

export default ComboProgress
