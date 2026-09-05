import React from 'react'

const steps = ['Cart', 'Shipping', 'Checkout']

const CheckoutSteps = ({ current }) => {
  const currentIndex = steps.indexOf(current)

  return (
    <div className='flex items-center justify-center gap-2 sm:gap-4 py-8 text-xs sm:text-sm'>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className='flex items-center gap-2'>
            <span className={`w-6 h-6 rounded flex items-center justify-center text-white ${i <= currentIndex ? 'bg-black' : 'bg-gray-300'}`}>{i + 1}</span>
            <span className={i <= currentIndex ? 'text-black' : 'text-gray-400'}>{label}</span>
          </div>
          {i < steps.length - 1 && <span className='w-6 sm:w-10 h-px bg-gray-300'></span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutSteps
