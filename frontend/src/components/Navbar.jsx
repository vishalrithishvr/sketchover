import React, { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { categoryShowcase, CATEGORY_BANNERS } from '../assets/assets';
import Logo from './Logo';
import { SearchIcon, CartIcon, MenuIcon, CloseIcon, HeartIcon, ChevronDownIcon } from './icons/NavIcons';

const linkClass = ({ isActive }) =>
  `flex items-center gap-1 whitespace-nowrap transition-colors ${isActive ? 'text-black' : 'text-gray-700'} hover:text-black`

// How long the curtain stays up, and when the route swaps behind it.
const CURTAIN_MS = 850
const NAVIGATE_AT_MS = 320

// Desktop dropdown. Opens on hover, and on focus so it's keyboard reachable.
const Dropdown = ({ to, label, children }) => (
  <li className='group relative'>
    <NavLink to={to} className={linkClass}>
      <span>{label}</span>
      <ChevronDownIcon className='w-3 h-3' />
    </NavLink>
    <div className='hidden group-hover:block group-focus-within:block absolute left-1/2 -translate-x-1/2 pt-4 z-30'>
      <div className='flex flex-col gap-2 min-w-[200px] py-4 px-5 bg-white text-gray-600 shadow-lg border border-gray-100'>
        {children}
      </div>
    </div>
  </li>
)

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    // The category being opened: drives the curtain animation and the pressed tile.
    const [transition, setTransition] = useState(null);
    const timers = useRef([]);
    const { search, setSearch, setShowSearch, getCartCount, wishlist } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Close the drawer whenever the route changes, and lock the page behind it.
    useEffect(() => { setMenuOpen(false) }, [location.pathname, location.search])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    useEffect(() => () => timers.current.forEach(clearTimeout), [])

    const submitSearch = (e) => {
        e.preventDefault()
        setShowSearch(true)
        setMenuOpen(false)
        navigate('/collection')
    }

    const shopCategories = categoryShowcase.filter(c => !c.custom)

    const categoryPath = (category) => `/collection?category=${encodeURIComponent(category)}`

    // Tapping a category plays a short branded curtain while the route changes,
    // so there is always visible feedback — on a phone as much as on a desktop.
    const openCategory = (e, category) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        if (transition) return

        setTransition({ category, accent: CATEGORY_BANNERS[category]?.accent || '#F5007E' })
        timers.current.push(setTimeout(() => {
            setMenuOpen(false)
            navigate(categoryPath(category))
            window.scrollTo({ top: 0 })
        }, NAVIGATE_AT_MS))
        timers.current.push(setTimeout(() => setTransition(null), CURTAIN_MS))
    }

    const curtain = transition && createPortal(
      <div className='fixed inset-0 z-[95] overflow-hidden pointer-events-none' aria-hidden='true'>
        <div
          className='absolute inset-0 animate-curtain'
          style={{ background: `linear-gradient(155deg, #070707 0%, #141414 45%, ${transition.accent} 100%)` }}
        >
          <div className='h-full flex items-center justify-center animate-label-in'>
            <span className='block w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin' />
          </div>
        </div>
      </div>,
      document.body
    )

    // The drawer is portalled to <body>: the header uses backdrop-blur, which
    // creates a containing block for fixed children and would otherwise trap
    // the drawer inside the header strip.
    const drawer = createPortal(
      <>
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-[70] bg-black/40 transition-opacity duration-300 lg:hidden ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden='true'
        />
        <aside
          className={`fixed top-0 right-0 bottom-0 w-[86vw] max-w-sm z-[80] bg-white overflow-y-auto shadow-2xl transition-transform duration-300 lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-hidden={!menuOpen}
        >
          <div className='flex flex-col text-gray-700'>
            <div className='flex items-center justify-between px-4 py-3 border-b'>
              <Logo />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label='Close menu'
                className='p-2.5 -mr-2.5 text-gray-600 hover:text-black'
              >
                <CloseIcon className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={submitSearch} className='flex items-center gap-2 border-b px-4 py-3'>
              <SearchIcon className='w-4 h-4 text-gray-500 shrink-0' />
              <input
                value={search}
                onChange={(e)=>{ setSearch(e.target.value); setShowSearch(true) }}
                placeholder='Search the product'
                className='w-full outline-none text-sm bg-transparent'
              />
            </form>

            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/'>Home</NavLink>
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/collection'>Shop all products</NavLink>
            {shopCategories.map((c) => {
              const opening = transition?.category === c.category
              return (
                <Link
                  key={c.category}
                  to={categoryPath(c.category)}
                  onClick={(e) => openCategory(e, c.category)}
                  className={`flex items-center gap-3 py-3 pl-8 pr-6 border-b text-sm origin-left transition-colors ${
                    opening ? 'bg-brand/10 text-brand animate-tile-pop' : 'text-gray-500 active:bg-gray-50'
                  }`}
                >
                  <img src={c.image} alt='' className='w-8 h-8 rounded-full object-cover shrink-0' />
                  <span>{c.category}</span>
                  {opening && <span className='ml-auto w-1.5 h-1.5 rounded-full bg-brand animate-ping' />}
                </Link>
              )
            })}
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/collection?sort=new'>New arrivals</NavLink>
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/custom-posters'>Custom Posters</NavLink>
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/favorites'>Favorites</NavLink>
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/cart'>Cart</NavLink>
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/about'>About</NavLink>
            <NavLink className='py-3.5 px-6 border-b active:bg-gray-50' to='/contact'>Contact</NavLink>
          </div>
        </aside>
      </>,
      document.body
    )

  return (
    <header className='sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='flex items-center justify-between gap-4 sm:gap-6 py-3'>

        <Logo id="nav-logo" />

        <nav className='hidden lg:block'>
          <ul className='flex items-center gap-7 text-sm'>
            <Dropdown to='/collection' label='Shop'>
              {shopCategories.map((c) => (
                <Link
                  key={c.category}
                  to={categoryPath(c.category)}
                  onClick={(e) => openCategory(e, c.category)}
                  className={`whitespace-nowrap transition-colors ${transition?.category === c.category ? 'text-brand' : 'hover:text-brand'}`}
                >
                  {c.category}
                </Link>
              ))}
              <Link to='/collection' className='pt-2 mt-1 border-t border-gray-100 text-black hover:text-brand'>Shop all products</Link>
            </Dropdown>

            <li><NavLink to='/collection?sort=new' className={linkClass}>New arrivals</NavLink></li>
            <li><NavLink to='/custom-posters' className={linkClass}>Custom Posters</NavLink></li>

            <Dropdown to='/collection?category=TV Series' label='Vintage Prints'>
              <Link to={categoryPath('TV Series')} onClick={(e) => openCategory(e, 'TV Series')} className='hover:text-brand'>TV &amp; Movie Classics</Link>
              <Link to={categoryPath('Autosport')} onClick={(e) => openCategory(e, 'Autosport')} className='hover:text-brand'>Retro Autosport</Link>
            </Dropdown>
          </ul>
        </nav>

        <form onSubmit={submitSearch} className='hidden sm:flex items-center gap-2 border-b border-gray-300 focus-within:border-black transition-colors pb-1 flex-1 max-w-[230px]'>
          <SearchIcon className='w-4 h-4 text-gray-500 shrink-0' />
          <input
            value={search}
            onChange={(e)=>{ setSearch(e.target.value); setShowSearch(true) }}
            type='text'
            placeholder='Search the product'
            className='w-full outline-none text-xs placeholder:text-gray-400 bg-transparent'
          />
        </form>

        {/* Actions — each a real button/link with a finger-sized hit area */}
        <div className='flex items-center gap-1 sm:gap-2 shrink-0'>
          <Link to='/favorites' className='relative p-2.5' aria-label='Favorites'>
            <HeartIcon className='w-5 h-5 hover:text-brand transition-colors' />
            {wishlist.length > 0 && (
              <span className='absolute right-1 bottom-1 w-4 h-4 flex items-center justify-center bg-brand text-white rounded-full text-[9px]'>{wishlist.length}</span>
            )}
          </Link>

          <Link to='/cart' className='relative p-2.5' aria-label='Cart'>
            <CartIcon className='w-5 h-5 hover:text-brand transition-colors' />
            <span className='absolute right-1 bottom-1 w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[9px]'>{getCartCount()}</span>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label='Open menu'
            aria-expanded={menuOpen}
            className='p-2.5 -mr-2.5 lg:hidden'
          >
            <MenuIcon className='w-5 h-5' />
          </button>
        </div>
      </div>

      {drawer}
      {curtain}
    </header>
  )
}

export default Navbar
