import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api, inr, mediaSrc } from '../api'

const Products = ({ token }) => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [onlyProblems, setOnlyProblems] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const response = await api('/api/product/admin-list', {}, token)
    if (response.success) setProducts(response.products)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const categories = useMemo(
    () => ['All', ...new Set(products.map(p => p.category))],
    [products]
  )

  const visible = useMemo(() => products.filter(p => {
    if (category !== 'All' && p.category !== category) return false
    if (onlyProblems && !(p.outOfStock || p.totalStock <= 5)) return false
    if (search) {
      const needle = search.toLowerCase()
      return p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle)
    }
    return true
  }), [products, category, search, onlyProblems])

  const replace = (updated) => setProducts(prev => prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p)))

  const toggleStock = async (product) => {
    const response = await api('/api/product/stock', { id: product.id, outOfStock: !product.outOfStock }, token)
    if (response.success) {
      toast.success(`${product.name} is ${response.product.outOfStock ? 'out of stock' : 'back on sale'}`)
      load()
    }
  }

  const toggleActive = async (product) => {
    const response = await api('/api/product/update', { id: product.id, active: !product.active }, token)
    if (response.success) {
      toast.success(`${product.name} ${product.active ? 'hidden from the shop' : 'is live'}`)
      load()
    }
  }

  const saveSizeStock = async (product, size, quantity, available) => {
    const response = await api('/api/product/stock', { id: product.id, size, quantity, available }, token)
    if (response.success) load()
  }

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    const response = await api('/api/product/remove', { id: product.id }, token)
    if (response.success) {
      toast.success('Removed')
      setProducts(prev => prev.filter(p => p.id !== product.id))
    }
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-xl sm:text-2xl text-gray-900'>Posters</h1>
          <p className='text-xs text-gray-500 mt-1'>{visible.length} of {products.length}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Name or SKU'
            className='text-sm px-3 py-1.5 w-48'
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='text-sm px-3 py-1.5'>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <label className='flex items-center gap-2 text-xs text-gray-600'>
            <input type='checkbox' checked={onlyProblems} onChange={() => setOnlyProblems(v => !v)} className='accent-brand' />
            Needs attention
          </label>
          <Link to='/add' className='bg-black text-white text-sm px-4 py-1.5 rounded hover:bg-brand transition-colors'>
            Add poster
          </Link>
        </div>
      </div>

      {loading && <p className='text-sm text-gray-500'>Loading…</p>}

      <div className='flex flex-col gap-2'>
        {visible.map(product => (
          <div key={product.id} className='border border-gray-200 rounded-lg bg-white'>
            <div className='grid grid-cols-[48px_1fr] sm:grid-cols-[56px_2fr_1fr_1fr_auto] gap-3 p-3 items-center'>
              <img src={mediaSrc(product.image[0])} alt='' className='w-12 h-14 object-cover bg-gray-100 rounded-sm' />

              <div className='min-w-0'>
                <p className='text-sm text-gray-900 truncate'>{product.name}</p>
                <p className='text-[11px] text-gray-400'>
                  {product.sku} · {product.category} · {product.subCategory}
                  {product.panels ? ` · ${product.panels} panels` : ''}
                </p>
              </div>

              <div className='text-sm text-gray-600 hidden sm:block'>
                {inr(product.price)}
                {product.originalPrice ? <span className='text-gray-400 line-through ml-2 text-xs'>{inr(product.originalPrice)}</span> : null}
              </div>

              <div className='hidden sm:flex flex-wrap gap-1'>
                {product.stock?.length === 0 && <span className='text-[11px] text-gray-400'>made to order</span>}
                {product.stock?.map(entry => (
                  <span
                    key={entry.size}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      !entry.available || entry.quantity === 0 ? 'bg-red-100 text-red-700'
                        : entry.quantity <= 5 ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {entry.size} {entry.quantity}
                  </span>
                ))}
              </div>

              <div className='flex items-center gap-2 justify-end'>
                <button
                  onClick={() => toggleStock(product)}
                  className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                    product.outOfStock
                      ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                      : 'border-gray-300 text-gray-600 hover:border-black'
                  }`}
                >
                  {product.outOfStock ? 'Out of stock' : 'In stock'}
                </button>
                <button
                  onClick={() => setEditing(editing === product.id ? null : product.id)}
                  className='text-xs text-brand hover:underline'
                >
                  {editing === product.id ? 'Close' : 'Edit'}
                </button>
              </div>
            </div>

            {editing === product.id && (
              <div className='border-t border-gray-100 p-4 bg-gray-50/60 flex flex-col gap-4'>
                <div className='flex flex-wrap gap-3'>
                  {product.stock?.map(entry => (
                    <div key={entry.size} className='border border-gray-200 bg-white rounded p-2 w-28'>
                      <p className='text-xs text-gray-500 mb-1'>{entry.size}</p>
                      <input
                        type='number'
                        min='0'
                        defaultValue={entry.quantity}
                        onBlur={(e) => saveSizeStock(product, entry.size, e.target.value, entry.available)}
                        className='w-full text-sm px-2 py-1'
                      />
                      <label className='flex items-center gap-1.5 text-[11px] text-gray-500 mt-1.5'>
                        <input
                          type='checkbox'
                          checked={entry.available}
                          onChange={(e) => saveSizeStock(product, entry.size, entry.quantity, e.target.checked)}
                          className='accent-brand'
                        />
                        On sale
                      </label>
                    </div>
                  ))}
                  {product.stock?.length === 0 && (
                    <p className='text-xs text-gray-500'>Custom prints are made to order and never run out.</p>
                  )}
                </div>

                <div className='flex flex-wrap items-center gap-4 text-xs'>
                  <label className='flex items-center gap-2 text-gray-600'>
                    <input type='checkbox' checked={product.active} onChange={() => toggleActive(product)} className='accent-brand' />
                    Live on the storefront
                  </label>
                  <span className='text-gray-400'>{product.sold || 0} sold</span>
                  <button onClick={() => remove(product)} className='text-red-600 hover:underline ml-auto'>
                    Delete poster
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
