import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { HeartIcon } from './icons/NavIcons'
import { formatProductName } from '../assets/assets'

const ProductItem = ({ product, theme = 'light' }) => {

    const { currency, addToCart, wishlist, toggleWishlist } = useContext(ShopContext);
    const { _id: id, image, name, price, originalPrice, category, subCategory, sizes } = product;
    const isDark = theme === 'dark';
    const isWishlisted = wishlist.includes(id);
    const hasDiscount = originalPrice && originalPrice > price;
    const displayName = formatProductName(product);

    const quickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(id, (sizes && sizes[0]) || 'A4');
    }

    const onWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(id);
    }

  return (
    <Link
      onClick={()=>scrollTo(0,0)}
      to={`/product/${id}`}
      className={`group block cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1
        ${isDark ? 'bg-neutral-900 border-white/10 hover:shadow-xl hover:shadow-black/40' : 'bg-white border-gray-200 hover:shadow-xl hover:shadow-gray-300/50'}`}
    >
      <div className='relative aspect-[4/5] overflow-hidden bg-gray-100'>
        <img
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
          src={image[0]}
          alt={displayName}
          loading='lazy'
        />
        {hasDiscount && (
          <span className='absolute top-2 left-2 bg-black text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded'>
            Sale
          </span>
        )}
        <button
          onClick={onWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-[#FF6B00] text-white' : 'bg-white/85 text-gray-600 hover:text-[#FF6B00]'}`}
        >
          <HeartIcon filled={isWishlisted} className='w-3.5 h-3.5' />
        </button>
        {category && (
          <span className={`absolute bottom-2 left-2 text-[10px] tracking-wide px-2 py-0.5 rounded-full ${isDark ? 'bg-white/15 text-white' : 'bg-white/90 text-gray-700'}`}>
            {category}
          </span>
        )}
      </div>
      <div className='px-3 py-3'>
        <p className={`text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{displayName}</p>
        <div className='flex items-center gap-2 mt-0.5'>
          <span className='text-[10px] text-gray-400 uppercase tracking-wide'>From</span>
          {hasDiscount && <span className='text-xs text-gray-400 line-through'>{currency}{originalPrice}</span>}
          <span className={`text-sm font-medium ${isDark ? 'text-[#FF6B00]' : 'text-gray-900'}`}>{currency}{price}</span>
        </div>
        <button
          onClick={quickAdd}
          className={`mt-2 w-full text-xs font-medium py-2 rounded transition-colors ${isDark ? 'bg-white text-black hover:bg-[#FF6B00] hover:text-white' : 'bg-black text-white hover:bg-[#FF6B00]'}`}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

export default ProductItem
