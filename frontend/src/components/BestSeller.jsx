import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import Carousel from './Carousel';
import Reveal from './Reveal';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [posterSets,setPosterSets] = useState([]);

    useEffect(()=>{
        const sets = products.filter((item)=>(item.subCategory === 'Split'));
        setPosterSets(sets)
    },[products])

    if (posterSets.length === 0) return null;

  return (
    <div className='my-16'>
      <div className='text-center text-3xl py-6'>
        <Title text1={'COLLAGE'} text2={'POSTER KIT'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Matching multi-panel sets, printed and shipped together.
        </p>
      </div>

      <Carousel>
        {
            posterSets.map((item,index)=>(
                <div key={item._id} className='w-[70%] sm:w-[46%] md:w-[31%] lg:w-[23%] shrink-0 snap-start'>
                  <Reveal delay={index * 80}>
                    <ProductItem product={item} />
                  </Reveal>
                </div>
            ))
        }
      </Carousel>
    </div>
  )
}

export default BestSeller
