import Link from 'next/link'
import { NotFoundAnimation } from '@/components/not-found-animation'
import fs from 'fs'
import path from 'path'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  // Get all json files from public/anime
  const animeDir = path.join(process.cwd(), 'public', 'anime')
  let animations: string[] = []

  try {
    if (fs.existsSync(animeDir)) {
      animations = fs
        .readdirSync(animeDir)
        .filter((file) => file.endsWith('.json'))
    }
  } catch (error) {
    console.error('Error reading anime directory:', error)
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F5F2EB] p-4 overflow-hidden">
      <div className="flex flex-col items-center gap-2">
        {/* Big 404 Text */}
        <h1 className="text-[150px] leading-none font-black text-black tracking-tighter">
          404
        </h1>

        {/* Animation */}
        <div className="w-full max-w-[300px] md:max-w-[400px] -mt-10 mb-8">
          {animations.length > 0 ? (
            <NotFoundAnimation animations={animations} />
          ) : (
            <div className="aspect-square w-64 bg-black/5 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🐾</span>
            </div>
          )}
        </div>

        {/* Back Button (Text only with arrow) */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold text-black hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
          BACK
        </Link>
      </div>
    </div>
  )
}
