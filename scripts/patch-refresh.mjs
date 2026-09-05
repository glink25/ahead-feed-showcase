import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('./refresh-showcase-media.mjs', import.meta.url)
let source = await readFile(path, 'utf8')

const replacements = {
  'New Year fireworks China city skyline': 'Shanghai fireworks',
  'Spring Festival Beijing lanterns Forbidden City': 'Spring Festival China lanterns',
  'International Workers Day China May Day Beijing': 'May Day China',
  'asteroid telescope observation': 'asteroid telescope',
  'Unix terminal computer code': 'computer terminal code',
  'The Elder Scrolls VI logo': 'Elder Scrolls logo',
  'Steam logo autumn leaves': 'Steam logo',
  'artist painting studio museum art': 'artist painting studio',
  'museum visitors gallery exhibition': 'museum visitors gallery',
  'Berlin Museum Island night': 'Museum Island Berlin night',
  'public domain mark creative commons': 'public domain mark',
  'citizen science smartphone plant observation': 'citizen science smartphone',
  'free software Linux Tux open source': 'Linux Tux',
  'Boulder Colorado Flatirons cinema': 'Boulder Colorado Flatirons',
  'Academy Museum Los Angeles film': 'Academy Museum Los Angeles',
  'Dolby Theatre Hollywood red carpet': 'Dolby Theatre Hollywood',
  'Annecy France animation festival cinema': 'Annecy France animation',
  'cricket match South Africa stadium': 'cricket South Africa',
  'women football Brazil match stadium': 'women football Brazil',
  'rugby union Australia stadium match': 'rugby Australia',
  'artificial intelligence data center computer chips': 'data center computers',
  'pirate reenactment sailing ship costume': 'pirate reenactment',
  'postcards handwriting mail collection': 'postcards collection',
  'people knitting in public park': 'knitting public',
  'external hard drive data backup computer': 'external hard drive',
  'Douglas Adams portrait towel': 'Douglas Adams',
  'Chuseok Korea traditional celebration hanbok': 'Chuseok Korea',
  'King Sejong Hangul Korean alphabet monument': 'King Sejong Hangul',
  'opera stage theatre performance': 'opera stage',
  'independent record store vinyl records': 'record store vinyl',
  'street musicians outdoor public performance': 'street musicians'
}
for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(from, to)

source = source.replace(
  'async function resolveCommons(query, used) {',
  'async function resolveCommons(query, used, allowFallback = true) {'
)
source = source.replace(
  '  if (!pages.length) throw new Error(`No Commons image found for: ${query}`)',
  `  if (!pages.length && allowFallback) {
    const words = query.split(/\\s+/).filter((word) => word.length > 2)
    const candidates = [
      words.slice(0, 3).join(' '),
      words.slice(-3).join(' '),
      words.slice(0, 2).join(' '),
      words.slice(-2).join(' '),
      words[0],
      words.at(-1)
    ].filter(Boolean)
    for (const fallback of [...new Set(candidates)]) {
      if (fallback === query) continue
      try { return await resolveCommons(fallback, used, false) } catch {}
    }
  }
  if (!pages.length) throw new Error(\`No Commons image found for: \${query}\`)`
)

await writeFile(path, source)
