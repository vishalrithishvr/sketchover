import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName } from '../assets/assets'
import { TrashIcon } from './icons/NavIcons'

const FavoriteRow = ({ product }) => {
    const { addToCart, toggleWishlist } = useContext(ShopContext)
    const [size, setSize] = useState('')
    const [choosing, setChoosing] = useState(false)
    const { price, originalPrice } = getSizePrice(size || product.sizes[0], product.subCategory)

    const onAddToBag = () => {
        if (!size) { setChoosing(true); return }
        addToCart(product._id, size)
    }

    return (
        <div className='flex gap-4 sm:gap-6 py-6 border-b border-gray-100 last:border-0'>
            <Link to={`/product/${product._id}`} className='shrink-0'>
                <img src={product.image[0]} alt='' className='w-20 sm:w-[110px] aspect-[176/206] object-cover bg-gray-100' />
            </Link>

            <div className='flex-1 min-w-0'>
                <Link to={`/product/${product._id}`} className='text-sm sm:text-base hover:text-brand transition-colors'>
                    {formatProductName(product)}
                </Link>

                <div className='mt-3'>
                    {choosing ? (
                        <div className='flex flex-wrap gap-2'>
                            {product.sizes.map(s => (
                                <button
                                    key={s}
                                    onClick={()=>setSize(s)}
                                    className={`text-xs px-3 py-1.5 transition-colors ${size === s ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button onClick={()=>setChoosing(true)} className='bg-black text-white text-xs px-4 py-2 hover:bg-brand transition-colors'>
                            Choose Size
                        </button>
                    )}
                </div>

                <div className='flex items-center justify-between gap-3 mt-4 flex-wrap'>
                    <div className='flex items-center gap-4'>
                        <button onClick={onAddToBag} className='border border-gray-300 text-xs px-4 py-1.5 hover:border-black transition-colors'>
                            Add to bag
                        </button>
                        <button onClick={()=>toggleWishlist(product._id)} className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors'>
                            <TrashIcon className='w-3.5 h-3.5' /> Remove
                        </button>
                    </div>
                    <div className='flex items-center gap-2'>
                        {originalPrice > price && <span className='text-xs text-gray-400 line-through'>RS.{originalPrice}</span>}
                        <span className='text-sm'>RS.{price}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const FavoritesList = ({ title = 'Favorites', emptyMessage }) => {
    const { products, wishlist } = useContext(ShopContext)
    const favoriteProducts = products.filter(p => wishlist.includes(p._id))

    if (favoriteProducts.length === 0) {
        return emptyMessage ? <p className='text-sm text-gray-400'>{emptyMessage}</p> : null
    }

    return (
        <div>
            {title && <p className='text-base mb-2'>{title}</p>}
            {favoriteProducts.map(p => <FavoriteRow key={p._id} product={p} />)}
        </div>
    )
}

export default FavoritesList
