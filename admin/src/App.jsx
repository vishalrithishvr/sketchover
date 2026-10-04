import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Add from './pages/Add'
import Media from './pages/Media'
import Coupons from './pages/Coupons'
import Settings from './pages/Settings'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export { backendUrl, currency } from './api'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => { localStorage.setItem('token', token) }, [token])

  if (!token) {
    return (
      <div className='bg-gray-50 min-h-screen'>
        <ToastContainer position='bottom-right' />
        <Login setToken={setToken} />
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer position='bottom-right' />
      <Navbar setToken={setToken} />
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 min-w-0 p-4 sm:p-6 lg:p-8'>
          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='/dashboard' element={<Dashboard token={token} />} />
            <Route path='/orders' element={<Orders token={token} />} />
            <Route path='/products' element={<Products token={token} />} />
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/media' element={<Media token={token} />} />
            <Route path='/coupons' element={<Coupons token={token} />} />
            <Route path='/settings' element={<Settings token={token} />} />
            {/* Links from the old panel still land somewhere sensible. */}
            <Route path='/list' element={<Navigate to='/products' replace />} />
            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
