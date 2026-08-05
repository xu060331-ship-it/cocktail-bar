const { Client } = require("pg")
const client = new Client({database:"cocktail_bar",user:"postgres",password:"tony0331",host:"localhost",port:5432})

;(async()=>{
  await client.connect()

  // Article 1 fix
  await client.query(`UPDATE articles SET body = $1 WHERE id = 1`, [`1806年5月13日，纽约《平衡与哥伦比亚知识库》周报刊登了一封读者来信。读者问："什么是鸡尾酒？"编辑在回复中下了历史上第一个书面定义：鸡尾酒是一种由任意烈酒、糖、水和苦精组成的刺激性饮品。这个定义简洁到令人惊讶：烈酒、糖、水、苦精。四样东西，两百年来鸡尾酒的所有演变都建立在这个基本公式之上。但要追溯鸡尾酒的真正起源，我们需要回到更早。古罗马人用加药草的葡萄酒作为药物——这是苦精和加强酒的祖先。中世纪修士用蒸馏器提取药草精华——这是利口酒的雏形。16世纪的加勒比海，水手们发现往劣质朗姆酒里加青柠汁和糖可以防止坏血病。18世纪从印度归来的英国东印度公司官员带回了潘趣酒的配方。潘趣酒在伦敦社交圈迅速流行。19世纪初冰块商业化生产让冰镇进入鸡尾酒世界。1862年Jerry Thomas写了世界上第一本鸡尾酒书。曼哈顿、马天尼、大吉利都在19世纪末诞生。1920年禁酒令到来——但讽刺的是，它最终为鸡尾酒注入了前所未有的创造力。1933年后美国调酒师将技艺带到全球。今天从纽约到上海，全球调酒师们在经典配方基础上持续创新。鸡尾酒的未来和它的过去一样——是关于药草、烈酒和人类创造力的故事。`])

  // Article 2 fix
  await client.query(`UPDATE articles SET body = $1 WHERE id = 2`, [`1920年1月17日，美国宪法第十八修正案正式生效。合法的酒吧一夜之间全部关门。但人们并没有停止喝酒——他们只是躲进了地下。地下酒吧（Speakeasy）的暗号轻声传递，门内别有洞天。调酒师面临巨大的问题：烈酒质量极差。浴缸金酒不是比喻——工业酒精在浴缸中混合植物提取物。调酒师们用果汁、糖浆和利口酒来掩盖劣质烈酒的刺鼻味道。正是这种掩盖行为催生了现代鸡尾酒的革新——玛丽·毕克馥、蜜蜂膝盖和最后的话都在这个时期诞生。地下酒吧的文化影响超越了配方：它是美国爵士乐的孵化器，是女性进入公共饮酒空间的转折点，也是种族融合的早期场所。1933年禁酒令废除。但13年积累下来的秘密留了下来。禁酒令是一场失败的社会实验——它把鸡尾酒文化推到了地下，孵化了一个世纪后我们仍然在喝的经典。`])

  // Ensure articles 4-10 have their long bodies preserved
  const check = await client.query("SELECT id, char_length(body) as len FROM articles ORDER BY id")
  check.rows.forEach(r => console.log("Article " + r.id + ": " + r.len + " chars"))

  await client.end()
})()
