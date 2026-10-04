import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { api, mediaSrc } from '../api'

const Media = ({ token }) => {
  const [items, setItems] = useState([])
  const [slots, setSlots] = useState([])
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', caption: '', slot: '', kind: 'video', externalUrl: '', order: 0 })
  const [file, setFile] = useState(null)
  const [poster, setPoster] = useState(null)

  const load = async () => {
    const response = await api('/api/media/list', {}, token)
    if (response.success) {
      setItems(response.media)
      setSlots(response.slots)
      setForm(prev => ({ ...prev, slot: prev.slot || response.slots[0]?.id || '' }))
    }
  }

  useEffect(() => { load() }, [])

  const grouped = useMemo(() => {
    const map = {}
    items.forEach(item => {
      map[item.slot] = map[item.slot] || []
      map[item.slot].push(item)
    })
    return map
  }, [items])

  const upload = async (e) => {
    e.preventDefault()
    if (!file && !form.externalUrl) return toast.error('Choose a file or paste a link.')
    if (!form.slot) return toast.error('Pick where it goes.')

    setUploading(true)
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (file) data.append('file', file)
    if (poster) data.append('poster', poster)

    const response = await api('/api/media/upload', data, token)
    setUploading(false)
    if (response.success) {
      toast.success('Uploaded')
      setFile(null); setPoster(null)
      setForm(prev => ({ ...prev, title: '', caption: '', externalUrl: '' }))
      load()
    }
  }

  const toggle = async (item) => {
    const response = await api('/api/media/update', { id: item.id, active: !item.active }, token)
    if (response.success) load()
  }

  const move = async (item, direction) => {
    const response = await api('/api/media/update', { id: item.id, order: (item.order || 0) + direction }, token)
    if (response.success) load()
  }

  const remove = async (item) => {
    if (!window.confirm(`Remove "${item.title}"?`)) return
    const response = await api('/api/media/remove', { id: item.id }, token)
    if (response.success) { toast.success('Removed'); load() }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl sm:text-2xl text-gray-900'>Videos & media</h1>
        <p className='text-xs text-gray-500 mt-1'>
          Upload a review clip or an ad, pick where on the site it should play, and it appears there straight away.
        </p>
      </div>

      <form onSubmit={upload} className='border border-gray-200 rounded-lg bg-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Video or image file</span>
          <input type='file' accept='video/*,image/*' onChange={(e) => setFile(e.target.files?.[0] || null)} className='w-full text-sm px-3 py-2' />
          <span className='block text-[11px] text-gray-400 mt-1'>
            Up to 200 MB. MP4 plays everywhere. Leave empty if you are linking a YouTube video instead.
          </span>
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Or paste a link</span>
          <input
            value={form.externalUrl}
            onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
            placeholder='https://youtube.com/…'
            className='w-full text-sm px-3 py-2'
          />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Where should it show?</span>
          <select value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} className='w-full text-sm px-3 py-2'>
            {slots.map(slot => <option key={slot.id} value={slot.id}>{slot.label}</option>)}
          </select>
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Kind</span>
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className='w-full text-sm px-3 py-2'>
            <option value='video'>Video</option>
            <option value='image'>Image</option>
          </select>
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Title</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className='w-full text-sm px-3 py-2' placeholder='Customer review — Aarav' />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Caption</span>
          <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className='w-full text-sm px-3 py-2' />
        </label>

        <label className='block'>
          <span className='block text-xs text-gray-500 mb-1'>Cover image (videos only)</span>
          <input type='file' accept='image/*' onChange={(e) => setPoster(e.target.files?.[0] || null)} className='w-full text-sm px-3 py-2' />
        </label>

        <div className='flex items-end'>
          <button disabled={uploading} className='bg-black text-white text-sm px-6 py-2.5 rounded hover:bg-brand transition-colors disabled:bg-gray-400'>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>

      {slots.map(slot => (
        <section key={slot.id} className='border border-gray-200 rounded-lg bg-white p-4'>
          <p className='text-sm text-gray-700'>{slot.label}</p>
          <p className='text-[11px] text-gray-400 mb-3'>{(grouped[slot.id] || []).length} item(s)</p>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {(grouped[slot.id] || []).map(item => (
              <div key={item.id} className={`border rounded overflow-hidden ${item.active ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
                <div className='aspect-video bg-black flex items-center justify-center'>
                  {item.kind === 'image'
                    ? <img src={mediaSrc(item.url)} alt='' className='w-full h-full object-cover' />
                    : item.url.includes('youtu')
                      ? <span className='text-white/70 text-[11px] px-2 text-center'>YouTube link</span>
                      : <video src={mediaSrc(item.url)} poster={mediaSrc(item.poster)} className='w-full h-full object-cover' muted playsInline preload='metadata' />}
                </div>
                <div className='p-2'>
                  <p className='text-xs text-gray-800 truncate'>{item.title}</p>
                  <p className='text-[10px] text-gray-400'>
                    {item.kind}{item.sizeBytes ? ` · ${(item.sizeBytes / 1024 / 1024).toFixed(1)} MB` : ''}
                  </p>
                  <div className='flex items-center gap-2 mt-1.5 text-[11px]'>
                    <button onClick={() => toggle(item)} className={item.active ? 'text-gray-600 hover:underline' : 'text-brand hover:underline'}>
                      {item.active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => move(item, -1)} className='text-gray-500 hover:underline'>↑</button>
                    <button onClick={() => move(item, 1)} className='text-gray-500 hover:underline'>↓</button>
                    <button onClick={() => remove(item)} className='text-red-600 hover:underline ml-auto'>Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {(grouped[slot.id] || []).length === 0 && (
              <p className='text-xs text-gray-400 col-span-full'>Nothing here yet.</p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Media
