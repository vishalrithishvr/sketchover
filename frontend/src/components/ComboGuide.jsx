import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { COMBO_TIERS, getComboEffectivePrice } from '../assets/assets'
import { CheckIcon, ArrowRightIcon } from './icons/NavIcons'

// The combo ladder as the cart sees it. Each size runs its own ladder, so the
// panel reports one line per size in the basket: what it has earned, what the
// next rung needs, and what that rung is worth at that size's price.
const ComboGuide = () => {
  const { currency, comboBySize, comboFocus } = useContext(ShopContext)

  if (comboBySize.length === 0) return null

  const focus = comboFocus || comboBySize[0]

  return (
    <div className='border-2 border-dashed border-black p-4 sm:p-5 mb-7'>

      <div className='flex items-baseline justify-between gap-3'>
        <p className='heading-font tracking-[0.18em] text-sm sm:text-base'>COMBO&nbsp;&nbsp;OFFER</p>
        <span className='text-[11px] text-gray-500'>counted per size</span>
      </div>

      <p className='text-[11px] text-gray-500 mt-1'>
        Each size runs its own combo — four A6 posters earn eight A6 posters, and sizes never mix.
        Collage sets and custom prints are not part of the offer.
      </p>

      {/* One row per size in the basket */}
      <div className='flex flex-col gap-4 mt-4'>
        {comboBySize.map((entry) => (
          <div key={entry.size}>
            <div className='flex items-center justify-between gap-3 text-[11px] mb-1.5'>
              <span className='text-gray-700'>
                <span className='font-medium text-black'>{entry.size}</span>
                <span className='text-gray-500'> · {entry.count} {entry.count === 1 ? 'poster' : 'posters'}</span>
              </span>
              <span className='text-gray-500'>
                {entry.next ? `${entry.count} / ${entry.next.get}` : 'top tier'}
              </span>
            </div>

            <div className='h-2 bg-gray-200'>
              <div
                className={`h-full transition-all duration-500 ${entry.discount > 0 ? 'bg-green-600' : 'bg-brand'}`}
                style={{ width: `${entry.next ? Math.min(100, Math.round((entry.count / entry.next.get) * 100)) : 100}%` }}
              />
            </div>

            {entry.discount > 0 ? (
              <p className='flex items-start gap-1.5 text-sm text-green-800 mt-2'>
                <CheckIcon className='w-3.5 h-3.5 mt-1 shrink-0' />
                <span>
                  Buy {entry.tier.buy} Get {entry.tier.get} applied on {entry.size} — {entry.tier.get - entry.tier.buy} free,
                  {' '}{currency}{entry.discount} off.
                  {entry.next && ` Add ${entry.remaining} more ${entry.size} for Buy ${entry.next.buy} Get ${entry.next.get}.`}
                </span>
              </p>
            ) : (
              <p className='text-sm mt-2'>
                Add <span className='font-medium'>{entry.remaining} more {entry.size}</span> and {entry.next.get - entry.next.buy} come free
                {entry.nextSaving > 0 && <> — about <span className='text-brand font-medium'>{currency}{entry.nextSaving} off</span></>}.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* The ladder, priced for the size closest to its next rung */}
      <p className='text-[11px] text-gray-500 mt-5 mb-2'>The ladder, at {focus.size} prices</p>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
        {COMBO_TIERS.map((tier) => {
          const unlocked = focus.count >= tier.get
          const isNext = focus.next?.get === tier.get
          return (
            <div
              key={tier.buy}
              className={`px-3 py-2.5 text-left transition-colors ${
                unlocked ? 'bg-green-600 text-white'
                  : isNext ? 'bg-brand text-white'
                  : 'bg-neutral-900 text-white/90'
              }`}
            >
              <p className='flex items-center gap-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap'>
                BUY {tier.buy}
                <span className={unlocked || isNext ? 'text-white' : 'text-brand'}>&rarr;</span>
                GET {tier.get}
                {unlocked && <CheckIcon className='w-3.5 h-3.5 ml-auto' />}
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-0.5 ${unlocked || isNext ? 'text-white/90' : 'text-brand'}`}>
                +{tier.get - tier.buy} FREE posters
              </p>
              <p className={`text-[10px] sm:text-[11px] mt-1 ${unlocked || isNext ? 'text-white/75' : 'text-white/60'}`}>
                {unlocked ? 'Unlocked' : `${currency}${getComboEffectivePrice(tier, focus.size)}/poster effective`}
              </p>
            </div>
          )
        })}
      </div>

      {focus.next && (
        <Link
          to='/collection'
          className='mt-4 w-full bg-black text-white text-sm py-3 flex items-center justify-center gap-2 hover:bg-brand transition-colors'
        >
          Add {focus.remaining} more {focus.size} {focus.remaining === 1 ? 'poster' : 'posters'}
          <ArrowRightIcon className='w-4 h-4' />
        </Link>
      )}
    </div>
  )
}

export default ComboGuide
