import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const feedDirectory = new URL('../feeds/', import.meta.url)
const banned = new Set(['picsum.photos', 'placehold.co', 'loremflickr.com'])
const fetchedAt = '2026-09-05T00:00:00Z'

// Event-specific search terms. These are deliberately concrete: venue, ritual,
// artwork, sport or observable phenomenon rather than a broad feed category.
const queries = {
  'hobbit-day-2026': 'Hobbiton Bag End New Zealand',
  'read-tolkien-day-2027': 'J R R Tolkien portrait',
  'new-delhi-book-fair-2027': 'New Delhi World Book Fair Pragati Maidan',
  'world-book-day-2027': 'World Book Day children reading books',
  'bloomsday-2027': 'Bloomsday Dublin James Joyce Tower',

  'new-year-cn-2026': 'New Year fireworks China city skyline',
  'spring-festival-cn-2026': 'Spring Festival Beijing lanterns Forbidden City',
  'qingming-cn-2026': 'Qingming Festival tomb sweeping',
  'labour-day-cn-2026': 'International Workers Day China May Day Beijing',
  'dragon-boat-cn-2026': 'Dragon Boat Festival China race',
  'mid-autumn-cn-2026': 'Mid-Autumn Festival Beijing lanterns moon',
  'national-day-cn-2026': 'China National Day Tiananmen Square October 1',

  'asteroid-prophecy-2026': 'asteroid Bennu NASA',
  'doomsday-clock-2027': 'Doomsday Clock Bulletin Atomic Scientists',
  'yr4-safe-passage-2032': 'asteroid telescope observation',
  'year-2038-problem': 'Unix terminal computer code',
  'newton-2060': 'Isaac Newton portrait',

  'gta-vi': 'Grand Theft Auto VI logo',
  'elder-scrolls-vi': 'The Elder Scrolls VI logo',
  'silksong-expansion': 'Hollow Knight Silksong logo',
  'steam-autumn-sale-2026': 'Steam logo autumn leaves',

  'mid-autumn-2026': 'Mid-Autumn Festival Hong Kong lanterns',
  'national-day-holiday-cn': 'China National Day Tiananmen Square October 1',
  christmas: 'Christmas market lights tree',
  'spring-festival-2027': 'Chinese New Year Spring Festival red lanterns',

  'world-art-day-2027': 'artist painting studio museum art',
  'international-museum-day-2027': 'museum visitors gallery exhibition',
  'long-night-museums-berlin-2027': 'Berlin Museum Island night',
  'museum-night-amsterdam-2026': 'Rijksmuseum Amsterdam night',
  'public-domain-day-2027': 'public domain mark creative commons',

  'october-big-day-2026': 'birdwatching migration observatory binoculars',
  'christmas-bird-count-2026': 'winter birdwatching binoculars birds',
  'backyard-bird-count-2027': 'backyard bird feeder birdwatching',
  'city-nature-challenge-2027': 'citizen science smartphone plant observation',
  'world-migratory-bird-day-2027': 'bird migration flock geese sky',

  'programmers-day-2026': 'laptop programming code terminal',
  'open-access-week-2026': 'Open Access logo',
  'darwin-day-2027': 'Charles Darwin portrait 1881',
  'pi-day-2027': 'Pi pie mathematics',
  'software-freedom-day-2027': 'free software Linux Tux open source',

  'sundance-2027': 'Boulder Colorado Flatirons cinema',
  'oscars-nominations-2027': 'Academy Museum Los Angeles film',
  'oscars-2027': 'Dolby Theatre Hollywood red carpet',
  'cannes-2027': 'Cannes Film Festival Palais red carpet',
  'annecy-2027': 'Annecy France animation festival cinema',

  'moon-night-2026': 'Moon NASA high resolution',
  'orionids-2026': 'Orionids meteor shower',
  'leonids-2026': 'Leonids meteor shower',
  'geminids-2026': 'Geminids meteor shower',
  'lyrids-2027': 'Lyrids meteor shower',

  'super-bowl-2027': 'SoFi Stadium Los Angeles night American football',
  'cricket-world-cup-2027': 'cricket match South Africa stadium',
  'womens-world-cup-2027': 'women football Brazil match stadium',
  'tour-de-france-2027': 'Tour de France peloton cycling',
  'rugby-world-cup-2027': 'rugby union Australia stadium match',

  'apple-fall-event-2026': 'Apple Park Steve Jobs Theater',
  'wwdc-2027': 'Apple Park developer conference',
  'ces-2027': 'CES Las Vegas Convention Center electronics show',
  'next-frontier-model': 'artificial intelligence data center computer chips',

  'talk-like-pirate-2026': 'pirate reenactment sailing ship costume',
  'world-postcard-day-2026': 'postcards handwriting mail collection',
  'world-wide-knit-public-2027': 'people knitting in public park',
  'world-backup-day-2027': 'external hard drive data backup computer',
  'towel-day-2027': 'Douglas Adams portrait towel',

  'chuseok-2026': 'Chuseok Korea traditional celebration hanbok',
  'hangeul-day-2026': 'King Sejong Hangul Korean alphabet monument',
  'tanabata-2027': 'Tanabata tanzaku bamboo wishes Japan',
  'matariki-2027': 'Matariki Pleiades Maori New Year',
  'bastille-day-2027': 'Bastille Day Eiffel Tower fireworks',
  'world-opera-day-2026': 'opera stage theatre performance',
  'record-store-day-2027': 'independent record store vinyl records',
  'eurovision-final-2027': 'Eurovision Song Contest stage arena',
  'make-music-day-2027': 'street musicians outdoor public performance'
}

