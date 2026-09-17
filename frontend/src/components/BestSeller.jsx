import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import Carousel from './Carousel';
import Reveal from './Reveal';

// "Collage Poster Kit" — the multi-panel (Split) products.
const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [posterSets,setPosterSets] = useState([]);

    useEffect(()=>{
        setPosterSets(products.filter((item)=>(item.subCategory === 'Split')))
    },[products])

    if (posterSets.length === 0) return null;

  return (
    <div className='my-14'>
      <div className='text-center text-xl sm:text-2xl mb-7'>
        <Title text1={'COLLAGE POSTER KIT'}/>
      </div>

      <Carousel>
        {
            posterSets.map((item,index)=>(
                <div key={item._id} className='w-[47%] sm:w-[31%] md:w-[23.5%] lg:w-[19%] shrink-0 snap-start'>
                  <Reveal delay={index * 70}>
                    <ProductItem product={item} />
                  </Reveal>
                </div>
            ))
        }
      </Carousel>

      <div className='flex justify-center mt-6'>
        <Link to='/collection' className='bg-black text-white text-xs px-8 py-2.5 hover:bg-brand transition-colors'>
          View all
        </Link>
      </div>
    </div>
  )
}

export default BestSeller
