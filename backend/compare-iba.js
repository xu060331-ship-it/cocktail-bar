const { Client } = require("pg")
const client = new Client({database:"cocktail_bar",user:"postgres",password:"tony0331",host:"localhost",port:5432})

const new101 = [
  "Alexander","Americano","Angel face","Aviation","Between the Sheets","Boulevardier",
  "Brandy Crusta","Casino","Clover Club","Daiquiri","Dry Martini","Gin Fizz",
  "Hanky Panky","John Collins","Last word","Manhattan","Martinez","Mary Pickford",
  "Monkey Gland","Negroni","Old Fashioned","Paradise","Planter's Punch","Porto Flip",
  "Ramos Fizz","Remember the Maine","Rusty Nail","Sazerac","Sidecar","Stinger",
  "Tuxedo","Vieux Carre","Whiskey Sour","White Lady",
  "Bellini","Black Russian","Bloody Mary","Caipirinha","Cardinale","Champagne Cocktail",
  "Corpse Reviver 2","Cosmopolitan","Cuba Libre","French 75","French Connection",
  "Garibaldi","Godfather","Godmother","Grasshopper","Harvey Wallbanger","Hemingway Special",
  "Horse's Neck","Irish Coffee","Kir","Long Island Ice Tea","Mai-Tai","Margarita",
  "Mimosa","Mint Julep","Mojito","Moscow Mule","Pina Colada","Sea Breeze",
  "Sex on the Beach","Singapore Sling","Tequila Sunrise",
  "B-52","Bee's Knees","Bramble","Canchanchara","Dark 'n' stormy","Dirty Martini",
  "Espresso Martini","Fernandito","French Martini","Illegal","Kamikaze",
  "Lemon drop Martini","Naked and Famous","New York Sour","Old Cuban","Paloma",
  "Paper Plane","Penicillin","Pisco Sour","Rabo de Galo","Russian Spring Punch",
  "Spicy Fifty","Spritz","Suffering Bastard","Tipperary","Tommy's Margarita",
  "Trinidad Sour","Vampiro","Vesper","Ve.n.to","Yellow Bird","Barracuda",
  "Golden Dream","Corpse Reviver 1","Zombie"
]

function normalize(s) {
  return s.toLowerCase().trim().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").replace(/\./g, "")
}

;(async()=>{
  await client.connect()
  const r = await client.query("SELECT eng FROM cocktails ORDER BY eng")
  const dbEngs = r.rows.map(r => r.eng)

  const missing = []
  const found = []

  for (const eng of new101) {
    const key = normalize(eng)
    const match = dbEngs.find(d => {
      const dk = normalize(d)
      if (dk === key) return true
      if (key.includes("corpse reviver") && dk.includes("corpse reviver")) return true
      if (key.includes("dark") && dk.includes("dark")) return true
      if (key.includes("horses") && dk.includes("horse")) return true
      if (key.includes("ve n to") && dk.includes("vento")) return true
      if (key.includes("long island") && dk.includes("long island")) return true
      if (key.includes("pina colada") && dk.includes("pina colada")) return true
      if (key.includes("mai tai") && dk.includes("mai tai")) return true
      if (key.includes("lemon drop") && dk.includes("lemon drop")) return true
      if (key.includes("dark") && dk.includes("dark")) return true
      if (key.includes("bees") && dk.includes("bee")) return true
      if (key.includes("b 52") && dk.includes("b52")) return true
      return false
    })
    if (match) {
      found.push(eng)
    } else {
      missing.push(eng)
    }
  }

  console.log("数据库中已有: " + found.length + " 款")
  console.log("\n缺失的鸡尾酒 (" + missing.length + " 款):\n")
  missing.forEach((m, i) => console.log("  " + (i+1) + ". " + m + " (需添加到数据库)"))

  await client.end()
})()
