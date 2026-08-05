function slug(eng) {
  return eng.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}

export function cocktailImg(eng) {
  return `/images/${slug(eng)}.jpg`
}

export function spiritImg(slugName) {
  return `/images/${slug(slugName)}.jpg`
}

export function cocktailHeroImg(eng) {
  return `/images/${slug(eng)}.jpg`
}

const localArticles = [
  { match: "味美思", file: "vermouth.png" },
]

export function articleImg(title) {
  for (const a of localArticles) {
    if (title.includes(a.match)) return `/images/${a.file}`
  }
  const s = slug(title).substring(0, 30)
  return `https://picsum.photos/seed/${s}/600/400`
}
