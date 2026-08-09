const { Client } = require("pg")
const fs = require("fs")
const cocktailsData = JSON.parse(fs.readFileSync("./data/cocktails.json", "utf-8"))
const barClassicsData = JSON.parse(fs.readFileSync("./data/bar-classics.json", "utf-8"))
const methodsData = JSON.parse(fs.readFileSync("./data/cocktail-methods.json", "utf-8"))
const methodsMap = {}
methodsData.forEach(m => { methodsMap[m.eng] = { method: m.method, glass: m.glass, steps: m.steps, garnish: m.garnish } })

const attrsData = JSON.parse(fs.readFileSync("./data/cocktail-attributes.json", "utf-8"))
const attrsMap = {}
attrsData.forEach(a => { attrsMap[a.eng] = { taste_tags: a.taste_tags, difficulty: a.difficulty, occasion: a.occasion } })

const tipsData = JSON.parse(fs.readFileSync("./data/cocktail-tips.json", "utf-8"))
const tipsMap = {}
tipsData.forEach(t => { tipsMap[t.eng] = t.tip })

const client = new Client({
  database: "cocktail_bar",
  user: "postgres",
  password: "tony0331",
  host: "localhost",
  port: 5432,
})

const spirits = [
  {
    slug: "gin", name: "金酒", eng: "Gin", emoji: "🍸",
    desc: "杜松子的清香，药草的层次。从伦敦干金到日本精酿，植物学家们用几百种药草编织风味迷宫。",
    hero: "杜松子、药草与酒精的三重奏。从伦敦的蒸馏厂到西班牙的海岸酒吧，金酒是鸡尾酒世界最活跃的分子——它几乎能和任何风味对话。",
    details: {
      sections: [
        {
          title: "金酒的分类",
          items: [
            { label: "伦敦干金 London Dry Gin", desc: "最经典的金酒风格。杜松子主导，柑橘和香料的复杂层次。不甜、不添加人工风味。代表：Beefeater、Tanqueray。" },
            { label: "老汤姆金 Old Tom Gin", desc: "比伦敦干金稍甜，是18世纪金酒热潮的遗存。马天尼的前身马丁内斯用的就是它。代表：Hayman's Old Tom。" },
            { label: "普利茅斯金 Plymouth Gin", desc: "受地理标志保护，只能在普利茅斯市生产。比伦敦干金更土质、更柔和。代表：Plymouth Gin。" },
            { label: "新西部金 New Western Gin", desc: "杜松子不再是绝对主角。花香、黄瓜、玫瑰、柑橘走到前台。代表：Hendrick's（黄瓜+玫瑰）、Monkey 47（47种药草）。" },
            { label: "荷兰金酒 Genever", desc: "金酒的祖先。用麦芽酒为基底蒸馏，口感更接近威士忌。代表：Bols Genever。" },
            { label: "海军强度金酒 Navy Strength", desc: "57% ABV 以上。历史上英国海军用火药测试——酒精度不够火药点不着。代表：Plymouth Navy Strength。" },
          ],
        },
        {
          title: "金酒的经典配方",
          items: [
            { label: "干马天尼 Dry Martini", desc: "金酒 + 干味美思。鸡尾酒之王。搅拌、冰镇、橄榄。邱吉尔的理想比例是看一眼味美思瓶子就够了。" },
            { label: "内格罗尼 Negroni", desc: "金酒 + 金巴利 + 甜味美思，1:1:1。佛罗伦萨的骄傲。苦、甜、药草在冰球上缓慢融合。" },
            { label: "金菲士 Gin Fizz", desc: "金酒 + 柠檬汁 + 糖浆 + 苏打水。清爽长饮的标杆。" },
            { label: "飞行 Aviation", desc: "金酒 + 樱桃利口酒 + 紫罗兰利口酒 + 柠檬汁。淡紫色的天空，禁酒令时期的地下酒吧最爱。" },
            { label: "白色佳人 White Lady", desc: "金酒 + 橙皮利口酒 + 柠檬汁。1920年代巴黎的优雅。" },
            { label: "新加坡司令 Singapore Sling", desc: "金酒 + 樱桃利口酒 + 菠萝汁 + 青柠汁 + 石榴糖浆。莱佛士酒店的粉红色传奇。" },
          ],
        },
      ],
    },
  },
  {
    slug: "vodka", name: "伏特加", eng: "Vodka", emoji: "🍶",
    desc: "纯粹到极致——水与乙醇的二重奏。俄罗斯的黑麦、波兰的马铃薯、瑞典的冬小麦。",
    hero: "水与乙醇的终极净化。伏特加不争不抢——它把自己的性格降到最低，成为其他风味最忠实的载体。",
    details: {
      sections: [
        {
          title: "伏特加的流派",
          items: [
            { label: "俄罗斯伏特加", desc: "黑麦和小麦为主。醇厚、微甜、有明显的谷物口感。代表：Russian Standard、Stolichnaya。" },
            { label: "波兰伏特加", desc: "马铃薯为主。更奶油、更饱满。代表：Chopin、Belvedere。" },
            { label: "北欧伏特加", desc: "冬小麦和冰川水。极致的纯净和柔顺。代表：Absolut（瑞典）、Finlandia（芬兰）。" },
            { label: "法国伏特加", desc: "葡萄为原料。微妙的果香，比谷物伏特加更圆润。代表：Ciroc、Grey Goose。" },
            { label: "精酿伏特加", desc: "小批量、单一原料、本地水源。美国的精酿蒸馏运动也影响了伏特加。代表：Tito's（玉米）、Hangar 1。" },
          ],
        },
        {
          title: "伏特加的经典配方",
          items: [
            { label: "大都会 Cosmopolitan", desc: "伏特加 + 橙皮利口酒 + 青柠汁 + 蔓越莓汁。《欲望都市》让这杯酒火遍全球。" },
            { label: "血腥玛丽 Bloody Mary", desc: "伏特加 + 番茄汁 + 柠檬汁 + 伍斯特酱。早午餐之王，宿醉救星。" },
            { label: "莫斯科骡子 Moscow Mule", desc: "伏特加 + 姜汁啤酒 + 青柠汁。铜杯是标配——三个推销员在酒吧里一拍脑袋的营销杰作。" },
            { label: "咖啡马天尼 Espresso Martini", desc: "伏特加 + 咖啡利口酒 + 浓缩咖啡。1980年代伦敦传奇调酒师 Dick Bradsell 的发明。" },
            { label: "黑俄罗斯 Black Russian", desc: "伏特加 + 咖啡利口酒。加奶油就是白俄罗斯。" },
            { label: "长岛冰茶 Long Island Iced Tea", desc: "伏特加 + 金酒 + 朗姆 + 龙舌兰 + 橙皮利口酒 + 柠檬汁 + 可乐。披着茶外衣的烈酒炸弹。" },
          ],
        },
      ],
    },
  },
  {
    slug: "rum", name: "朗姆", eng: "Rum", emoji: "🥃",
    desc: "甘蔗的灵魂在加勒比海的橡木桶里跳舞。白朗姆清爽、金朗姆醇厚、黑朗姆深沉。",
    hero: "哥伦布在1493年把甘蔗带到加勒比海，从此这片热带群岛与朗姆酒结下了不解之缘。从海盗船到提基酒吧，朗姆是自由的液体化身。",
    details: {
      sections: [
        {
          title: "朗姆的分类",
          items: [
            { label: "白朗姆 White Rum", desc: "蒸馏后短时间陈年或不过桶，用活性炭过滤掉颜色。清爽、干净，是最常用的调酒基酒。代表：Bacardi Carta Blanca、Havana Club 3年。" },
            { label: "金朗姆 Gold Rum", desc: "在橡木桶中陈年1-3年，获得金色和香草、焦糖的甜感。代表：Mount Gay Eclipse、Appleton Estate Signature。" },
            { label: "黑朗姆 Dark Rum", desc: "长时间陈年或添加焦糖色。浓郁、醇厚，带有糖蜜、咖啡和黑巧克力风味。代表：Myers's、Goslings Black Seal。" },
            { label: "农业朗姆 Rhum Agricole", desc: "用新鲜甘蔗汁而非糖蜜发酵蒸馏，保留了更多植物和草本的鲜活风味。产地仅限于法属加勒比岛屿。代表：Clenin、Rhum J.M。" },
            { label: "陈年朗姆 Aged Rum", desc: "在橡木桶中陈年5年以上，复杂度媲美威士忌。热带陈年速度快于寒冷地区——牙买加10年约等于苏格兰30年。代表：Zacapa 23、Diplomatico Reserva。" },
            { label: "高度朗姆 Overproof Rum", desc: "酒精度超过57%的朗姆，常用于调制提基鸡尾酒或制作火烈燃烧效果。代表：Wray & Nephew、Lemon Hart 151。" },
          ],
        },
        {
          title: "朗姆的经典配方",
          items: [
            { label: "莫吉托 Mojito", desc: "白朗姆 + 青柠汁 + 薄荷 + 砂糖 + 苏打水。哈瓦那的清风，海明威的最爱之一。" },
            { label: "大吉利 Daiquiri", desc: "白朗姆 + 青柠汁 + 细砂糖。朗姆最纯粹的三角结构，海明威在哈瓦那的日常伴侣。" },
            { label: "迈泰 Mai-Tai", desc: "陈年朗姆 + 农业朗姆 + 橙皮利口酒 + 杏仁糖浆 + 青柠汁。波利尼西亚的魅惑。" },
            { label: "椰林飘香 Pina Colada", desc: "朗姆 + 椰浆 + 菠萝汁。波多黎各的官方饮品，一杯就是一场热带假期。" },
            { label: "自由古巴 Cuba Libre", desc: "朗姆 + 可乐 + 青柠汁。古巴独立运动的庆祝饮品，简单到你在任何地方都能做。" },
            { label: "僵尸 Zombie", desc: "三种朗姆的混合体 + 果汁 + 糖浆。Don the Beachcomber 的发明，一杯就能让复活的人都躺下。" },
          ],
        },
      ],
    },
  },
  {
    slug: "tequila", name: "龙舌兰", eng: "Tequila", emoji: "🌵",
    desc: "墨西哥烈日下，一株蓝色龙舌兰需要七年才能成熟。从 blanco 的青涩到 anejo 的深邃，每一口都是沙漠与时间的对话。",
    hero: "龙舌兰是墨西哥的灵魂。蓝色龙舌兰需要7-10年才能成熟，而真正的龙舌兰酒只能在哈利斯科州和另外四个指定区域生产。它不是派对上的速醉工具——它是烈日、火山土和时间的三重奏。",
    details: {
      sections: [
        {
          title: "龙舌兰的分类",
          items: [
            { label: "银色/白色 Blanco / Plata", desc: "蒸馏后不陈年或短时间陈年（60天以内）。保留了龙舌兰最原始的辛辣、青草和柑橘风味。代表：Patron Silver、Don Julio Blanco。" },
            { label: "微陈 Reposado", desc: "在橡木桶中陈年2个月到1年。桶的甜味开始与龙舌兰的辛辣融合，口感更圆润。代表：Herradura Reposado、Casamigos Reposado。" },
            { label: "陈年 Anejo", desc: "橡木桶陈年1-3年。深琥珀色，带有香草、焦糖和干燥辛香料的味道。代表：Don Julio 1942、Clase Azul Anejo。" },
            { label: "超陈 Extra Anejo", desc: "陈年3年以上。复杂度接近顶级威士忌或白兰地。代表：Patron Extra Anejo、Gran Patron Burdeos。" },
            { label: "梅斯卡尔 Mezcal", desc: "龙舌兰的野生亲戚。用地下坑烤龙舌兰芯，赋予独特的烟熏风味。任何品种龙舌兰都可以做梅斯卡尔。代表：Del Maguey、Montelobos。" },
          ],
        },
        {
          title: "龙舌兰的经典配方",
          items: [
            { label: "玛格丽特 Margarita", desc: "龙舌兰 + 橙皮利口酒 + 青柠汁。盐边可选。世界最畅销的鸡尾酒之一。" },
            { label: "龙舌兰日出 Tequila Sunrise", desc: "龙舌兰 + 橙汁 + 石榴糖浆。滚石乐队在1972年巡演中用这杯酒取代了威士忌和可乐。" },
            { label: "帕洛玛 Paloma", desc: "龙舌兰 + 西柚苏打 + 青柠汁。墨西哥本土比玛格丽特更受欢迎的日常饮品。" },
            { label: "恶魔 El Diablo", desc: "龙舌兰 + 黑加仑利口酒 + 青柠汁 + 姜汁啤酒。甜中带辛辣。" },
            { label: "一柱成名 Naked and Famous", desc: "梅斯卡尔 + 黄查特酒 + 阿佩罗 + 青柠汁。等比例四重奏，现代经典。" },
          ],
        },
      ],
    },
  },
  {
    slug: "whisky", name: "威士忌", eng: "Whisky", emoji: "🥃",
    desc: "橡木桶里的时间艺术。苏格兰的泥煤烟熏、爱尔兰的顺滑、波本的甜美——同一个名字，大西洋两岸各自成王国。",
    hero: "威士忌是时间的液体形态。麦芽经过发芽、烘干、糖化、发酵、蒸馏，然后进入橡木桶——在那里它可能沉睡三年，也可能沉睡三十年。每一瓶都是酒厂的签名和桶匠的手艺。",
    details: {
      sections: [
        {
          title: "威士忌的全球版图",
          items: [
            { label: "苏格兰威士忌 Scotch", desc: "使用泥煤烘干麦芽，赋予标志性的烟熏风味。分为单一麦芽、调和、调和麦芽、单桶等。代表：Macallan、Lagavulin、Johnnie Walker。" },
            { label: "爱尔兰威士忌 Irish Whiskey", desc: "三次蒸馏、不使用泥煤。口感更顺滑、更轻快。代表：Jameson、Redbreast、Bushmills。" },
            { label: "美国波本 Bourbon", desc: "至少51%玉米、新烧焦的美国白橡木桶。甜美、香草、焦糖。代表：Maker's Mark、Woodford Reserve、Buffalo Trace。" },
            { label: "美国黑麦 Rye", desc: "至少51%黑麦。辛辣、干燥骨架，适合调制曼哈顿。代表：Rittenhouse、Michter's、WhistlePig。" },
            { label: "日本威士忌 Japanese Whisky", desc: "灵感来自苏格兰，但追求极致平衡。代表作：Hibiki、Yamazaki、Nikka。" },
            { label: "加拿大 & 其他", desc: "加拿大威士忌以顺滑著称，印度是最大的威士忌消费国。代表：Crown Royal、Amrut、Kavalan（台湾）。" },
          ],
        },
        {
          title: "威士忌的经典配方",
          items: [
            { label: "古典鸡尾酒 Old Fashioned", desc: "波本 + 方糖 + 苦精。鸡尾酒的鼻祖，最纯粹的威士忌表达。" },
            { label: "曼哈顿 Manhattan", desc: "黑麦威士忌 + 甜味美思 + 苦精。鸡尾酒的王后。" },
            { label: "威士忌酸 Whiskey Sour", desc: "波本 + 柠檬汁 + 糖浆 + 蛋清。酸甜的完美平衡。" },
            { label: "花花公子 Boulevardier", desc: "波本 + 金巴利 + 甜味美思。内格罗尼的威士忌变奏。" },
            { label: "盘尼西林 Penicillin", desc: "苏格兰威士忌 + 柠檬汁 + 蜂蜜姜糖浆 + 泥煤威士忌漂浮。现代经典中的传奇。" },
          ],
        },
      ],
    },
  },
  {
    slug: "brandy", name: "白兰地", eng: "Brandy", emoji: "🍇",
    desc: "葡萄酒的灵魂升华。干邑的优雅、雅文邑的粗犷、卡尔瓦多斯的苹果香、皮斯科的南美风情。",
    hero: "白兰地是水果的涅槃——葡萄、苹果、樱桃经过发酵和蒸馏，成为比原酒更浓烈、更复杂的烈酒。干邑和雅文邑是其中最著名的两种，但全球各地都有自己的白兰地传统。",
    details: {
      sections: [
        {
          title: "白兰地的流派",
          items: [
            { label: "干邑 Cognac", desc: "法国干邑地区产的白葡萄为原料，铜制蒸馏器两次蒸馏，法国橡木桶陈年。VS（2年+）、VSOP（4年+）、XO（10年+）。代表：Hennessy、Remy Martin、Martell。" },
            { label: "雅文邑 Armagnac", desc: "法国雅文邑地区，比干邑更古老。柱式蒸馏器一次蒸馏，保留更多风味。更粗犷、更土质。代表：Darroze、Janneau。" },
            { label: "卡尔瓦多斯 Calvados", desc: "法国诺曼底产的苹果白兰地。苹果发酵后蒸馏，在橡木桶中陈年。代表：Boulard、Dupont。" },
            { label: "皮斯科 Pisco", desc: "秘鲁和智利产的葡萄白兰地。不陈年不加水，保留葡萄最原始的花果香。皮斯科酸是最著名的喝法。代表：Barsol、Alto del Carmen。" },
            { label: "水果白兰地 Eau-de-Vie", desc: "用各种水果（梨、樱桃、李子、覆盆子）发酵蒸馏的无色烈酒。代表：Schladerer（德国）、Massenez（法国）。" },
          ],
        },
        {
          title: "白兰地的经典配方",
          items: [
            { label: "边车 Sidecar", desc: "白兰地 + 橙皮利口酒 + 柠檬汁。巴黎丽兹酒店诞生的经典，糖边可选。" },
            { label: "亚历山大 Alexander", desc: "白兰地 + 可可利口酒 + 鲜奶油。丝滑如甜点，二十世纪初的社交名饮。" },
            { label: "萨泽拉克 Sazerac", desc: "白兰地 + 方糖 + 苦精 + 苦艾酒洗杯。新奥尔良的官方饮料。" },
            { label: "皮斯科酸 Pisco Sour", desc: "皮斯科 + 柠檬汁 + 糖浆 + 蛋清 + 苦精。秘鲁和智利的国饮。" },
            { label: "法国连接 French Connection", desc: "白兰地 + 杏仁利口酒。简单到极致。" },
          ],
        },
      ],
    },
  },
]

