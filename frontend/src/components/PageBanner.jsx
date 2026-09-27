import React from 'react'
import { banners, CATEGORY_BANNERS } from '../assets/assets'

// Wide promo strip above listing pages.
//
// Three modes, in priority order:
//   1. `category` — a generated collage strip unique to that category, so no two
//      listing pages open with the same artwork.
//   2. `image`    — one of the studio's own promo banners.
//   3. neither    — a plain titled dark panel.
const PageBanner = ({ image, category, title, subtitle, starburst = false }) => {

  const preset = category ? CATEGORY_BANNERS[category] : null

  if (preset) {
    const { headline, tagline, accent, posters } = preset

    return (
      <div
        className='relative bleed-2cm overflow-hidden h-[clamp(152px,21vw,330px)] text-white'
        style={{ background: `linear-gradient(110deg, #070707 0%, #131313 52%, ${accent}2b 100%)` }}
      >
        {/* Accent glow + hairline grid keep the flat panel from looking empty. */}
        <div
          className='absolute -right-16 -top-1/2 w-[55%] aspect-square rounded-full blur-3xl opacity-30'
          style={{ background: accent }}
          aria-hidden='true'
        />
        <div
          className='absolute inset-0 opacity-[0.07]'
          style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px)', backgroundSize: '44px 100%' }}
          aria-hidden='true'
        />

        <div className='relative h-full flex items-center gap-3 sm:gap-8 px-5 sm:px-10 lg:px-14'>

          <div className='min-w-0 flex-1 animate-rise-in'>
            <span
              className='inline-block text-[9px] sm:text-[11px] tracking-[0.22em] uppercase px-2.5 py-1 mb-1.5 sm:mb-3'
              style={{ backgroundColor: accent }}
            >
              Sketchover
            </span>
            <p className='heading-font uppercase leading-[0.92] tracking-[0.04em] text-[clamp(1.6rem,6.4vw,4.2rem)]'>
              {headline}
            </p>
            <p className='text-white/70 text-[10px] sm:text-sm mt-1 sm:mt-2 max-w-sm leading-snug line-clamp-2'>
              {tagline || subtitle}
            </p>
          </div>

          {/* Poster collage — fanned out, clipped by the strip. */}
          <div className='shrink-0 flex items-center'>
            {posters.map((poster, i) => (
              <div
                key={i}
                className='w-[clamp(46px,9vw,118px)] aspect-[176/206]'
                style={{
                  transform: `rotate(${(i - (posters.length - 1) / 2) * 7}deg)`,
                  marginLeft: i === 0 ? 0 : 'clamp(-14px,-1.4vw,-6px)',
                  zIndex: posters.length - i,
                }}
              >
                {/* The rotation lives on the wrapper so the entrance animation
                    can own `transform` without cancelling it. */}
                <div
                  className='w-full h-full overflow-hidden shadow-xl ring-1 ring-white/15 animate-fan-in'
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  <img src={poster} alt='' className='w-full h-full object-cover' loading='lazy' />
                </div>
              </div>
            ))}
          </div>
        </div>

        {starburst && (
          <span className='absolute top-3 right-3 sm:top-6 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-brand [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]' />
        )}
      </div>
    )
  }

  if (image) {
    return (
      <div className='relative bleed-2cm overflow-hidden'>
        <img src={image} alt={title || ''} className='w-full h-auto object-cover' />
        {starburst && (
          <span className='absolute top-3 right-3 sm:top-6 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-brand [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]' />
        )}
      </div>
    )
  }

  return (
    <div className='relative bleed-2cm overflow-hidden bg-neutral-950 text-white aspect-[1428/518] max-h-[330px]'>
      <div className='h-full flex flex-col items-center justify-center text-center px-6 gap-2'>
        <p className='heading-font tracking-wide leading-none text-[clamp(1.5rem,5vw,3.5rem)]'>{title}</p>
        {subtitle && <p className='text-white/70 text-xs sm:text-sm max-w-md'>{subtitle}</p>}
      </div>
    </div>
  )
}

export default PageBanner
