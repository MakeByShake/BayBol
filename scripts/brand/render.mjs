// Превращает SVG-исходники из scripts/brand/build в PNG для соцсетей и иконок.
// Запуск: node scripts/brand/render.mjs
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const pub = join(here, '..', '..', 'public')

const jobs = [
  { src: 'og-image.svg', out: 'og-image.png', width: 1200 },
  { src: 'apple-touch-icon.svg', out: 'apple-touch-icon.png', width: 180 },
  { src: 'apple-touch-icon.svg', out: 'icon-512.png', width: 512 },
]

for (const job of jobs) {
  const svg = await readFile(join(here, 'build', job.src))
  await sharp(svg, { density: 300 }).resize({ width: job.width }).png({ compressionLevel: 9 }).toFile(join(pub, job.out))
  console.log('  ✓ public/' + job.out)
}
