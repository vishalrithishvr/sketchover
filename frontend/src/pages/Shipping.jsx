import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary from '../components/OrderSummary'
import CustomerReviews from '../components/CustomerReviews'
import NewsletterBox from '../components/NewsletterBox'

const emptyAddress = {
  firstName: '', lastName: '', street: '', landmark: '',
  city: '', postalCode: '', state: '', country: '',
  email: '', phone: ''
}

const Field = ({ label, name, value, onChange, required = true, type = 'text' }) => (
  <div>
    <label className='block text-[11px] text-gray-500 mb-1'>{label}{required && ' *'}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e)=>onChange(name, e.target.value)}
      className='w-full border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-black'
    />
  </div>
)

const Shipping = () => {

  const { shippingAddress, setShippingAddress, getCartAmount } = useContext(ShopContext)
  const [form, setForm] = useState({ ...emptyAddress, ...shippingAddress })
  const navigate = useNavigate()

  const update = (name, value) => setForm(prev => ({ ...prev, [name]: value }))

  const cartIsEmpty = getCartAmount() === 0;

  useEffect(() => {
    if (cartIsEmpty) navigate('/cart')
  }, [cartIsEmpty])

  if (cartIsEmpty) return null

  const onSubmit = (e) => {
    e.preventDefault()
    setShippingAddress(form)
    navigate('/place-order')
  }

  return (
    <div>
      <CheckoutSteps current='Shipping' />

      <div className='text-xl sm:text-2xl mb-8'>
        <Title text1={'SHIPPING ADDRESS'} />
      </div>

      <form onSubmit={onSubmit} className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='First name' name='firstName' value={form.firstName} onChange={update} />
            <Field label='Last name' name='lastName' value={form.lastName} onChange={update} />
          </div>
          <Field label='Street number and Area' name='street' value={form.street} onChange={update} />
          <Field label='Landmark' name='landmark' value={form.landmark} onChange={update} />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='City' name='city' value={form.city} onChange={update} />
            <Field label='Postal code' name='postalCode' value={form.postalCode} onChange={update} />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='State' name='state' value={form.state} onChange={update} />
            <Field label='Country' name='country' value={form.country} onChange={update} />
          </div>

          <p className='text-base mt-4'>Contact Info</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='Email address' name='email' type='email' value={form.email} onChange={update} />
            <Field label='Mobile number' name='phone' type='tel' value={form.phone} onChange={update} />
          </div>
        </div>

        <div>
          <OrderSummary
            showItems
            action={({ agreed }) => (
              <button
                type='submit'
                disabled={!agreed}
                className='w-full bg-black text-white py-3.5 hover:bg-brand transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Place Order
              </button>
            )}
          />
        </div>
      </form>

      <CustomerReviews />
      <NewsletterBox />
    </div>
  )
}

export default Shipping
