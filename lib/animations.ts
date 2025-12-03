import fs from 'fs'
import path from 'path'

export function getAnimationFiles(): string[] {
  const animeDir = path.join(process.cwd(), 'public', 'anime')

  try {
    if (fs.existsSync(animeDir)) {
      return fs
        .readdirSync(animeDir)
        .filter((file) => file.endsWith('.json'))
    }
  } catch (error) {
    console.error('Error reading anime directory:', error)
  }

  return []
}
