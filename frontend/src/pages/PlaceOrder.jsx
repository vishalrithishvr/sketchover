import React, { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, Link } from 'react-router-dom'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary, { useOrderTotals } from '../components/OrderSummary'
import FavoritesList from '../components/FavoritesList'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName } from '../assets/assets'
import { isChennaiAddress } from '../utils/addressValidation'

const WHATSAPP_NUMBER = '918870333236'

// SKO-260927-4F2A — short enough to read out on a call.
const makeReference = () => {
    const d = new Date()
    const stamp = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()]
        .map(n => String(n).padStart(2, '0')).join('')
    const tail = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `SKO-${stamp}-${tail}`
}

// Plays while the order is being written down, before the confirmation page.
const ConfirmingOverlay = () => createPortal(
    <div className='fixed inset-0 z-[95] bg-neutral-950/95 flex flex-col items-center justify-center animate-fade-in' role='status'>
        <div className='relative'>
            <span className='absolute inset-0 rounded-full bg-green-500 animate-ring-out' aria-hidden='true' />
            <span className='relative flex w-20 h-20 items-center justify-center rounded-full bg-green-600 animate-pop-in'>
                <svg viewBox='0 0 24 24' className='w-9 h-9' fill='none' stroke='white' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline className='animate-draw-check' points='4 12 10 18 20 6' />
                </svg>
            </span>
        </div>
        <p className='heading-font uppercase tracking-[0.12em] text-white text-2xl mt-7'>Order confirmed</p>
        <p className='text-white/60 text-sm mt-1.5'>Writing up your order details…</p>
    </div>,
    document.body
)

