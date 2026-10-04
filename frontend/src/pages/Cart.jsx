import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName } from '../assets/assets';
import Title from '../components/Title';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary, { CouponBox, useOrderTotals } from '../components/OrderSummary';
import ProductItem from '../components/ProductItem';
import NewsletterBox from '../components/NewsletterBox';
import ComboGuide from '../components/ComboGuide';
import { PlusIcon, MinusIcon, CloseIcon } from '../components/icons/NavIcons';

const Cart = () => {

  const {
    products, getProduct, productsLoaded, cartItems, updateQuantity, changeQuantity, navigate, currency,
    comboFocus, cartMinimum,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const { subtotal, total } = useOrderTotals();

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({ _id: items, size: item, quantity: cartItems[items][item] })
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products])

  const suggestions = products.filter(p => !p.isCustom && !cartData.some(c => c._id === p._id)).slice(0, 4);
  // Each size sets its own minimum; the basket is judged by the friendliest one.
  const belowMinimum = subtotal > 0 && total < cartMinimum;

  return (
    <div>
      <CheckoutSteps current='Cart' />

      <div className='text-xl sm:text-2xl mb-8'>
        <Title text1={'SHOPPING CART'} />
      </div>

      {!productsLoaded ? (
        <div className='py-16' />
      ) : cartData.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-gray-500 mb-4'>Your cart is empty.</p>
          <Link to='/collection' className='inline-block bg-black text-white text-sm px-7 py-3 hover:bg-brand transition-colors'>Continue Shopping</Link>
        </div>
      ) : (
      <div className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>

        {/* Items */}
        <div>

          <ComboGuide />

          {cartData.map((item, index) => {
            const productData = getProduct(item._id);
            if (!productData) return null;
            const { price, originalPrice } = getSizePrice(item.size, productData.subCategory, productData.panels);

            return (
              <div key={index} className='flex gap-4 sm:gap-6 py-6 border-b border-gray-200'>
                {/* Tapping a catalogue poster goes to its description page;
                    uploaded artwork has no page of its own. */}
                {productData.isCustom ? (
                  <div className='shrink-0'>
                    <img
                      className='w-20 sm:w-[110px] aspect-[176/206] object-cover bg-gray-100'
                      src={productData.image[0]}
                      alt={formatProductName(productData)}
                    />
                  </div>
                ) : (
                  <Link to={`/product/${productData._id}`} className='shrink-0 group'>
                    <img
                      className='w-20 sm:w-[110px] aspect-[176/206] object-cover bg-gray-100 group-hover:opacity-90 transition-opacity'
                      src={productData.image[0]}
                      alt={formatProductName(productData)}
                    />
                  </Link>
                )}

                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-3'>
                    {productData.isCustom ? (
                      <div className='min-w-0'>
                        <p className='text-sm sm:text-base'>{formatProductName(productData)}</p>
                        <p className='text-[11px] text-gray-500 mt-0.5'>
                          Your upload — sent with the order on WhatsApp
                        </p>
                      </div>
                    ) : (
                      <Link to={`/product/${productData._id}`} className='text-sm sm:text-base hover:text-brand transition-colors'>
                        {formatProductName(productData)}
                      </Link>
                    )}
                    <button onClick={() => updateQuantity(item._id, item.size, 0)} aria-label='Remove' className='text-gray-400 hover:text-black shrink-0'>
                      <CloseIcon className='w-4 h-4' />
                    </button>
                  </div>

                  <p className='text-xs text-gray-500 mt-1.5'>Size: {item.size}</p>

                  <div className='flex items-center justify-between gap-4 mt-5'>
                    <div className='flex items-center border border-gray-300'>
                      <button onClick={()=>item.quantity > 1 && changeQuantity(item._id, item.size, -1)} aria-label='Decrease' className='w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black'>
                        <MinusIcon className='w-3 h-3' />
                      </button>
                      <span className='w-7 text-center text-xs'>{item.quantity}</span>
                      <button onClick={()=>changeQuantity(item._id, item.size, 1)} aria-label='Increase' className='w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black'>
                        <PlusIcon className='w-3 h-3' />
                      </button>
                    </div>

                    <div className='flex items-center gap-2'>
                      {originalPrice > price && <span className='text-xs text-gray-400 line-through'>RS.{originalPrice * item.quantity}</span>}
                      <span className='text-sm'>RS.{price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div>
          <OrderSummary
            action={({ agreed }) => (
              <button
                disabled={!agreed || belowMinimum}
                onClick={() => navigate('/shipping')}
                className='w-full bg-black text-white py-3.5 hover:bg-brand transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Place Order
              </button>
            )}
          />

          {belowMinimum && (
            <p className='text-xs text-brand mt-3'>
              Add {currency}{cartMinimum - total} more to reach the {currency}{cartMinimum} minimum for this order.
            </p>
          )}

          {/* Payment terms — prepaid only. */}
          <div className='border border-gray-300 bg-gray-50 px-4 py-3 mt-4'>
            <p className='text-sm font-medium'>No cash on delivery</p>
            <p className='text-xs text-gray-500 mt-1'>
              Prepaid orders only — pay by UPI, card or net banking when you confirm the order on WhatsApp.
            </p>
          </div>

          <CouponBox />
        </div>
      </div>
      )}

      {suggestions.length > 0 && (
        <div className='mt-20'>
          <div className='text-xl sm:text-2xl mb-2'>
            <Title text1={comboFocus && cartData.length > 0
              ? `ADD ${comboFocus.remaining} MORE ${comboFocus.size} FOR BUY ${comboFocus.next.buy} GET ${comboFocus.next.get}`
              : 'YOU MAY ALSO LIKE'} />
          </div>
          {comboFocus && cartData.length > 0 && (
            <p className='text-xs sm:text-sm text-gray-500 mb-6'>
              Combos count within a size — {comboFocus.next.get - comboFocus.next.buy} {comboFocus.size} posters come free once you reach {comboFocus.next.get} of them.
            </p>
          )}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8'>
            {suggestions.map(p => <ProductItem key={p._id} product={p} />)}
          </div>
        </div>
      )}

      <NewsletterBox />
    </div>
  )
}

export default Cart
