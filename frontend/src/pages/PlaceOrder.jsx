import React, { useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary from '../components/OrderSummary'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName, MIN_ORDER_VALUE } from '../assets/assets'
import { WhatsappIcon } from '../components/icons/NavIcons'

// TODO: replace with Sketchover's real WhatsApp Business number (country code + number, no symbols)
const WHATSAPP_NUMBER = '910000000000'

const PlaceOrder = () => {

    const { products, cartItems, currency, getCartAmount, getComboDiscount, couponCode, shippingAddress, setCartItems } = useContext(ShopContext)
    const navigate = useNavigate()

    const subtotal = getCartAmount();
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
                }
            }
        }

        const comboDiscount = getComboDiscount();
        const couponPct = { SKO10: 10, SKO5: 5, WELCOME5: 5 }[couponCode.trim().toUpperCase()] || 0;
        const couponDiscount = Math.round((subtotal - comboDiscount) * couponPct / 100);
        const total = Math.max(0, subtotal - comboDiscount - couponDiscount);

        lines.push('', `Subtotal: ${currency}${subtotal}`)
        if (comboDiscount > 0) lines.push(`Combo Offer (Buy 4 Get 4 Free): -${currency}${comboDiscount}`)
        if (couponPct > 0) lines.push(`Discount (${couponCode.trim().toUpperCase()}): ${couponPct}%`)
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
        const text = encodeURIComponent(buildWhatsappMessage())
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
        setCartItems({})
        navigate('/')
    }

    return (
        <div className='border-t pt-6'>
            <CheckoutSteps current='Checkout' />
            <div className='text-2xl mb-6'>
                <Title text1={'CONFIRMATION'} text2={''} />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10'>
                <div className='border rounded-lg p-5 sm:p-6'>
                    <div className='flex justify-between items-start mb-4'>
                        <p className='text-sm font-medium'>Shipping Address</p>
                        <Link to='/shipping' className='text-xs underline text-gray-500 hover:text-black'>Change</Link>
                    </div>
                    {shippingAddress?.firstName ? (
                        <div className='text-sm text-gray-600 leading-relaxed'>
                            <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                            <p>{shippingAddress.street}{shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ''}</p>
                            <p>{[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', ')}</p>
                            <p>{shippingAddress.country}</p>
                            <p className='mt-2'>{shippingAddress.email} · {shippingAddress.phone}</p>
                        </div>
                    ) : (
                        <p className='text-sm text-gray-400'>No address on file — <Link to='/shipping' className='underline'>add one</Link>.</p>
                    )}
                </div>

                <div>
                    <OrderSummary showCoupon={false}>
                        <button
                            onClick={checkoutOnWhatsapp}
                            className='w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-medium mt-4 py-3 rounded hover:opacity-90 transition-opacity'
                        >
                            <WhatsappIcon className='w-4 h-4' />
                            Checkout On WhatsApp
                        </button>
                        <p className='text-[11px] text-gray-400 mt-2'>We'll confirm your order and payment details over WhatsApp.</p>
                    </OrderSummary>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