// Prefer an official event/organizer hero when the page exposes one. If it does
// not, the resolver falls back to the event-specific Commons search above.
const officialPages = {
  'gta-vi': 'https://www.rockstargames.com/VI',
  'silksong-expansion': 'https://www.teamcherry.com.au/',
  'apple-fall-event-2026': 'https://www.apple.com/apple-events/',
  'ces-2027': 'https://www.ces.tech/',
  'super-bowl-2027': 'https://www.nfl.com/super-bowl/',
  'cricket-world-cup-2027': 'https://www.icc-cricket.com/tournaments/cricketworldcup',
  'womens-world-cup-2027': 'https://www.fifa.com/en/tournaments/womens/womensworldcup/brazil-2027',
  'tour-de-france-2027': 'https://www.letour.fr/en/',
  'rugby-world-cup-2027': 'https://www.rugbyworldcup.com/2027/en',
  'sundance-2027': 'https://festival.sundance.org/',
  'oscars-2027': 'https://www.oscars.org/oscars',
  'cannes-2027': 'https://www.festival-cannes.com/en/',
  'annecy-2027': 'https://www.annecyfestival.com/',
  'world-opera-day-2026': 'https://worldoperaday.com/',
  'record-store-day-2027': 'https://recordstoreday.com/',
  'eurovision-final-2027': 'https://eurovision.tv/',
  'make-music-day-2027': 'https://makemusicday.org/',
  'international-museum-day-2027': 'https://imd.icom.museum/',
  'long-night-museums-berlin-2027': 'https://www.lange-nacht-der-museen.de/en',
  'museum-night-amsterdam-2026': 'https://museumnacht.amsterdam/en',
  'october-big-day-2026': 'https://ebird.org/news/october-big-day',
  'christmas-bird-count-2026': 'https://www.audubon.org/community-science/christmas-bird-count',
  'backyard-bird-count-2027': 'https://www.birdcount.org/',
  'city-nature-challenge-2027': 'https://www.citynaturechallenge.org/',
  'world-migratory-bird-day-2027': 'https://www.worldmigratorybirdday.org/'
}

