"use client";

import React from 'react'
import Header from '../components/Header'
import Matches from '../components/Matches'

const page = () => {
  return (
    <div className="min-h-screen fixed inset-0 bg-gradient-to-b from-[#FEF1F3] via-[#F9F2F9] to-[#F5F3FF] pt-16 overflow-y-auto">
        <Header />
        <Matches />
    </div>
  )
}

export default page