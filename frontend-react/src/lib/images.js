// 已有的本地图片（从 Kling 生成的 26 张）
const localImages = [
  "aviation", "bloody-mary", "cosmopolitan", "daiquiri", "dry-martini",
  "espresso-martini", "gin-fizz", "manhattan", "margarita", "mint-julep",
  "mojito", "moscow-mule", "negroni", "old-fashioned", "pina-colada",
  "sazerac", "sidecar", "singapore-sling", "whiskey-sour", "white-lady",
]

const localSpirits = ["gin", "vodka", "rum", "tequila", "whisky", "brandy"]

function slug(eng) {
  return eng.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}

// 鸡尾酒图片：有本地图用本地，没有用 Picsum 占位
export function cocktailImg(eng) {
  const s = slug(eng)
  if (localImages.includes(s)) return `/images/${s}.jpg`
  return `https://picsum.photos/seed/${s}/400/300`
}

// 基酒图片
export function spiritImg(slugName) {
  const s = slug(slugName)
  if (localSpirits.includes(s)) return `/images/${s}.jpg`
  return `https://picsum.photos/seed/${s}/100/100`
}

// 鸡尾酒大图（详情页 Hero）
export function cocktailHeroImg(eng) {
  const s = slug(eng)
  if (localImages.includes(s)) return `/images/${s}.jpg`
  return `https://picsum.photos/seed/${s}/1200/600`
}