const copy = {
  'new-year-cn-2026': ['三天不算长，但足够把闹钟关掉、见见人，也给新一年留一个不那么匆忙的开头。', 'Three days is not long, but it is enough to turn off the alarm, see someone you miss, and let the new year begin without rushing.'],
  'spring-festival-cn-2026': ['九天假期很适合回家，也很适合提前想清楚哪两天还要补班——团圆和日历都别落下。', 'Nine days leaves room to go home; just remember the two adjusted workdays too. Keep both the reunion and the calendar in view.'],
  'labour-day-cn-2026': ['五天够安排一次小旅行，也够什么都不安排。唯一别忘的是 5 月 9 日还要补班。', 'Five days is enough for a small trip—or for no plan at all. Just remember the adjusted workday on May 9.'],
  'mid-autumn-cn-2026': ['把这一晚留给月亮、月饼，以及那些平时总说“改天再聊”的人。', 'Save one evening for the Moon, mooncakes, and the people you keep promising to catch up with.'],
  'national-day-cn-2026': ['七天长假很诱人，但它只属于 2026 年这张日历；出发前也把两个补班日一起记上。', 'A seven-day break is tempting, but it belongs to the 2026 calendar only—mark the two adjusted workdays before making plans.'],
  'gta-vi': ['档期一改再改，反而更像真实的等待：先别替官方猜日期，等下一次 Newswire 把窗口再钉牢一点。', 'The shifting window is part of the wait: do not guess for Rockstar; let the next Newswire update make the date firmer.'],
  'elder-scrolls-vi': ['这是那种可以先忘一阵、某天看到新预告又突然想起来“原来我还在等”的长线盼头。', 'This is the kind of long wait you can forget for a while—until a new teaser suddenly reminds you that you are still waiting.'],
  'silksong-expansion': ['没有日期就不造日期。先把它放在“哪天官方终于说清楚”的清单里。', 'No date means no invented date. For now, it belongs on the list of things waiting for an official answer.'],
  'steam-autumn-sale-2026': ['愿望单可以先养肥一点，等折扣窗口真的打开再决定哪些游戏值得把周末交出去。', 'Let the wishlist grow a little; when the sale actually opens, decide which games deserve your weekend.'],
  'mid-autumn-2026': ['月亮每年都会来，但一起抬头的人未必都在身边——这大概就是中秋最值得等的部分。', 'The Moon returns every year; the people looking up with you may not always be nearby. That is part of what makes Mid-Autumn worth waiting for.'],
  christmas: ['哪怕不过圣诞，也很难完全绕开街灯、树、歌单和年末那点“今年快结束了”的气氛。', 'Even if you do not celebrate Christmas, it is hard to miss the lights, trees, playlists, and the feeling that the year is nearly done.'],
  'spring-festival-2027': ['先记住正月初一；至于放几天、怎么调休，等官方通知来了再把假期拼完整。', 'Mark Lunar New Year’s Day first. The days off and adjusted workdays can wait until the official notice completes the calendar.'],
  'apple-fall-event-2026': ['邀请函落地以后，猜谜阶段差不多结束了：剩下的就是到点看直播，看看哪几个传闻真的走上舞台。', 'Once the invitation lands, guessing season is mostly over. The fun left is watching which rumors actually make it onstage.'],
  'wwdc-2027': ['六月是经验，不是官宣。真正值得等的是 Apple 把日期写出来的那一天。', 'June is a pattern, not an announcement. The real moment to wait for is when Apple puts actual dates on the calendar.'],
  'ces-2027': ['四天里会冒出太多“未来感”产品；真正有趣的是半年后回头看，哪些东西真的走进了生活。', 'Four days will produce plenty of “future” products. The fun part is looking back six months later to see which ones actually reached everyday life.'],
  'next-frontier-model': ['传闻可以很热闹，但没有官方窗口就没有倒计时。先等一个真正能引用的发布日期。', 'Rumors can be loud, but without an official window there is no countdown. Wait for a launch date that can actually be cited.'],
  'year-2038-problem': ['它更像一张给工程师的超长期 TODO，而不是末日预告：最好在那一秒到来前，相关系统早已没人需要担心。', 'It is a very long-term engineering TODO, not a doomsday prophecy. Ideally, by that second, affected systems will already be boringly fixed.']
}

function decodeHtml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"')
}