const articles = [
  {
    title: "鸡尾酒的诞生：从药房到酒吧的三百年旅程", cat: "鸡尾酒历史", author: "调酒百科编辑部", read_time: "12 分钟",
    summary: "1806年5月13日，纽约《平衡与哥伦比亚知识库》周报首次在印刷品中定义了鸡尾酒这个词。这是一段关于药、苦味、甜味和酒精如何走到一起的故事。",
    body: `1806年5月13日，纽约《平衡与哥伦比亚知识库》周报刊登了一封读者来信。这位读者问："什么是鸡尾酒？"编辑在回复中下了历史上第一个书面定义：Cocktail is a stimulating liquor, composed of spirits of any kind, sugar, water, and bitters——鸡尾酒是一种由任意烈酒、糖、水和苦精组成的刺激性饮品。

这个定义简洁到令人惊讶：烈酒、糖、水、苦精。四样东西，两百年来鸡尾酒的所有演变都建立在这个基本公式之上。

但要追溯鸡尾酒的真正起源，我们需要回到更早。

古罗马人用加药草的葡萄酒作为药物——这是苦精和加强酒的祖先。中世纪的修士用蒸馏器提取药草精华——这是利口酒的雏形。16世纪的加勒比海，水手们发现往劣质朗姆酒里加青柠汁和糖可以防止坏血病——无意中发明了朗姆鸡尾酒的原始配方。

18世纪是大转折。从印度归来的英国东印度公司官员带回了"潘趣酒"（Punch）的配方——一种用烈酒、柑橘汁、糖、水和香料混合的大碗饮品。潘趣酒在伦敦社交圈迅速流行，成为最早的社交鸡尾酒。

19世纪初，随着冰块的商业化生产，"冰镇"这一概念进入了鸡尾酒世界。1820年代，纽约出现了第一批专门供应鸡尾酒的"酒吧"——其中最具代表性的是Jerry Thomas的酒吧。Jerry Thomas写了世界上第一本鸡尾酒书《The Bar-Tender's Guide》（1862年），书中收录了236款配方。

Jerry Thomas的开创性在于：他第一次系统化了鸡尾酒的知识体系。他把鸡尾酒分成Julep、Punch、Cobbler、Cocktail等类别，为后来的IBA分类体系打下了基础。

19世纪末到20世纪初是鸡尾酒的"黄金时代前的黎明"。曼哈顿（1870年代）、马天尼（1880年代）、大吉利（1898年）都在这个时期诞生。那一代的调酒师在吧台后面穿着白色西装，像药剂师一样精确地调配每一杯酒。

然而，所有这一切在1920年戛然而止——禁酒令的到来彻底改变了鸡尾酒的地图。`,
  },
  {
    title: "禁酒令与美国鸡尾酒的黄金时代", cat: "鸡尾酒历史", author: "林一", read_time: "10 分钟",
    summary: "1920年到1933年，禁酒令催生了地下酒吧文化。调酒师不得不用果汁和糖浆来掩盖劣质酒的味道——无意中创造了现代鸡尾酒的黄金时代。",
    body: `1920年1月17日凌晨，美国宪法第十八修正案生效。生产、运输和销售酒精饮料成为非法行为。合法的酒吧一夜之间全部关门。但人们并没有停止喝酒——他们只是躲进了地下。

地下酒吧（Speakeasy）这个名字来源于"轻声说话"（speak easy）——你需要低声告诉门卫暗号才能进入。门是普通的公寓门，里面却别有洞天：暗红色灯光、爵士乐队、穿着流苏裙的舞者、以及吧台后面那个穿着白衬衫的身影——调酒师。

但调酒师面临一个巨大的问题：烈酒。

合法的烈酒生产已经停止。地下酒吧依赖走私的劣质酒——用工业酒精稀释、用不卫生的设备蒸馏、甚至从药房偷药用酒精。"浴缸金酒"（Bathtub Gin）不是比喻——它真的是在浴缸里混合的。这种酒的品质有多差？调酒师们不得不用大量的果汁、糖浆、利口酒和香料来掩盖劣质烈酒的刺鼻味道。

讽刺的是，正是这种对劣质烈酒的"掩盖"行为，催生了现代鸡尾酒的革新。如果一个调酒师能用劣质金酒做出一杯好喝的马天尼，那他一定是真正的大师。如果一个调酒师能用蔗糖和青柠让劣质朗姆变得令人愉悦——那他正在发明今天的提基文化。

地下酒吧时期诞生了一批经典鸡尾酒：

- 玛丽·毕克馥（Mary Pickford）——用朗姆、菠萝汁和石榴糖浆为好莱坞明星调制
- 蜜蜂膝盖（Bee's Knees）——金酒、蜂蜜、柠檬汁，蜂蜜的芬芳遮盖劣质金酒
- 最后的话（The Last Word）——金酒、绿查特酒、樱桃利口酒、青柠汁，等比例四重奏

1933年禁酒令废除。合法酒吧重新开张。但13年积累下来的秘密——那些用果汁和利口酒揉合烈酒的手段——并没有消失。"浴缸金酒"走了，但地下酒吧的配方留了下来。而且这一年——更多的美国调酒师逃到了欧洲和古巴，把美国风格带到了巴黎、伦敦和哈瓦那。

禁酒令是一场失败的社会实验，但它无意中为鸡尾酒注入了创造力。没有那13年的黑暗，就没有今天我们手中的这杯内格罗尼。`,
  },
  {
    title: "安格斯特拉苦精：从军医的药箱到每一间酒吧的吧台", cat: "基酒知识", author: "周言", read_time: "7 分钟",
    summary: "那张过大的标签是印刷错误的结果——兄弟俩一个设计标签、一个订购瓶子，没有沟通尺寸。错误变成了标志，一用就是两百年。",
    body: `几乎每一间酒吧的吧台上都有一瓶安格斯特拉苦精。那个带着过大标签的小瓶子，是调酒师不可缺失的最后一道调味——Old Fashioned需要两滴，曼哈顿也需要两滴，香槟鸡尾酒需要一滴浸透方糖。

但很少有人知道，这瓶苦精起源于一个德国军医在南美洲的冒险。

1820年，德国医生约翰·西格特（Johann Siegert）来到委内瑞拉的安格斯图拉镇（Angostura——后来成为苦精的名字），担任西蒙·玻利瓦尔的军队军医。当时军队中的士兵饱受热带疾病之苦——疟疾、黄热病、消化不良。西格特医生根据他在欧洲学到的草药知识，用当地的热带植物——龙胆根、肉桂、丁香、小豆蔻——调配出一种高浓度的药酒。

这种药酒被士兵们称为"西格特医生的药"。它在军队内部迅速传播，不仅被用作肠胃药，还被加入茶水和糖水中当作日常保健品。

1824年，西格特医生退役，在安格斯图拉镇开设了第一家苦精作坊。他开始商业化生产这种药酒，命名为"安格斯图拉芳香苦精"（Angostura Aromatic Bitters）。

1875年，工厂迁到了特立尼达岛——这里离南美洲不远，却属于英国殖民地，政治稳定、海港便利。至今，每一瓶安格斯特拉苦精仍然在特立尼达岛的西班牙港生产，产自同一家工厂。

关于那张过大的标签，有个著名的故事：据说西格特医生的两个儿子——一个负责设计标签、一个负责订购瓶子——没有互相沟通。瓶子订小了，标签设计大了。标签纸已经印好了，不能浪费，于是他们决定用大标签贴小瓶子。"错误"反而成为了醒目的标志——在拥挤的吧台上，过大的白色标签让你一眼就能找到它。

这个"错误"至今未被纠正。每一瓶安格斯特拉苦精仍然是那张过大的白色标签，两百年来不换。

配方是严格保密的商业秘密。只有五个人知道完整的44种原料配方——据说这五个人从来不同时乘坐同一架飞机。我们知道其中一些成分：龙胆根（提供深层苦味）、肉桂和丁香（温暖辛香料）、小豆蔻和柑橘皮（明亮的层次）。但完整的配方，至今仍然锁在特立尼达岛的一个保险柜里。

今天，安格斯特拉苦精的年产量超过5000万瓶。它出现在全球每一间酒吧的吧台上——从纽约的酒店大堂吧到伦敦的角落酒吧，从东京的地下店到上海的天际线高空吧。

一个德国军医的药品，两个兄弟的印刷错误，两百年不变。这就是苦精的力量——不起眼的几滴，决定了鸡尾酒是平庸还是出色。`,
  },
  { title: "橡木桶里的炼金术：威士忌陈年全解", cat: "酿造工艺", author: "陈默", read_time: "15 分钟", summary: "一片橡木如何改变一桶无色透明的新酒？从美国白橡到欧洲橡木，从波本桶到雪莉桶——这里没有魔法，只有时间、木材和酒精的化学反应。" },
  { title: "吧台背后的物理学家：摇和法 vs 搅拌法的科学", cat: "调酒师故事", author: "林一", read_time: "6 分钟", summary: "一位麻省理工毕业的调酒师用实验室设备测量了摇和的物理原理——不仅是混合，更是在给鸡尾酒注入空气、水分和温度。" },
  { title: "雪莉酒的秘密：被低估的鸡尾酒灵魂", cat: "品鉴笔记", author: "陈默", read_time: "9 分钟", summary: "Fino的清瘦、Oloroso的坚果、PX的蜜糖——雪莉酒不是一种酒，而是一整个风味宇宙。" },
  { title: "日本威士忌：一个世纪的追赶与超越", cat: "酿造工艺", author: "林一", read_time: "11 分钟", summary: "从竹鹤政孝远赴苏格兰学艺，到山崎55年在拍卖会上创下纪录，日本用一百年走完了苏格兰五百年的路。" },
  { title: "马天尼杯：一个世纪的形状之争", cat: "酒具百科", author: "周言", read_time: "5 分钟", summary: "V形、圆底、带脚还是不带脚？马天尼杯的形状在百年间经历了多次演变。有人说V形是为了不让橄榄滑出来。" },
  {
    title: "威士忌的\"天使分享\"：每年蒸发2%的魔法", cat: "酿造工艺", author: "陈默", read_time: "8 分钟",
    summary: "每年有2%的威士忌从橡木桶中蒸发消失。苏格兰人诗意地称之为\"天使分享\"。但这2%去哪了，又带走了什么？",
    body: `苏格兰威士忌在橡木桶中陈年时，水分和酒精每年会平均蒸发约2%，称之为\"天使分享\"（Angel's Share）。储藏的方式和环境的温度、湿度，都会影响流失的速度。

在干燥地区，水分蒸发更快，酒精度反而上升——因为酒精分子比水分子大，不容易透过橡木的微小孔隙。在湿润地区则是酒精蒸发的更快，酒精度慢慢降低。同一个酒厂的不同仓库、同一仓库的不同位置，天使分享的速度都不一样。

靠近天花板的高层货架温度更高，蒸发更快——通常每年3-4%。底层的酒桶更接近地面，温度更低更稳定，蒸发率可能只有1-2%。老仓库的空气中弥漫着挥发的酒精蒸汽，一种黑色的真菌——\"酒厂之菌\"——以此为食，在仓库外墙和附近的树木上留下黑色斑块。在苏格兰的酒厂小镇，你不需要看地图导航——跟着墙上和树上的黑色真菌走，就能找到最近的那间酒厂。

12年的威士忌，实际装入橡木桶时可能是一整桶新酒——但12年后取出的量只有原来的一半。这是\"天使\"拿走的真实代价。一桶1960年代的Macallan，如果在2020年开桶，可能只剩下原来体积的20-30%。这也是为什么高年份威士忌如此昂贵——时间的单位不是年，是被天使拿走的每一毫升。`,
  },
  {
    title: "味美思：古罗马的药方，现代吧台的秘密武器", cat: "基酒知识", author: "周言", read_time: "9 分钟",
    summary: "味美思是加了药草和香料的加强葡萄酒。古罗马人用它入药，18世纪意大利人把它当开胃酒。没有它就没有马天尼，也没有曼哈顿。",
    body: `味美思（Vermouth）的名字来自德语的\"苦艾\"（Wermut）。它的核心是白葡萄酒基酒，加入数十种药草、树皮、根和香料进行浸渍，然后加入白兰地或中性烈酒加强酒精度，最后加糖或焦糖调甜度。

古罗马人最早发明了用药草调味的葡萄酒作为药物。但现代味美思的真正发明者是意大利人安东尼奥·贝内代托·卡尔帕诺（Antonio Benedetto Carpano）。1786年，他在都灵创造了第一款商业化的甜味美思。

都灵迅速成为味美思之都。Martini & Rossi、Cinzano、Cocchi都在这里诞生。今天，\"意大利味美思\"和\"都灵味美思\"受地理标志保护。法国也不甘落后——1813年Noilly Prat在马赛发明了干味美思。

味美思是葡萄酒，不是烈酒。开瓶后的味美思需要冷藏保存，最好在几周内用完——它会氧化、失去香气、逐渐变成一瓶没用的酒精调料。这是味美思最大的悲哀：几乎每一间酒吧的味美思都放得太久了。

一瓶新鲜的味美思本身就是一种绝妙的饮品。冰镇、加一片橙子或者不加任何东西，就是一杯完美的开胃酒。不要等到它氧化变味了再倒进曼哈顿里——新鲜的味美思才能让你真正理解为什么马天尼是鸡尾酒之王。`,
  },
]

