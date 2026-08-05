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
