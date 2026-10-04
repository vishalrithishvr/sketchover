import React, { useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { formatProductName, getSizePrice } from '../assets/assets'
import { CloseIcon, PlusIcon, MinusIcon, CheckIcon, ArrowRightIcon } from './icons/NavIcons'

// Pages that already are the cart — the slide-over stays out of their way.
const HIDDEN_ON = ['/cart', '/shipping', '/place-order', '/order-placed']

// The side cart. It opens itself every time a poster is added, shows what is in
// the basket with the newest poster called out, and carries the combo nudge.
const CartDrawer = () => {
  const {
    cartItems, getProduct, currency, changeQuantity, updateQuantity,
    getCartAmount, getComboDiscount, comboFocus, cartMinimum,
    cartDrawerOpen, closeCartDrawer, lastAdded,
  } = useContext(ShopContext)
  const location = useLocation()

  const onCartPage = HIDDEN_ON.includes(location.pathname)
  const open = cartDrawerOpen && !onCartPage

  // Close it on navigation, and lock the page behind it while it is open.
  useEffect(() => { closeCartDrawer() }, [location.pathname, location.search])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') closeCartDrawer() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeCartDrawer])

  const lines = []
  for (const itemId in cartItems) {
    const product = getProduct(itemId)
    if (!product) continue
    for (const size in cartItems[itemId]) {
      const quantity = cartItems[itemId][size]
      if (quantity > 0) lines.push({ product, size, quantity })
    }
  }
  // Newest first, so what was just added is at the top.
  const isLatest = (line) => lastAdded?.itemId === line.product._id && lastAdded?.size === line.size
  lines.sort((a, b) => Number(isLatest(b)) - Number(isLatest(a)))

  const subtotal = getCartAmount()
  const discount = getComboDiscount()
  const total = Math.max(0, subtotal - discount)
  const belowMinimum = subtotal > 0 && total > 0 && total + 4 < cartMinimum

  return createPortal(
    <>
      <div
        onClick={closeCartDrawer}
        className={`fixed inset-0 z-[85] bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden='true'
      />

      <aside
        role='dialog'
        aria-label='Cart'
        aria-hidden={!open}
        className={`fixed top-0 right-0 bottom-0 w-[90vw] max-w-md z-[90] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200'>
          <p className='heading-font tracking-[0.1em] text-lg'>YOUR CART</p>
          <button onClick={closeCartDrawer} aria-label='Close cart' className='p-2 -mr-2 text-gray-500 hover:text-black'>
            <CloseIcon className='w-5 h-5' />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center text-center px-6 gap-4'>
            <p className='text-gray-500 text-sm'>Nothing in the cart yet.</p>
            <Link to='/collection' onClick={closeCartDrawer} className='bg-black text-white text-sm px-6 py-3 hover:bg-brand transition-colors'>
              Browse posters
            </Link>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4'>
              {lines.map((line) => {
                const { price } = getSizePrice(line.size, line.product.subCategory, line.product.panels)
                const justAdded = isLatest(line)

                return (
                  <div
                    key={line.product._id + line.size}
                    className={`flex gap-3 pb-4 border-b border-gray-100 last:border-0 ${justAdded ? 'animate-rise-in' : ''}`}
                  >
                    {/* Uploaded artwork has no catalogue page to link to. */}
                    {line.product.isCustom ? (
                      <img
                        src={line.product.image[0]}
                        alt=''
                        className={`w-16 shrink-0 aspect-[176/206] object-cover bg-gray-100 ${justAdded ? 'ring-2 ring-brand' : ''}`}
                      />
                    ) : (
                      <Link to={`/product/${line.product._id}`} onClick={closeCartDrawer} className='shrink-0'>
                        <img
                          src={line.product.image[0]}
                          alt=''
                          className={`w-16 aspect-[176/206] object-cover bg-gray-100 ${justAdded ? 'ring-2 ring-brand' : ''}`}
                        />
                      </Link>
                    )}

                    <div className='flex-1 min-w-0'>
                      {justAdded && (
                        <p className='flex items-center gap-1 text-[10px] text-green-700 mb-0.5'>
                          <CheckIcon className='w-3 h-3' /> Just added
                        </p>
                      )}
                      {line.product.isCustom ? (
                        <p className='text-sm leading-snug line-clamp-2'>{formatProductName(line.product)}</p>
                      ) : (
                        <Link
                          to={`/product/${line.product._id}`}
                          onClick={closeCartDrawer}
                          className='text-sm leading-snug line-clamp-2 hover:text-brand transition-colors'
                        >
                          {formatProductName(line.product)}
                        </Link>
                      )}
                      <p className='text-[11px] text-gray-500 mt-0.5'>Size: {line.size}</p>

                      <div className='flex items-center justify-between gap-2 mt-2'>
                        <div className='flex items-center border border-gray-300'>
                          <button
                            onClick={() => line.quantity > 1 && changeQuantity(line.product._id, line.size, -1)}
                            aria-label={`Remove one ${formatProductName(line.product)}`}
                            className='w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black'
                          >
                            <MinusIcon className='w-3 h-3' />
                          </button>
                          <span className='w-7 text-center text-xs'>{line.quantity}</span>
                          <button
                            onClick={() => changeQuantity(line.product._id, line.size, 1)}
                            aria-label={`Add another ${formatProductName(line.product)}`}
                            className='w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black'
                          >
                            <PlusIcon className='w-3 h-3' />
                          </button>
                        </div>

                        <div className='flex items-center gap-2'>
                          <span className='text-sm'>{currency}{price * line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.product._id, line.size, 0)}
                            aria-label={`Remove ${formatProductName(line.product)} from cart`}
                            className='text-gray-400 hover:text-black'
                          >
                            <CloseIcon className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='border-t border-gray-200 px-5 py-4'>
              {comboFocus && (
                <p className='text-[11px] text-brand mb-3'>
                  Add {comboFocus.remaining} more {comboFocus.size} and {comboFocus.next.get - comboFocus.next.buy} come free
                  {comboFocus.nextSaving > 0 && ` — about ${currency}${comboFocus.nextSaving} off`}.
                </p>
              )}

              <div className='flex justify-between text-sm'>
                <span>Subtotal</span>
                <span>{currency}{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className='flex justify-between text-sm text-brand mt-1'>
                  <span>Combo discount</span>
                  <span>-{currency}{discount}</span>
                </div>
              )}

              {belowMinimum && (
                <p className='text-[11px] text-brand mt-2'>
                  {currency}{cartMinimum} minimum for this order — add {currency}{cartMinimum - (total + 4)} more.
                </p>
              )}

              <div className='flex gap-2 mt-4'>
                <button
                  onClick={closeCartDrawer}
                  className='flex-1 border border-black text-sm py-3 hover:bg-gray-50 transition-colors'
                >
                  Keep shopping
                </button>
                <Link
                  to='/cart'
                  onClick={closeCartDrawer}
                  className='flex-1 bg-black text-white text-sm py-3 flex items-center justify-center gap-2 hover:bg-brand transition-colors'
                >
                  View cart
                  <ArrowRightIcon className='w-4 h-4' />
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body
  )
}

export default CartDrawer
