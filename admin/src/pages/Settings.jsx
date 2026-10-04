import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { api, apiGet } from '../api'

const Settings = ({ token }) => {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const response = await apiGet('/api/admin/settings')
    if (response.success) setSettings(response.settings)
  }

  useEffect(() => { load() }, [])

  if (!settings) return <p className='text-sm text-gray-500'>Loading…</p>

  const update = (field, value) => setSettings(prev => ({ ...prev, [field]: value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const response = await api('/api/admin/settings', {
      marqueeMessages: settings.marqueeMessages,
      ribbonMessages: settings.ribbonMessages,
      announcement: settings.announcement,
      whatsappNumber: settings.whatsappNumber,
      freeDeliveryFrom: settings.freeDeliveryFrom,
      deliveryDaysChennai: settings.deliveryDaysChennai,
      deliveryDaysIndia: settings.deliveryDaysIndia,
    }, token)
    setSaving(false)
    if (response.success) {
      toast.success('Saved — the storefront picks this up on its next load.')
      setSettings(response.settings)
    }
  }

  const lines = (value) => (Array.isArray(value) ? value.join('\n') : '')

  return (
    <form onSubmit={save} className='flex flex-col gap-6 max-w-2xl'>
      <div>
        <h1 className='text-xl sm:text-2xl text-gray-900'>Site settings</h1>
        <p className='text-xs text-gray-500 mt-1'>Wording and numbers you can change without a deploy.</p>
      </div>

      <section className='border border-gray-200 rounded-lg bg-white p-4 flex flex-col gap-4'>
        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Top strip offers — one per line</span>
          <textarea
            rows={3}
            value={lines(settings.marqueeMessages)}
            onChange={(e) => update('marqueeMessages', e.target.value.split('\n'))}
            className='w-full text-sm px-3 py-2'
          />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Slanted ribbon — one per line</span>
          <textarea
            rows={3}
            value={lines(settings.ribbonMessages)}
            onChange={(e) => update('ribbonMessages', e.target.value.split('\n'))}
            className='w-full text-sm px-3 py-2'
          />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Announcement</span>
          <input
            value={settings.announcement || ''}
            onChange={(e) => update('announcement', e.target.value)}
            placeholder='Shown above the header when set'
            className='w-full text-sm px-3 py-2'
          />
        </label>
      </section>

      <section className='border border-gray-200 rounded-lg bg-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>WhatsApp number</span>
          <input value={settings.whatsappNumber || ''} onChange={(e) => update('whatsappNumber', e.target.value)} className='w-full text-sm px-3 py-2' />
          <span className='block text-[11px] text-gray-400 mt-1'>With country code, no plus — 918870333236.</span>
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Free delivery from</span>
          <input type='number' value={settings.freeDeliveryFrom || 0} onChange={(e) => update('freeDeliveryFrom', e.target.value)} className='w-full text-sm px-3 py-2' />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Delivery days — Chennai</span>
          <input value={settings.deliveryDaysChennai || ''} onChange={(e) => update('deliveryDaysChennai', e.target.value)} className='w-full text-sm px-3 py-2' />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Delivery days — rest of India</span>
          <input value={settings.deliveryDaysIndia || ''} onChange={(e) => update('deliveryDaysIndia', e.target.value)} className='w-full text-sm px-3 py-2' />
        </label>
      </section>

      <div>
        <button disabled={saving} className='bg-black text-white text-sm px-8 py-2.5 rounded hover:bg-brand transition-colors disabled:bg-gray-400'>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}

export default Settings
