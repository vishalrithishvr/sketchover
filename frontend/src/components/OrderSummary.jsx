import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const VALID_COUPONS = { SKO10: 10, SKO5: 5 }

const OrderSummary = ({ children, showCoupon = true, compact = false }) => {
  const { products, cartItems, currency, getCartAmount, couponCode, setCouponCode } = useContext(ShopContext)
  const [couponInput, setCouponInput] = useState(couponCode)

  const subtotal = getCartAmount()
  const discountPct = VALID_COUPONS[couponCode.trim().toUpperCase()] || 0
  const discountAmt = Math.round(subtotal * discountPct / 100)
  const total = Math.max(0, subtotal - discountAmt)

  const applyCoupon = (e) => {
    e.preventDefault()
    setCouponCode(couponInput)
  }

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
    <div className='border rounded-lg p-5 sm:p-6 w-full'>
      <p className='text-lg font-medium mb-4'>Order Summary</p>

      {!compact && lineItems.length > 0 && (
        <div className='flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto pr-1'>
          {lineItems.map(({ product, size, qty }) => (
            <div key={product._id + size} className='flex items-center gap-3 text-xs sm:text-sm'>
              <img src={product.image[0]} alt='' className='w-10 h-12 object-cover rounded shrink-0' />
              <div className='flex-1 min-w-0'>
                <p className='truncate'>{product.name}</p>
                <p className='text-gray-400'>Size: {size} × {qty}</p>
              </div>
              <p className='shrink-0'>{currency}{product.price * qty}</p>
            </div>
          ))}
        </div>
      )}

      <div className='flex justify-between text-sm py-1'>
        <span className='text-gray-500'>Subtotal</span>
        <span>{currency}{subtotal}.00</span>
      </div>
      {discountPct > 0 && (
        <div className='flex justify-between text-sm py-1 text-green-600'>
          <span>Discount</span>
          <span>{discountPct}%</span>
        </div>
      )}
      <hr className='my-2' />
      <div className='flex justify-between text-base font-medium py-1'>
        <span>Total</span>
        <span>{currency}{total}.00</span>
      </div>

      {children}

      {showCoupon && (
        <form onSubmit={applyCoupon} className='mt-5'>
          <p className='text-xs text-gray-500 mb-2'>Do you have a discount code?</p>
          <div className='flex'>
            <input
              value={couponInput}
              onChange={(e)=>setCouponInput(e.target.value)}
              placeholder='Coupon code'
              className='flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm outline-none'
            />
            <button type='submit' className='bg-black text-white px-4 rounded-r text-sm hover:bg-[#FF6B00] transition-colors'>&rarr;</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default OrderSummary