// 15 款核心鸡尾酒的完整历史故事
const cocktailStories = {
  "Alexander": { origin: { title: "诞生：二十世纪初的伦敦", body: "亚历山大的起源有多种说法。最广为流传的版本是：1902年伦敦的Ciro's Club为庆祝亚历山大国王的加冕典礼而创作。另一说认为它诞生于纽约的一家餐厅，为一位名叫亚历山大的铁路官员而调。无论真相如何，这款以白兰地为基酒、可可利口酒和鲜奶油为辅的鸡尾酒，成为了二十世纪初社交场合最受欢迎的奶油鸡尾酒。它的口感丝滑如甜点，在那个女性开始出现在公共酒吧的年代，亚历山大是一杯优雅的\"淑女饮品\"。" }, funFact: { title: "趣味事实：奶油的魔术", body: "亚历山大是少数使用鲜奶油的经典鸡尾酒之一。鲜奶油不仅赋予它丝绒般的质地，更让它的口感在口腔中层层展开——先是可可的微苦，然后是白兰地的温暖，最后是奶油的绵长余味。这也是为什么它常被戏称为\"可以喝的提拉米苏\"。在电影《谋杀绿脚趾》中，主角Dude喝的\"白俄罗斯\"——伏特加+咖啡利口酒+奶油——正是亚历山大的现代变奏。" }, legacy: { title: "延伸：奶油鸡尾酒的鼻祖", body: "亚历山大开创了\"奶油鸡尾酒\"这一品类。后来的白俄罗斯、金色梦想（Golden Dream）、蚱蜢（Grasshopper）都受其启发。今天的精品鸡尾酒吧中，你可以找到用椰子奶油、燕麦奶甚至开心果奶替代传统鲜奶油的现代版本。亚历山大的核心公式——烈酒+利口酒+奶油——至今仍然是调酒师创作新配方的起点。" } },
  "Americano": { origin: { title: "诞生：1860年代的米兰", body: "美国佬（Americano）的历史可以追溯到1860年代的米兰。Gaspare Campari——金巴利苦酒的创始人——在他的酒吧里将金巴利与甜味美思混合，加苏打水稀释，创造了一款清爽的开胃酒。最初它被称为\"Milano-Torino\"（米兰-都灵），因为金巴利产自米兰、味美思产自都灵。后来，因为大量美国游客在禁酒令期间涌入意大利并爱上了这款酒，它被重新命名为\"Americano\"——即\"美国佬\"。" }, funFact: { title: "趣味事实：詹姆斯·邦德的第一杯酒", body: "在伊恩·弗莱明的第一部007小说《皇家赌场》中，邦德的第一杯酒不是马天尼，而是一杯Americano。在书中，邦德点了一杯Americano，然后自己加了一片柠檬皮。直到后来的小说中，马天尼才取代了Americano成为邦德的标志性饮品。" }, legacy: { title: "延伸：内格罗尼的前身", body: "Americano是内格罗尼（Negroni）的前身。1919年，佛罗伦萨的卡米洛·内格罗尼伯爵要求在Americano中用金酒代替苏打水——内格罗尼从此诞生。今天，Americano仍然是意大利最受欢迎的开胃酒之一，尤其是在温暖的下午，一杯冰镇的Americano配上小吃，是意大利人日常的仪式。" } },
  "Daiquiri": { origin: { title: "诞生：1898年的古巴", body: "大吉利诞生于1898年的古巴圣地亚哥附近。一位名叫詹宁斯·考克斯（Jennings Cox）的美国矿业工程师在Daiquiri村附近工作，用他手边的三种原料——当地朗姆酒、青柠汁和糖——为客人调制了一款简单的鸡尾酒。他用村子名字命名了它。大吉利后来被介绍到哈瓦那的Floridita酒吧，在那里遇到了它最著名的拥护者——欧内斯特·海明威。" }, funFact: { title: "趣味事实：海明威与双份大吉利", body: "海明威在哈瓦那的Floridita酒吧喝掉了数不清的大吉利。但他不喜欢甜味，所以调酒师为他特制了一个无糖版本——\"Papa Doble\"（海明威老爹双份）：双份朗姆、青柠汁、葡萄柚汁、樱桃利口酒——没有糖。海明威据说一次性可以喝掉16杯。酒吧至今还保留着他坐过的角落。" }, legacy: { title: "延伸：朗姆酒最纯粹的表达", body: "大吉利是鸡尾酒中最简洁的公式之一：烈酒+柑橘+甜。这个三角结构启发了无数变奏——草莓大吉利、芒果大吉利、甚至冷冻大吉利（冰沙机打的糖水版本——虽然很多纯化论者不承认这种版本）。一杯真正好的大吉利，需要鲜榨青柠汁和一杯体面的白朗姆——不该需要超过三样东西。" } },
  "Dry Martini": { origin: { title: "诞生：1880年代的美国", body: "干马天尼的确切起源存在争议。最可信的说法是：1880年代旧金山的Martinez镇，一位调酒师为一位前往Martinez的旅客调制了这杯酒——用老汤姆金酒（当时的甜金酒）和甜味美思。后来，金酒变干了（伦敦干金普及），味美思也变干了（Noilly Prat在法国量产），干马天尼从此诞生。1911年，纽约的Knickerbocker酒店的调酒师Martini di Arma di Taggia——一位意大利移民——为约翰·洛克菲勒调制了今天的版本：伦敦干金、干味美思、橙味苦精、柠檬皮。洛克菲勒喝了三杯，马天尼的纽约传奇从此开始。" }, funFact: { title: "趣味事实：摇晃 vs 搅拌", body: "詹姆斯·邦德的\"摇晃，不要搅拌\"是电影史上最著名的饮酒台词之一。但真正的马天尼纯化论者会告诉你：应该搅拌，而不是摇晃。搅拌保持酒液丝滑透明，摇和会让金酒充气——邦德其实在喝一杯稀释的、浑浊的马天尼。但007有他的理由：二战期间的伏特加马天尼用的是马铃薯伏特加，油性重，摇晃有助于乳化。" }, legacy: { title: "延伸：一杯永远进化的酒", body: "马天尼可能是世界上最多变奏的鸡尾酒。脏马天尼（加橄榄盐水）、完美马天尼（干+甜味美思各半）、吉布森（用洋葱代替橄榄）、伏特加马天尼、浓缩咖啡马天尼——每一代调酒师都在这个统一的公式上留下自己的印记。但核心不变：冰镇的金酒、一丁点味美思、冷到可以在玻璃杯上写字的温度。" } },
  "Margarita": { origin: { title: "诞生：1930-1940年代的墨西哥", body: "玛格丽特的起源至少有四个互相竞争的版本。最有说服力的是：1938年，墨西哥蒂华纳的Carlos \"Danny\" Herrera为一位对除龙舌兰之外所有烈酒都过敏的舞者创造了这款酒——他将龙舌兰、橙皮利口酒和青柠汁摇在一起，加上盐边。另一种说法指向达拉斯社交名流Margarita Sames，她在1948年的阿卡普尔科派对上将这款酒介绍给了Tommy Hilton（希尔顿酒店家族的成员），后者把它放进了希尔顿的全球酒单。" }, funFact: { title: "趣味事实：盐边的科学", body: "为什么玛格丽特有盐边？味觉科学给出了答案：盐抑制了舌头上的苦味感受器，同时增强了甜味和咸鲜味的感知。换句话说，盐边让龙舌兰的苦味边缘变得柔和，让青柠的酸更突出。这是一个小小的物理技巧——你在每一口之间舔一下盐边，每一口都像是第一口。" }, legacy: { title: "延伸：全球最畅销的鸡尾酒之一", body: "玛格丽特今天有无数变奏：冷冻玛格丽特（冰沙机版）、水果玛格丽特（草莓、芒果、西瓜）、辣味玛格丽特（jalapeno浸渍龙舌兰）、甚至梅斯卡尔玛格丽特（烟熏版本）。每年2月22日是美国国家玛格丽特日。但一杯真正好的玛格丽特的秘诀一直没变：100%龙舌兰（不是混合酒）、鲜榨青柠汁（不是瓶装酸汁）、以及一个好盐边。" } },
  "Manhattan": { origin: { title: "诞生：1870年代的纽约", body: "曼哈顿的确切诞生日期是调酒史上最大的谜团之一。最可信的版本是指向纽约曼哈顿俱乐部（Manhattan Club）——1870年代，丘吉尔的母亲——珍妮·杰罗姆——在那里举办了一场宴会，调酒师为这个场合调制了这款酒。另一种说法认为它更早：1860年代，一位名叫布莱克的调酒师在纽约百老汇的一家酒吧中调出了这款酒的早期版本。无论哪种版本——曼哈顿是纽约的官方符号。" }, funFact: { title: "趣味事实：黑麦 vs 波本", body: "曼哈顿的传统主义者坚持必须用黑麦威士忌——黑麦的辛辣骨架才能穿透甜味美思的厚重。波本派则偏爱它的甜美柔软。两者的争论激烈程度不亚于马天尼的摇晃vs搅拌。但在19世纪的纽约，黑麦是默认的——因为当时黑麦是美国本土最主要的威士忌类型。波本几乎不为人知。所以如果你想要一杯'历史准确'的曼哈顿——用黑麦。" }, legacy: { title: "延伸：鸡尾酒的王后", body: "曼哈顿常被称为\"鸡尾酒的王后\"——马天尼是国王。两款经典的比较：马天尼是清澈的、锋利的、对味蕾毫不妥协；曼哈顿是温暖的、饱满的、像一杯液体丝绒。今天，曼哈顿有多个经典变奏：罗伯·罗伊（用苏格兰威士忌）、完美曼哈顿（干+甜味美思各半）、以及黑色曼哈顿（用Averna阿玛罗代替味美思）。" } },
  "Mojito": { origin: { title: "诞生：16世纪的古巴", body: "莫吉托的起源比大多数鸡尾酒都要古老。16世纪，英国海盗理查德·德雷克爵士（Sir Francis Drake）的手下在古巴海岸登陆时，当地原住民给他们喝了一种用未加工的朗姆酒（aguardiente）、青柠汁、薄荷和糖兑成的药酒。这种混合物的初衷是预防疾病——青柠提供维生素C、薄荷助消化、糖平衡苦味、朗姆酒杀菌。它从未打算\"好喝\"——但几个世纪后，它变成了全球最受欢迎的鸡尾酒之一。" }, funFact: { title: "趣味事实：海明威的签名", body: "海明威在哈瓦那有两个常去的酒吧：Floridita（大吉利）和La Bodeguita del Medio（莫吉托）。后者的墙上至今挂着一块海明威手写的牌子：\"我的莫吉托在La Bodeguita，我的大吉利在El Floridita\"。今天，那间小酒吧每天卖出数百杯莫吉托，游客们排队在墙上签名——海明威开了一个好头。" }, legacy: { title: "延伸：全球最畅销的新鲜鸡尾酒", body: "莫吉托的成功让薄荷在鸡尾酒中成为了明星配料。后来的Southside（金酒+薄荷+柠檬汁）、Mint Julep（波本+薄荷+糖粉）和各式各样的水果莫吉托（草莓、芒果、百香果）都源于这个古巴配方。一杯好的莫吉托需要耐心——薄荷不是被捣碎的，是被轻轻拍打释放精油的。过度捣碎释放叶绿素会让酒变苦。" } },
  "Negroni": { origin: { title: "诞生：1919年的佛罗伦萨", body: "1919年，意大利佛罗伦萨。卡米洛·内格罗尼伯爵（Count Camillo Negroni）走进Cafe Casoni酒吧。他刚从伦敦回来，在那里爱上了金酒。他要求调酒师Fosco Scarselli将Americano（金巴利+甜味美思+苏打水）中的苏打水换成金酒。伯爵想要一杯更有劲的开胃酒。Scarselli把苏打水换成了金酒，用橙片装饰代替柠檬片——内格罗尼就此诞生。橙皮油脂在金酒表面形成微光，苦、甜、药草在冰球上缓慢融合——伯爵找到了他的完美饮品。" }, funFact: { title: "趣味事实：1:1:1的魔力", body: "内格罗尼可能是所有经典鸡尾酒中最简单的配方：1:1:1——30ml金酒+30ml金巴利+30ml甜味美思。三个等量成分，没有任何一种占主导。金酒的杜松子+金巴利的苦+味美思的甜——三者不是加法，是乘法。Orson Welles在1947年第一次喝到内格罗尼后写道：\"苦味对肝脏有益，金酒对大脑有害。两者在一起，恰好平衡。\"" }, legacy: { title: "延伸：全世界调酒师的实验场", body: "内格罗尼的等比例公式使其成为全世界调酒师最喜欢的实验平台。替代金酒——梅斯卡尔内格罗尼（烟熏版）、白朗姆内格罗尼、甚至椰子油洗的金酒。替代金巴利——用各种阿玛罗和苦味利口酒。替代味美思——用雪莉酒、波特酒、甚至椰子水。2013年开始，内格罗尼周（Negroni Week）每年在全球数千家酒吧举办，为慈善机构筹款。一杯意大利人的午后饮品，变成了全球调酒界的团结符号。" } },
  "Old Fashioned": { origin: { title: "诞生：1806年之前", body: "古典鸡尾酒被称为\"鸡尾酒的鼻祖\"——因为它实际上就是历史上第一款\"鸡尾酒\"。1806年纽约报纸上第一次出现\"cocktail\"这个词的定义：烈酒、糖、水、苦精。这四样东西放在一起——就是一杯Old Fashioned。但\"Old Fashioned\"这个名字要到1880年代才出现。当时调酒师们开始往鸡尾酒里加苦艾酒、樱桃利口酒等各种花哨配料。一些坚持传统的饮酒者开始要求\"老式的\"（old-fashioned）做法——只用老四样。这个名字成了光荣的徽章。" }, funFact: { title: "趣味事实：方糖 vs 糖浆", body: "早期调酒师用方糖而不是糖浆。原因是：方糖可以被苦精浸透——将苦精滴在方糖上，让糖吸收苦精的每一滴，然后用捣棒将糖-苦精混合物捣碎，再加水融化。这个过程本身就一种仪式——与今天从瓶子里挤糖浆相比，它更慢、更专注、更古老。一杯好的Old Fashioned，冰块必须是大块冰——融化慢、稀释慢——让威士忌的每一口都保持浓郁。" }, legacy: { title: "延伸：威士忌复兴的推手", body: "21世纪初鸡尾酒复兴运动中，Old Fashioned成为了反甜腻鸡尾酒的旗帜——它不甜、不果汁、不花哨。它只有威士忌、一点糖、苦精、冰块和橙皮。Mad Men中的Don Draper把它重新带入流行文化。今天，几乎所有好的威士忌酒吧都以它们的Old Fashioned为招牌——每个调酒师都有自己的配方：用什么威士忌、多少糖、哪种苦精、大冰还是碎冰。" } },
  "Sidecar": { origin: { title: "诞生：1920年代的巴黎", body: "边车据称诞生于巴黎丽兹酒店（Hotel Ritz Paris）的酒吧，由传奇调酒师弗兰克·梅耶（Frank Meier）创作。名字来源很有趣：一位美国军官每天骑着一辆带边车的摩托车来到丽兹酒店，他要求梅耶创制一款能在寒冷的冬夜\"预热\"他的鸡尾酒。梅耶将白兰地、橙皮利口酒和柠檬汁以2:1:1的比例摇和，加上糖边——边车从此诞生。另一位军官后来说这款酒像边车一样\"撞\"醒了他——酸和烈酒的组合确实像一次温和的碰撞。" }, funFact: { title: "趣味事实：丽兹酒店与纳粹", body: "1940年纳粹占领巴黎后，丽兹酒店的酒吧继续营业——赫尔曼·戈林把丽兹当作他的巴黎总部。梅耶是一位立陶宛犹太人——这可能是最讽刺的事情：一个犹太调酒师在二战期间为纳粹高层调酒。梅耶在1940年代出版的调酒书中没有提及自己的犹太身份——他低调地活了下来，战后继续在丽兹工作直到去世。" }, legacy: { title: "延伸：白兰地调酒的标杆", body: "边车是白兰地调酒的标杆——它确立了三重奏（烈酒+橙皮利口酒+柠檬汁）作为白兰地调酒的黄金比例。后来的Between the Sheets（加了朗姆）、法国连接（白兰地+杏仁利口酒，材料更简单）都从这个公式变奏而来。一杯好的边车需要好的白兰地——VSOP或以上——因为这款酒对基酒的品质毫无遮掩。" } },
  "Whiskey Sour": { origin: { title: "诞生：1860年代", body: "威士忌酸是鸡尾酒世界中最古老的公式之一——\"酸\"（Sour）本身就是一种鸡尾酒类型。它的原型可以追溯到19世纪中叶的美国海军。当时的水手每天配给威士忌——防止坏血病——他们发现往威士忌里加柠檬汁和糖不仅更健康，而且更好喝。1862年Jerry Thomas的《调酒师指南》中正式收录了\"Whiskey Sour\"的配方：波本威士忌、柠檬汁、糖浆——用摇酒壶摇和。" }, funFact: { title: "趣味事实：蛋清的争议", body: "蛋清在威士忌酸中是一个可选的但有争议的成分。加入蛋清可以让鸡尾酒产生一层丝滑的白色泡沫——\"波士顿酸\"（Boston Sour）就是加了蛋清的威士忌酸。蛋清不加任何味道，但它改变了一切：质地从爽脆变成丝绒。有些人讨厌蛋清的\'蛋腥味\'——但一杯正确摇和的威士忌酸，蛋清应该完全融入，只留下泡沫和丝滑——没有任何异味。" }, legacy: { title: "延伸：酸的家族", body: "威士忌酸是\"酸\"鸡尾酒家族中最著名的一员。这个家族的公式是统一的：烈酒+柠檬汁+糖——可以套用在任何烈酒上。皮斯科酸（皮斯科+柠檬汁+糖+蛋清+苦精）、白兰地酸、朗姆酸——所有\"酸\"类鸡尾酒都共享这个DNA。纽约的Attaboy酒吧以威士忌酸闻名——他们不给你菜单，你告诉他们你想要什么口味，他们当场摇一杯。" } },
  "Espresso Martini": { origin: { title: "诞生：1980年代的伦敦", body: "咖啡马天尼是1980年代伦敦传奇调酒师Dick Bradsell的发明。一个夜晚，一位著名的模特——据说是凯特·莫斯（但Bradsell从未确认）——走进Fred's Club，对Bradsell说：\"给我一杯东西，能让我'醒过来，然后把我砸晕'\"（Wake me up, then f**k me up）。Bradsell将伏特加（砸晕）、浓缩咖啡（醒过来）、咖啡利口酒和糖浆摇在一起。咖啡马天尼从此诞生。" }, funFact: { title: "趣味事实：它根本不是马天尼", body: "咖啡马天尼不含金酒——不含味美思——实际上跟马天尼毫无关系。它叫\"马天尼\"只是因为装在马天尼杯里。但这种命名没有伤害它——咖啡马天尼成为了1980-1990年代伦敦豪饮文化的代表鸡尾酒之一。后来精品咖啡文化的兴起让它重新流行——今天的版本使用新鲜现磨的浓缩咖啡、单一产地咖啡豆甚至冷萃咖啡。" }, legacy: { title: "延伸：提神与微醺的双重奏", body: "咖啡马天尼是少有的同时含有兴奋剂和抑制剂的鸡尾酒——咖啡因让你警觉，酒精让你放松。这种对立的平衡正是它的魅力所在。今天它仍然是全球最流行的餐后鸡尾酒之一——用一杯咖啡马天尼来结束晚餐，至少你不会在餐桌上睡着。" } },
  "Bloody Mary": { origin: { title: "诞生：1920年代的巴黎", body: "血腥玛丽诞生在巴黎的Harry's New York Bar——正是同一间酒吧发明了French 75和Sidecar。1921年，调酒师Fernand Petiot将等量的伏特加和番茄汁混合在一起。最初他称之为\"Bucket of Blood\"（一桶血）。一位顾客说它让他想起了芝加哥的Bucket of Blood俱乐部里的一位叫Mary的舞者。后来为了更优雅，改名为\"Bloody Mary\"——可能指向英国女王玛丽一世（她的血腥迫害历史），也可能只是听起来更顺耳。" }, funFact: { title: "趣味事实：宿醉治愈剂的传说", body: "血腥玛丽被称为\"世界上最好喝的宿醉治愈剂\"——虽然科学并不同意。但其中有道理：番茄汁含有维生素C和抗氧化物质；辣椒素刺激新陈代谢；伏特加让宿醉的人\"再喝一口\"以缓解戒断症状。血腥玛丽也因此成为了早午餐的官方饮品——它可以合理地在上午11点端上餐桌——因为它是\"蔬菜\"。" }, legacy: { title: "延伸：最疯狂的装饰战争", body: "血腥玛丽的装饰已经成为酒吧之间的军备竞赛。一开始是一根芹菜茎。然后加了一片柠檬。然后再加了一条培根。然后是整只虾。然后是汉堡、炸鸡、整个龙虾、甚至一整块披萨——切达威斯康辛的一家酒吧用一整只烤鸡做装饰。血腥玛丽已经从一杯鸡尾酒变成了一顿饭。" } },
  "Mint Julep": { origin: { title: "诞生：18世纪的美国南方", body: "薄荷茱莉普是18世纪美国南方种植园的产物。当地人在早晨喝一种用威士忌（或白兰地）、薄荷和糖调成的冰镇饮料——作为一种清淡的早晨提神饮品。到了19世纪，它已经成为肯塔基州的社会支柱——肯塔基的议员们在议会中互相请喝薄荷茱莉普来缓和辩论气氛。1938年，肯塔基德比赛马场（Kentucky Derby）正式把它作为官方饮品——每年5月的第一个周六，超过12万杯薄荷茱莉普在Churchill Downs赛马场被消费。" }, funFact: { title: "趣味事实：银杯的仪式", body: "薄荷茱莉普传统上盛在银杯或铜杯中——不是为了好看，而是因为金属杯壁可以让杯子外壁结冰。正确的喝法是用手握住杯子的底部边缘，保持冰块尽可能冷。银杯是肯塔基德比的官方纪念品——每一年都有专门的款式。" }, legacy: { title: "延伸：薄荷的神圣性", body: "薄荷茱莉普有一个不可妥协的规则：薄荷必须新鲜。这不是装饰——薄荷的芳香精油在威士忌和糖的甜苦中起到引导作用。永远不要用干薄荷——那已经失去了茱莉普的灵魂。正确的做法是轻轻拍打薄荷叶释放精油，然后放在杯子底部或顶部——捣碎会让它变苦。" } },
  "Cosmopolitan": { origin: { title: "诞生：1970-1990年代", body: "大都会有多位声称者。它的前身可以追溯到1970年代——用伏特加、橙皮利口酒、青柠汁和蔓越莓汁调制的鸡尾酒。但真正让大都会成为全球现象的是纽约的Toby Cecchini（1987年在The Odeon酒吧）和迈阿密的Cheryl Cook（1980年代在The Strand）。1998年，《欲望都市》中的Carrie、Miranda、Samantha和Charlotte在每一集都点大都会——粉红色的鸡尾酒和曼哈顿四姐妹的摩登生活完美匹配。大都会的销量从此爆发。" }, funFact: { title: "趣味事实：蔓越莓汁不是为了味道", body: "大都会中的蔓越莓汁量很少——只有15ml左右。它的主要作用不是调味，而是上色——那标志性的粉色。如果用白蔓越莓汁代替红色蔓越莓汁，你会得到一杯白色透明的大都会——味道几乎一样，但没人认得出。粉色是大都会的视觉签名——和《欲望都市》的海报颜色一致。" }, legacy: { title: "延伸：现代鸡尾酒流行文化的开端", body: "大都会是第一款通过流行文化大爆发的现代鸡尾酒——在社交媒体出现之前。它证明了电视上的鸡尾酒可以改变全球的饮酒习惯。《欲望都市》后的20年间，大都会从曼哈顿到孟买无处不在。虽然近年手工鸡尾酒吧对它有所冷落——认为它\"太甜、太90年代\"——但它仍然是世界各地派对中最常被点的鸡尾酒之一。" } },
  "Pina Colada": { origin: { title: "诞生：1950年代的波多黎各", body: "椰林飘香的故事有两个版本。大多数波多黎各人相信：1954年，圣胡安的Caribe Hilton酒店的调酒师Ramon \"Monchito\" Marrero花了三个月时间完美平衡了朗姆酒、椰浆和菠萝汁——创造了椰林飘香。另一个版本来自同一城市的Barrachina餐厅——声称他们的调酒师Ramon Portas Mingot在1963年发明了它。无论如何，1978年椰林飘香被宣布为波多黎各的官方饮品——整个岛屿都在庆祝一杯朗姆酒的胜利。" }, funFact: { title: "趣味事实：Coco Lopez的秘密", body: "椰林飘香的存在要感谢Coco Lopez——一种罐装椰子奶油。这款产品的发明者是波多黎各大学的Ramon Lopez Irizarry教授，他在1940年代发明了将椰子奶油与糖混合的工艺，使其可以稳定保存。没有Coco Lopez，椰林飘香的商业化是不可能的——你不可能每天在酒吧新鲜压榨数百个椰子来榨奶。" }, legacy: { title: "延伸：热带假期的液体符号", body: "椰林飘香已经成为\"热带假期\"的液体符号——一杯插着小伞和菠萝角的乳白色鸡尾酒。它是提基文化（Tiki Culture）最重要的鸡尾酒之一——尽管很多纯化论者对商业化版本（过度甜、用预调糖浆代替新鲜原料）感到不满。一杯真正好的椰林飘香，需要鲜榨菠萝汁——和罐装菠萝汁的区别就像新鲜水果和水果罐头的区别。" } },
  "Moscow Mule": { origin: { title: "诞生：1941年的洛杉矶", body: "莫斯科骡子的诞生故事充满好莱坞的随意。1941年的洛杉矶，三个男人在一家酒吧里碰面：John Martin（Smirnoff伏特加的总裁，手里有一堆卖不出去的伏特加）、Jack Morgan（Cock'n Bull姜汁啤酒的老板，手里有一堆卖不出去的姜汁啤酒）和一位不太记得名字的调酒师。他们发现伏特加+姜汁啤酒+青柠汁的组合意外地好喝——莫斯科骡子就此诞生。为了让这款酒更酷炫，他们把它装在铜杯中——铜杯最初是俄罗斯的象征（伏特加来自俄罗斯）。铜杯冰镇后外壁凝结水珠，拿在手里有一种独特的冷感。" }, funFact: { title: "趣味事实：营销史上的经典案例", body: "莫斯科骡子是营销史上的经典——Smirnoff的John Martin走遍全美酒吧，为每家酒吧免费赠送铜杯和拍立得相机。他让调酒师为顾客调莫斯科骡子，然后用拍立得拍下顾客举着铜杯的照片——一张留给顾客，一张留在酒吧。这个营销手法让莫斯科骡子在美国爆发式普及，也最终让伏特加在美国市场上成功立足。" }, legacy: { title: "延伸：铜杯的不可妥协", body: "莫斯科骡子必须用铜杯——纯化论者不会退让。铜杯不仅是审美，它改变饮用体验：铜壁比玻璃更快降温，金属的冷感透过杯壁传到手指。铜杯和姜汁啤酒的辛辣气泡形成对比——冰冷金属+辛辣姜汁——让每一口都清爽到骨子里。铜杯不能放进洗碗机——必须手洗——这是莫斯科骡子不可妥协的仪式。" } },
}

