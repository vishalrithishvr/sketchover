import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { COMBO_TIERS, getComboEffectivePrice, getTierSaving } from '../assets/assets'
import { CheckIcon, CloseIcon } from './icons/NavIcons'

// The combo ladder on a product page, for the size currently selected. Picking a
// tier adds this poster and marks the goal; its Cancel takes that poster back
// out again. Counts are per size — A4 posters only ever count towards A4.
const ComboOffer = ({ product, size, onPick }) => {
  const { activeCombo, startCombo, clearCombo, comboBySize, addToCart, changeQuantity } = useContext(ShopContext)

  const forSize = comboBySize.find(entry => entry.size === size)
  const count = forSize?.count || 0
  const picked = activeCombo?.size === size ? activeCombo : null

  const choose = (tier) => {
    startCombo({ size, buy: tier.buy, get: tier.get, productId: product?._id })
    if (product && size) {
      addToCart(product._id, size)
      onPick?.(tier)
    }
  }

  // Cancel puts back exactly what picking the tier added.
  const cancel = (e) => {
    e.stopPropagation()
    if (picked?.productId) changeQuantity(picked.productId, picked.size, -1)
    clearCombo()
  }

  return (
    <div className='mt-6 border-2 border-dashed border-black p-4'>
      <div className='flex items-baseline justify-between gap-3 mb-1'>
        <p className='heading-font tracking-[0.18em] text-sm sm:text-base'>COMBO&nbsp;&nbsp;OFFER</p>
        <span className='text-[11px] text-gray-500'>{size} · {count} in cart</span>
      </div>
      <p className='text-[11px] text-gray-500 mb-3'>
        Combos count within one size. Pick a deal and we'll add this poster in {size} — keep going at {size} to unlock it.
      </p>

      <div className='grid grid-cols-2 gap-3'>
        {COMBO_TIERS.map((tier) => {
          const selected = picked?.get === tier.get
          const unlocked = count >= tier.get
          const remaining = Math.max(0, tier.get - count)

          return (
            <div
              key={tier.buy}
              className={`relative transition-all ${
                unlocked ? 'bg-green-600 text-white'
                  : selected ? 'bg-brand text-white ring-2 ring-brand ring-offset-2'
                  : 'bg-neutral-900 text-white'
              }`}
            >
              <button
                onClick={() => choose(tier)}
                aria-pressed={selected}
                className='w-full text-left px-3 py-2.5 hover:opacity-95 transition-opacity'
              >
                <p className='flex items-center gap-1.5 text-xs sm:text-sm font-medium whitespace-nowrap'>
                  BUY {tier.buy}
                  <span className={selected || unlocked ? 'text-white' : 'text-brand'}>&rarr;</span>
                  GET {tier.get}
                  {unlocked && <CheckIcon className='w-3.5 h-3.5 ml-auto' />}
                </p>
                <p className={`text-[10px] sm:text-[11px] mt-0.5 ${selected || unlocked ? 'text-white/90' : 'text-brand'}`}>
                  +{tier.get - tier.buy} FREE posters
                </p>
                <p className={`text-[10px] sm:text-[11px] mt-1 ${selected || unlocked ? 'text-white/75' : 'text-white/60'}`}>
                  {unlocked
                    ? `Unlocked — ₹${getTierSaving(tier, size)} off`
                    : selected
                      ? `Add ${remaining} more ${size}`
                      : `₹${getComboEffectivePrice(tier, size)}/poster effective`}
                </p>
              </button>

              {selected && (
                <button
                  onClick={cancel}
                  aria-label={`Cancel Buy ${tier.buy} Get ${tier.get}`}
                  className='absolute top-1.5 right-1.5 flex items-center gap-1 text-[10px] bg-white/15 hover:bg-white/25 px-1.5 py-0.5 transition-colors'
                >
                  <CloseIcon className='w-3 h-3' />
                  Cancel
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComboOffer
