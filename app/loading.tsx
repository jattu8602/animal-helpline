import React from 'react'

function AppLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EB] text-white">
      {/* Splash image */}
      <div className="relative h-40 w-40 md:h-56 md:w-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/splash.png"
          alt="Animal Helpline splash"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Three loading dots that grow/shrink like a loading indicator */}
      <div className="loading-dots mt-8 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-black" />
        <span className="h-2 w-2 rounded-full bg-black" />
        <span className="h-2 w-2 rounded-full bg-black" />
      </div>
    </div>
  )
}

export default AppLoading
