import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CheckoutSteps from '../components/CheckoutSteps'
import OrderSummary from '../components/OrderSummary'
import CustomerReviews from '../components/CustomerReviews'
import NewsletterBox from '../components/NewsletterBox'
import { validateAddress, INDIAN_STATES, TN_DISTRICTS } from '../utils/addressValidation'

// The half-filled form is kept separately from the confirmed address, so a
// refresh mid-typing loses nothing.
const DRAFT_KEY = 'shippingDraft'

const emptyAddress = {
  firstName: '', lastName: '', street: '', landmark: '',
  city: '', district: '', postalCode: '', state: '', country: 'India',
  email: '', phone: ''
}

// A field turns red only once it has been visited or the form has been submitted,
// so the page does not open covered in errors.
const Field = ({ label, name, value, onChange, onBlur, error, hint, required = true, type = 'text', list, inputMode, maxLength, autoComplete }) => (
  <div>
    <label htmlFor={name} className='block text-[11px] text-gray-500 mb-1'>{label}{required && ' *'}</label>
    <input
      id={name}
      name={name}
      type={type}
      list={list}
      inputMode={inputMode}
      maxLength={maxLength}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
      className={`w-full border px-3 py-2.5 text-sm outline-none transition-colors ${
        error ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-400 focus:border-black'
      }`}
    />
    {error
      ? <p id={`${name}-error`} className='text-[11px] text-red-600 mt-1'>{error}</p>
      : hint ? <p className='text-[11px] text-gray-400 mt-1'>{hint}</p> : null}
  </div>
)

const Shipping = () => {

  const { shippingAddress, setShippingAddress, getCartAmount, productsLoaded } = useContext(ShopContext)
  // Last confirmed address first, then anything typed but not yet submitted.
  const [form, setForm] = useState(() => {
    let draft = {}
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY)) || {} } catch { draft = {} }
    return { ...emptyAddress, ...shippingAddress, ...draft }
  })
  const returning = !!shippingAddress?.postalCode
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  // Autosave every keystroke.
  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)) } catch { /* non-critical */ }
  }, [form])

  const errors = useMemo(() => validateAddress(form), [form])
  const isValid = Object.keys(errors).length === 0

  const update = (name, value) => setForm(prev => ({ ...prev, [name]: value }))
  const blur = (name) => setTouched(prev => ({ ...prev, [name]: true }))
  const errorFor = (name) => ((touched[name] || submitted) ? errors[name] : undefined)

  // The restored basket is only measurable once the catalogue has arrived.
  const cartIsEmpty = productsLoaded && getCartAmount() === 0;

  useEffect(() => {
    if (cartIsEmpty) navigate('/cart')
  }, [cartIsEmpty])

  if (cartIsEmpty) return null

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid) {
      const firstBad = Object.keys(errors)[0]
      document.getElementById(firstBad)?.focus()
      document.getElementById(firstBad)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setShippingAddress(form)
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* non-critical */ }
    navigate('/place-order')
  }

  const errorCount = Object.keys(errors).length

  return (
    <div>
      <CheckoutSteps current='Shipping' />

      <div className='text-xl sm:text-2xl mb-8'>
        <Title text1={'SHIPPING ADDRESS'} />
      </div>

      {/* Suggestion lists: typing a real place is easier than spelling it. */}
      <datalist id='state-options'>
        {INDIAN_STATES.map(s => <option key={s} value={s} />)}
      </datalist>
      <datalist id='district-options'>
        {TN_DISTRICTS.map(d => <option key={d} value={d} />)}
      </datalist>

      {/* A real form with standard autocomplete tokens: Chrome offers to save
          this address on submit and fills it in on the next order. */}
      <form onSubmit={onSubmit} noValidate autoComplete='on' name='shipping-address' className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16'>
        <div className='flex flex-col gap-4'>

          {returning && (
            <p className='text-xs text-gray-500 border border-gray-200 bg-gray-50 px-4 py-2.5'>
              Filled in from your last order — change anything that has moved.
            </p>
          )}

          {submitted && !isValid && (
            <div className='border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700'>
              {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'} fixing before we can ship this order.
            </div>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='First name' name='firstName' value={form.firstName} onChange={update} onBlur={blur} error={errorFor('firstName')} autoComplete='shipping given-name' />
            <Field label='Last name' name='lastName' value={form.lastName} onChange={update} onBlur={blur} error={errorFor('lastName')} autoComplete='shipping family-name' />
          </div>

          <Field label='Street number and Area' name='street' value={form.street} onChange={update} onBlur={blur} error={errorFor('street')} autoComplete='shipping address-line1' />
          <Field label='Landmark' name='landmark' value={form.landmark} onChange={update} onBlur={blur} required={false} autoComplete='shipping address-line2' hint='Optional — helps the courier find you.' />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='City / Town' name='city' value={form.city} onChange={update} onBlur={blur} error={errorFor('city')} autoComplete='shipping address-level2' />
            <Field
              label='District' name='district' value={form.district} onChange={update} onBlur={blur}
              error={errorFor('district')} list='district-options' autoComplete='shipping address-level3'
              hint='Tamil Nadu districts are checked against the official list.'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field
              label='Postal code (PIN)' name='postalCode' value={form.postalCode} onChange={update} onBlur={blur}
              error={errorFor('postalCode')} inputMode='numeric' maxLength={6} autoComplete='shipping postal-code'
              hint='6 digits — checked against the state you enter.'
            />
            <Field
              label='State' name='state' value={form.state} onChange={update} onBlur={blur}
              error={errorFor('state')} list='state-options' autoComplete='shipping address-level1'
            />
          </div>

          <Field label='Country' name='country' value={form.country} onChange={update} onBlur={blur} error={errorFor('country')} hint='India only, for now.' autoComplete='shipping country-name' />

          <p className='text-base mt-4'>Contact Info</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='Email address' name='email' type='email' value={form.email} onChange={update} onBlur={blur} error={errorFor('email')} autoComplete='shipping email' />
            <Field label='Mobile number' name='phone' type='tel' value={form.phone} onChange={update} onBlur={blur} error={errorFor('phone')} inputMode='numeric' autoComplete='shipping tel' hint='10 digits, no +91 needed.' />
          </div>
        </div>

        <div>
          <OrderSummary
            showItems
            action={({ agreed }) => (
              <button
                type='submit'
                disabled={!agreed || !isValid}
                className='w-full bg-black text-white py-3.5 hover:bg-brand transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {isValid ? 'Place Order' : 'Complete your address'}
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
