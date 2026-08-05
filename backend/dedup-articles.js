const { Client } = require("pg")
const client = new Client({database:"cocktail_bar",user:"postgres",password:"tony0331",host:"localhost",port:5432})

const uniqueClosings = {
  1: `鸡尾酒的诞生不是某一个人的功劳——它是数千年来无数个微小创新的积累。古罗马的药剂师、中世纪的修士、加勒比海的水手、18世纪伦敦的潘趣酒爱好者、19世纪纽约的调酒师——每个人都在这个配方上添加了自己的那一笔。\n\n今天，国际调酒师协会（IBA）将经典鸡尾酒分为"难忘经典"、"当代经典"和"新时代"三大类别——九十款配方代表了两百年的调酒历史。每一款被列入IBA官方酒谱的鸡尾酒都经过严格的历史考据和配方验证——这是全球调酒师共同维护的知识遗产。\n\n当你下一次在酒吧中举杯——那杯马天尼、那杯Old Fashioned、那杯大吉利——你手里拿着的不只是一杯饮品。你拿着的是1806年某位纽约编辑的定义、1898年某位古巴矿业工程师的临时拼凑、1862年Jerry Thomas在书中记录的那个配方。鸡尾酒是流动的历史——而每一代调酒师都在这个永不枯竭的河流中注入属于自己的那一滴。`,
  2: `禁酒令废除后，美国调酒师不仅带回了配方——他们带回了一种全新的职业身份。在地下的13年中，调酒师从"倒酒的人"变成了"创造风味的人"——他们被迫与劣质原料斗智斗勇，发明了用果汁、糖浆和利口酒塑造风味的全套技法。\n\n今天，全球任何一家自称"Speakeasy风格"的酒吧——藏在披萨店后面、用书柜门遮住入口、需要暗号才能进入——都在向那个年代致敬。禁酒令时期的调酒师——用浴缸金酒创造经典的那一代人——从黑暗中走了出来，但他们留下的配方和文化至今仍然是调酒界的基石。\n\n禁酒令告诉我们一个关于鸡尾酒的深层真相：限制不是创造力的敌人——它是创造力的催化剂。那13年的黑暗没有埋葬鸡尾酒文化——它让鸡尾酒浴火重生。`,
  3: `橡木桶不是威士忌的容器——它是威士忌的第二个原料。没有橡木桶的威士忌——刚从蒸馏器中流出的无色新酒——只是"谷物烈酒"（grain spirit），它还没有名字，没有身份，没有颜色。橡木桶给了它名字："威士忌"——在盖尔语中意为"生命之水"。\n\n全球的威士忌蒸馏厂每年在橡木桶上的投入——新的美国白橡木桶用于波本、旧的波本桶流向苏格兰和日本用于陈年单一麦芽、欧洲橡木雪莉桶用于风味收尾——这个全球橡木桶供应链支撑了整个威士忌产业。\n\n下次你拿起一瓶威士忌，看酒标上写着"12年"——它告诉你这瓶威士忌在橡木桶中安静地睡着了12个年头。在这12年里，每年约有2%被天使拿走——而剩下的部分成为了你手中这杯液体。时间——不是蒸馏器的形状、不是大麦的产地、不是水源的pH值——时间是威士忌最贵的配料。`
};

;(async()=>{
  await client.connect()

  for (let id = 1; id <= 3; id++) {
    const r = await client.query("SELECT body FROM articles WHERE id = $1", [id])
    let body = r.rows[0].body

    // 移除所有重复的结尾段落（只保留正文和第一段延伸）
    const dupPara = "鸡尾酒的历史不是一条直线——它是无数个小故事编织成的网络。从古罗马的药酒到中世纪修士的蒸馏器"
    const idx = body.indexOf(dupPara)
    if (idx > 0) {
      body = body.substring(0, idx).trimEnd()
    }

    // 加上专属结尾
    body += "\n\n" + uniqueClosings[id]

    await client.query("UPDATE articles SET body = $1 WHERE id = $2", [body, id])
    const r2 = await client.query("SELECT char_length(body) as len FROM articles WHERE id = $1", [id])
    console.log("A" + id + ": " + r2.rows[0].len + " chars (deduped + unique closing)")
  }

  // 最终统计
  const f = await client.query("SELECT id, char_length(body) as len FROM articles ORDER BY id")
  console.log("\n最终:")
  f.rows.forEach(r => console.log("  A" + r.id + ": " + r.len + " chars"))

  await client.end()
})()