async function imageLooksUsable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'ahead-feed-showcase-media-refresh/1.0' } })
    const type = response.headers.get('content-type') ?? ''
    return response.ok && type.startsWith('image/')
  } catch {
    return false
  }
}

async function resolveOfficial(pageUrl) {
  try {
    const response = await fetch(pageUrl, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 ahead-feed-showcase-media-refresh/1.0', accept: 'text/html' } })
    if (!response.ok) return null
    const html = await response.text()
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
    ]
    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (!match) continue
      const candidate = new URL(decodeHtml(match[1]), response.url).href
      if (await imageLooksUsable(candidate)) return { path: candidate, source: pageUrl, kind: 'official' }
    }
  } catch {}
  return null
}

async function resolveCommons(query, used) {
  const api = new URL('https://commons.wikimedia.org/w/api.php')
  api.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '20',
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: '1600',
    format: 'json',
    origin: '*'
  }).toString()
  const response = await fetch(api, { headers: { 'user-agent': 'ahead-feed-showcase-media-refresh/1.0' } })
  if (!response.ok) throw new Error(`Commons search failed for ${query}: ${response.status}`)
  const data = await response.json()
  const pages = Object.values(data.query?.pages ?? {})
    .map((page) => ({ ...page, info: page.imageinfo?.[0] }))
    .filter((page) => page.info?.thumburl && page.info?.descriptionurl && page.info?.mime?.startsWith('image/'))
    .filter((page) => !used.has(page.info.thumburl))
  if (!pages.length) throw new Error(`No Commons image found for: ${query}`)

  const score = (page) => {
    const { width = 0, height = 0, mime = '' } = page.info
    const ratio = width && height ? width / height : 1
    const resolutionPenalty = mime === 'image/svg+xml' ? 0 : width < 1200 ? 40 : 0
    const aspectPenalty = Math.abs(ratio - 16 / 9) * 12
    return (page.index ?? 99) * 10 + resolutionPenalty + aspectPenalty
  }
  pages.sort((a, b) => score(a) - score(b))
  const selected = pages[0]
  return { path: selected.info.thumburl, source: selected.info.descriptionurl, kind: 'commons' }
}

async function resolveImage(id, used) {
  const query = queries[id]
  if (!query) throw new Error(`Missing event-specific image query for ${id}`)
  const officialPage = officialPages[id]
  if (officialPage) {
    const official = await resolveOfficial(officialPage)
    if (official && !used.has(official.path)) return official
  }
  return resolveCommons(query, used)
}

function replaceImageEvidence(block, asset) {
  const citation = asset.kind === 'official'
    ? '海报图片：活动或机构官网公开主视觉；版权与使用条件见来源页'
    : '海报图片：Wikimedia Commons 公开图片；作者与许可见文件页'
  const evidence = `      - kind: url\n        value: ${asset.source}\n        label:\n          zh-CN: 海报图片来源\n          en: Poster image source\n        fetchedAt: '${fetchedAt}'\n      - kind: citation\n        value: ${citation}`
  const pattern = /      - kind: url\n        value: [^\n]+\n        label:\n          zh-CN: 海报图片来源\n          en: Poster image source\n        fetchedAt: [^\n]+\n      - kind: citation\n        value: [^\n]+/
  if (!pattern.test(block)) throw new Error('Image source evidence block not found')
  return block.replace(pattern, evidence)
}

function humanize(block, id) {
  const replacement = copy[id]
  if (!replacement) return block
  const [zh, en] = replacement
  const description = `    description:\n      zh-CN: ${zh}\n      en: ${en}`
  if (/    description:\n      zh-CN: [^\n]+\n      en: [^\n]+/.test(block)) {
    return block.replace(/    description:\n      zh-CN: [^\n]+\n      en: [^\n]+/, description)
  }
  const summary = /(    summary:\n      zh-CN: [^\n]+\n      en: [^\n]+\n)/
  if (summary.test(block)) return block.replace(summary, `$1${description}\n`)
  return block
}

