import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { ArrowRightIcon } from './icons/NavIcons'

// Signing up unlocks the 5% welcome code.
const WELCOME_CODE = 'WELCOME5'

const NewsletterBox = () => {

    const { setCouponCode } = useContext(ShopContext)
    const [done, setDone] = useState(false)

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setCouponCode(WELCOME_CODE)
        setDone(true)
    }

  return (
    <div className='text-center my-16'>
      <div className='text-xl sm:text-2xl mb-6'>
        <Title text1={'JOIN THE NEWSLETTER'} />
      </div>

      {done ? (
        <p className='text-sm text-gray-700'>
          You're in — use code <span className='heading-font tracking-wide text-brand text-base'>{WELCOME_CODE}</span> for 5% off your order.
        </p>
      ) : (
        <form onSubmit={onSubmitHandler} className='w-full sm:w-[420px] flex items-center mx-auto border border-black px-4 py-2.5'>
          <input
            className='w-full flex-1 outline-none bg-transparent text-sm placeholder:text-gray-400'
            type='email'
            placeholder='Your Email Address'
            required
          />
          <button type='submit' className='flex items-center gap-2 text-[11px] text-gray-500 hover:text-brand transition-colors shrink-0'>
            Subscribe <ArrowRightIcon className='w-5 h-5 text-black' />
          </button>
        </form>
      )}
    </div>
  )
}

export default NewsletterBox
