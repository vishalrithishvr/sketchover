import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { CheckIcon, DeliveryIcon, WhatsappIcon } from '../components/icons/NavIcons'

const dayMs = 24 * 60 * 60 * 1000

const formatDate = (ms) => new Date(ms).toLocaleDateString('en-IN', {
  weekday: 'short', day: 'numeric', month: 'short',
})

// Confirmation page shown once the order has been handed to WhatsApp: what was
// bought, where it ships and when it lands.
const OrderPlaced = () => {

  const { lastOrder, currency } = useContext(ShopContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!lastOrder) navigate('/')
  }, [lastOrder])

  if (!lastOrder) return null

  const { reference, placedAt, items = [], address = {}, totals = {}, whatsappUrl, isChennai } = lastOrder

  // City and district are frequently the same place — say it once.
  const addressLine = [...new Set([address.city, address.district, address.state, address.postalCode].filter(Boolean))].join(', ')
  const [minDays, maxDays] = isChennai ? [2, 3] : [4, 7]
  const dispatchBy = placedAt + dayMs
  const from = placedAt + minDays * dayMs
  const to = placedAt + maxDays * dayMs

  const timeline = [
    { label: 'Order placed', date: formatDate(placedAt), done: true },
    { label: 'Printed & packed', date: `by ${formatDate(dispatchBy)}`, done: false },
    { label: 'Out for delivery', date: `${formatDate(from)} – ${formatDate(to)}`, done: false },
  ]

  return (
    <div>
      {/* Success header */}
      <div className='text-center pt-12 pb-10'>
        <span className='inline-flex w-14 h-14 items-center justify-center rounded-full bg-green-600 text-white mb-5'>
          <CheckIcon className='w-7 h-7' />
        </span>
        <div className='text-xl sm:text-2xl'>
          <Title text1={'ORDER PLACED'} />
        </div>
        <p className='text-sm text-gray-500 mt-4'>
          Order reference <span className='text-black font-medium'>{reference}</span> · placed {formatDate(placedAt)}
        </p>
        <p className='text-sm text-gray-500 mt-2 max-w-lg mx-auto'>
          We have opened WhatsApp with your order details. Send that message to confirm the order and receive the payment link.
        </p>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 bg-whatsapp text-white text-sm px-6 py-3 mt-5 hover:opacity-90 transition-opacity'
          >
            <WhatsappIcon className='w-4 h-4' />
            Re-open WhatsApp message
          </a>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>

        <div className='flex flex-col gap-8'>

          {/* Delivery estimate */}
          <div className='border border-black'>
            <div className='flex items-center gap-3 px-5 py-4 bg-neutral-950 text-white'>
              <DeliveryIcon className='w-5 h-5 shrink-0' />
              <div>
                <p className='heading-font tracking-[0.06em] text-lg leading-none'>ESTIMATED DELIVERY</p>
                <p className='text-xs text-white/70 mt-1'>
                  {isChennai
                    ? `2–3 days within Chennai · ${formatDate(from)} – ${formatDate(to)}`
                    : `4–7 days outside Chennai · ${formatDate(from)} – ${formatDate(to)}`}
                </p>
              </div>
            </div>

            <div className='px-5 py-5'>
              <ol className='flex flex-col gap-4'>
                {timeline.map((step) => (
                  <li key={step.label} className='flex items-start gap-3'>
                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-300'}`}>
                      <CheckIcon className='w-3 h-3' />
                    </span>
                    <div>
                      <p className='text-sm'>{step.label}</p>
                      <p className='text-xs text-gray-500'>{step.date}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className='text-xs text-gray-500 mt-5 pt-4 border-t border-gray-200'>
                Rolled in a rigid tube, never folded. Orders inside Chennai reach you in 2–3 days;
                the rest of India takes 4–7 days. Prepaid only — no cash on delivery.
              </p>
            </div>
          </div>

          {/* Shipping details */}
          <div className='border border-gray-300 px-5 py-5'>
            <p className='heading-font uppercase tracking-[0.06em] text-lg'>Shipping Details</p>
            <div className='text-sm text-gray-600 leading-relaxed mt-3'>
              <p className='text-black'>{address.firstName} {address.lastName}</p>
              <p>{address.street}{address.landmark ? `, ${address.landmark}` : ''}</p>
              <p>{addressLine}</p>
              <p>{address.country}</p>
              <p className='mt-2'>{address.email} · {address.phone}</p>
            </div>
          </div>
        </div>

        {/* Order summary snapshot */}
        <div className='border border-black p-5 h-fit'>
          <p className='text-lg mb-4'>Order Summary</p>

          <div className='flex flex-col gap-3 mb-5'>
            {items.map((item, i) => (
              <div key={i} className='flex items-center gap-3'>
                <img src={item.image} alt='' className='w-10 h-12 object-cover bg-gray-100 shrink-0' />
                <p className='flex-1 min-w-0 text-[11px] leading-tight'>
                  {item.name}
                  <span className='text-gray-500'> · {item.size} × {item.quantity}</span>
                </p>
                <span className='text-[11px] shrink-0'>{currency}{item.lineTotal}</span>
              </div>
            ))}
          </div>

          <div className='flex justify-between py-1.5 text-sm'>
            <span>Subtotal</span><span>{currency}{totals.subtotal}.00</span>
          </div>
          {totals.comboDiscount > 0 && (
            <div className='flex justify-between py-1.5 text-sm text-brand'>
              <span>Combo (Buy {totals.comboBuy} Get {totals.comboGet})</span>
              <span>-{currency}{totals.comboDiscount}</span>
            </div>
          )}
          {totals.couponDiscount > 0 && (
            <div className='flex justify-between py-1.5 text-sm'>
              <span>Discount ({totals.discountPct}%)</span>
              <span>-{currency}{totals.couponDiscount}</span>
            </div>
          )}
          <div className='flex justify-between py-1.5 text-sm text-gray-600'>
            <span>Platform fee</span><span>{currency}{totals.platformFee}.00</span>
          </div>

          <hr className='my-3 border-gray-200' />

          <div className='flex justify-between py-1'>
            <span>Total</span><span className='font-medium'>{currency}{totals.total}.00</span>
          </div>

          <p className='text-[10px] text-gray-500 mt-3'>Prepaid only — no cash on delivery.</p>

          <Link to='/collection' className='block text-center bg-black text-white text-sm py-3 mt-5 hover:bg-brand transition-colors'>
            Continue Shopping
          </Link>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default OrderPlaced