const PlaceOrder = () => {

    const { getProduct, productsLoaded, cartItems, currency, couponCode, shippingAddress, setCartItems, saveOrder, clearCombo, cartMinimum } = useContext(ShopContext)
    const { subtotal, comboDiscount, discountPct, couponDiscount, platformFee, total, combos } = useOrderTotals()
    const navigate = useNavigate()
    const [confirming, setConfirming] = useState(false)
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    // Warm the confirmation page's chunk before it is needed.
    useEffect(() => { import('./OrderPlaced') }, [])

    const blocked = productsLoaded && !confirming && (subtotal === 0 || total < cartMinimum);

    useEffect(() => {
        if (blocked) navigate('/cart')
    }, [blocked])

    if (blocked || !productsLoaded) return null

    // City and district are frequently the same place — say it once.
    const addressLine = [...new Set([shippingAddress.city, shippingAddress.district, shippingAddress.state, shippingAddress.postalCode].filter(Boolean))].join(', ')

    // Flat list of what was bought, used for both the WhatsApp message and the
    // confirmation page's snapshot.
    const collectLineItems = () => {
        const lines = []
        for (const itemId in cartItems) {
            const product = getProduct(itemId)
            if (!product) continue
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size]
                if (quantity > 0) {
                    const { price } = getSizePrice(size, product.subCategory, product.panels)
                    lines.push({
                        id: product._id,
                        name: formatProductName(product),
                        image: product.image[0],
                        isCustom: !!product.isCustom,
                        // Uploaded artwork travels with the order: the id points
                        // at the stored originals, which are attached when the
                        // order is sent on WhatsApp.
                        customPosterId: product.customPosterId || null,
                        fileNames: product.fileNames || null,
                        size,
                        quantity,
                        price,
                        lineTotal: price * quantity,
                    })
                }
            }
        }
        return lines
    }

    const buildWhatsappMessage = (reference, lineItems) => {
        const lines = [`Hi Sketchover! I would like to place this order (${reference}):`, ''];

        lineItems.forEach(item => {
            lines.push(`• ${item.name} (Size ${item.size}) x${item.quantity} — ${currency}${item.lineTotal}`)
            if (item.isCustom && item.fileNames?.length) {
                lines.push(`   ↳ artwork attached: ${item.fileNames.join(', ')}`)
            } else if (item.isCustom) {
                lines.push('   ↳ artwork attached in this chat')
            }
        })

        lines.push('', `Subtotal: ${currency}${subtotal}`)
        combos.forEach(entry => lines.push(`Combo ${entry.size} (Buy ${entry.tier.buy} Get ${entry.tier.get}): -${currency}${entry.discount}`))
        if (discountPct > 0) lines.push(`Discount (${couponCode.trim().toUpperCase()}): -${currency}${couponDiscount} (${discountPct}%)`)
        lines.push(`Platform fee: ${currency}${platformFee}`)
        lines.push(`Total: ${currency}${total}`, '')

        if (shippingAddress?.firstName) {
            lines.push('Shipping to:')
            lines.push(`${shippingAddress.firstName} ${shippingAddress.lastName || ''}`.trim())
            lines.push([shippingAddress.street, shippingAddress.landmark].filter(Boolean).join(', '))
            lines.push(addressLine)
            lines.push(shippingAddress.country || '')
            lines.push(`Phone: ${shippingAddress.phone || '-'}`)
        }

        return lines.join('\n')
    }

    // The order is confirmed here on the site: we record it, play the
    // confirmation animation, then hand the shopper to the confirmation page.
    // WhatsApp is opened from there, by a tap of their own, so no popup blocker
    // can swallow it.
    const confirmOrder = () => {
        if (confirming) return
        const reference = makeReference()
        const lineItems = collectLineItems()
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage(reference, lineItems))}`

        saveOrder({
            reference,
            placedAt: Date.now(),
            items: lineItems,
            address: shippingAddress,
            isChennai: isChennaiAddress(shippingAddress),
            whatsappUrl,
            // The message on its own, so the confirmation page can share it
            // alongside the artwork files.
            message: buildWhatsappMessage(reference, lineItems),
            customPosterIds: lineItems.filter(item => item.customPosterId).map(item => item.customPosterId),
            totals: {
                subtotal, comboDiscount, discountPct, couponDiscount, platformFee, total,
                combos: combos.map(entry => ({
                    size: entry.size, buy: entry.tier.buy, get: entry.tier.get, discount: entry.discount,
                })),
            },
        })

        setConfirming(true)
        timer.current = setTimeout(() => {
            setCartItems({})
            clearCombo()
            navigate('/order-placed')
        }, 1600)
    }

    return (
        <div>
            <CheckoutSteps current='Checkout' />

            <div className='text-xl sm:text-2xl mb-8'>
                <Title text1={'CONFIRMATION'} />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>
                <div>
                    <div className='border border-black px-5 py-5 flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                            <p className='heading-font uppercase tracking-[0.06em] text-lg sm:text-xl'>Your Shipping Address</p>
                            {shippingAddress?.firstName ? (
                                <div className='text-sm text-gray-600 leading-relaxed mt-3'>
                                    <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                                    <p>{shippingAddress.street}{shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ''}</p>
                                    <p>{addressLine}</p>
                                    <p>{shippingAddress.country}</p>
                                    <p className='mt-2'>{shippingAddress.email} · {shippingAddress.phone}</p>
                                </div>
                            ) : (
                                <p className='text-sm text-gray-400 mt-3'>No address on file yet.</p>
                            )}
                        </div>
                        <Link to='/shipping' className='text-sm underline text-gray-600 hover:text-black shrink-0'>Change</Link>
                    </div>

                    <p className='text-xs text-gray-500 mt-3'>
                        Estimated delivery: {isChennaiAddress(shippingAddress) ? '2–3 days within Chennai' : '4–7 days across India'}. Prepaid only — no cash on delivery.
                    </p>

                    <div className='mt-10'>
                        <FavoritesList />
                    </div>
                </div>

                <div>
                    <OrderSummary
                        showItems
                        action={({ agreed }) => (
                            <button
                                onClick={confirmOrder}
                                disabled={!agreed || confirming}
                                className='w-full bg-black text-white py-3.5 hover:bg-brand transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {confirming ? 'Confirming…' : 'Confirm Order'}
                            </button>
                        )}
                    />
                </div>
            </div>

            <NewsletterBox />

            {confirming && <ConfirmingOverlay />}
        </div>
    )
}

export default PlaceOrder
