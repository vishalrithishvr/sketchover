import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary from '../components/OrderSummary'

const emptyAddress = {
  firstName: '', lastName: '', street: '', landmark: '',
  city: '', postalCode: '', state: '', country: '',
  email: '', phone: ''
}

const Input = ({ label, name, value, onChange, required = true, type = 'text' }) => (
  <div>
    <label className='text-xs text-gray-500'>{label}{required && ' *'}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e)=>onChange(name, e.target.value)}
      className='w-full border border-gray-300 rounded px-3 py-2 mt-1 outline-none focus:border-black'
    />
  </div>
)

const Shipping = () => {

  const { shippingAddress, setShippingAddress, getCartAmount } = useContext(ShopContext)
  const [form, setForm] = useState({ ...emptyAddress, ...shippingAddress })
  const navigate = useNavigate()

  const update = (name, value) => setForm(prev => ({ ...prev, [name]: value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setShippingAddress(form)
    navigate('/place-order')
  }

  const cartIsEmpty = getCartAmount() === 0;

  useEffect(() => {
    if (cartIsEmpty) navigate('/cart')
  }, [cartIsEmpty])

  if (cartIsEmpty) return null

  return (
    <div className='border-t pt-6'>
      <CheckoutSteps current='Shipping' />
      <div className='text-2xl mb-6'>
        <Title text1={'SHIPPING'} text2={'ADDRESS'} />
      </div>

      <form onSubmit={onSubmit} className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10'>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input label='First name' name='firstName' value={form.firstName} onChange={update} />
            <Input label='Last name' name='lastName' value={form.lastName} onChange={update} />
          </div>
          <Input label='Street number and Area' name='street' value={form.street} onChange={update} />
          <Input label='Landmark' name='landmark' value={form.landmark} onChange={update} required={false} />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input label='City' name='city' value={form.city} onChange={update} />
            <Input label='Postal code' name='postalCode' value={form.postalCode} onChange={update} />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input label='State' name='state' value={form.state} onChange={update} />
            <Input label='Country' name='country' value={form.country} onChange={update} />
          </div>

          <p className='text-sm font-medium mt-4'>Contact Info</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input label='Email address' name='email' type='email' value={form.email} onChange={update} />
            <Input label='Mobile number' name='phone' type='tel' value={form.phone} onChange={update} />
          </div>

          <button type='submit' className='sm:hidden bg-black text-white text-sm mt-4 py-3 rounded hover:bg-[#FF6B00] transition-colors'>Continue to Checkout</button>
        </div>

        <div>
          <OrderSummary compact showCoupon={false}>
            <button type='submit' className='hidden sm:block w-full bg-black text-white text-sm mt-4 py-3 rounded hover:bg-[#FF6B00] transition-colors'>Continue to Checkout</button>
          </OrderSummary>
        </div>
      </form>
    </div>
  )
}

export default Shipping
