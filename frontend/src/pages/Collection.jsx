import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { SIZES } from '../assets/assets'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Pagination from '../components/Pagination';
import PageBanner from '../components/PageBanner';
import NewsletterBox from '../components/NewsletterBox';
import Reveal from '../components/Reveal';
import { CloseIcon } from '../components/icons/NavIcons';

const PER_PAGE = 12

const Collection = () => {

  const { products , search , showSearch } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [filterProducts,setFilterProducts] = useState([]);
  const [sizeFilter,setSizeFilter] = useState('');
  const [sortType,setSortType] = useState(()=> searchParams.get('sort') === 'new' ? 'new' : 'relavent')
  const [page, setPage] = useState(1)
  const category = searchParams.get('category');
  const bestsellerOnly = searchParams.get('bestseller') === 'true';
  const splitsOnly = searchParams.get('type') === 'split';

  useEffect(()=>{

    let productsCopy = products.filter(p => !p.isCustom);

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category) {
      productsCopy = productsCopy.filter(item => item.category === category);
    }

    if (bestsellerOnly) {
      productsCopy = productsCopy.filter(item => item.bestseller);
    }

    if (splitsOnly) {
      productsCopy = productsCopy.filter(item => item.subCategory === 'Split');
    }

    if (sizeFilter) {
      productsCopy = productsCopy.filter(item => item.sizes.includes(sizeFilter));
    }

    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a,b)=>(a.price - b.price));
        break;
      case 'high-low':
        productsCopy.sort((a,b)=>(b.price - a.price));
        break;
      case 'new':
        productsCopy.sort((a,b)=>(b.date - a.date));
        break;
      case 'popularity':
        productsCopy.sort((a,b)=>(Number(b.bestseller) - Number(a.bestseller)) || (b.date - a.date));
        break;
      default:
        break;
    }

    setFilterProducts(productsCopy)
    setPage(1)

  },[category, bestsellerOnly, splitsOnly, sizeFilter, sortType, search, showSearch, products])

  const pageCount = Math.max(1, Math.ceil(filterProducts.length / PER_PAGE))
  const visible = filterProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const changePage = (next) => {
    setPage(next)
    scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <PageBanner title={category ? category : 'Shop All Products'} subtitle='Premium matte prints — A6 to A3+' />

      <div className='text-center text-xl sm:text-2xl mt-10 mb-6'>
        <Title text1={category ? category : 'Shop All Products'} />
      </div>

      {/* Filter / sort row */}
      <div className='flex items-center justify-between gap-4 flex-wrap text-xs sm:text-sm mb-8'>
        <div className='flex items-center gap-3'>
          <span className='text-gray-500'>Filter:</span>
          <select
            value={sizeFilter}
            onChange={(e)=>setSizeFilter(e.target.value)}
            className='border border-gray-300 px-3 py-1.5 outline-none focus:border-black'
          >
            <option value=''>Size</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {category && (
            <Link to='/collection' className='inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black border rounded-full px-3 py-1'>
              {category} <CloseIcon className='w-3 h-3' />
            </Link>
          )}
        </div>

        <div className='flex items-center gap-3'>
          <span className='text-gray-500'>Sort by:</span>
          <select
            onChange={(e)=>setSortType(e.target.value)}
            value={sortType}
            className='border border-gray-300 px-3 py-1.5 outline-none focus:border-black'
          >
            <option value='relavent'>Relevant</option>
            <option value='new'>Latest</option>
            <option value='popularity'>Popularity</option>
            <option value='low-high'>Price: Low to High</option>
            <option value='high-low'>Price: High to Low</option>
          </select>
        </div>
      </div>

      {filterProducts.length === 0 && (
        <p className='text-sm text-gray-400 py-16 text-center'>No posters match these filters yet.</p>
      )}

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8'>
        {
          visible.map((item,index)=>(
            <Reveal key={item._id} delay={(index % 8) * 40}>
              <ProductItem product={item} />
            </Reveal>
          ))
        }
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={changePage} className='mt-12' />

      <NewsletterBox />
    </div>
  )
}

export default Collection