const files = (await readdir(feedDirectory)).filter((file) => file.endsWith('.yaml')).sort()
const used = new Set()
let changedEvents = 0

// Preserve already-good URLs and make uniqueness decisions against them first.
for (const file of files) {
  const text = await readFile(join(feedDirectory.pathname, file), 'utf8')
  for (const match of text.matchAll(/^\s+- path: (https:\/\/\S+)$/gm)) {
    const url = new URL(match[1])
    if (!banned.has(url.hostname)) used.add(match[1])
  }
}

for (const file of files) {
  const path = join(feedDirectory.pathname, file)
  let text = await readFile(path, 'utf8')
  const eventsStart = text.indexOf('\nevents:\n')
  if (eventsStart < 0) continue
  const prefix = text.slice(0, eventsStart + '\nevents:\n'.length)
  const body = text.slice(eventsStart + '\nevents:\n'.length)
  const starts = [...body.matchAll(/^  - id: (.+)$/gm)]
  let rebuilt = ''

  for (let index = 0; index < starts.length; index += 1) {
    const id = starts[index][1]
    const start = starts[index].index
    const end = starts[index + 1]?.index ?? body.length
    let block = body.slice(start, end)
    block = humanize(block, id)
    const pathMatch = block.match(/^\s+- path: (https:\/\/\S+)$/m)
    if (pathMatch) {
      const current = pathMatch[1]
      const host = new URL(current).hostname
      if (banned.has(host)) {
        const asset = await resolveImage(id, used)
        used.add(asset.path)
        block = replaceImageEvidence(block, asset)
        block = block.replace(/^\s+- path: https:\/\/\S+$/m, `      - path: ${asset.path}`)
        changedEvents += 1
        console.log(`${file}:${id} -> ${asset.kind} ${asset.path}`)
      }
    }
    rebuilt += block
  }
  await writeFile(path, prefix + rebuilt)
}

// Keep the repository documentation aligned with the new standard.
const readmeUrl = new URL('../README.md', import.meta.url)
let readme = await readFile(readmeUrl, 'utf8')
readme = readme.replace(
  /事件的 `media\[\]\.path` 分别使用 Picsum、LoremFlickr 与 Placehold\.co。每个事件使用独立的 HTTPS 图片地址，来源与说明记录在对应事件的 `evidence` 中，图片均提供中英文替代文本。图片只用于营造主题氛围，不作为事件事实证据。/,
  '事件的 `media[].path` 使用与具体事件语义匹配的公开图片：品牌与赛事优先主办方/官方页面主视觉，文化、自然、天文和公共领域主题优先采用 Wikimedia Commons、NASA 等可追溯素材。每个事件使用独立 HTTPS 图片地址，来源与许可说明记录在对应事件的 `evidence` 中，并提供中英文替代文本。图片用于事件卡片表达，但不替代日期、赛程等事实证据。'
)
await writeFile(readmeUrl, readme)

// Upgrade the local audit so placeholder/random services cannot silently return.
const auditUrl = new URL('./audit-images.mjs', import.meta.url)
let audit = await readFile(auditUrl, 'utf8')
if (!audit.includes('bannedImageHosts')) {
  audit = audit.replace(
    "const errors = []\n",
    "const errors = []\nconst bannedImageHosts = new Set(['picsum.photos', 'placehold.co', 'loremflickr.com'])\n"
  )
  audit = audit.replace(
    "      if (!path.startsWith('https://')) errors.push(`${file}:${id} image is not HTTPS`)\n      images.push({ file, id, path })",
    "      if (!path.startsWith('https://')) errors.push(`${file}:${id} image is not HTTPS`)\n      try {\n        const hostname = new URL(path).hostname\n        if (bannedImageHosts.has(hostname)) errors.push(`${file}:${id} uses banned placeholder/random image host ${hostname}`)\n      } catch {\n        errors.push(`${file}:${id} image URL is invalid`)\n      }\n      images.push({ file, id, path })"
  )
}
await writeFile(auditUrl, audit)

console.log(`Updated ${changedEvents} event images across ${files.length} feeds.`)
