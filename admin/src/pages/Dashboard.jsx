import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, inr, formatDate, formatDateTime } from '../api'

const Card = ({ label, value, hint, tone = 'default' }) => (
  <div className={`border rounded-lg p-4 bg-white ${tone === 'brand' ? 'border-brand' : 'border-gray-200'}`}>
    <p className='text-[11px] uppercase tracking-[0.12em] text-gray-400'>{label}</p>
    <p className={`text-2xl mt-1.5 ${tone === 'brand' ? 'text-brand' : 'text-gray-900'}`}>{value}</p>
    {hint && <p className='text-[11px] text-gray-400 mt-1'>{hint}</p>}
  </div>
)

const statusTone = (status) => ({
  'Order Placed': 'bg-gray-100 text-gray-700',
  'Payment Pending': 'bg-amber-100 text-amber-800',
  Paid: 'bg-green-100 text-green-800',
  Printing: 'bg-blue-100 text-blue-800',
  Packed: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-600 text-white',
  Cancelled: 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-700')

const Dashboard = ({ token }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const response = await api('/api/admin/dashboard', {}, token)
    if (response.success) setData(response)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading && !data) return <p className='text-sm text-gray-500'>Loading…</p>
  if (!data) return <p className='text-sm text-gray-500'>Nothing to show yet.</p>

  const peak = Math.max(1, ...data.daily.map(d => d.revenue))

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-xl sm:text-2xl text-gray-900'>Dashboard</h1>
          <p className='text-xs text-gray-500 mt-1'>Revenue counts orders marked paid or further along.</p>
        </div>
        <button onClick={load} className='text-xs border border-gray-300 hover:border-black px-3 py-1.5 rounded transition-colors'>
          Refresh
        </button>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-5 gap-3'>
        <Card label='Today' value={inr(data.revenue.today)} hint={`${data.counts.today} orders`} tone='brand' />
        <Card label='Last 7 days' value={inr(data.revenue.week)} hint={`${data.counts.week} orders`} />
        <Card label='Last 30 days' value={inr(data.revenue.month)} />
        <Card label='All time' value={inr(data.revenue.all)} hint={`${data.counts.total} orders`} />
        <Card label='Awaiting payment' value={inr(data.revenue.pending)} hint='placed but not paid' />
      </div>

      {/* Fourteen days of takings */}
      <section className='border border-gray-200 rounded-lg bg-white p-4'>
        <p className='text-sm text-gray-700 mb-4'>Revenue, last 14 days</p>
        <div className='flex items-end gap-1.5 h-36'>
          {data.daily.map(day => (
            <div key={day.date} className='flex-1 flex flex-col items-center gap-1.5 group'>
              <div className='w-full flex items-end h-28'>
                <div
                  className='w-full bg-brand/80 group-hover:bg-brand rounded-t transition-colors'
                  style={{ height: `${Math.max(2, (day.revenue / peak) * 100)}%` }}
                  title={`${formatDate(day.date)} — ${inr(day.revenue)} from ${day.orders} orders`}
                />
              </div>
              <span className='text-[9px] text-gray-400'>{new Date(day.date).getDate()}</span>
            </div>
          ))}
        </div>
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Orders by stage */}
        <section className='border border-gray-200 rounded-lg bg-white p-4'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm text-gray-700'>Orders by stage</p>
            <Link to='/orders' className='text-xs text-brand hover:underline'>All orders</Link>
          </div>
          <div className='flex flex-wrap gap-2'>
            {['Order Placed', 'Payment Pending', 'Paid', 'Printing', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
              .filter(status => data.counts[status])
              .map(status => (
                <span key={status} className={`text-xs px-2.5 py-1 rounded ${statusTone(status)}`}>
                  {status} · {data.counts[status]}
                </span>
              ))}
            {!data.counts.total && <p className='text-xs text-gray-400'>No orders yet.</p>}
          </div>

          <p className='text-sm text-gray-700 mt-6 mb-2'>Latest</p>
          <div className='flex flex-col divide-y divide-gray-100'>
            {data.recentOrders.map(order => (
              <Link key={order.id} to='/orders' className='flex items-center justify-between gap-3 py-2 text-sm hover:bg-gray-50 -mx-2 px-2 rounded'>
                <div className='min-w-0'>
                  <p className='truncate'>{order.customerName || 'Customer'}</p>
                  <p className='text-[11px] text-gray-400'>{order.reference} · {formatDateTime(order.date)}</p>
                </div>
                <div className='text-right shrink-0'>
                  <p>{inr(order.amount)}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusTone(order.status)}`}>{order.status}</span>
                </div>
              </Link>
            ))}
            {data.recentOrders.length === 0 && <p className='text-xs text-gray-400 py-2'>Nothing yet.</p>}
          </div>
        </section>

        <div className='flex flex-col gap-6'>
          {/* What is selling */}
          <section className='border border-gray-200 rounded-lg bg-white p-4'>
            <p className='text-sm text-gray-700 mb-3'>Best sellers</p>
            <div className='flex flex-col gap-2'>
              {data.topProducts.map(item => (
                <div key={item.key} className='flex items-center justify-between gap-3 text-sm'>
                  <span className='truncate text-gray-700'>{item.name}</span>
                  <span className='shrink-0 text-gray-500'>{item.quantity} sold · {inr(item.revenue)}</span>
                </div>
              ))}
              {data.topProducts.length === 0 && <p className='text-xs text-gray-400'>No sales yet.</p>}
            </div>
          </section>

          {/* What needs restocking */}
          <section className='border border-gray-200 rounded-lg bg-white p-4'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-sm text-gray-700'>Running low</p>
              <Link to='/products' className='text-xs text-brand hover:underline'>Manage stock</Link>
            </div>
            <div className='flex flex-col gap-2'>
              {data.lowStock.map(item => (
                <div key={item.id} className='flex items-center justify-between gap-3 text-sm'>
                  <span className='truncate text-gray-700'>{item.name}</span>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${item.outOfStock ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                    {item.outOfStock ? 'Out of stock' : `${item.total} left`}
                  </span>
                </div>
              ))}
              {data.lowStock.length === 0 && <p className='text-xs text-gray-400'>Everything is well stocked.</p>}
            </div>
          </section>

          <section className='border border-gray-200 rounded-lg bg-white p-4 text-sm text-gray-600'>
            <p>{data.catalogue.products} posters in the catalogue · {data.catalogue.active} live · {data.catalogue.outOfStock} out of stock</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
