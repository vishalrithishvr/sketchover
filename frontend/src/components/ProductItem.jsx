import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { formatProductName, DEFAULT_SIZE } from '../assets/assets'

const ProductItem = ({ product, theme = 'light' }) => {

    const { addToCart } = useContext(ShopContext);
    const { _id: id, image, price, originalPrice, sizes, isCustom } = product;
    const isDark = theme === 'dark';
    const hasDiscount = originalPrice && originalPrice > price;
    const displayName = formatProductName(product);

    const quickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(id, sizes?.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : sizes?.[0]);
    }

  return (
    <Link onClick={()=>scrollTo(0,0)} to={`/product/${id}`} className='group block'>

      {/* Image */}
      <div className={`relative overflow-hidden aspect-[333/461] ${isDark ? 'bg-neutral-800' : 'bg-gray-100'}`}>
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

      <button
        onClick={quickAdd}
        className={`mt-2 w-full text-[11px] sm:text-xs py-2 transition-colors ${isDark ? 'bg-white text-black hover:bg-brand hover:text-white' : 'bg-black text-white hover:bg-brand'}`}
      >
        Add to Cart
      </button>
    </Link>
  )
}

export default ProductItem
