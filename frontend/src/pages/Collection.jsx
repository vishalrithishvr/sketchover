import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Reveal from '../components/Reveal';
import { CloseIcon } from '../components/icons/NavIcons';

const SIZES = ['A5', 'A4', 'A3', 'A3+']

const Collection = () => {

  const { products , search , showSearch } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [filterProducts,setFilterProducts] = useState([]);
  const [sizeFilter,setSizeFilter] = useState([]);
  const [sortType,setSortType] = useState(()=> searchParams.get('sort') === 'new' ? 'new' : 'relavent')
  const category = searchParams.get('category');
  const bestsellerOnly = searchParams.get('bestseller') === 'true';

  const toggleSize = (size) => {
    setSizeFilter(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  useEffect(()=>{

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category) {
      productsCopy = productsCopy.filter(item => item.category === category);
    }

    if (bestsellerOnly) {
      productsCopy = productsCopy.filter(item => item.bestseller);
    }

    if (sizeFilter.length > 0) {
      productsCopy = productsCopy.filter(item => item.sizes.some(s => sizeFilter.includes(s)));
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
      default:
        break;
    }

    setFilterProducts(productsCopy)

  },[category, bestsellerOnly, sizeFilter, sortType, search, showSearch, products])

  return (
    <div className='pt-10 border-t'>

      <div className='flex justify-between items-center text-base sm:text-2xl mb-2'>
          <Title text1={category ? category.toUpperCase() : 'SHOP ALL'} text2={'PRODUCTS'} />
      </div>

      {category && (
        <Link to='/collection' className='inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black mb-4 border rounded-full px-3 py-1 w-fit'>
          {category} <CloseIcon className='w-3 h-3' />
        </Link>
      )}

      <div className='flex flex-wrap items-center justify-between gap-4 mb-6 py-3 border-y border-gray-200'>
        <div className='flex items-center gap-3 flex-wrap'>
          <span className='text-xs sm:text-sm text-gray-500'>Filter: Size</span>
          {SIZES.map(size => (
            <label key={size} className='cursor-pointer select-none'>
              <input type='checkbox' className='peer sr-only' checked={sizeFilter.includes(size)} onChange={()=>toggleSize(size)} />
              <span className='inline-block px-2.5 py-1 rounded border border-gray-300 text-xs text-gray-600 peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-colors'>{size}</span>
            </label>
          ))}
        </div>

        <select onChange={(e)=>setSortType(e.target.value)} value={sortType} className='border border-gray-300 text-xs sm:text-sm px-2 py-1.5 rounded'>
          <option value="relavent">Sort by: Relevant</option>
          <option value="new">Sort by: New Arrivals</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      {filterProducts.length === 0 && (
        <p className='text-sm text-gray-400 py-10 text-center'>No posters match these filters yet.</p>
      )}

      {/* Map Products */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
        {
          filterProducts.map((item,index)=>(
            <Reveal key={item._id} delay={(index % 8) * 40}>
              <ProductItem name={item.name} id={item._id} price={item.price} originalPrice={item.originalPrice} image={item.image} category={item.category} sizes={item.sizes} />
            </Reveal>
          ))
        }
      </div>
    </div>
  )
}

export default Collection
