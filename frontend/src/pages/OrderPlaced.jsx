import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { getFilesAsFiles } from '../utils/customPosterStore'
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

  // The artwork is loaded up front so the send button can hand it to the share
  // sheet inside the tap itself — Safari drops the gesture across an await.
  const [attachments, setAttachments] = useState([])
  const [sending, setSending] = useState(false)
  const [sendNote, setSendNote] = useState('')

  const posterIds = lastOrder?.customPosterIds || []

  useEffect(() => {
    if (!lastOrder) navigate('/')
  }, [lastOrder])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const files = []
      for (const id of posterIds) {
        try {
          files.push(...await getFilesAsFiles(id))
        } catch { /* the artwork is no longer on this device */ }
      }
      if (!cancelled) setAttachments(files)
    }
    if (posterIds.length) load()
    return () => { cancelled = true }
  }, [posterIds.join(',')])

  if (!lastOrder) return null

  const { reference, placedAt, items = [], address = {}, totals = {}, whatsappUrl, message, isChennai } = lastOrder

  // City and district are frequently the same place — say it once.
  const addressLine = [...new Set([address.city, address.district, address.state, address.postalCode].filter(Boolean))].join(', ')
  const [minDays, maxDays] = isChennai ? [2, 3] : [4, 7]
  const dispatchBy = placedAt + dayMs
  const from = placedAt + minDays * dayMs
  const to = placedAt + maxDays * dayMs

  // Send the order, with the uploaded artwork attached at full quality.
  const sendOnWhatsapp = async () => {
    if (sending) return
    setSending(true)
    setSendNote('')

    const text = message || ''
    const shareData = { files: attachments, text, title: `Sketchover order ${reference}` }

    try {
      if (attachments.length > 0 && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        setSendNote('Shared — choose Sketchover in WhatsApp to finish.')
        return
      }

      // No share sheet: save the originals, then open the chat with the order.
      attachments.forEach((file) => {
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      })
      if (attachments.length > 0) {
        setSendNote(`Your ${attachments.length === 1 ? 'image has' : 'images have'} been saved — attach ${attachments.length === 1 ? 'it' : 'them'} in the chat that just opened.`)
      }
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setSendNote('WhatsApp would not open — your order is saved on this page.')
      }
    } finally {
      setSending(false)
    }
  }

  const timeline = [
    { label: 'Order placed', date: formatDate(placedAt), done: true },
    { label: 'Printed & packed', date: `by ${formatDate(dispatchBy)}`, done: false },
    { label: 'Out for delivery', date: `${formatDate(from)} – ${formatDate(to)}`, done: false },
  ]

  return (
    <div>
      {/* Success header */}
      <div className='text-center pt-12 pb-10'>
        <div className='relative inline-flex mb-5'>
          <span className='absolute inset-0 rounded-full bg-green-500 animate-ring-out' aria-hidden='true' />
          <span className='relative inline-flex w-16 h-16 items-center justify-center rounded-full bg-green-600 animate-pop-in'>
            <svg viewBox='0 0 24 24' className='w-8 h-8' fill='none' stroke='white' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
              <polyline className='animate-draw-check' points='4 12 10 18 20 6' />
            </svg>
          </span>
        </div>
        <div className='text-xl sm:text-2xl animate-rise-in'>
          <Title text1={'ORDER CONFIRMED'} />
        </div>
        <p className='text-sm text-gray-500 mt-4'>
          Order reference <span className='text-black font-medium'>{reference}</span> · placed {formatDate(placedAt)}
        </p>
        <p className='text-sm text-gray-500 mt-2 max-w-lg mx-auto'>
          Your order is saved on this page. Send it to us on WhatsApp{posterIds.length > 0 && ' with your artwork'} and
          we will share the payment link and start printing.
        </p>
        {whatsappUrl && (
          <button
            onClick={sendOnWhatsapp}
            disabled={sending}
            className='inline-flex items-center gap-2 bg-whatsapp text-white text-sm px-6 py-3 mt-5 hover:opacity-90 transition-opacity disabled:opacity-60'
          >
            <WhatsappIcon className='w-4 h-4' />
            {sending
              ? 'Opening WhatsApp…'
              : attachments.length > 0
                ? `Send order + ${attachments.length} ${attachments.length === 1 ? 'image' : 'images'} on WhatsApp`
                : 'Send order on WhatsApp'}
          </button>
        )}
        {sendNote && <p className='text-xs text-gray-500 mt-3 max-w-md mx-auto'>{sendNote}</p>}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>

        <div className='flex flex-col gap-8 animate-rise-in' style={{ animationDelay: '120ms' }}>

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
        <div className='border border-black p-5 h-fit animate-rise-in' style={{ animationDelay: '220ms' }}>
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
          {(totals.combos || []).map(entry => (
            <div key={entry.size} className='flex justify-between py-1.5 text-sm text-brand'>
              <span>{entry.size} combo (Buy {entry.buy} Get {entry.get})</span>
              <span>-{currency}{entry.discount}</span>
            </div>
          ))}
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
