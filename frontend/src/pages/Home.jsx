import React from 'react'
import Hero from '../components/Hero'
import CategoryShowcase from '../components/CategoryShowcase'
import LatestCollection from '../components/LatestCollection'
import PersonalizationBanner from '../components/PersonalizationBanner'
import BestSeller from '../components/BestSeller'
import CustomerReviews from '../components/CustomerReviews'
import OurPolicy from '../components/OurPolicy'
import FAQ from '../components/FAQ'
import NewsletterBox from '../components/NewsletterBox'
import Reveal from '../components/Reveal'

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryShowcase />
      <LatestCollection/>
      <PersonalizationBanner />
      <BestSeller/>
      <CustomerReviews />
      <OurPolicy/>
      <FAQ />
      <Reveal><NewsletterBox/></Reveal>
    </div>
  )
}

export default Home
