'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { motion } from 'framer-motion'

interface NotFoundAnimationProps {
  animations: string[]
}

export function NotFoundAnimation({ animations }: NotFoundAnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    const loadRandomAnimation = async () => {
      if (animations.length > 0) {
        const randomIndex = Math.floor(Math.random() * animations.length)
        const selectedAnimation = animations[randomIndex]

        try {
          const response = await fetch(`/anime/${selectedAnimation}`)
          const data = await response.json()
          setAnimationData(data)
        } catch (error) {
          console.error('Failed to load animation:', error)
        }
      }
    }

    loadRandomAnimation()
  }, [animations])

  if (!animationData) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md aspect-square"
    >
      <Lottie animationData={animationData} loop={true} />
    </motion.div>
  )
}
