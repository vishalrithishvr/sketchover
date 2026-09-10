import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, formatProductName } from '../assets/assets'
import Title from '../components/Title'
import { HeartIcon } from '../components/icons/NavIcons'

const FavoriteRow = ({ product }) => {
    const { currency, addToCart, toggleWishlist } = useContext(ShopContext)
    const [size, setSize] = useState('')
    const [choosing, setChoosing] = useState(false)
    const { price, originalPrice } = getSizePrice(size || product.sizes[0], product.subCategory)

    const onAddToBag = () => {
        if (!size) { setChoosing(true); return }
        addToCart(product._id, size)
    }

    return (
        <div className='flex gap-4 py-5 border-b'>
            <Link to={`/product/${product._id}`}>
                <img src={product.image[0]} alt={formatProductName(product)} className='w-20 h-24 sm:w-24 sm:h-28 object-cover rounded' />
            </Link>
            <div className='flex-1 min-w-0'>
                <Link to={`/product/${product._id}`} className='font-medium text-sm sm:text-base hover:text-[#FF6B00]'>{formatProductName(product)}</Link>

                {choosing && (
                    <div className='flex gap-2 mt-2'>
                        {product.sizes.map(s => (
                            <button key={s} onClick={()=>setSize(s)} className={`text-xs border px-2 py-1 rounded ${size === s ? 'bg-black text-white border-black' : ''}`}>{s}</button>
                        ))}
                    </div>
                )}

                <div className='flex items-center gap-3 mt-3 flex-wrap'>
                    <button onClick={onAddToBag} className='bg-black text-white text-xs px-4 py-2 rounded hover:bg-[#FF6B00] transition-colors'>
                        {choosing && !size ? 'Pick a size' : 'Add to bag'}
                    </button>
                    <button onClick={()=>toggleWishlist(product._id)} className='text-xs text-gray-500 hover:text-black underline'>Remove</button>
                    {originalPrice > price && <span className='text-xs text-gray-400 line-through'>{currency}{originalPrice}</span>}
                    <span className='text-sm font-medium'>{currency}{price}</span>
                </div>
            </div>
        </div>
    )
}

const Favorites = () => {
    const { products, wishlist } = useContext(ShopContext)
    const favoriteProducts = products.filter(p => wishlist.includes(p._id))

    return (
        <div className='border-t pt-10 min-h-[50vh]'>
            <div className='text-2xl mb-6'>
                <Title text1={'MY'} text2={'FAVORITES'} />
            </div>

            {favoriteProducts.length === 0 ? (
                <div className='text-center py-16 text-gray-400'>
                    <HeartIcon className='w-10 h-10 mx-auto mb-3 text-gray-300' />
                    <p className='mb-4'>Nothing saved yet — tap the heart on any poster to add it here.</p>
                    <Link to='/collection' className='inline-block bg-black text-white text-sm px-6 py-3 rounded hover:bg-[#FF6B00] transition-colors'>Browse Posters</Link>
                </div>
            ) : (
                <div className='max-w-2xl'>
                    {favoriteProducts.map(p => <FavoriteRow key={p._id} product={p} />)}
                </div>
            )}
        </div>
    )
}

export default Favorites