// 自动生成基础描述
function generateStory(cocktail) {
  if (cocktailStories[cocktail.eng]) return cocktailStories[cocktail.eng]

  const spiritText = cocktail.ingredients ? cocktail.ingredients[0] || "" : ""
  const catText = cocktail.cat === "难忘经典" ? "IBA 官方列为\"难忘经典\"——它是鸡尾酒历史上的基石。" : cocktail.cat === "当代经典" ? "IBA 官方列为\"当代经典\"——它在全球酒吧中被新一代调酒师不断演绎。" : "IBA 官方列为\"新时代\"——它代表了鸡尾酒文化的当代革新。"

  return {
    origin: {
      title: `关于${cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktail.eng}`,
      body: `${cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktail.eng}是一款${cocktail.cat || "经典"}鸡尾酒。${catText}它的核心配料包括${cocktail.ingredients ? cocktail.ingredients.slice(0, 3).join("、") : "烈酒和新鲜配料"}。详细的起源故事正在由调酒师社区撰写中——每一位经典鸡尾酒的背后，都有一段等待被讲述的历史。`,
    },
    funFact: {
      title: "等待更多发现",
      body: `${cocktail.chn?.replace(/[（(][^）)]*[）)]/g, "").trim() || cocktail.eng}的配方和调制方法已被收录在国际调酒师协会（IBA）的官方酒谱中。每款经典鸡尾酒都有其独特的故事——有些关于意外发明，有些关于特定的人物或地点。如果您知道关于这款酒的趣闻或历史，欢迎投稿。`,
    },
    legacy: {
      title: "经典传承",
      body: "每一杯经典鸡尾酒都是一个时代的切片——它诞生于特定的时间和地点，却超越了它的时代。今天，全世界各地的调酒师在这些经典配方的基础上创造新的变奏，延续着调酒文化的传承。",
    },
  }
}

