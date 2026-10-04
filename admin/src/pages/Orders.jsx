import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { api, inr, formatDateTime, mediaSrc } from '../api'

const STATUSES = ['Order Placed', 'Payment Pending', 'Paid', 'Printing', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

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

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const response = await api('/api/order/list', { status, search }, token)
    if (response.success) setOrders(response.orders)
    setLoading(false)
  }

  useEffect(() => { load() }, [status])

  const changeStatus = async (order, next) => {
    const response = await api('/api/order/status', { orderId: order._id, status: next }, token)
    if (response.success) {
      toast.success(`${order.reference} → ${next}`)
      setOrders(prev => prev.map(o => (o._id === order._id ? response.order : o)))
      if (open?._id === order._id) setOpen(response.order)
    }
  }

  // Everything in the list, as a spreadsheet.
  const exportCsv = () => {
    const rows = [['Reference', 'Date', 'Customer', 'Phone', 'Items', 'Amount', 'Status', 'Paid', 'City', 'PIN']]
    orders.forEach(o => rows.push([
      o.reference, new Date(o.date).toISOString(), o.customerName, o.phone,
      o.items.reduce((n, i) => n + i.quantity, 0), o.amount, o.status, o.payment ? 'yes' : 'no',
      o.address?.city || '', o.address?.postalCode || '',
    ]))
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `sketchover-orders-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-xl sm:text-2xl text-gray-900'>Orders</h1>
          <p className='text-xs text-gray-500 mt-1'>{orders.length} shown</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <form onSubmit={(e) => { e.preventDefault(); load() }} className='flex'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Reference, name or phone'
              className='text-sm px-3 py-1.5 w-56'
            />
            <button className='bg-black text-white text-sm px-4 rounded-r'>Find</button>
          </form>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className='text-sm px-3 py-1.5'>
            <option>All</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={exportCsv} className='text-sm border border-gray-300 hover:border-black px-3 py-1.5 rounded transition-colors'>
            Export CSV
          </button>
        </div>
      </div>

      {loading && <p className='text-sm text-gray-500'>Loading…</p>}
      {!loading && orders.length === 0 && <p className='text-sm text-gray-500'>No orders here yet.</p>}

      <div className='flex flex-col gap-3'>
        {orders.map(order => (
          <div key={order._id} className='border border-gray-200 rounded-lg bg-white'>
            <div className='grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto] gap-3 p-4 items-start'>
              <div className='min-w-0'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='font-medium text-gray-900'>{order.reference}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${statusTone(order.status)}`}>{order.status}</span>
                  {order.payment && order.status !== 'Paid' && <span className='text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-800'>Paid</span>}
                </div>
                <p className='text-xs text-gray-500 mt-1'>{formatDateTime(order.date)}</p>
                <p className='text-sm text-gray-700 mt-2'>
                  {order.items.reduce((n, i) => n + i.quantity, 0)} items · {inr(order.amount)}
                </p>
                <button onClick={() => setOpen(open?._id === order._id ? null : order)} className='text-xs text-brand hover:underline mt-1'>
                  {open?._id === order._id ? 'Hide details' : 'View details'}
                </button>
              </div>

              <div className='text-sm text-gray-600 min-w-0'>
                <p className='text-gray-900'>{order.customerName}</p>
                <p className='text-xs'>{order.phone}</p>
                <p className='text-xs truncate'>{[order.address?.city, order.address?.postalCode].filter(Boolean).join(' · ')}</p>
                {order.items.some(i => i.isCustom) && (
                  <p className='text-[11px] text-brand mt-1'>Has uploaded artwork</p>
                )}
              </div>

              <select
                value={order.status}
                onChange={(e) => changeStatus(order, e.target.value)}
                className='text-sm px-2 py-1.5'
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {open?._id === order._id && (
              <div className='border-t border-gray-100 p-4 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 bg-gray-50/60'>
                <div>
                  <p className='text-xs uppercase tracking-wide text-gray-400 mb-2'>Items</p>
                  <div className='flex flex-col gap-2'>
                    {order.items.map((item, i) => (
                      <div key={i} className='flex items-center gap-3 text-sm'>
                        {item.image && <img src={mediaSrc(item.image)} alt='' className='w-9 h-11 object-cover bg-gray-100 rounded-sm' />}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate'>{item.name}</p>
                          <p className='text-[11px] text-gray-500'>
                            {item.size} × {item.quantity}
                            {item.fileNames?.length ? ` · artwork: ${item.fileNames.join(', ')}` : ''}
                          </p>
                        </div>
                        <span className='text-gray-600'>{inr(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className='mt-4 text-sm text-gray-600 flex flex-col gap-1'>
                    <div className='flex justify-between'><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
                    {order.comboDiscount > 0 && <div className='flex justify-between text-brand'><span>Combo discount</span><span>-{inr(order.comboDiscount)}</span></div>}
                    {order.couponDiscount > 0 && <div className='flex justify-between'><span>Coupon {order.couponCode}</span><span>-{inr(order.couponDiscount)}</span></div>}
                    <div className='flex justify-between'><span>Platform fee</span><span>{inr(order.platformFee)}</span></div>
                    <div className='flex justify-between font-medium text-gray-900 border-t border-gray-200 pt-1 mt-1'>
                      <span>Total</span><span>{inr(order.amount)}</span>
                    </div>
                  </div>
                </div>

                <div className='text-sm text-gray-600'>
                  <p className='text-xs uppercase tracking-wide text-gray-400 mb-2'>Deliver to</p>
                  <p className='text-gray-900'>{order.customerName}</p>
                  <p>{order.address?.street}{order.address?.landmark ? `, ${order.address.landmark}` : ''}</p>
                  <p>{[...new Set([order.address?.city, order.address?.district, order.address?.state, order.address?.postalCode].filter(Boolean))].join(', ')}</p>
                  <p>{order.address?.country}</p>
                  <p className='mt-2'>{order.email}</p>
                  <p>{order.phone}</p>
                  <p className='text-xs text-gray-400 mt-2'>
                    {order.isChennai ? 'Chennai — 2-3 day promise' : 'Outside Chennai — 4-7 days'}
                  </p>

                  <p className='text-xs uppercase tracking-wide text-gray-400 mt-5 mb-2'>History</p>
                  <div className='flex flex-col gap-1'>
                    {order.statusHistory?.map((entry, i) => (
                      <p key={i} className='text-xs'>
                        <span className='text-gray-900'>{entry.status}</span>
                        <span className='text-gray-400'> · {formatDateTime(entry.at)}</span>
                      </p>
                    ))}
                  </div>

                  <a
                    href={`https://wa.me/${(order.phone || '').replace(/\D/g, '').replace(/^0/, '91')}`}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-block mt-4 text-xs bg-[#2E8B7A] text-white px-4 py-2 rounded'
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
