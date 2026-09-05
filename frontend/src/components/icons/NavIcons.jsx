import React from 'react'

export const SearchIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <circle cx='11' cy='11' r='7' />
    <line x1='21' y1='21' x2='16.65' y2='16.65' />
  </svg>
)

export const UserIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <circle cx='12' cy='8' r='4' />
    <path d='M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7' />
  </svg>
)

export const CartIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <circle cx='9' cy='21' r='1.4' fill='currentColor' stroke='none' />
    <circle cx='19' cy='21' r='1.4' fill='currentColor' stroke='none' />
    <path d='M2 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.6L21 8H6' />
  </svg>
)

export const MenuIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' {...props}>
    <line x1='3' y1='6' x2='21' y2='6' />
    <line x1='3' y1='12' x2='21' y2='12' />
    <line x1='3' y1='18' x2='21' y2='18' />
  </svg>
)

export const BackIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <line x1='19' y1='12' x2='5' y2='12' />
    <polyline points='12 19 5 12 12 5' />
  </svg>
)

export const ChevronDownIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <polyline points='6 9 12 15 18 9' />
  </svg>
)

export const CloseIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' {...props}>
    <line x1='5' y1='5' x2='19' y2='19' />
    <line x1='19' y1='5' x2='5' y2='19' />
  </svg>
)

export const HeartIcon = ({ filled, ...props }) => (
  <svg viewBox='0 0 24 24' fill={filled ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d='M12 20.5c-.3 0-.6-.1-.8-.3C7 16.7 3.8 13.8 3.8 10.2 3.8 7.6 5.8 5.6 8.3 5.6c1.4 0 2.8.7 3.7 1.9 0.9-1.2 2.3-1.9 3.7-1.9 2.5 0 4.5 2 4.5 4.6 0 3.6-3.2 6.5-7.4 10C12.6 20.4 12.3 20.5 12 20.5Z' />
  </svg>
)

export const ChevronLeftIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <polyline points='15 18 9 12 15 6' />
  </svg>
)

export const ChevronRightIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <polyline points='9 18 15 12 9 6' />
  </svg>
)

export const PlusIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' {...props}>
    <line x1='12' y1='5' x2='12' y2='19' />
    <line x1='5' y1='12' x2='19' y2='12' />
  </svg>
)

export const MinusIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' {...props}>
    <line x1='5' y1='12' x2='19' y2='12' />
  </svg>
)

export const InstagramIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' {...props}>
    <rect x='3' y='3' width='18' height='18' rx='5' />
    <circle cx='12' cy='12' r='4' />
    <circle cx='17.5' cy='6.5' r='1' fill='currentColor' stroke='none' />
  </svg>
)

export const FacebookIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
    <path d='M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.9.2-1.5 1.5-1.5h1.6V4.3C16.3 4.2 15.3 4 14.2 4c-2.3 0-3.9 1.4-3.9 4v2.5H7.8v3h2.5V21h3.2Z' />
  </svg>
)

export const YoutubeIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinejoin='round' {...props}>
    <rect x='2.5' y='5.5' width='19' height='13' rx='4' />
    <polygon points='10.5 9 15.5 12 10.5 15' fill='currentColor' stroke='none' />
  </svg>
)

export const PinterestIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
    <path d='M12 2a10 10 0 0 0-3.6 19.3c0-.8-.1-2 .1-2.8l1.3-5.6s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.6 0 .9-.6 2.3-1 3.6-.3 1.1.5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3.1 0-4.9 2.3-4.9 4.6 0 .9.4 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.2 6.5-5.4 6.5-1 0-2-.6-2.4-1.2l-.6 2.5c-.2.9-.8 2-1.3 2.7A10 10 0 1 0 12 2Z' />
  </svg>
)

export const QualityIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d='M12 3l2.6 2.7 3.7-.5.5 3.7L21.5 11l-2.7 2.6.5 3.7-3.7-.5L13 20.5 10.4 17.8l-3.7.5-.5-3.7L3.5 12l2.7-2.6-.5-3.7 3.7.5L12 3Z' />
    <path d='M9.5 12l1.8 1.8 3.2-3.6' />
  </svg>
)

export const DesignIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d='M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19 4 20Z' />
    <line x1='13.5' y1='6.5' x2='17.5' y2='10.5' />
  </svg>
)

export const OfferIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d='M20 12.5V6a1 1 0 0 0-1-1h-6.5a1 1 0 0 0-.7.3l-8 8a1 1 0 0 0 0 1.4l6.5 6.5a1 1 0 0 0 1.4 0l8-8a1 1 0 0 0 .3-.7Z' />
    <circle cx='15' cy='9' r='1.4' fill='currentColor' stroke='none' />
  </svg>
)

export const DeliveryIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <rect x='2.5' y='7' width='11' height='9' rx='1' />
    <path d='M13.5 10h3.5l3 3v3h-6.5z' />
    <circle cx='7' cy='18' r='1.6' />
    <circle cx='17' cy='18' r='1.6' />
  </svg>
)

export const WhatsappIcon = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
    <path d='M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3Z' />
    <path d='M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z' />
  </svg>
)