async function setup() {
  await client.connect()

  // 建鸡尾酒表
  await client.query(`DROP TABLE IF EXISTS cocktails CASCADE`)
  await client.query(`
    CREATE TABLE cocktails (
      id SERIAL PRIMARY KEY,
      eng VARCHAR(100) UNIQUE NOT NULL,
      chn VARCHAR(200),
      cat VARCHAR(50),
      ingredients TEXT[],
      story JSONB,
      method JSONB,
      taste_tags TEXT[],
      difficulty INT DEFAULT 2,
      occasion TEXT[],
      view_count INT DEFAULT 0,
      tip TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // 建基酒表（含详情 JSON）
  await client.query(`DROP TABLE IF EXISTS spirits CASCADE`)
  await client.query(`
    CREATE TABLE spirits (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(50),
      eng VARCHAR(50),
      emoji VARCHAR(10),
      description TEXT,
      hero TEXT,
      details JSONB
    )
  `)

  // 建文章表
  await client.query(`DROP TABLE IF EXISTS articles CASCADE`)
  await client.query(`
    CREATE TABLE articles (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200),
      cat VARCHAR(50),
      author VARCHAR(50),
      read_time VARCHAR(20),
      summary TEXT,
      body TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  console.log("表创建成功")

  // 清空 + 导入鸡尾酒
  await client.query("DELETE FROM cocktails")
  for (const c of cocktailsData) {
    const story = generateStory(c)
    await client.query(
      "INSERT INTO cocktails (eng, chn, cat, ingredients, story, method, taste_tags, difficulty, occasion, tip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [c.eng, c.chn, c.cat, c.ingredients, JSON.stringify(story), methodsMap[c.eng] ? JSON.stringify(methodsMap[c.eng]) : null, attrsMap[c.eng]?.taste_tags || null, attrsMap[c.eng]?.difficulty || 2, attrsMap[c.eng]?.occasion || null, tipsMap[c.eng] || null]
    )
  }
  console.log(`导入 ${cocktailsData.length} 款鸡尾酒（含历史故事）`)

  // 导入酒吧经典（25款非IBA经典）
  for (const c of barClassicsData) {
    await client.query(
      "INSERT INTO cocktails (eng, chn, cat, ingredients, story, method, taste_tags, difficulty, occasion, tip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [c.eng, c.chn, c.cat, c.ingredients, JSON.stringify(c.story), JSON.stringify(c.method), c.taste_tags, c.difficulty, c.occasion, c.tip]
    )
  }
  console.log(`导入 ${barClassicsData.length} 款酒吧经典`)

  // 清空 + 导入基酒
  await client.query("DELETE FROM spirits")
  for (const s of spirits) {
    await client.query(
      "INSERT INTO spirits (slug, name, eng, emoji, description, hero, details) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [s.slug, s.name, s.eng, s.emoji, s.desc, s.hero, s.details ? JSON.stringify(s.details) : null]
    )
  }
  console.log(`导入 ${spirits.length} 种基酒`)

  // 清空 + 导入文章
  await client.query("DELETE FROM articles")
  for (const a of articles) {
    await client.query(
      "INSERT INTO articles (title, cat, author, read_time, summary, body) VALUES ($1, $2, $3, $4, $5, $6)",
      [a.title, a.cat, a.author, a.read_time, a.summary, a.body || null]
    )
  }
  console.log(`导入 ${articles.length} 篇文章`)

  await client.end()
  console.log("数据库初始化完成")
}

setup().catch((err) => console.error("出错:", err.message))
