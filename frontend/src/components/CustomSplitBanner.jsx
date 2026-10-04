import React from 'react'
import { Link } from 'react-router-dom'
import { SPLIT_SET_TYPES, bannerPosters } from '../assets/assets'
import { SplitPreview } from './SplitSetRow'
import Title from './Title'
import Reveal from './Reveal'
import { UploadIcon } from './icons/NavIcons'

// The pitch that sits between the vertical sets and the horizontal ones: every
// shape in one place, each one a way into the uploader.
const CustomSplitBanner = () => (
  <div className='my-16'>
    <div className='text-center text-xl sm:text-2xl mb-6'>
      <Title text1={'CUSTOMIZED POSTERS & SPLIT SETS'} />
      <p className='text-xs sm:text-sm text-gray-500 mt-1 normal-case tracking-normal'>Your photos, your fandoms</p>
    </div>

    <Reveal>
      <div className='relative overflow-hidden bg-neutral-950 text-white px-5 sm:px-10 py-10'>
        <div className='absolute inset-0 flex opacity-25' aria-hidden='true'>
          {bannerPosters.map((src, i) => (
            <img key={i} src={src} alt='' className='flex-1 h-full object-cover' loading='lazy' />
          ))}
        </div>
        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50' aria-hidden='true' />

        <div className='relative grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-center'>
          <div>
            <p className='heading-font tracking-wide text-[clamp(1.4rem,4.5vw,2.75rem)] leading-none'>
              ONE PHOTO, ONE WALL
            </p>
            <p className='text-white/70 text-xs sm:text-sm mt-3 max-w-md'>
              Send us the picture and we cut it across the panels, print each one on 200 GSM matte
              and ship the set ready to hang. Pick the shape that fits your wall.
            </p>
            <Link
              to='/custom-posters'
              className='inline-flex items-center gap-2 bg-brand hover:bg-white hover:text-black text-white text-xs sm:text-sm px-7 py-3 mt-6 transition-colors'
            >
              <UploadIcon className='w-4 h-4' />
              Upload your pictures
            </Link>
          </div>

          <div className='grid grid-cols-3 sm:grid-cols-5 gap-3'>
            {SPLIT_SET_TYPES.map((type, i) => (
              <Link key={type.id} to={`/custom-posters?type=${type.id}`} className='group block'>
                <SplitPreview
                  image={bannerPosters[i % bannerPosters.length]}
                  panels={type.panels}
                  orientation={type.orientation}
                  className='aspect-[3/4] bg-white/10 ring-1 ring-white/15 group-hover:ring-brand transition-all'
                />
                <p className='text-[10px] sm:text-[11px] text-white/70 group-hover:text-white mt-1.5 text-center transition-colors'>
                  {type.short}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  </div>
)

export default CustomSplitBanner
