import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName, MIN_ORDER_VALUE } from '../assets/assets';
import Title from '../components/Title';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary, { CouponBox } from '../components/OrderSummary';
import ProductItem from '../components/ProductItem';
import NewsletterBox from '../components/NewsletterBox';
import { PlusIcon, MinusIcon, CloseIcon } from '../components/icons/NavIcons';

const Cart = () => {

  const { products, cartItems, updateQuantity, navigate, getCartAmount } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

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
  const subtotal = getCartAmount();
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_VALUE;

  return (
    <div>
      <CheckoutSteps current='Cart' />

      <div className='text-xl sm:text-2xl mb-8'>
        <Title text1={'SHOPPING CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-gray-500 mb-4'>Your cart is empty.</p>
          <Link to='/collection' className='inline-block bg-black text-white text-sm px-7 py-3 hover:bg-brand transition-colors'>Continue Shopping</Link>
        </div>
      ) : (
      <div className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>

        {/* Items */}
        <div>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null;
            const { price, originalPrice } = getSizePrice(item.size, productData.subCategory);

            return (
              <div key={index} className='flex gap-4 sm:gap-6 py-6 border-b border-gray-200'>
                <img className='w-20 sm:w-[110px] aspect-[176/206] object-cover bg-gray-100 shrink-0' src={productData.image[0]} alt='' />

                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-3'>
                    <p className='text-sm sm:text-base'>{formatProductName(productData)}</p>
                    <button onClick={() => updateQuantity(item._id, item.size, 0)} aria-label='Remove' className='text-gray-400 hover:text-black shrink-0'>
                      <CloseIcon className='w-4 h-4' />
                    </button>
                  </div>

                  <p className='text-xs text-gray-500 mt-1.5'>Size: {item.size}</p>

                  <div className='flex items-center justify-between gap-4 mt-5'>
                    <div className='flex items-center border border-gray-300'>
                      <button onClick={()=>updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))} aria-label='Decrease' className='w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black'>
                        <MinusIcon className='w-3 h-3' />
                      </button>
                      <span className='w-7 text-center text-xs'>{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item._id, item.size, item.quantity + 1)} aria-label='Increase' className='w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black'>
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
              Add ₹{MIN_ORDER_VALUE - subtotal} more to reach the ₹{MIN_ORDER_VALUE} minimum order.
            </p>
          )}

          <CouponBox />
        </div>
      </div>
      )}

      {suggestions.length > 0 && (
        <div className='mt-20'>
          <div className='text-xl sm:text-2xl mb-7'>
            <Title text1={'YOU MAY ALSO LIKE'} />
          </div>
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
