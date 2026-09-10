import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { ChevronRightIcon } from './icons/NavIcons'
import { ShopContext } from '../context/ShopContext'

const NEWSLETTER_CODE = 'WELCOME5'

const NewsletterBox = () => {
    const { setCouponCode } = useContext(ShopContext)
    const [subscribed, setSubscribed] = useState(false)

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setCouponCode(NEWSLETTER_CODE)
        setSubscribed(true)
        toast.success(`You're in! Code ${NEWSLETTER_CODE} is applied for 5% off.`)
    }

  return (
    <div className='bg-black text-white text-center rounded-2xl px-6 py-14 my-16'>
      <p className='heading-font text-2xl sm:text-3xl'>Join the newsletter</p>
      <p className='text-white/50 mt-3 text-sm'>
      Be the first to know about new drops, restocks and combo offers.
      </p>

      {subscribed ? (
        <p className='mt-8 text-sm'>
          Thanks for joining! Use code <span className='text-[#FF6B00] font-medium'>{NEWSLETTER_CODE}</span> at checkout for 5% off — it's already applied to your cart.
        </p>
      ) : (
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto mt-8 border-b border-white/30 pb-2'>
          <input className='w-full flex-1 outline-none bg-transparent placeholder:text-white/40' type="email" placeholder='Your Email Address' required/>
          <button type='submit' aria-label='Subscribe' className='flex items-center gap-1 text-xs tracking-wide hover:text-[#FF6B00] transition-colors'>
            Subscribe <ChevronRightIcon className='w-4 h-4' />
          </button>
        </form>
      )}
    </div>
  )
}

export default NewsletterBox
