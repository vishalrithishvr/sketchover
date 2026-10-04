import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../api'
import Logo from './Logo'

const Login = ({ setToken }) => {
  // The studio signs in with a username, not an email address.
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/admin`, {
        email: username.trim(),
        password,
      })
      if (data.success) {
        setToken(data.token)
      } else {
        toast.error(data.message || 'Those details did not match.')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-sm'>
        <div className='flex justify-center mb-6'>
          <Logo />
        </div>

        <form onSubmit={onSubmit} className='bg-white border border-gray-200 rounded-lg p-6'>
          <h1 className='text-lg text-gray-900 mb-1'>Sign in</h1>
          <p className='text-xs text-gray-500 mb-5'>The order desk, stock and media for sketchover.in.</p>

          <label className='block mb-3'>
            <span className='block text-xs text-gray-500 mb-1'>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete='username'
              required
              className='w-full px-3 py-2 text-sm'
              placeholder='Skoadmin'
            />
          </label>

          <label className='block mb-5'>
            <span className='block text-xs text-gray-500 mb-1'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              required
              className='w-full px-3 py-2 text-sm'
            />
          </label>

          <button
            type='submit'
            disabled={busy}
            className='w-full bg-black text-white text-sm py-2.5 rounded hover:bg-brand transition-colors disabled:bg-gray-400'
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
