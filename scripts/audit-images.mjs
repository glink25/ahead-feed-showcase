import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const feedDirectory = new URL('../feeds/', import.meta.url)
const files = (await readdir(feedDirectory)).filter((file) => file.endsWith('.yaml')).sort()
const images = []
const errors = []
const bannedImageHosts = new Set(['picsum.photos', 'placehold.co', 'loremflickr.com'])

for (const file of files) {
  const text = await readFile(join(feedDirectory.pathname, file), 'utf8')
  const eventsText = text.split('\nevents:\n')[1] ?? ''
  const starts = [...eventsText.matchAll(/^  - id: (.+)$/gm)]
  for (let index = 0; index < starts.length; index += 1) {
    const id = starts[index][1]
    const block = eventsText.slice(starts[index].index, starts[index + 1]?.index)
    const paths = [...block.matchAll(/^\s+- path: (\S+)$/gm)].map((match) => match[1])
    if (paths.length !== 1) errors.push(`${file}:${id} has ${paths.length} media paths`)
    if (!block.includes('en: Poster image source')) errors.push(`${file}:${id} lacks image source evidence`)
    if (!/^\s+alt:\n\s+zh-CN: .+\n\s+en: .+/m.test(block)) errors.push(`${file}:${id} lacks bilingual alt text`)
    for (const path of paths) {
      if (!path.startsWith('https://')) errors.push(`${file}:${id} image is not HTTPS`)
      try {
        const hostname = new URL(path).hostname
        if (bannedImageHosts.has(hostname)) errors.push(`${file}:${id} uses banned placeholder/random image host ${hostname}`)
      } catch {
        errors.push(`${file}:${id} image URL is invalid`)
      }
      images.push({ file, id, path })
    }
  }
}

const owners = new Map()
for (const image of images) {
  const previous = owners.get(image.path)
  if (previous) errors.push(`${image.file}:${image.id} repeats ${previous}`)
  else owners.set(image.path, `${image.file}:${image.id}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Checked ${images.length} events across ${files.length} feeds: every image URL is unique, HTTPS, sourced, and has bilingual alt text.`)
}
