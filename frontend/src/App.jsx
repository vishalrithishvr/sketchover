import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MarqueeBar from './components/MarqueeBar'
import WhatsappFloat from './components/WhatsappFloat'
import LogoIntro from './components/LogoIntro'
import ComboProgress from './components/ComboProgress'
import { PageTransitionProvider, ScrollToTop } from './components/PageTransition'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Browsing is the hot path and stays in the main bundle. Everything behind it —
// checkout, account, the static pages — is fetched the first time it is opened,
// which keeps the initial download small.
const Cart = lazy(() => import('./pages/Cart'))
const Shipping = lazy(() => import('./pages/Shipping'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const OrderPlaced = lazy(() => import('./pages/OrderPlaced'))
const Orders = lazy(() => import('./pages/Orders'))
const Verify = lazy(() => import('./pages/Verify'))
const Login = lazy(() => import('./pages/Login'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Favorites = lazy(() => import('./pages/Favorites'))
const CustomPosters = lazy(() => import('./pages/CustomPosters'))

const App = () => {
  return (
    <PageTransitionProvider>
      <ScrollToTop />
      <LogoIntro />
      <ToastContainer />
      <MarqueeBar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Navbar />
        <Suspense fallback={<div className='min-h-[60vh]' />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/custom-posters' element={<CustomPosters />} />
            <Route path='/favorites' element={<Favorites />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/shipping' element={<Shipping />} />
            <Route path='/login' element={<Login />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/order-placed' element={<OrderPlaced />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/verify' element={<Verify />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <ComboProgress />
      <WhatsappFloat />
    </PageTransitionProvider>
  )
}

export default App
