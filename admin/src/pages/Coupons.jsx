import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { api, inr } from '../api'

const blank = { code: '', percent: 10, minOrder: 0, usageLimit: 0, expiresAt: '', note: '', active: true }

const Coupons = ({ token }) => {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const response = await api('/api/admin/coupon/list', {}, token)
    if (response.success) setCoupons(response.coupons)
  }

  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const response = await api('/api/admin/coupon/save', form, token)
    setSaving(false)
    if (response.success) {
      toast.success('Saved')
      setForm(blank)
      load()
    }
  }

  const toggle = async (coupon) => {
    const response = await api('/api/admin/coupon/save', { id: coupon._id, ...coupon, active: !coupon.active }, token)
    if (response.success) load()
  }

  const remove = async (coupon) => {
    if (!window.confirm(`Delete ${coupon.code}?`)) return
    const response = await api('/api/admin/coupon/remove', { id: coupon._id }, token)
    if (response.success) { toast.success('Removed'); load() }
  }

  return (
    <div className='flex flex-col gap-6 max-w-4xl'>
      <div>
        <h1 className='text-xl sm:text-2xl text-gray-900'>Coupons</h1>
        <p className='text-xs text-gray-500 mt-1'>Codes shoppers can type in the cart. The storefront checks them here.</p>
      </div>

      <form onSubmit={save} className='border border-gray-200 rounded-lg bg-white p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end'>
        <label className='col-span-2 sm:col-span-1'>
          <span className='block text-xs text-gray-500 mb-1'>Code</span>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
            placeholder='SKO10'
            className='w-full text-sm px-3 py-2 uppercase'
          />
        </label>
        <label>
          <span className='block text-xs text-gray-500 mb-1'>% off</span>
          <input type='number' min='1' max='90' value={form.percent} onChange={(e) => setForm({ ...form, percent: e.target.value })} required className='w-full text-sm px-3 py-2' />
        </label>
        <label>
          <span className='block text-xs text-gray-500 mb-1'>Min order</span>
          <input type='number' min='0' value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className='w-full text-sm px-3 py-2' />
        </label>
        <label>
          <span className='block text-xs text-gray-500 mb-1'>Max uses</span>
          <input type='number' min='0' value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className='w-full text-sm px-3 py-2' placeholder='0 = no limit' />
        </label>
        <label>
          <span className='block text-xs text-gray-500 mb-1'>Expires</span>
          <input type='date' value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className='w-full text-sm px-3 py-2' />
        </label>
        <button disabled={saving} className='bg-black text-white text-sm px-4 py-2.5 rounded hover:bg-brand transition-colors disabled:bg-gray-400'>
          {saving ? 'Saving…' : 'Add code'}
        </button>
      </form>

      <div className='border border-gray-200 rounded-lg bg-white divide-y divide-gray-100'>
        {coupons.map(coupon => (
          <div key={coupon._id} className='flex flex-wrap items-center gap-3 p-3 text-sm'>
            <span className='font-medium text-gray-900 w-24'>{coupon.code}</span>
            <span className='text-brand w-16'>{coupon.percent}% off</span>
            <span className='text-gray-500 text-xs'>
              {coupon.minOrder ? `min ${inr(coupon.minOrder)}` : 'no minimum'}
              {coupon.usageLimit ? ` · ${coupon.usedCount}/${coupon.usageLimit} used` : ` · ${coupon.usedCount} used`}
              {coupon.expiresAt ? ` · until ${new Date(coupon.expiresAt).toLocaleDateString('en-IN')}` : ''}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {coupon.active ? 'Active' : 'Paused'}
            </span>
            <div className='ml-auto flex items-center gap-3 text-xs'>
              <button onClick={() => toggle(coupon)} className='text-gray-600 hover:underline'>
                {coupon.active ? 'Pause' : 'Activate'}
              </button>
              <button onClick={() => remove(coupon)} className='text-red-600 hover:underline'>Delete</button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <p className='text-sm text-gray-400 p-4'>No codes yet.</p>}
      </div>
    </div>
  )
}

export default Coupons
