import React from 'react'
import { BackgroundPattern } from './background/BackgroundPattern'

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <BackgroundPattern />
      <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-100"></div>
    </div>
  )
}
