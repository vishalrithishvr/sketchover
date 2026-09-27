import React, { useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary, { useOrderTotals } from '../components/OrderSummary'
import FavoritesList from '../components/FavoritesList'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName, MIN_ORDER_VALUE } from '../assets/assets'
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

const PlaceOrder = () => {

    const { products, cartItems, currency, couponCode, shippingAddress, setCartItems, customPosters, saveOrder, clearCombo } = useContext(ShopContext)
    const { subtotal, comboDiscount, discountPct, couponDiscount, platformFee, total, comboTier } = useOrderTotals()
    const navigate = useNavigate()

    const blocked = subtotal === 0 || total < MIN_ORDER_VALUE;

    useEffect(() => {
        if (blocked) navigate('/cart')
    }, [blocked])

    if (blocked) return null

    // City and district are frequently the same place — say it once.
    const addressLine = [...new Set([shippingAddress.city, shippingAddress.district, shippingAddress.state, shippingAddress.postalCode].filter(Boolean))].join(', ')

    // Flat list of what was bought, used for both the WhatsApp message and the
    // confirmation page's snapshot.
    const collectLineItems = () => {
        const lines = []
        for (const itemId in cartItems) {
            const product = products.find(p => p._id === itemId)
            if (!product) continue
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size]
                if (quantity > 0) {
                    const { price } = getSizePrice(size, product.subCategory)
                    lines.push({
                        id: product._id,
                        name: formatProductName(product),
                        image: product.image[0],
                        isCustom: !!product.isCustom,
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
            if (item.isCustom && customPosters[0]) {
                lines.push(`   ↳ artwork: ${customPosters[0].fileName} (will send in chat)`)
            }
        })

        lines.push('', `Subtotal: ${currency}${subtotal}`)
        if (comboDiscount > 0) lines.push(`Combo Offer (Buy ${comboTier?.buy} Get ${comboTier?.get}): -${currency}${comboDiscount}`)
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

    const checkoutOnWhatsapp = () => {
        const reference = makeReference()
        const lineItems = collectLineItems()
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage(reference, lineItems))}`

        // Snapshot the order before the cart is emptied — the confirmation page
        // reads this, and it survives a refresh.
        saveOrder({
            reference,
            placedAt: Date.now(),
            items: lineItems,
            address: shippingAddress,
            isChennai: isChennaiAddress(shippingAddress),
            whatsappUrl,
            totals: {
                subtotal, comboDiscount, discountPct, couponDiscount, platformFee, total,
                comboBuy: comboTier?.buy, comboGet: comboTier?.get,
            },
        })

        window.open(whatsappUrl, '_blank')
        setCartItems({})
        clearCombo()
        navigate('/order-placed')
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
                                onClick={checkoutOnWhatsapp}
                                disabled={!agreed}
                                className='w-full bg-whatsapp text-white py-3.5 hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                Checkout On Whatsapp
                            </button>
                        )}
                    />
                </div>
            </div>

            <NewsletterBox />
        </div>
    )
}

export default PlaceOrder
