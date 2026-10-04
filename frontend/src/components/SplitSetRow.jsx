import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { getSizePrice, DEFAULT_SIZE, bannerPosters } from '../assets/assets'
import { usePageTransition } from './PageTransition'
import Title from './Title'
import Carousel from './Carousel'
import Reveal from './Reveal'
import ProductItem from './ProductItem'
import { UploadIcon, ArrowRightIcon } from './icons/NavIcons'

// One poster shown as the set it would be cut into: the same picture across N
// panels, so the shopper can see what a 3, 4, 6 or 8-split actually looks like.
export const SplitPreview = ({ image, panels, orientation = 'vertical', className = '' }) => {
  const slices = Array.from({ length: panels })
  const vertical = orientation === 'vertical'

  return (
    <div
      className={`flex gap-[3px] bg-gray-100 ${vertical ? 'flex-row' : 'flex-col'} ${className}`}
      aria-hidden='true'
    >
      {slices.map((_, i) => (
        <div key={i} className='relative flex-1 overflow-hidden'>
          {/* max-w-none is load-bearing: Tailwind's preflight caps images at
              100% of their box, which would squash the slice back to one panel. */}
          <img
            src={image}
            alt=''
            loading='lazy'
            decoding='async'
            className='absolute max-w-none object-cover'
            style={vertical
              ? { width: `${panels * 100}%`, height: '100%', top: 0, left: `${-i * 100}%` }
              : { width: '100%', height: `${panels * 100}%`, left: 0, top: `${-i * 100}%` }}
          />
        </div>
      ))}
    </div>
  )
}

// A homepage row for one kind of split set: the upload card first, then what the
// cut looks like on real artwork, then any ready-made sets of that shape.
const SplitSetRow = ({ type, examples = bannerPosters }) => {
  const { products } = useContext(ShopContext)
  const { openPage } = usePageTransition()

  const uploadTo = `/custom-posters?type=${type.id}`
  const viewAllTo = `/collection?type=split&panels=${type.panels}&orientation=${type.orientation}`
  const vertical = type.orientation === 'vertical'

  // Ready-made sets of the same shape, if the catalogue has any.
  const readyMade = products.filter(p => (
    p.subCategory === 'Split'
    && (p.panels || 3) === type.panels
    && (p.orientation || 'vertical') === type.orientation
  ))

  const { price } = getSizePrice(DEFAULT_SIZE, 'Split', type.panels)

  return (
    <div className='my-14'>
      <div className='flex items-end justify-between gap-4 mb-6'>
        <div className='text-xl sm:text-2xl'>
          <Title text1={type.name} />
          <p className='text-xs sm:text-sm text-gray-500 mt-1 normal-case tracking-normal'>Your photos, your fandoms</p>
        </div>
        <Link
          to={viewAllTo}
          onClick={(e) => openPage(e, { label: type.name, to: viewAllTo })}
          className='text-sm font-medium hover:text-brand transition-colors whitespace-nowrap'
        >
          View all
        </Link>
      </div>

      <Carousel>
        {/* Upload card */}
        <div className='w-[70%] xs:w-[55%] sm:w-[38%] md:w-[30%] lg:w-[23.5%] shrink-0 snap-start'>
          <Reveal>
            <Link
              to={uploadTo}
              className='group block border-2 border-dashed border-black hover:border-brand transition-colors h-full'
            >
              <div className={`aspect-[333/461] flex ${vertical ? 'flex-row' : 'flex-col'} gap-[3px] p-3`}>
                {Array.from({ length: type.panels }).map((_, i) => (
                  <div key={i} className='flex-1 bg-gray-100 group-hover:bg-brand/10 transition-colors' />
                ))}
              </div>
              <div className='px-3 pb-4 text-center'>
                <span className='inline-flex items-center gap-2 text-xs sm:text-sm font-medium'>
                  <UploadIcon className='w-4 h-4' />
                  Upload your pictures
                </span>
                <p className='text-[11px] text-gray-500 mt-1'>
                  {type.panels} panels · from RS.{price}
                </p>
              </div>
            </Link>
          </Reveal>
        </div>

        {/* What the cut looks like on real artwork */}
        {examples.slice(0, 4).map((image, index) => (
          <div key={index} className='w-[47%] sm:w-[31%] md:w-[23.5%] lg:w-[19%] shrink-0 snap-start'>
            <Reveal delay={(index + 1) * 60}>
              <Link to={uploadTo} className='group block'>
                <SplitPreview
                  image={image}
                  panels={type.panels}
                  orientation={type.orientation}
                  className='aspect-[333/461] group-hover:opacity-90 transition-opacity'
                />
                <p className='mt-3 text-xs sm:text-[13px] text-gray-800'>
                  {type.short} set · {type.panels} panels
                </p>
                <p className='text-[11px] text-gray-500 mt-0.5'>Example cut — made from your photo</p>
              </Link>
            </Reveal>
          </div>
        ))}

        {/* Ready-made sets of the same shape */}
        {readyMade.map((item, index) => (
          <div key={item._id} className='w-[47%] sm:w-[31%] md:w-[23.5%] lg:w-[19%] shrink-0 snap-start'>
            <Reveal delay={(index + 1) * 60}>
              <ProductItem product={item} />
            </Reveal>
          </div>
        ))}
      </Carousel>

      <div className='flex justify-center mt-6'>
        <Link
          to={uploadTo}
          className='inline-flex items-center gap-2 bg-black text-white text-xs px-8 py-2.5 hover:bg-brand transition-colors'
        >
          Upload your pictures
          <ArrowRightIcon className='w-4 h-4' />
        </Link>
      </div>
    </div>
  )
}

export default SplitSetRow
