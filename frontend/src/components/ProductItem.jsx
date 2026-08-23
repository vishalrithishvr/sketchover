import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price,category,theme='light'}) => {

    const {currency} = useContext(ShopContext);
    const isDark = theme === 'dark';

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
          alt={name}
          loading='lazy'
        />
        {category && (
          <span className={`absolute top-2 left-2 text-[10px] tracking-wide px-2 py-0.5 rounded-full ${isDark ? 'bg-white/15 text-white' : 'bg-white/90 text-gray-700'}`}>
            {category}
          </span>
        )}
      </div>
      <div className='px-3 py-3'>
        <p className={`text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{name}</p>
        <p className={`text-sm font-medium mt-0.5 ${isDark ? 'text-[#FF6B00]' : 'text-gray-900'}`}>{currency}{price}</p>
      </div>
    </Link>
  )
}

export default ProductItem
