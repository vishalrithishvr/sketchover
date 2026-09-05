import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary from '../components/OrderSummary';
import ProductItem from '../components/ProductItem';
import { PlusIcon, MinusIcon } from '../components/icons/NavIcons';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [agreed, setAgreed] = useState(false);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  const suggestions = products.filter(p => !cartData.some(c => c._id === p._id)).slice(0, 4);

  return (
    <div className='border-t pt-6'>

      <CheckoutSteps current='Cart' />

      <div className=' text-2xl mb-3'>
        <Title text1={'SHOPPING'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-gray-500 mb-4'>Your cart is empty.</p>
          <Link to='/collection' className='inline-block bg-black text-white text-sm px-6 py-3 rounded hover:bg-[#FF6B00] transition-colors'>Continue Shopping</Link>
        </div>
      ) : (
      <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10'>
        <div>
          {
            cartData.map((item, index) => {

              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              return (
                <div key={index} className='py-4 border-b text-gray-700 flex items-center gap-4'>
                  <img className='w-16 sm:w-20 rounded' src={productData.image[0]} alt="" />
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs sm:text-base font-medium truncate'>{productData.name}</p>
                    <p className='text-xs text-gray-400 mt-1'>Size: {item.size}</p>
                    <div className='flex items-center gap-4 mt-2'>
                      <div className='flex items-center border rounded'>
                        <button onClick={()=>updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))} className='w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black'>
                          <MinusIcon className='w-3 h-3' />
                        </button>
                        <span className='w-7 text-center text-xs'>{item.quantity}</span>
                        <button onClick={()=>updateQuantity(item._id, item.size, item.quantity + 1)} className='w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black'>
                          <PlusIcon className='w-3 h-3' />
                        </button>
                      </div>
                      <p className='text-sm font-medium'>{currency}{productData.price * item.quantity}</p>
                    </div>
                  </div>
                  <button onClick={() => updateQuantity(item._id, item.size, 0)} aria-label='Remove'>
                    <img className='w-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
                  </button>
                </div>
              )

            })
          }
        </div>

        <div>
          <OrderSummary>
            <label className='flex items-start gap-2 text-xs text-gray-500 mt-4'>
              <input type='checkbox' checked={agreed} onChange={()=>setAgreed(a=>!a)} className='mt-0.5' />
              I have read and agree to the website terms and conditions*
            </label>
            <button
              disabled={!agreed}
              onClick={() => navigate('/shipping')}
              className='w-full bg-black text-white text-sm mt-4 py-3 rounded hover:bg-[#FF6B00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black'
            >
              Place Order
            </button>
          </OrderSummary>
        </div>
      </div>
      )}

      {suggestions.length > 0 && (
        <div className='my-20'>
          <div className='text-xl mb-4'>
            <Title text1={'YOU MAY'} text2={'ALSO LIKE'} />
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {suggestions.map(p => (
              <ProductItem key={p._id} id={p._id} name={p.name} price={p.price} originalPrice={p.originalPrice} image={p.image} category={p.category} sizes={p.sizes} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Cart
