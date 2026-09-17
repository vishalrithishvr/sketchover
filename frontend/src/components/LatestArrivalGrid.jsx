import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import Pagination from './Pagination'
import Reveal from './Reveal'

const PER_PAGE = 4

// "NEW ARRIVAL" block used below the product pages.
const LatestArrivalGrid = ({ excludeId }) => {
  const { products } = useContext(ShopContext)
  const [page, setPage] = useState(1)

  const items = useMemo(() => (
    products
      .filter(p => p._id !== excludeId && !p.isCustom)
      .slice()
      .sort((a, b) => b.date - a.date)
  ), [products, excludeId])

  if (items.length === 0) return null

  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const visible = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className='my-16'>
      <div className='text-center text-xl sm:text-2xl mb-7'>
        <Title text1={'NEW ARRIVAL'} />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8'>
        {visible.map((item, index) => (
          <Reveal key={item._id} delay={index * 60}>
            <ProductItem product={item} />
          </Reveal>
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} className='mt-10' />
    </div>
  )
}

export default LatestArrivalGrid
