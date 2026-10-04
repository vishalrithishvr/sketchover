import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import Reveal from './Reveal'

const backendUrl = import.meta.env.VITE_BACKEND_URL || ''

// Media uploaded in the admin panel comes back with a relative url, so it keeps
// working whatever host the API ends up on.
const src = (url) => (!url ? '' : /^https?:/.test(url) ? url : `${backendUrl}${url}`)

// YouTube and Vimeo links are embedded; anything else is played directly.
const embedUrl = (url) => {
  const youtube = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/.exec(url || '')
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`
  const vimeo = /vimeo\.com\/(\d+)/.exec(url || '')
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

const Item = ({ item }) => {
  const url = src(item.url)
  const embed = embedUrl(item.url)

  return (
    <figure>
      <div className='relative aspect-video bg-neutral-950 overflow-hidden'>
        {item.kind === 'image' ? (
          <img src={url} alt={item.title || ''} className='w-full h-full object-cover' loading='lazy' />
        ) : embed ? (
          <iframe
            src={embed}
            title={item.title || 'Video'}
            className='absolute inset-0 w-full h-full'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            loading='lazy'
          />
        ) : (
          <video
            src={url}
            poster={src(item.poster)}
            className='w-full h-full object-cover'
            controls
            playsInline
            preload='metadata'
          />
        )}
      </div>
      {(item.title || item.caption) && (
        <figcaption className='mt-2'>
          {item.title && <p className='text-sm text-gray-800'>{item.title}</p>}
          {item.caption && <p className='text-xs text-gray-500 mt-0.5'>{item.caption}</p>}
        </figcaption>
      )}
    </figure>
  )
}

// Renders whatever the studio has pinned to a slot. Shows nothing at all when
// the slot is empty, so the page reads the same as before anything is uploaded.
const MediaSlot = ({ slot, title, className = '', columns = 3 }) => {
  const { mediaBySlot } = useContext(ShopContext)
  const items = mediaBySlot?.[slot] || []

  if (items.length === 0) return null

  const grid = columns === 1
    ? 'grid-cols-1'
    : columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`my-14 ${className}`}>
      {title && (
        <div className='text-center text-xl sm:text-2xl mb-7'>
          <Title text1={title} />
        </div>
      )}
      <div className={`grid ${grid} gap-5`}>
        {items.map((item, index) => (
          <Reveal key={item.id} delay={(index % 3) * 70}>
            <Item item={item} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default MediaSlot
