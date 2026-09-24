import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { CUSTOM_SIZES } from '../assets/assets'
import Title from '../components/Title'
import PageBanner from '../components/PageBanner'
import ProductItem from '../components/ProductItem'
import Pagination from '../components/Pagination'
import CustomerReviews from '../components/CustomerReviews'
import MyCustomPosters from '../components/MyCustomPosters'
import NewsletterBox from '../components/NewsletterBox'
import Reveal from '../components/Reveal'

const PER_PAGE = 8

const CustomPosters = () => {
  const { products } = useContext(ShopContext)
  const [sizeFilter, setSizeFilter] = useState('')
  const [sortType, setSortType] = useState('relavent')
  const [page, setPage] = useState(1)

  // The custom product plus anything else offered as personalised work.
  const items = useMemo(() => {
    let list = products.filter(p => p.isCustom || p.category === 'Custom')

    // Nothing custom in the catalogue yet? show the split sets as the closest thing.
    if (list.length === 0) list = products.filter(p => p.subCategory === 'Split')

    if (sizeFilter) list = list.filter(p => p.sizes.includes(sizeFilter))

    const sorted = list.slice()
    if (sortType === 'low-high') sorted.sort((a, b) => a.price - b.price)
    if (sortType === 'high-low') sorted.sort((a, b) => b.price - a.price)
    if (sortType === 'new') sorted.sort((a, b) => b.date - a.date)
    return sorted
  }, [products, sizeFilter, sortType])

  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const visible = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <PageBanner
        title='Custom Posters'
        subtitle='Upload your own photo or artwork — printed in A4 or A3'
        starburst
      />

      <div className='text-center text-xl sm:text-2xl mt-10 mb-6'>
        <Title text1={'CUSTOM POSTERS'} />
      </div>

      <div className='flex items-center justify-between gap-4 flex-wrap text-xs sm:text-sm mb-8'>
        <div className='flex items-center gap-3'>
          <span className='text-gray-500'>Filter:</span>
          <select
            value={sizeFilter}
            onChange={(e)=>setSizeFilter(e.target.value)}
            className='border border-gray-300 px-3 py-1.5 outline-none focus:border-black'
          >
            <option value=''>Size</option>
            {CUSTOM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className='flex items-center gap-3'>
          <span className='text-gray-500'>Sort by:</span>
          <select
            value={sortType}
            onChange={(e)=>setSortType(e.target.value)}
            className='border border-gray-300 px-3 py-1.5 outline-none focus:border-black'
          >
            <option value='relavent'>Relevant</option>
            <option value='new'>Latest</option>
            <option value='low-high'>Price: Low to High</option>
            <option value='high-low'>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8'>
        {visible.map((item, index) => (
          <Reveal key={item._id} delay={(index % 8) * 40}>
            <ProductItem product={item} />
          </Reveal>
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} className='mt-12' />

      <MyCustomPosters />

      <CustomerReviews />
      <NewsletterBox />
    </div>
  )
}

export default CustomPosters
