import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../api'

// Kept in step with the storefront's own lists.
const CATEGORIES = ['Autosport', 'Anime', 'Sports', 'TV Series', 'Music', 'Video-Games', 'Motivate', 'Custom']
const SIZES = ['A6', 'A5', 'A4', 'A3', 'A3+']
const SIZE_PRICES = { A6: 29, A5: 49, A4: 89, A3: 109, 'A3+': 119 }

const Field = ({ label, hint, children }) => (
  <label className='block'>
    <span className='block text-xs text-gray-500 mb-1'>{label}</span>
    {children}
    {hint && <span className='block text-[11px] text-gray-400 mt-1'>{hint}</span>}
  </label>
)

const Add = ({ token }) => {
  const navigate = useNavigate()
  const [images, setImages] = useState([null, null, null, null])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Autosport',
    subCategory: 'Single',
    price: SIZE_PRICES.A4,
    originalPrice: 129,
    sizes: ['A6', 'A5', 'A4', 'A3', 'A3+'],
    panels: '',
    orientation: 'vertical',
    bestseller: false,
    tags: '',
    stockPerSize: 25,
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleSize = (size) => setForm(prev => ({
    ...prev,
    sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
  }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!images.some(Boolean)) return toast.error('Add at least one image.')
    if (form.sizes.length === 0) return toast.error('Pick at least one size.')

    setSaving(true)
    const data = new FormData()
    data.append('name', form.name)
    data.append('description', form.description)
    data.append('category', form.category)
    data.append('subCategory', form.subCategory)
    data.append('price', form.price)
    data.append('originalPrice', form.originalPrice)
    data.append('sizes', JSON.stringify(form.sizes))
    data.append('bestseller', form.bestseller)
    data.append('tags', form.tags)
    if (form.subCategory === 'Split') {
      data.append('panels', form.panels || 3)
      data.append('orientation', form.orientation)
    }
    data.append('stock', JSON.stringify(form.sizes.map(size => ({
      size, quantity: Number(form.stockPerSize) || 0, available: true,
    }))))
    images.forEach((file, i) => { if (file) data.append(`image${i + 1}`, file) })

    const response = await api('/api/product/add', data, token)
    setSaving(false)
    if (response.success) {
      toast.success(response.message)
      navigate('/products')
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-6 max-w-3xl'>
      <div>
        <h1 className='text-xl sm:text-2xl text-gray-900'>Add a poster</h1>
        <p className='text-xs text-gray-500 mt-1'>It goes live on the storefront as soon as you save.</p>
      </div>

      <section className='border border-gray-200 rounded-lg bg-white p-4'>
        <p className='text-xs text-gray-500 mb-3'>Images — the first one is the tile</p>
        <div className='flex flex-wrap gap-3'>
          {images.map((file, i) => (
            <label key={i} className='cursor-pointer'>
              <input
                type='file'
                accept='image/*'
                hidden
                onChange={(e) => {
                  const next = [...images]
                  next[i] = e.target.files?.[0] || null
                  setImages(next)
                }}
              />
              <div className='w-24 h-28 border-2 border-dashed border-gray-300 hover:border-brand rounded flex items-center justify-center overflow-hidden bg-gray-50 transition-colors'>
                {file
                  ? <img src={URL.createObjectURL(file)} alt='' className='w-full h-full object-cover' />
                  : <span className='text-[11px] text-gray-400'>{i === 0 ? 'Main' : `Image ${i + 1}`}</span>}
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className='border border-gray-200 rounded-lg bg-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Field label='Name'>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required className='w-full text-sm px-3 py-2' placeholder='BMW M2 Drift Poster' />
        </Field>

        <Field label='Category'>
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className='w-full text-sm px-3 py-2'>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <Field label='Description' hint='Shown on the product page.'>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className='w-full text-sm px-3 py-2' />
        </Field>

        <div className='grid grid-cols-2 gap-3'>
          <Field label='Type'>
            <select value={form.subCategory} onChange={(e) => update('subCategory', e.target.value)} className='w-full text-sm px-3 py-2'>
              <option>Single</option>
              <option>Split</option>
            </select>
          </Field>
          {form.subCategory === 'Split' && (
            <>
              <Field label='Panels'>
                <select value={form.panels} onChange={(e) => update('panels', e.target.value)} className='w-full text-sm px-3 py-2'>
                  {[3, 4, 6, 8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label='Orientation'>
                <select value={form.orientation} onChange={(e) => update('orientation', e.target.value)} className='w-full text-sm px-3 py-2'>
                  <option value='vertical'>Vertical</option>
                  <option value='horizontal'>Horizontal</option>
                </select>
              </Field>
            </>
          )}
        </div>

        <Field label='Price shown on the tile' hint='A4 is the catalogue price; each size has its own on the product page.'>
          <input type='number' value={form.price} onChange={(e) => update('price', e.target.value)} required className='w-full text-sm px-3 py-2' />
        </Field>

        <Field label='Struck-through price'>
          <input type='number' value={form.originalPrice} onChange={(e) => update('originalPrice', e.target.value)} className='w-full text-sm px-3 py-2' />
        </Field>

        <Field label='Sizes offered'>
          <div className='flex flex-wrap gap-2'>
            {SIZES.map(size => (
              <button
                type='button'
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                  form.sizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </Field>

        <Field label='Opening stock, per size'>
          <input type='number' min='0' value={form.stockPerSize} onChange={(e) => update('stockPerSize', e.target.value)} className='w-full text-sm px-3 py-2' />
        </Field>

        <Field label='Tags' hint='Comma separated — used for curated rows like the superhero wall.'>
          <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className='w-full text-sm px-3 py-2' placeholder='superhero, marvel' />
        </Field>

        <label className='flex items-center gap-2 text-sm text-gray-600 self-end'>
          <input type='checkbox' checked={form.bestseller} onChange={(e) => update('bestseller', e.target.checked)} className='accent-brand' />
          Feature as a bestseller
        </label>
      </section>

      <div>
        <button disabled={saving} className='bg-black text-white text-sm px-8 py-2.5 rounded hover:bg-brand transition-colors disabled:bg-gray-400'>
          {saving ? 'Saving…' : 'Add poster'}
        </button>
      </div>
    </form>
  )
}

export default Add
