import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { categoryShowcase } from '../assets/assets';
import Logo from './Logo';
import { SearchIcon, CartIcon, MenuIcon, BackIcon, HeartIcon, ChevronDownIcon } from './icons/NavIcons';

const linkClass = ({ isActive }) =>
  `flex items-center gap-1 whitespace-nowrap transition-colors ${isActive ? 'text-black' : 'text-gray-700'} hover:text-black`

const Dropdown = ({ to, label, children }) => (
  <li className='group relative'>
    <NavLink to={to} className={linkClass}>
      <span>{label}</span>
      <ChevronDownIcon className='w-3 h-3' />
    </NavLink>
    <div className='hidden group-hover:block absolute left-1/2 -translate-x-1/2 pt-4 z-30'>
      <div className='flex flex-col gap-2 min-w-[200px] py-4 px-5 bg-white text-gray-600 shadow-lg border border-gray-100'>
        {children}
      </div>
    </div>
  </li>
)

const Navbar = () => {

    const [visible,setVisible] = useState(false);
    const { search, setSearch, setShowSearch, getCartCount, wishlist } = useContext(ShopContext);
    const navigate = useNavigate();

    const submitSearch = (e) => {
        e.preventDefault()
        setShowSearch(true)
        navigate('/collection')
    }

    const shopCategories = categoryShowcase.filter(c => !c.custom)

  return (
    <header className='sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='flex items-center justify-between gap-6 py-3'>

        <Logo />

        {/* Primary nav — vertically centred with the logo and search */}
        <nav className='hidden lg:block'>
          <ul className='flex items-center gap-7 text-sm'>
            <Dropdown to='/collection' label='Shop'>
              {shopCategories.map((c) => (
                <Link key={c.category} to={`/collection?category=${encodeURIComponent(c.category)}`} className='hover:text-brand whitespace-nowrap'>{c.category}</Link>
              ))}
              <Link to='/collection' className='pt-2 mt-1 border-t border-gray-100 text-black hover:text-brand'>Shop all products</Link>
            </Dropdown>

            <li>
              <NavLink to='/collection?sort=new' className={linkClass}>New arrivals</NavLink>
            </li>

            <li>
              <NavLink to='/custom-posters' className={linkClass}>Custom Posters</NavLink>
            </li>

            <Dropdown to='/collection?category=TV Series' label='Vintage Prints'>
              <Link to='/collection?category=TV Series' className='hover:text-brand'>TV &amp; Movie Classics</Link>
              <Link to='/collection?category=Autosport' className='hover:text-brand'>Retro Autosport</Link>
            </Dropdown>
          </ul>
        </nav>

        {/* Search */}
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

        {/* Actions */}
        <div className='flex items-center gap-4 sm:gap-5 shrink-0'>
          <Link to='/favorites' className='relative' aria-label='Favorites'>
            <HeartIcon className='w-5 h-5 hover:text-brand transition-colors' />
            {wishlist.length > 0 && (
              <span className='absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center bg-brand text-white rounded-full text-[9px]'>{wishlist.length}</span>
            )}
          </Link>

          <Link to='/cart' className='relative' aria-label='Cart'>
            <CartIcon className='w-5 h-5 min-w-5 hover:text-brand transition-colors' />
            <span className='absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[9px]'>{getCartCount()}</span>
          </Link>

          <MenuIcon onClick={()=>setVisible(true)} className='w-5 h-5 cursor-pointer lg:hidden' />
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-y-auto bg-white transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-700'>
          <button onClick={()=>setVisible(false)} className='flex items-center gap-4 p-4 text-left'>
            <BackIcon className='w-4 h-4' />
            <span>Back</span>
          </button>

          <form onSubmit={(e)=>{ submitSearch(e); setVisible(false) }} className='flex items-center gap-2 border-y px-4 py-3'>
            <SearchIcon className='w-4 h-4 text-gray-500' />
            <input
              value={search}
              onChange={(e)=>{ setSearch(e.target.value); setShowSearch(true) }}
              placeholder='Search the product'
              className='w-full outline-none text-sm'
            />
          </form>

          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/'>Home</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/collection'>Shop all products</NavLink>
          {shopCategories.map((c) => (
            <NavLink onClick={()=>setVisible(false)} key={c.category} className='py-2.5 pl-10 border-b text-sm text-gray-500' to={`/collection?category=${encodeURIComponent(c.category)}`}>{c.category}</NavLink>
          ))}
          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/collection?sort=new'>New arrivals</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/custom-posters'>Custom Posters</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/favorites'>Favorites</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/about'>About</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-3 pl-6 border-b' to='/contact'>Contact</NavLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
