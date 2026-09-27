import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { formatProductName, DEFAULT_SIZE } from '../assets/assets'
import { PlusIcon, MinusIcon } from './icons/NavIcons'

const ProductItem = ({ product, theme = 'light' }) => {

    const { addToCart, updateQuantity, cartItems } = useContext(ShopContext);
    const { _id: id, image, price, originalPrice, sizes, isCustom } = product;
    const isDark = theme === 'dark';
    const hasDiscount = originalPrice && originalPrice > price;
    const displayName = formatProductName(product);

    // What this poster already contributes to the basket, shown on the tile so
    // the shopper can build a combo without leaving the listing.
    const lines = cartItems[id] || {};
    const inCart = Object.values(lines).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
    const defaultSize = sizes?.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : sizes?.[0];
    // Step the size that is actually in the basket; fall back to the default one.
    const sizeInCart = Object.keys(lines).find(size => lines[size] > 0 && size === defaultSize)
        || Object.keys(lines).find(size => lines[size] > 0)
        || defaultSize;

    const stop = (e) => { e.preventDefault(); e.stopPropagation(); }

    const quickAdd = (e) => {
        stop(e);
        addToCart(id, defaultSize);
    }

    const step = (e, delta) => {
        stop(e);
        const current = lines[sizeInCart] || 0;
        if (delta > 0 && current === 0) return addToCart(id, sizeInCart)
        updateQuantity(id, sizeInCart, Math.max(0, current + delta));
    }

  return (
    <Link
      onClick={()=>scrollTo(0,0)}
      to={`/product/${id}`}
      className='group block transition-transform duration-300 hover:-translate-y-1'
    >

      {/* Image */}
      <div className={`relative overflow-hidden aspect-[333/461] ${isDark ? 'bg-neutral-800' : 'bg-gray-100'} ${inCart > 0 ? 'ring-2 ring-brand' : ''}`}>
        <img
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
          src={image[0]}
          alt={displayName}
          loading='lazy'
        />
        {(hasDiscount || isCustom) && (
          <span className='absolute top-0 right-0 bg-black text-white text-[10px] px-3 py-1'>
            {isCustom ? 'Custom' : 'Sale'}
          </span>
        )}
        {inCart > 0 && (
          <span className='absolute bottom-0 left-0 bg-brand text-white text-[10px] px-3 py-1 animate-pop-in'>
            {inCart} in cart
          </span>
        )}
      </div>

      {/* Details */}
      <p className={`mt-3 text-xs sm:text-[13px] leading-snug line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        {displayName}
      </p>

      <div className='flex items-center gap-2 mt-1'>
        {hasDiscount && (
          <span className={`text-[11px] line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>RS.{originalPrice}</span>
        )}
        <span className={`text-[13px] ${isDark ? 'text-white' : 'text-gray-900'}`}>RS.{price}.00</span>
      </div>

      {inCart > 0 ? (
        <div className={`mt-2 flex items-center justify-between border ${isDark ? 'border-white/30' : 'border-black'}`}>
          <button
            onClick={(e) => step(e, -1)}
            aria-label={`Remove one ${displayName}`}
            className={`w-9 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-white hover:text-brand' : 'text-gray-600 hover:text-brand'}`}
          >
            <MinusIcon className='w-3 h-3' />
          </button>
          <span className={`text-[11px] sm:text-xs ${isDark ? 'text-white' : 'text-black'}`}>
            {inCart} added
          </span>
          <button
            onClick={(e) => step(e, 1)}
            aria-label={`Add another ${displayName}`}
            className={`w-9 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-white hover:text-brand' : 'text-gray-600 hover:text-brand'}`}
          >
            <PlusIcon className='w-3 h-3' />
          </button>
        </div>
      ) : (
        <button
          onClick={quickAdd}
          className={`mt-2 w-full text-[11px] sm:text-xs py-2 transition-colors ${isDark ? 'bg-white text-black hover:bg-brand hover:text-white' : 'bg-black text-white hover:bg-brand'}`}
        >
          Add to Cart
        </button>
      )}
    </Link>
  )
}

export default ProductItem
