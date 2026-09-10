import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { categoryShowcase } from '../assets/assets';
import Logo from './Logo';
import { SearchIcon, UserIcon, CartIcon, MenuIcon, BackIcon, HeartIcon, ChevronDownIcon } from './icons/NavIcons';

const Navbar = () => {

    const [visible,setVisible] = useState(false);

    const {setShowSearch , getCartCount , navigate, token, setToken, setCartItems, wishlist} = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    const linkClass = ({ isActive }) => `flex items-center gap-1 py-1 ${isActive ? 'text-black' : 'text-gray-600'} hover:text-black transition-colors`

  return (
    <div className='flex items-center justify-between py-5 font-medium'>

      <Logo />

      <ul className='hidden sm:flex gap-6 text-sm text-gray-700 uppercase tracking-wide'>

        <li className='group relative'>
            <NavLink to='/collection' className={linkClass}>
                <span>Shop</span>
                <ChevronDownIcon className='w-3 h-3' />
            </NavLink>
            <div className='hidden group-hover:block absolute left-1/2 -translate-x-1/2 pt-4 z-20'>
                <div className='grid grid-cols-2 gap-x-6 gap-y-2 w-56 py-4 px-5 bg-white text-gray-600 rounded shadow-lg border border-gray-100 normal-case'>
                    {categoryShowcase.filter(c => c.category !== 'Custom').map((c) => (
                        <Link key={c.category} to={`/collection?category=${encodeURIComponent(c.category)}`} className='hover:text-[#FF6B00] whitespace-nowrap'>{c.category}</Link>
                    ))}
                    <Link to='/collection' className='col-span-2 pt-2 mt-1 border-t border-gray-100 font-medium text-black hover:text-[#FF6B00]'>Shop all products</Link>
                </div>
            </div>
        </li>
        <NavLink to='/collection?sort=new' className={linkClass}><span>New Arrivals</span></NavLink>

        <li className='group relative'>
            <NavLink to='/custom-posters' className={linkClass}>
                <span>Custom Posters</span>
                <ChevronDownIcon className='w-3 h-3' />
            </NavLink>
            <div className='hidden group-hover:block absolute left-1/2 -translate-x-1/2 pt-4 z-20'>
                <div className='flex flex-col gap-2 w-52 py-4 px-5 bg-white text-gray-600 rounded shadow-lg border border-gray-100 normal-case'>
                    <Link to='/custom-posters' className='hover:text-[#FF6B00]'>Personalization</Link>
                    <Link to='/custom-posters' className='hover:text-[#FF6B00]'>Bulk / Event Orders</Link>
                </div>
            </div>
        </li>

        <li className='group relative'>
            <NavLink to='/collection?category=TV Series' className={linkClass}>
                <span>Vintage Prints</span>
                <ChevronDownIcon className='w-3 h-3' />
            </NavLink>
            <div className='hidden group-hover:block absolute left-1/2 -translate-x-1/2 pt-4 z-20'>
                <div className='flex flex-col gap-2 w-52 py-4 px-5 bg-white text-gray-600 rounded shadow-lg border border-gray-100 normal-case'>
                    <Link to='/collection?category=TV Series' className='hover:text-[#FF6B00]'>TV &amp; Movie Classics</Link>
                    <Link to='/collection?category=Autosport' className='hover:text-[#FF6B00]'>Retro Autosport</Link>
                </div>
            </div>
        </li>

      </ul>

      <div className='flex items-center gap-5'>
            <SearchIcon onClick={()=> { setShowSearch(true); navigate('/collection') }} className='w-5 h-5 cursor-pointer hover:text-[#FF6B00] transition-colors' />

            <Link to='/favorites' className='relative hidden xs:inline-block'>
                <HeartIcon className='w-5 h-5 hover:text-[#FF6B00] transition-colors' />
                {wishlist.length > 0 && (
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{wishlist.length}</p>
                )}
            </Link>

            <div className='group relative'>
                <UserIcon onClick={()=> token ? null : navigate('/login') } className='w-5 h-5 cursor-pointer hover:text-[#FF6B00] transition-colors' />
                {/* Dropdown Menu */}
                {token &&
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded'>
                        <p className='cursor-pointer hover:text-black'>My Profile</p>
                        <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                        <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>}
            </div>
            <Link to='/cart' className='relative'>
                <CartIcon className='w-5 h-5 min-w-5 hover:text-[#FF6B00] transition-colors' />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>
            <MenuIcon onClick={()=>setVisible(true)} className='w-5 h-5 cursor-pointer sm:hidden' />
      </div>

        {/* Sidebar menu for small screens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-30 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <BackIcon className='w-4 h-4' />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'>SHOP ALL</NavLink>
                    {categoryShowcase.filter(c => c.category !== 'Custom').map((c) => (
                        <NavLink onClick={()=>setVisible(false)} key={c.category} className='py-2 pl-10 border text-sm' to={`/collection?category=${encodeURIComponent(c.category)}`}>{c.category}</NavLink>
                    ))}
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/custom-posters'>CUSTOM POSTERS</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/favorites'>FAVORITES</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                </div>
        </div>

    </div>
  )
}

export default Navbar
