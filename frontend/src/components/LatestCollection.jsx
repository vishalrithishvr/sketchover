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
    <div className='my-14 bg-neutral-950 text-white rounded-lg px-4 sm:px-7 py-8 sm:py-10'>

      <Reveal className='flex items-start justify-between gap-4 mb-6'>
        <div>
          <span className='inline-block text-[10px] tracking-[0.2em] uppercase border border-white/25 rounded-full px-3 py-1 text-white/70 mb-3'>
            Fresh Drops
          </span>
          <h2 className='heading-font text-2xl sm:text-3xl tracking-[0.08em]'>NEW ARRIVALS</h2>
        </div>
        <Link to='/collection?sort=new' className='text-xs text-white/70 hover:text-brand transition-colors whitespace-nowrap mt-1'>
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
