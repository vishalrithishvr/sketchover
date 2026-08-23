import React from 'react'
import Hero from '../components/Hero'
import CategoryShowcase from '../components/CategoryShowcase'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import Reveal from '../components/Reveal'

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryShowcase />
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <Reveal><NewsletterBox/></Reveal>
    </div>
  )
}

export default Home
