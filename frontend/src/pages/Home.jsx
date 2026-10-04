import React from 'react'
import Hero from '../components/Hero'
import CategoryShowcase from '../components/CategoryShowcase'
import LatestCollection from '../components/LatestCollection'
import PersonalizationBanner from '../components/PersonalizationBanner'
import { DiagonalRibbon } from '../components/MarqueeBar'
import SplitSetRow from '../components/SplitSetRow'
import CustomSplitBanner from '../components/CustomSplitBanner'
import HeroCollection from '../components/HeroCollection'
import BestSeller from '../components/BestSeller'
import CustomerReviews from '../components/CustomerReviews'
import OurPolicy from '../components/OurPolicy'
import FAQ from '../components/FAQ'
import NewsletterBox from '../components/NewsletterBox'
import MediaSlot from '../components/MediaSlot'
import { SPLIT_SET_TYPES } from '../assets/assets'

const verticalSets = SPLIT_SET_TYPES.filter(type => type.orientation === 'vertical')
const horizontalSets = SPLIT_SET_TYPES.filter(type => type.orientation === 'horizontal')

const Home = () => {
  return (
    <div>
      <Hero />
      <MediaSlot slot='home-hero' columns={1} />
      <CategoryShowcase />
      <LatestCollection />
      <PersonalizationBanner />
      <DiagonalRibbon />

      {/* 3, 4, 6 and 8-panel sets, then the pitch, then the horizontal cut. */}
      {verticalSets.map(type => <SplitSetRow key={type.id} type={type} />)}
      <CustomSplitBanner />
      {horizontalSets.map(type => <SplitSetRow key={type.id} type={type} />)}

      <MediaSlot slot='home-ads' title='FROM THE STUDIO' columns={2} />
      <HeroCollection />
      <BestSeller />
      <CustomerReviews />
      <MediaSlot slot='home-reviews' title='REVIEWS ON VIDEO' />
      <OurPolicy />
      <FAQ />
      <NewsletterBox />
    </div>
  )
}

export default Home
