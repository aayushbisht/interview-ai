import React from 'react'
import { Hero } from '@/components/landing/Hero'
import { About } from '@/components/landing/About'
import { HowItWorks } from '@/components/landing/HowItWorks'

const page = () => {
  return (
    <div><Hero></Hero>
    <About></About>
    <HowItWorks></HowItWorks>
    </div>

  )
}

export default page