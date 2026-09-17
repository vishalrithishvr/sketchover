import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import Reveal from './Reveal';

const RelatedProducts = ({ category, subCategory, currentId }) => {

    const { products } = useContext(ShopContext);

    const related = useMemo(() => {
        const sameCategory = products.filter(item =>
            item._id !== currentId && !item.isCustom && item.category === category
        )
        const preferred = sameCategory.filter(item => item.subCategory === subCategory)
        // Fall back to the rest of the category so the row is never sparse.
        return [...preferred, ...sameCategory.filter(item => item.subCategory !== subCategory)].slice(0, 4)
    }, [products, category, subCategory, currentId])

    if (related.length === 0) return null;

  return (
    <div className='mt-20'>
      <div className='text-xl sm:text-2xl mb-7'>
        <Title text1={'YOU MAY ALSO LIKE'} />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8'>
        {related.map((item,index)=>(
            <Reveal key={item._id} delay={index * 60}>
              <ProductItem product={item} />
            </Reveal>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
