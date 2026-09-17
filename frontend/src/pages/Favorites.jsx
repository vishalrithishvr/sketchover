import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import FavoritesList from '../components/FavoritesList'
import NewsletterBox from '../components/NewsletterBox'
import { HeartIcon } from '../components/icons/NavIcons'

const Favorites = () => {
    const { wishlist } = useContext(ShopContext)

    return (
        <div className='pt-10 min-h-[50vh]'>
            <div className='text-xl sm:text-2xl mb-8'>
                <Title text1={'FAVORITES'} />
            </div>

            {wishlist.length === 0 ? (
                <div className='text-center py-16 text-gray-400'>
                    <HeartIcon className='w-10 h-10 mx-auto mb-3 text-gray-300' />
                    <p className='mb-5'>Nothing saved yet — tap the heart on any poster to add it here.</p>
                    <Link to='/collection' className='inline-block bg-black text-white text-sm px-7 py-3 hover:bg-brand transition-colors'>Browse Posters</Link>
                </div>
            ) : (
                <div className='max-w-3xl'>
                    <FavoritesList title='' />
                </div>
            )}

            <NewsletterBox />
        </div>
    )
}

export default Favorites
