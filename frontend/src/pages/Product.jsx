import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { getSizePrice, formatProductName, DEFAULT_SIZE, isComboEligible } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import LatestArrivalGrid from '../components/LatestArrivalGrid';
import NewsletterBox from '../components/NewsletterBox';
import MediaSlot from '../components/MediaSlot';
import ComboOffer from '../components/ComboOffer';
import CustomPosterSender from '../components/CustomPosterSender';
import { PlusIcon, MinusIcon, HeartIcon } from '../components/icons/NavIcons';

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-gray-200'>
      <button onClick={()=>setOpen(o=>!o)} className='w-full flex items-center justify-between py-3.5 text-left'>
        <span className='text-sm text-gray-800'>{title}</span>
        {open ? <MinusIcon className='w-4 h-4 text-gray-500' /> : <PlusIcon className='w-4 h-4 text-gray-500' />}
      </button>
      {open && <div className='pb-4 text-sm text-gray-500 flex flex-col gap-3'>{children}</div>}
    </div>
  )
}

const Product = () => {

  const { productId } = useParams();
  const { products, addToCart, cartItems, wishlist, toggleWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const found = products.find(item => item._id === productId)
    if (found) {
      setProductData(found)
      setImage(found.image[0])
      setSize(found.sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : found.sizes[0])
      setQuantity(1)
    }
  }, [productId, products])

  if (!productData) return <div className='opacity-0'></div>

  const { price, originalPrice } = getSizePrice(size || DEFAULT_SIZE, productData.subCategory, productData.panels);
  const hasDiscount = originalPrice > price;
  const isWishlisted = wishlist.includes(productData._id)
  // Everything of this poster already in the basket, by size.
  const cartLines = Object.entries(cartItems[productData._id] || {}).filter(([, qty]) => qty > 0)
  const inCart = cartLines.reduce((sum, [, qty]) => sum + qty, 0)

  return (
    <div className='pt-8'>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-14'>

        {/* Images */}
        <div>
          <div className='relative bg-gray-100 aspect-[763/801] overflow-hidden'>
            <img className='w-full h-full object-cover' src={image} alt={formatProductName(productData)} />
            {(productData.isCustom || hasDiscount) && (
              <span className='absolute top-0 right-0 bg-black text-white text-[11px] px-4 py-1.5'>
                {productData.isCustom ? 'Custom' : 'Sale'}
              </span>
            )}
            <button
              onClick={()=>toggleWishlist(productData._id)}
              aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
              className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-brand text-white' : 'bg-white/90 text-gray-600 hover:text-brand'}`}
            >
              <HeartIcon filled={isWishlisted} className='w-4 h-4' />
            </button>
          </div>

          <div className='grid grid-cols-4 gap-2 sm:gap-3 mt-3'>
            {productData.image.map((item,index)=>(
              <button
                key={index}
                onClick={()=>setImage(item)}
                className={`aspect-square overflow-hidden bg-gray-100 border-2 ${image === item ? 'border-black' : 'border-transparent'}`}
              >
                <img src={item} className='w-full h-full object-cover' alt='' />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className='heading-font uppercase tracking-[0.06em] text-2xl sm:text-3xl leading-tight'>
            {formatProductName(productData)}
          </h1>

          <div className='flex items-center gap-3 mt-3'>
            {hasDiscount && <span className='text-gray-400 line-through'>RS. {originalPrice}.00</span>}
            <span className='text-xl'>RS. {price}.00</span>
          </div>

          {/* Size */}
          <p className='text-sm text-gray-500 mt-6 mb-2'>Size</p>
          <div className='flex flex-wrap gap-2'>
            {productData.sizes.map((item)=>{
              const soldOut = (productData.soldOutSizes || []).includes(item)
              return (
                <button
                  key={item}
                  onClick={()=>setSize(item)}
                  disabled={soldOut}
                  title={soldOut ? 'Sold out in this size' : undefined}
                  className={`min-w-[56px] py-2 px-4 text-sm border transition-colors ${
                    soldOut ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                      : item === size ? 'bg-gray-500 border-gray-500 text-white'
                      : 'bg-transparent border-gray-300 text-black hover:border-gray-500'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>

          {/* Qty */}
          <p className='text-sm text-gray-500 mt-5 mb-2'>Qty</p>
          <div className='inline-flex items-center border border-gray-300'>
            <button onClick={()=>setQuantity(q => Math.max(1, q - 1))} aria-label='Decrease' className='w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black'>
              <MinusIcon className='w-3.5 h-3.5' />
            </button>
            <span className='w-10 text-center text-sm'>{quantity}</span>
            <button onClick={()=>setQuantity(q => q + 1)} aria-label='Increase' className='w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black'>
              <PlusIcon className='w-3.5 h-3.5' />
            </button>
          </div>

          {/* Custom artwork goes straight to the studio on WhatsApp. */}
          {productData.isCustom && (
            <div className='mt-6'>
              <CustomPosterSender defaultSize={size} compact />
            </div>
          )}

          <button
            onClick={()=>addToCart(productData._id,size,quantity)}
            disabled={productData.outOfStock || (productData.soldOutSizes || []).includes(size)}
            className='w-full bg-black text-white py-3 text-sm mt-3 hover:bg-brand transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
          >
            {productData.outOfStock ? 'Sold out' : 'Add to cart'}
          </button>

          {inCart > 0 && (
            <p className='text-xs text-gray-600 mt-2 animate-pop-in'>
              <span className='text-brand'>{inCart} in your cart</span>
              <span className='text-gray-400'> ({cartLines.map(([s, q]) => `${q} × ${s}`).join(', ')})</span>
              {' — '}
              <Link to='/cart' className='underline hover:text-black'>view cart</Link>
            </p>
          )}

          {/* Accordions */}
          <div className='mt-8'>
            <Accordion title='Description'>
              <p>{productData.description}</p>
              <p>Printed on premium 200 GSM matte paper for true-to-design colour and a glare-free finish.</p>
              <p>Available in {productData.sizes.join(', ')} — frame not included.</p>
            </Accordion>
            <Accordion title='Shipping and Packaging'>
              <p>Every order is rolled (never folded) and shipped in a rigid cardboard tube so it arrives flat and crease-free.</p>
              <p>Printed and dispatched within 2-3 business days; delivery typically takes 4-7 days. Free delivery on orders from ₹399.</p>
            </Accordion>

            {isComboEligible(productData) && <ComboOffer product={productData} size={size} />}
          </div>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />

      <MediaSlot slot='product-below' columns={2} />

      <LatestArrivalGrid excludeId={productData._id} />

      <NewsletterBox />
    </div>
  )
}

export default Product
