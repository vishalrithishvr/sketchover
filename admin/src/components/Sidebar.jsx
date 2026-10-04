import React from 'react'
import { NavLink } from 'react-router-dom'

const Icon = ({ d, filled = false }) => (
  <svg viewBox='0 0 24 24' className='w-5 h-5 shrink-0' fill={filled ? 'currentColor' : 'none'}
       stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round'>
    {d}
  </svg>
)

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <><rect x='3' y='3' width='7' height='9' rx='1' /><rect x='14' y='3' width='7' height='5' rx='1' /><rect x='14' y='12' width='7' height='9' rx='1' /><rect x='3' y='16' width='7' height='5' rx='1' /></> },
  { to: '/orders',    label: 'Orders',    icon: <><path d='M3 7l9-4 9 4-9 4-9-4Z' /><path d='M3 7v10l9 4 9-4V7' /><path d='M12 11v10' /></> },
  { to: '/products',  label: 'Posters',   icon: <><rect x='4' y='3' width='16' height='18' rx='1' /><path d='M8 8h8M8 12h8M8 16h4' /></> },
  { to: '/add',       label: 'Add poster', icon: <><circle cx='12' cy='12' r='9' /><path d='M12 8v8M8 12h8' /></> },
  { to: '/media',     label: 'Videos & media', icon: <><rect x='2.5' y='5' width='19' height='14' rx='2' /><polygon points='10 9 16 12 10 15' fill='currentColor' stroke='none' /></> },
  { to: '/coupons',   label: 'Coupons',   icon: <><path d='M20 12.5V6a1 1 0 0 0-1-1h-6.5a1 1 0 0 0-.7.3l-8 8a1 1 0 0 0 0 1.4l6.5 6.5a1 1 0 0 0 1.4 0l8-8a1 1 0 0 0 .3-.7Z' /><circle cx='15' cy='9' r='1.3' fill='currentColor' stroke='none' /></> },
  { to: '/settings',  label: 'Site settings', icon: <><circle cx='12' cy='12' r='3' /><path d='M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z' /></> },
]

const Sidebar = () => (
  <aside className='w-16 sm:w-56 shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-61px)]'>
    <nav className='flex flex-col gap-1 p-2 sm:p-3 sticky top-0'>
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
            isActive ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={label}
        >
          <Icon d={icon} />
          <span className='hidden sm:block'>{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
