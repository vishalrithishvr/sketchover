import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { COMBO_TIERS } from '../assets/assets'
import { CheckIcon, ArrowRightIcon } from './icons/NavIcons'

// The combo ladder as the cart sees it: what has already been unlocked, what the
// next rung costs in posters, and what it is worth. The tiers and the per-poster
// figures are the ones printed on the studio's product-description sheet.
const ComboGuide = () => {
  const {
    currency, getComboQty, getComboDiscount, getActiveComboTier, getNextComboTier, getNextComboSaving,
  } = useContext(ShopContext)

  const qty = getComboQty()
  const discount = getComboDiscount()
  const tier = getActiveComboTier()
  const next = getNextComboTier()

  if (qty === 0) return null

  const remaining = next ? next.get - qty : 0
  const progress = next ? Math.min(100, Math.round((qty / next.get) * 100)) : 100
  const nextSaving = getNextComboSaving()

  return (
    <div className='border-2 border-dashed border-black p-4 sm:p-5 mb-7'>

      <div className='flex items-baseline justify-between gap-3'>
        <p className='heading-font tracking-[0.18em] text-sm sm:text-base'>COMBO&nbsp;&nbsp;OFFER</p>
        <span className='text-[11px] text-gray-500'>{qty} {qty === 1 ? 'poster' : 'posters'} in your cart</span>
      </div>

      {/* Where the basket stands right now */}
      {discount > 0 ? (
        <div className='flex items-start gap-2.5 mt-3'>
          <CheckIcon className='w-4 h-4 text-green-700 mt-0.5 shrink-0' />
          <p className='text-sm text-green-800'>
            Buy {tier.buy} Get {tier.get} is applied — {tier.get - tier.buy} posters free, {currency}{discount} off.
          </p>
        </div>
      ) : (
        <p className='text-sm mt-3'>
          You are <span className='text-brand font-medium'>{remaining} {remaining === 1 ? 'poster' : 'posters'}</span> away
          from your first combo.
        </p>
      )}

      {/* The next rung, and what it is worth */}
      {next && (
        <div className='mt-4'>
          <div className='flex items-center justify-between text-[11px] text-gray-500 mb-1.5'>
            <span>Next: Buy {next.buy} Get {next.get} — {next.get - next.buy} free</span>
            <span>{qty} / {next.get}</span>
          </div>
          <div className='h-2 bg-gray-200'>
            <div className='h-full bg-brand transition-all duration-500' style={{ width: `${progress}%` }} />
          </div>
          <p className='text-sm mt-2.5'>
            Add <span className='font-medium'>{remaining} more</span> and {next.get - next.buy} come free
            {nextSaving > 0 && <> — about <span className='text-brand font-medium'>{currency}{nextSaving} off</span></>}.
          </p>
        </div>
      )}

      {/* The full ladder, so the whole offer is visible from the cart */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4'>
        {COMBO_TIERS.map((t) => {
          const unlocked = qty >= t.get
          const isNext = next?.get === t.get
          return (
            <div
              key={t.buy}
              className={`px-3 py-2.5 text-left transition-colors ${
                unlocked ? 'bg-green-600 text-white'
                  : isNext ? 'bg-brand text-white'
                  : 'bg-neutral-900 text-white/90'
              }`}
            >
              <p className='flex items-center gap-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap'>
                BUY {t.buy}
                <span className={unlocked || isNext ? 'text-white' : 'text-brand'}>&rarr;</span>
                GET {t.get}
                {unlocked && <CheckIcon className='w-3.5 h-3.5 ml-auto' />}
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-0.5 ${unlocked || isNext ? 'text-white/90' : 'text-brand'}`}>
                +{t.get - t.buy} FREE posters
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-1 ${unlocked || isNext ? 'text-white/75' : 'text-white/60'}`}>
                {unlocked ? 'Unlocked' : `Just ₹${t.effective}/poster effective`}
              </p>
            </div>
          )
        })}
      </div>

      {next && (
        <Link
          to='/collection'
          className='mt-4 w-full bg-black text-white text-sm py-3 flex items-center justify-center gap-2 hover:bg-brand transition-colors'
        >
          Add {remaining} more {remaining === 1 ? 'poster' : 'posters'}
          <ArrowRightIcon className='w-4 h-4' />
        </Link>
      )}
    </div>
  )
}

export default ComboGuide
