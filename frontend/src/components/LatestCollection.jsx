import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import Carousel from './Carousel';
import Reveal from './Reveal';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[products])

  return (
    <div className='my-16 rounded-3xl bg-neutral-950 text-white px-4 sm:px-8 py-10 sm:py-14'>

      <Reveal className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8'>
        <div>
          <span className='inline-block text-[11px] tracking-[0.2em] uppercase border border-white/20 rounded-full px-3 py-1 text-white/70 mb-3'>
            Fresh Drops
          </span>
          <h2 className='heading-font text-2xl sm:text-3xl'>New Arrivals</h2>
          <p className='text-white/50 text-xs sm:text-sm mt-2 max-w-md'>Fresh off the press — our latest drops across cars, anime, movies and more.</p>
        </div>
        <Link to='/collection' className='text-xs sm:text-sm text-white/70 hover:text-[#FF6B00] transition-colors whitespace-nowrap'>
          View all &rarr;
        </Link>
      </Reveal>

      {/* Rendering Products */}
      <Carousel>
        {
          latestProducts.map((item,index)=>(
            <div key={item._id} className='w-[46%] sm:w-[31%] md:w-[23%] lg:w-[18.5%] shrink-0 snap-start'>
              <Reveal delay={(index % 5) * 70}>
                <ProductItem product={item} theme='dark' />
              </Reveal>
            </div>
          ))
        }
      </Carousel>
    </div>
  )
}

export default LatestCollection
