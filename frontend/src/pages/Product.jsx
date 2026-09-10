import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets, getSizePrice, formatProductName, SIZES } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { HeartIcon, PlusIcon, MinusIcon } from '../components/icons/NavIcons';

const Product = () => {

  const { productId } = useParams();
  const { products, currency ,addToCart, wishlist, toggleWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [openTab, setOpenTab] = useState('description')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        setSize(item.sizes[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
    setQuantity(1);
  }, [productId,products])

  if (!productData) return <div className='opacity-0'></div>

  const isWishlisted = wishlist.includes(productData._id);
  const { price, originalPrice } = getSizePrice(size || productData.sizes[0], productData.subCategory);
  const hasDiscount = originalPrice > price;

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded border-2 ${image === item ? 'border-black' : 'border-transparent'}`} alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%] relative'>
              <img className='w-full h-auto rounded-lg' src={image} alt="" />
              <button
                onClick={()=>toggleWishlist(productData._id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#FF6B00] text-white' : 'bg-white/90 text-gray-600 hover:text-[#FF6B00]'}`}
              >
                <HeartIcon filled={isWishlisted} className='w-4 h-4' />
              </button>
              {hasDiscount && (
                <span className='absolute top-3 left-3 bg-black text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded'>Sale</span>
              )}
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{formatProductName(productData)}</h1>
          <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div>
          <div className='flex items-center gap-3 mt-5'>
            {hasDiscount && <p className='text-lg text-gray-400 line-through'>{currency}{originalPrice}</p>}
            <p className='text-3xl font-medium'>{currency}{price}</p>
          </div>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 rounded ${item === size ? 'border-black bg-black text-white' : ''}`} key={index}>{item}</button>
                ))}
              </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='flex items-center border rounded'>
              <button onClick={()=>setQuantity(q => Math.max(1, q - 1))} className='w-9 h-10 flex items-center justify-center text-gray-600 hover:text-black'>
                <MinusIcon className='w-3.5 h-3.5' />
              </button>
              <span className='w-8 text-center text-sm'>{quantity}</span>
              <button onClick={()=>setQuantity(q => q + 1)} className='w-9 h-10 flex items-center justify-center text-gray-600 hover:text-black'>
                <PlusIcon className='w-3.5 h-3.5' />
              </button>
            </div>
            <button onClick={()=>addToCart(productData._id,size,quantity)} className='flex-1 bg-black text-white px-8 py-3 text-sm rounded hover:bg-[#FF6B00] transition-colors'>ADD TO CART</button>
          </div>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Shipping Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <button onClick={()=>setOpenTab('description')} className={`border px-5 py-3 text-sm ${openTab === 'description' ? 'font-bold' : 'text-gray-500'}`}>Description</button>
          <button onClick={()=>setOpenTab('shipping')} className={`border px-5 py-3 text-sm ${openTab === 'shipping' ? 'font-bold' : 'text-gray-500'}`}>Shipping and Packaging</button>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          {openTab === 'description' ? (
            <>
              <p>Printed on premium 200 GSM matte paper for true-to-design colour and a glare-free finish. Every poster ships rolled in a rigid tube to arrive flat and crease-free.</p>
              <p>Available in {SIZES.join(', ')} — pick the size that fits your wall. Frame not included.</p>
            </>
          ) : (
            <>
              <p>Every order is rolled (never folded) and shipped in a rigid cardboard tube so it arrives flat and crease-free.</p>
              <p>Orders are printed and dispatched within 2-3 business days. Delivery typically takes 4-7 days depending on your location — free on all orders (minimum order value ₹499).</p>
            </>
          )}
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  )
}

export default Product
