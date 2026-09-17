import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName } from '../assets/assets'
import { PlusIcon, MinusIcon, ArrowRightIcon } from './icons/NavIcons'

export const VALID_COUPONS = { SKO10: 10, SKO5: 5, WELCOME5: 5 }

export const useOrderTotals = () => {
  const { getCartAmount, getComboDiscount, couponCode } = useContext(ShopContext)
  const subtotal = getCartAmount()
  const comboDiscount = getComboDiscount()
  const discountPct = VALID_COUPONS[couponCode.trim().toUpperCase()] || 0
  const couponDiscount = Math.round((subtotal - comboDiscount) * discountPct / 100)
  const total = Math.max(0, subtotal - comboDiscount - couponDiscount)
  return { subtotal, comboDiscount, discountPct, couponDiscount, total }
}

// Bordered summary panel. `action` is a render prop so each step supplies its own
// button while the terms checkbox stays owned here.
const OrderSummary = ({ showItems = false, action }) => {
  const { products, cartItems, currency, updateQuantity } = useContext(ShopContext)
  const [agreed, setAgreed] = useState(false)
  const { subtotal, comboDiscount, discountPct, total } = useOrderTotals()

  const lineItems = []
  for (const itemId in cartItems) {
    const product = products.find(p => p._id === itemId)
    if (!product) continue
    for (const size in cartItems[itemId]) {
      if (cartItems[itemId][size] > 0) {
        lineItems.push({ product, size, qty: cartItems[itemId][size] })
      }
    }
  }

  return (
    <div className='border border-black'>
      <div className='p-5'>
        <p className='text-lg mb-4'>Order Summary</p>

        {showItems && lineItems.length > 0 && (
          <div className='flex flex-col gap-3 mb-5 max-h-64 overflow-y-auto pr-1'>
            {lineItems.map(({ product, size, qty }) => (
              <div key={product._id + size} className='flex items-center gap-3'>
                <img src={product.image[0]} alt='' className='w-10 h-12 object-cover bg-gray-100 shrink-0' />
                <p className='flex-1 min-w-0 text-[11px] leading-tight line-clamp-2'>{formatProductName(product)}</p>
                <div className='flex items-center border border-gray-300 shrink-0'>
                  <button onClick={()=>updateQuantity(product._id, size, Math.max(1, qty - 1))} aria-label='Decrease' className='w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black'>
                    <MinusIcon className='w-2.5 h-2.5' />
                  </button>
                  <span className='w-6 text-center text-[11px]'>{qty}</span>
                  <button onClick={()=>updateQuantity(product._id, size, qty + 1)} aria-label='Increase' className='w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black'>
                    <PlusIcon className='w-2.5 h-2.5' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex justify-between py-1.5'>
          <span>Subtotal</span>
          <span className='font-medium'>{currency}{subtotal}.00</span>
        </div>

        {comboDiscount > 0 && (
          <div className='flex justify-between py-1.5 text-brand text-sm'>
            <span>Combo (Buy 4 Get 4 Free)</span>
            <span>-{currency}{comboDiscount}</span>
          </div>
        )}

        <div className='flex justify-between py-1.5'>
          <span>Discount</span>
          <span className='font-medium'>{discountPct}%</span>
        </div>

        <hr className='my-3 border-gray-200' />

        <div className='flex justify-between py-1'>
          <span>Total</span>
          <span className='font-medium'>{currency}{total}.00</span>
        </div>

        <label className='flex items-start gap-2 text-[10px] text-gray-500 mt-4'>
          <input type='checkbox' checked={agreed} onChange={()=>setAgreed(a=>!a)} className='mt-0.5 accent-black' />
          I have read and agree to the website terms and conditions*
        </label>
      </div>

      {action && action({ agreed })}
    </div>
  )
}

// Coupon field that sits below the summary on the cart page.
export const CouponBox = () => {
  const { couponCode, setCouponCode } = useContext(ShopContext)
  const [input, setInput] = useState(couponCode)
  const { discountPct } = useOrderTotals()

  const apply = (e) => {
    e.preventDefault()
    setCouponCode(input)
  }

  return (
    <div className='mt-6'>
      <p className='text-xs text-gray-500 mb-2'>Do you have discount code?</p>
      <form onSubmit={apply} className='flex'>
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder='Coupon code'
          className='flex-1 bg-gray-100 px-4 py-3 text-sm outline-none'
        />
        <button type='submit' aria-label='Apply coupon' className='bg-brand hover:bg-brand-dark text-white px-5 flex items-center justify-center transition-colors'>
          <ArrowRightIcon className='w-5 h-5' />
        </button>
      </form>
      {couponCode && (
        <p className={`text-xs mt-2 ${discountPct ? 'text-green-600' : 'text-gray-400'}`}>
          {discountPct ? `${couponCode.toUpperCase()} applied — ${discountPct}% off` : 'That code isn\'t valid.'}
        </p>
      )}
    </div>
  )
}

export default OrderSummary
