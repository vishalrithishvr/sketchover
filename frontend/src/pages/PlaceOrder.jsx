import React, { useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary, { useOrderTotals } from '../components/OrderSummary'
import FavoritesList from '../components/FavoritesList'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName, MIN_ORDER_VALUE } from '../assets/assets'

const WHATSAPP_NUMBER = '918870333236'

const PlaceOrder = () => {

    const { products, cartItems, currency, getCartAmount, couponCode, shippingAddress, setCartItems, customPosters } = useContext(ShopContext)
    const { subtotal, comboDiscount, discountPct, total, comboTier } = useOrderTotals()
    const navigate = useNavigate()

    const blocked = subtotal === 0 || subtotal < MIN_ORDER_VALUE;

    useEffect(() => {
        if (blocked) navigate('/cart')
    }, [blocked])

    if (blocked) return null

    const buildWhatsappMessage = () => {
        const lines = ['Hi Sketchover! I would like to place this order:', ''];

        for (const itemId in cartItems) {
            const product = products.find(p => p._id === itemId)
            if (!product) continue
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    const { price } = getSizePrice(size, product.subCategory)
                    lines.push(`• ${formatProductName(product)} (Size ${size}) x${cartItems[itemId][size]} — ${currency}${price * cartItems[itemId][size]}`)
                    if (product.isCustom && customPosters[0]) {
                        lines.push(`   ↳ artwork: ${customPosters[0].fileName} (will send in chat)`)
                    }
                }
            }
        }

        lines.push('', `Subtotal: ${currency}${subtotal}`)
        if (comboDiscount > 0) lines.push(`Combo Offer (Buy ${comboTier?.buy} Get ${comboTier?.get}): -${currency}${comboDiscount}`)
        if (discountPct > 0) lines.push(`Discount (${couponCode.trim().toUpperCase()}): ${discountPct}%`)
        lines.push(`Total: ${currency}${total}`, '')

        if (shippingAddress?.firstName) {
            lines.push('Shipping to:')
            lines.push(`${shippingAddress.firstName} ${shippingAddress.lastName || ''}`.trim())
            lines.push([shippingAddress.street, shippingAddress.landmark].filter(Boolean).join(', '))
            lines.push([shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', '))
            lines.push(shippingAddress.country || '')
            lines.push(`Phone: ${shippingAddress.phone || '-'}`)
        }

        return lines.join('\n')
    }

    const checkoutOnWhatsapp = () => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage())}`, '_blank')
        setCartItems({})
        navigate('/')
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
                                    <p>{[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', ')}</p>
                                    <p>{shippingAddress.country}</p>
                                    <p className='mt-2'>{shippingAddress.email} · {shippingAddress.phone}</p>
                                </div>
                            ) : (
                                <p className='text-sm text-gray-400 mt-3'>No address on file yet.</p>
                            )}
                        </div>
                        <Link to='/shipping' className='text-sm underline text-gray-600 hover:text-black shrink-0'>Change</Link>
                    </div>

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
