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
        const sorted = products.filter(p => !p.isCustom).sort((a,b)=> b.date - a.date)
        setLatestProducts(sorted.slice(0,12));
    },[products])

  return (
    <div className='my-14 bg-neutral-950 text-white rounded-[2rem] sm:rounded-[2.5rem] px-5 sm:px-8 py-9 sm:py-11'>

      <Reveal className='flex items-start justify-between gap-4 mb-7'>
        <div>
          <span className='inline-block text-xs sm:text-sm font-bold tracking-[0.2em] uppercase border border-white/30 rounded-full px-4 py-1.5 text-white mb-4'>
            Fresh Drops
          </span>
          <h2 className='heading-font font-bold text-3xl sm:text-4xl lg:text-5xl tracking-[0.08em]'>NEW ARRIVALS</h2>
        </div>
        <Link to='/collection?sort=new' className='text-sm sm:text-base font-bold text-white hover:text-brand transition-colors whitespace-nowrap mt-2'>
          View all
        </Link>
      </Reveal>

      <Carousel theme='dark'>
        {
          latestProducts.map((item,index)=>(
            <div key={item._id} className='w-[47%] sm:w-[31%] md:w-[23.5%] shrink-0 snap-start'>
              <Reveal delay={(index % 4) * 60}>
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
