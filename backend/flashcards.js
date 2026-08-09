// ====== 学习卡片数据引擎 ======
// 从数据库 + 静态知识生成学习卡片

const STATIC_CARDS = [
  // ===== 调酒手法 =====
  {
    id: "technique_shake",
    category: "technique",
    question: "摇和法（Shake）适用于什么类型的鸡尾酒？",
    answer: "含有果汁、奶油、蛋清、糖浆等非酒精液体的鸡尾酒。摇和能快速冷却、充分混合、适当稀释，同时让蛋清或奶油产生丰富的泡沫。典型代表：Daiquiri、Whiskey Sour、Gin Fizz。",
    hint: "看配方里有没有果汁或奶制品",
    difficulty: 1,
  },
  {
    id: "technique_stir",
    category: "technique",
    question: "搅拌法（Stir）和摇和法（Shake）的核心区别是什么？",
    answer: "搅拌法用于全部由酒精类材料组成的鸡尾酒（如马天尼、曼哈顿、内格罗尼）。搅拌比摇和更温和，不会产生气泡和泡沫，酒体更丝滑、更清澈。而摇和会产生气泡、泡沫和更多稀释，适合含果汁或蛋清的酒。记住老林的规矩：全酒精→搅拌，有果汁→摇和。",
    hint: "看材料是否全都是透明的酒",
    difficulty: 1,
  },
  {
    id: "technique_dry_shake",
    category: "technique",
    question: "什么是「干摇」（Dry Shake）？为什么要干摇？",
    answer: "干摇就是不加冰先摇。主要用于含蛋清的鸡尾酒（如 Gin Fizz、Ramos Fizz、Porto Flip）。蛋清在室温下更容易打发成绵密泡沫；加冰后蛋清会变稠、难以打发。干摇后再加冰摇一次（湿摇），完成冷却和稀释。Ramos Fizz 需要干摇2分钟以上——这杯酒是全菜单最累的一杯。",
    hint: "和蛋清有关",
    difficulty: 2,
  },
  {
    id: "technique_build",
    category: "technique",
    question: "直调法（Build）是什么？什么酒用直调法？",
    answer: "直调法是最简单的调酒方法：直接在饮用杯中加冰、倒入材料、搅一搅就行。不需要摇酒壶或搅拌杯。典型代表：金汤力（Gin and Tonic）、自由古巴（Cuba Libre）、Gin & Tonic 等 Highball 类长饮。关键技巧：苏打水/汤力水最后沿杯壁倒入，保留气泡。",
    hint: "适合加了气泡饮料的长饮",
    difficulty: 1,
  },
  {
    id: "technique_muddle",
    category: "technique",
    question: "捣压（Muddle）的正确手法是什么？常见错误有哪些？",
    answer: "用捣棒（Muddler）在杯底轻轻按压草本或水果，目的是释放精油和风味，不是碾碎成泥。关键：薄荷叶要轻捣2-3下即可——过度捣压会让薄荷叶变苦变黑。青柠角要皮朝下捣，先释放皮的油脂。常见错误：像捣蒜一样用力碾磨，结果薄荷变苦、柠檬皮释放出白色内层的涩味。",
    hint: "薄荷莫吉托的关键步骤",
    difficulty: 2,
  },
  {
    id: "technique_layer",
    category: "technique",
    question: "分层（Layer/Float）是怎么做到的？原理是什么？",
    answer: "利用不同液体的密度差（含糖量不同），用吧勺背部缓慢引流，让密度大的酒在下面、密度小的浮在上面。糖分越高密度越大，所以甜利口酒在下、高度烈酒在上。技巧：吧勺的勺背贴着液面，让酒沿着勺背缓缓流下，不要直接倒否则会穿透下层。",
    hint: "利用密度差异",
    difficulty: 3,
  },
  {
    id: "technique_double_strain",
    category: "technique",
    question: "「双重过滤」（Double Strain）是什么？什么时候需要用？",
    answer: "在摇酒壶的滤冰器之外，再加一个细网滤网（茶滤）过滤。用来滤掉碎冰渣、果肉纤维、香草碎片、蛋清结块等。典型场景：Daiquiri 要双重过滤保证清爽口感；含新鲜水果泥或薄荷碎的酒也必须双重过滤，否则渣渣影响口感。",
    hint: "比普通过滤多一层滤网",
    difficulty: 2,
  },
  {
    id: "technique_rolling",
    category: "technique",
    question: "「滚动」（Rolling/Throwing）是什么调酒技法？",
    answer: "将酒在两个容器之间来回倒，让酒充分接触空气。比搅拌更温和，比摇和更文雅。常用于 Bloody Mary（番茄汁不适合摇晃会起泡变浑浊）和某些老式调酒。这个技法在21世纪几乎被遗忘，但近年精酿酒吧开始复兴。",
    hint: "两个杯子之间来回倒",
    difficulty: 3,
  },

  // ===== 杯型知识 =====
  {
    id: "glass_martini",
    category: "glassware",
    question: "马天尼杯（Martini Glass）的特点和适用场景？",
    answer: "经典的倒三角形高脚杯，容量约120-180ml。V形设计让酒的表面积大、香气直接上升。适合不加冰的纯酒精鸡尾酒（马天尼、曼哈顿、Daiquiri 等）。高脚设计让手不接触杯身，保持酒温。缺点：容易洒——所以酒吧里看到端马天尼杯小心翼翼走路的，不一定是装，是真的会洒。",
    hint: "倒三角形高脚杯",
    difficulty: 1,
  },
  {
    id: "glass_rocks",
    category: "glassware",
    question: "古典杯（Old Fashioned Glass / Rocks Glass）的特点？",
    answer: "矮身宽口厚底杯，容量180-300ml。厚底适合捣压方糖和苦精（Old Fashioned 的做法）。宽口方便加大冰块。适合加冰的短饮：Old Fashioned、Negroni、Whiskey on the rocks 等。也被称为 Rocks Glass 或 Lowball。",
    hint: "矮胖厚底，适合加冰",
    difficulty: 1,
  },
  {
    id: "glass_highball",
    category: "glassware",
    question: "高球杯（Highball Glass）适合什么类型的鸡尾酒？",
    answer: "直筒高身杯，容量250-350ml。适合加了大量苏打水/汤力水/可乐的长饮（Highball 类）：金汤力、自由古巴、Gin Fizz、Tom Collins 等。高身设计保留气泡更长，直筒造型方便加冰。",
    hint: "高个子直筒杯",
    difficulty: 1,
  },
  {
    id: "glass_coupe",
    category: "glassware",
    question: "Coupe 杯和马天尼杯有什么区别？哪个更好？",
    answer: "Coupe 杯是圆底碗形高脚杯，马天尼杯是V形倒三角。Coupe 杯历史悠久（可以追溯到17世纪香槟杯），优点是比马天尼杯更不容易洒，缺点是表面积小香气释放不如V形杯。近年来很多精酿酒吧改用 Coupe 杯替代马天尼杯——因为没人喜欢在吧台擦地。",
    hint: "圆底 vs V底",
    difficulty: 2,
  },
  {
    id: "glass_hurricane",
    category: "glassware",
    question: "飓风杯（Hurricane Glass）是什么？哪些酒用它？",
    answer: "曲线形高脚大杯，像个倒扣的郁金香花苞，容量可达450-600ml。新奥尔良的 Pat O'Brien's 酒吧在1940年代发明，因为二战期间玻璃短缺，酒商要求「买一箱朗姆送一箱杯子」。飓风杯里最适合热带朗姆长饮：Hurricane、Planters Punch、Blue Hawaii。",
    hint: "新奥尔良特产，配朗姆酒",
    difficulty: 2,
  },
  {
    id: "glass_nick_nora",
    category: "glassware",
    question: "Nick & Nora 杯是什么？",
    answer: "一种小容量（约120-150ml）的优雅高脚杯，杯身呈钟形，比马天尼杯小且更不易洒。名字来自1930年代电影《瘦子》（The Thin Man）中的侦探夫妇角色。近年来精酿鸡尾酒吧大量使用 Nick & Nora 杯替代马天尼杯，因为容量更合理（现代马天尼杯越做越大，120ml的酒装进去像空杯）。",
    hint: "来自一部老电影的侦探夫妇",
    difficulty: 3,
  },

  // ===== 调酒术语 =====
  {
    id: "term_dry",
    category: "term",
    question: "鸡尾酒中的「Dry」是什么意思？",
    answer: "Dry 有两个含义：①马天尼语境：Dry = 少放味美思（Dry Martini 的标准比例是 6:1 甚至更高，而 Wet Martini 则是 3:1 或更多味美思）。②整体风味：Dry = 不甜、偏干、清爽（对应 Sweet = 甜味为主）。干味美思（Dry Vermouth）本身就是不甜的加强葡萄酒。丘吉尔的 Dry Martini 配方：冰镇金酒，看一眼味美思瓶子就够了。",
    hint: "马天尼的核心参数",
    difficulty: 1,
  },
  {
    id: "term_perfect",
    category: "term",
    question: "「Perfect」在鸡尾酒中是什么意思？比如 Perfect Manhattan？",
    answer: "Perfect = 一半干味美思 + 一半甜味美思。所以 Perfect Manhattan = 黑麦威士忌 + 干味美思 + 甜味美思（各半）。这个用法只出现在有「干/甜」之分的鸡尾酒中（马天尼、曼哈顿等）。和「完美」没关系——Perfect Martini 不一定比 Dry Martini 更好喝，只是配方参数不同。",
    hint: "干味美思和甜味美思各一半",
    difficulty: 2,
  },
  {
    id: "term_dirty",
    category: "term",
    question: "「Dirty Martini」是什么？",
    answer: "Dirty Martini = 在 Dry Martini 中加入橄榄盐水（Olive Brine），让酒变得浑浊（所以叫 Dirty）。橄榄盐水的咸鲜味改变了整杯酒的风味走向，变得咸鲜、带海味。加多少盐水因人而异，从几滴到15ml都有。更进阶的还有 Filthy Martini——用蓝纹奶酪橄榄的盐水，味道更重更野。",
    hint: "和橄榄盐水有关",
    difficulty: 1,
  },
  {
    id: "term_up",
    category: "term",
    question: "「Up」和「On the Rocks」的区别？",
    answer: "Up = 酒在冰中冷却后过滤倒入高脚杯中，杯中无冰（如 Martini Up）。On the Rocks = 酒直接倒在冰块上，杯中一直有冰（如 Whiskey on the Rocks）。所以「点一杯马天尼 Up」= 标准做法（过滤到马天尼杯），而「马天尼 On the Rocks」= 倒在古典杯的冰块上——后者在老派酒吧可能会被调酒师多看两眼。",
    hint: "杯中到底有没有冰",
    difficulty: 1,
  },
  {
    id: "term_neat",
    category: "term",
    question: "「Neat」是什么意思？和「Straight Up」一样吗？",
    answer: "Neat = 纯饮，酒直接从瓶子倒入杯中，不冷却、不加冰、不加水。室温纯饮。常用于品鉴威士忌和高端烈酒。Straight Up = 酒在冰中冷却后过滤到杯中（不加冰）。这是两个容易混淆的词：Neat 没碰过冰，Straight Up 碰过冰但杯中没冰。",
    hint: "一个是室温纯饮，一个是冰过但杯中无冰",
    difficulty: 2,
  },
  {
    id: "term_abv",
    category: "term",
    question: "ABV 是什么意思？一杯鸡尾酒的 ABV 怎么估算？",
    answer: "ABV = Alcohol By Volume（酒精体积百分比），即酒精度数。一杯鸡尾酒的 ABV = 所有酒精材料的（体积 x 酒精度）之和 / 总体积。例如 Negroni：金酒(40%)、金巴利(25%)、甜味美思(16%) 各30ml，总酒精度约 (30x0.4 + 30x0.25 + 30x0.16) / 90 = 27%。再加冰融化稀释约20-25%，实际入口大约 20-22% ABV。",
    hint: "酒精体积百分比",
    difficulty: 2,
  },
  {
    id: "term_aperitif",
    category: "term",
    question: "什么是「餐前酒」（Aperitif）？有哪些经典餐前酒？",
    answer: "Aperitif（餐前酒）是饭前喝的酒，目的是刺激食欲。通常偏干、偏苦、酒精度适中，不会太甜以免影响食欲。经典餐前鸡尾酒：Negroni（苦味开胃）、Dry Martini（干净利落）、Americano（清爽低度）、Champagne Cocktail（优雅）。纯饮餐前酒：金巴利、Aperol、Lillet Blanc、干味美思。",
    hint: "饭前喝，开胃用",
    difficulty: 1,
  },
  {
    id: "term_digestif",
    category: "term",
    question: "什么是「餐后酒」（Digestif）？和餐前酒怎么区分？",
    answer: "Digestif（餐后酒）是饭后喝的酒，帮助消化。通常比餐前酒更烈、更甜、更厚重。经典餐后鸡尾酒：Alexander（奶油甜）、Sidecar（白兰地基底）、Rusty Nail（威士忌+蜂蜜利口酒）。纯饮餐后酒：干邑、阿玛罗、Fernet-Branca、波特酒。记住：餐前偏苦偏干（开胃），餐后偏烈偏甜（助消化）。",
    hint: "饭后喝，助消化用的",
    difficulty: 1,
  },
  {
    id: "term_bitters",
    category: "term",
    question: "苦精（Bitters）是什么？为什么几滴就能改变一杯酒？",
    answer: "苦精是高度浓缩的植物风味提取液（35-45% ABV），用几十种药草、香料、树根、果皮浸泡萃取而成。虽然只加几滴（约1-2ml），但风味强度极高——一dash 苦精相当于调酒师的盐。最经典的 Angostura Bitters 配方至今仍是商业秘密（据说是5个人分别知道配方的不同部分，没人知道完整配方）。没有苦精就没有 Old Fashioned、Manhattan、Sazerac。",
    hint: "调酒师的调味盐",
    difficulty: 2,
  },
  {
    id: "term_vermouth",
    category: "term",
    question: "味美思（Vermouth）是什么？干味美思和甜味美思的区别？",
    answer: "味美思是加了药草调味的加强葡萄酒（16-18% ABV）。干味美思（Dry Vermouth/French Vermouth）：不甜、清爽、草本味，透明淡黄色，经典用途：Dry Martini。甜味美思（Sweet Vermouth/Italian Vermouth）：甜、厚重、焦糖色、带香料味，经典用途：Negroni、Manhattan。重要提醒：味美思是葡萄酒基底的，开封后要放冰箱，4-6周内用完，不然会氧化变味。",
    hint: "调香加强葡萄酒",
    difficulty: 1,
  },
  {
    id: "term_rinse",
    category: "term",
    question: "「涮杯」（Rinse）是什么意思？为什么有的酒要涮杯？",
    answer: "Rinse = 用少量酒涮洗冰镇过的杯子内壁后倒掉，只留一层极薄的酒液和香气在杯壁上。目的是让这杯酒闻起来有某种香气但喝起来尝不到。最经典的应用：Sazerac 用苦艾酒涮杯（只闻茴香、不喝苦艾）。Rob Roy 有时用泥煤威士忌涮杯（只闻烟熏、不喝泥煤）。这是一个细腻的技术——嗅觉参与比味觉更高级。",
    hint: "只留香气不喝酒",
    difficulty: 2,
  },
  {
    id: "term_fat_wash",
    category: "term",
    question: "「脂肪浸洗」（Fat Washing）是什么？",
    answer: "将液体油脂（培根油、黄油、椰子油、芝麻油等）与烈酒混合，浸泡几小时让油脂的风味溶入酒精，然后冷冻让油脂凝固，过滤掉固体油脂，留下带有油脂风味的澄清烈酒。最著名的应用：Benton's Old Fashioned（培根油浸洗波本）。注意：Fat Washing 给的是风味而不是口感——过滤后酒体并不油腻。",
    hint: "培根味波本威士忌的秘密",
    difficulty: 3,
  },

  // ===== 基酒知识 =====
  {
    id: "spirit_gin_botanicals",
    category: "spirit",
    question: "金酒的「药草风味」来自哪里？",
    answer: "金酒的核心风味来自杜松子（Juniper Berry），这是法律上定义金酒的标准——没有杜松子就不能叫金酒。除了杜松子，各家酒厂还会加入各种 Botanicals（植物材料）：芫荽籽（柑橘香）、当归根（泥土味）、鸢尾根（定香剂）、柠檬皮、橙皮、甘草、桂皮、豆蔻等。Monkey 47 用了47种药草，Hendrick's 加了保加利亚玫瑰花瓣和黄瓜。金酒本质上是一瓶药草伏特加。",
    hint: "关键词：杜松子",
    difficulty: 1,
  },
  {
    id: "spirit_bourbon_rule",
    category: "spirit",
    question: "波本威士忌（Bourbon）的法律定义是什么？",
    answer: "美国法律规定波本必须满足：①原料至少51%是玉米；②蒸馏酒精度不超过80% ABV；③入桶陈年时酒精度不超过62.5% ABV；④必须在新烤制的美国白橡木桶中陈年（不能用旧桶）；⑤装瓶不低于40% ABV。另外波本不要求一定在肯塔基州生产——虽然95%的波本确实来自肯塔基，但法律上任何美国州都可以生产波本。",
    hint: "51%玉米 + 新橡木桶",
    difficulty: 2,
  },
  {
    id: "spirit_scotch_blend",
    category: "spirit",
    question: "单一麦芽（Single Malt）和调和（Blended）威士忌有什么区别？",
    answer: "Single Malt = 同一家蒸馏厂用100%发芽大麦在壶式蒸馏器中生产的威士忌。Blended = 多家蒸馏厂的麦芽威士忌 + 谷物威士忌的混合。Single Malt 强调个性、风土、蒸馏厂风格（像单品咖啡）。Blended 追求平衡、稳定、易饮（像拼配咖啡）。有名的 Single Malt：麦卡伦、拉弗格、阿贝。有名的 Blended：尊尼获加、芝华士、百龄坛。",
    hint: "同一家出品 vs 多家混合",
    difficulty: 1,
  },
  {
    id: "spirit_rum_types",
    category: "spirit",
    question: "白朗姆、金朗姆、黑朗姆的区别？",
    answer: "白朗姆（White/Light Rum）：陈年时间短或过滤去除颜色，口感清爽，适合 Mojito、Daiquiri。金朗姆（Gold/Amber Rum）：橡木桶陈年1-3年，有焦糖色和香草味，适合 Cuba Libre、Mai Tai。黑朗姆（Dark Rum）：重度陈年或加焦糖色，口感厚实、焦糖甜、烟熏味，适合 Dark 'n' Stormy、Hurricane。一句话：白=清爽果味，金=中庸万能，黑=厚重甜品。",
    hint: "颜色越深陈年越久",
    difficulty: 1,
  },
  {
    id: "spirit_tequila_agave",
    category: "spirit",
    question: "龙舌兰酒（Tequila）只能用蓝色龙舌兰吗？",
    answer: "是的，根据墨西哥法律，Tequila 必须用至少51%的蓝色韦伯龙舌兰（Blue Weber Agave）酿造，且只能在特定产区（主要是哈利斯科州）生产。100% Blue Agave Tequila 是顶级品质的标志。Mixto Tequila（混合龙舌兰酒）只需51%龙舌兰，其余可以加糖——便宜但容易头痛。所以买龙舌兰酒一定要看瓶子上有没有「100% Agave」的标识。",
    hint: "蓝色韦伯龙舌兰",
    difficulty: 2,
  },
  {
    id: "spirit_cognac_vs_brandy",
    category: "spirit",
    question: "干邑（Cognac）和白兰地（Brandy）是什么关系？",
    answer: "所有干邑都是白兰地，但不是所有白兰地都是干邑。白兰地 = 水果发酵蒸馏酒（最常见是葡萄）。干邑 = 在法国干邑地区用特定葡萄品种（主要是白玉霓）在铜壶蒸馏器中两次蒸馏，并在法国橡木桶中陈年至少2年的白兰地。类似关系：香槟 vs 起泡酒——产地保护。其他著名白兰地产区：雅邑（Armagnac，法国另一产区）、西班牙 Brandy de Jerez、秘鲁 Pisco。",
    hint: "香槟和起泡酒的关系",
    difficulty: 2,
  },

  // ===== 经典配方 =====
  {
    id: "recipe_negroni_ratio",
    category: "recipe",
    question: "Negroni 的三等分法则是什么？可以怎么变？",
    answer: "Negroni 标准配方 = 金酒 : 金巴利 : 甜味美思 = 1:1:1（各30ml）。这个等比例是完美的平衡点。常见的变体：①金酒换成波本 → Boulevardier（更甜更暖）；②金酒换成黑麦威士忌 → Old Pal（更辛辣）；③味美思换成苏打水 → Americano（更清爽低度）；④金酒换成龙舌兰 → Rosita（更烟熏）。Negroni 是鸡尾酒世界的模版——掌握了它，就掌握了至少十款酒的逻辑。",
    hint: "1:1:1 三等分",
    difficulty: 1,
  },
  {
    id: "recipe_old_fashioned_sugar",
    category: "recipe",
    question: "Old Fashioned 为什么必须先把方糖完全溶解？",
    answer: "Old Fashioned 的做法：方糖 + 苦精 + 少许水 → 用捣棒完全溶解 → 加威士忌 → 加冰搅拌。方糖必须完全溶解在苦精和水中后再加威士忌，否则杯底会有未溶解的糖粒。当客人喝到最后一口，如果碰到沙沙的糖粒，他会认为这杯酒做得匆忙。这是鸡尾酒世界里最经典的反面教材——细节见真章。",
    hint: "杯底不能有糖粒",
    difficulty: 1,
  },
  {
    id: "recipe_dry_martini_ratio",
    category: "recipe",
    question: "Dry Martini 的金酒和味美思比例是多少？",
    answer: "没有固定答案，这可能是鸡尾酒世界里最个人化的参数。从 3:1（经典）、6:1（干）、到 15:1（极干）、到丘吉尔的「只看一眼味美思瓶子」（开玩笑）。现代精酿酒吧的默认值大约是 5:1 到 6:1。建议：第一次喝先试 4:1，感觉自己喜欢更干还是更湿再调整。点酒的时候可以直接说比例，比如 6:1 Dry Martini——调酒师会尊重你的偏好。",
    hint: "非常个人化，从3:1到无限",
    difficulty: 1,
  },
  {
    id: "recipe_daiquiri_fresh_lime",
    category: "recipe",
    question: "Daiquiri 为什么必须用新鲜青柠汁？",
    answer: "Daiquiri 只有三种材料：朗姆酒、青柠汁、糖。它没有任何可以躲藏的地方——每一种材料都赤裸裸地暴露在味蕾上。瓶装青柠汁氧化后会产生金属味和苦味，会完全毁掉这杯酒。海明威最爱的 Daiquiri 变体（Papa Doble）用双倍朗姆、无糖、加樱桃利口酒——他在哈瓦那的 El Floridita 酒吧一天能喝十几杯。",
    hint: "三种材料，无处可藏",
    difficulty: 1,
  },
  {
    id: "recipe_manhattan_rye",
    category: "recipe",
    question: "Manhattan 应该用黑麦威士忌还是波本？",
    answer: "传统上 Manhattan 用黑麦威士忌（Rye Whiskey），因为黑麦的辛辣感和甜味美思的甜形成对比。但波本 Manhattan 也有大量拥护者——波本的香草甜和味美思的焦糖甜互相叠加，整体更圆润更甜。规则：如果你喜欢辛辣、有棱角的 → 黑麦；喜欢圆润、甜美的 → 波本。至于 Perfect Manhattan（干+甜味美思各半），建议用黑麦——否则甜味会太多。",
    hint: "传统是黑麦，但波本也行",
    difficulty: 2,
  },
  {
    id: "recipe_gin_fizz_egg",
    category: "recipe",
    question: "Gin Fizz 为什么加蛋清？不加蛋清叫什么？",
    answer: "加蛋清的叫 Gin Fizz 或 Silver Fizz（银菲士），蛋清提供了绵密的泡沫口感和丝滑的质地。不加蛋清的 Gin Fizz 本质上就是金酒+柠檬+糖+苏打水。如果加整颗蛋（蛋黄+蛋清）叫 Golden Fizz（黄金菲士）。如果加奶油叫 Ramos Gin Fizz——新奥尔良的传奇，需要干摇2分钟，调酒师的手臂杀手。",
    hint: "有没有蛋清影响名字",
    difficulty: 2,
  },
  {
    id: "recipe_margarita_triple_sec",
    category: "recipe",
    question: "Margarita 的三种核心材料是什么？比例？",
    answer: "Margarita = 龙舌兰 + 橙皮利口酒（Triple Sec/Cointreau）+ 新鲜青柠汁。经典比例 2:1:1（龙舌兰60ml : 橙皮利口酒30ml : 青柠汁30ml）。关键细节：①杯口蘸盐（只用半个杯口——留一半让客人选择）；②必须用新鲜青柠汁（和 Daiquiri 一样的道理）；③橙皮利口酒品质决定成败——用 Cointreau 比廉价 Triple Sec 好一万倍。",
    hint: "龙舌兰+橙皮利口酒+青柠汁",
    difficulty: 1,
  },
  {
    id: "recipe_bloody_mary_complex",
    category: "recipe",
    question: "Bloody Mary 为什么被称为「液体沙拉」？",
    answer: "Bloody Mary 的材料之多令人惊叹：伏特加、番茄汁、柠檬汁、伍斯特酱、辣酱（Tabasco）、盐、黑胡椒、芹菜盐、甚至还有蚝汁或培根伏特加。它不止是鸡尾酒，几乎是一道菜——有液体、有盐分、有辣味、有鲜味、有蔬菜装饰（芹菜杆、腌黄瓜、橄榄、柠檬角）。而且它是少数适合宿醉时喝的酒（番茄汁补钾、辣味提神），被称为「以酒解酒」的代表。",
    hint: "不止是酒，像一道菜",
    difficulty: 1,
  },
  {
    id: "recipe_whiskey_sour_variants",
    category: "recipe",
    question: "Whiskey Sour 加入蛋清后叫什么？有什么变化？",
    answer: "加蛋清的叫 Boston Sour（波士顿酸）。变化：蛋清提供丝滑的口感和厚厚的白色泡沫层，让酸味变得更柔和，整体口感从清爽型变成绵密型。如果加红酒浮面（红葡萄酒沿吧勺浮在泡沫上）叫 New York Sour（纽约酸）——红酒的果香和单宁和泡沫一起入口，层次感极好。不加蛋清的基础版就是普通 Whiskey Sour。",
    hint: "加蛋清叫波士顿酸",
    difficulty: 2,
  },
  {
    id: "recipe_mojito_mint",
    category: "recipe",
    question: "Mojito 的薄荷应该怎么处理？",
    answer: "关键：轻拍或轻捣（2-3下即可），不要碾碎！把薄荷叶放在掌心拍一下释放香气，或者用捣棒在杯底轻轻按压2-3下。过度捣压会让薄荷叶变黑、变苦、释放叶绿素的生草味。正确做法：薄荷叶+糖浆在杯底轻捣→加青柠汁→加朗姆酒→加碎冰搅拌→苏打水补满→放几片完整薄荷叶做装饰。Mojito 的灵魂是薄荷的清爽，不是薄荷的苦味。",
    hint: "轻拍轻捣，不要碾碎",
    difficulty: 1,
  },
  {
    id: "recipe_espresso_martini_shake",
    category: "recipe",
    question: "Espresso Martini 为什么需要用力长时间摇晃？",
    answer: "Espresso Martini 的标志性特征是一层厚厚的咖啡色泡沫（Crema）。这层泡沫来自浓缩咖啡中的油脂和糖在剧烈摇晃中乳化产生的气泡。所以必须：①用现萃的热浓缩咖啡（油脂最丰富，瓶装咖啡几乎没油脂）；②加冰后用力长时间摇晃（20-30秒以上）；③摇完立刻过滤倒入杯中，不要让它静置。咖啡油脂越多、摇得越狠，泡沫越厚越持久。",
    hint: "为了那层标志性的咖啡泡沫",
    difficulty: 2,
  },

  // ===== 原料知识 =====
  {
    id: "ingredient_vermouth",
    category: "ingredient",
    question: "味美思（Vermouth）是什么？干和甜有什么区别？",
    answer: "味美思是加了药草调味的加强葡萄酒（16-18% ABV）。干味美思（Dry/French）：不甜、清爽、草本、透明淡黄，经典用途是 Dry Martini。甜味美思（Sweet/Italian）：甜、厚重、焦糖色、香料味，经典用途是 Negroni 和 Manhattan。关键提醒：味美思是葡萄酒基底的，开封后必须放冰箱，4-6周内用完，否则氧化变味。一瓶在常温下放了半年的味美思已经不是味美思了——它变成了醋。",
    hint: "调香加强葡萄酒，开封要冷藏",
    difficulty: 1,
  },
  {
    id: "ingredient_campari",
    category: "ingredient",
    question: "金巴利（Campari）和 Aperol 有什么区别？能互相替代吗？",
    answer: "金巴利：25% ABV，苦味重、药草味浓郁、深红色。意大利苦味利口酒的代表。Aperol：11% ABV，甜味为主、苦味轻微、橙色更浅。不能直接替代——金巴利是苦味的，Aperol 是甜的。Negroni 用 Aperol 替代金巴利会变成完全不同的酒（更甜更淡）。Aperol Spritz 只能用 Aperol——用金巴利会苦到没法喝。",
    hint: "一个苦一个甜，不能互换",
    difficulty: 1,
  },
  {
    id: "ingredient_triple_sec",
    category: "ingredient",
    question: "Triple Sec、Cointreau、Grand Marnier 有什么区别？",
    answer: "三者都是橙皮利口酒，但完全不同。Triple Sec = 通用橙皮利口酒（15-40% ABV），最基础最便宜，Margarita 的默认选择。Cointreau（君度）= 高端 Triple Sec（40% ABV），用甜橙皮和苦橙皮混合蒸馏，清澈透明，风味纯净。Grand Marnier（柑曼怡）= 干邑基底的橙皮利口酒（40% ABV），颜色较深、口感更厚重、有白兰地的层次。一句话：便宜做 Margarita 用 Triple Sec，认真做用 Cointreau，做甜点或纯饮用 Grand Marnier。",
    hint: "都是橙皮酒，品质和基底完全不同",
    difficulty: 2,
  },
  {
    id: "ingredient_syrup",
    category: "ingredient",
    question: "单糖浆（Simple Syrup）和浓糖浆（Rich Syrup）的区别？",
    answer: "单糖浆 = 糖:水 = 1:1（按重量），浓度约50%。浓糖浆 = 糖:水 = 2:1，浓度约66%。浓糖浆更甜更稠，用量更少就能达到同样的甜度，而且因为糖浓度高不易变质、冷藏可保存数月。单糖浆流动性更好（更容易和其他材料融合），但需要更频繁地制作（易发酵）。大多数经典配方用单糖浆，但现代精酿酒吧倾向用浓糖浆——用量少、保质期长、稀释少。蜂蜜糖浆（Honey Syrup）= 蜂蜜:水 = 2:1 或 3:1，用于 Bee's Knees、Gold Rush 等。",
    hint: "糖水比例不同，浓糖浆更耐放",
    difficulty: 2,
  },
  {
    id: "ingredient_bitters_types",
    category: "ingredient",
    question: "苦精有哪些种类？各有什么用途？",
    answer: "Angostura Bitters（特立尼达和多巴哥）：最经典的芳香苦精，肉桂+丁香的暖香料味。Old Fashioned、Manhattan 的灵魂。Peychaud's Bitters（新奥尔良）：更轻更甜，有茴香和薄荷味，颜色更红。Sazerac 专用。Orange Bitters（橙味苦精）：橙皮风味，Dry Martini 的秘密武器——加入几滴让整杯酒多一层柑橘香气。其他常见：Chocolate Bitters（巧克力苦精，配陈年朗姆或威士忌）、Celery Bitters（芹菜苦精，Bloody Mary 提升鲜味）、Grapefruit Bitters（葡萄柚苦精，配龙舌兰酒）。",
    hint: "不同苦精就像不同的调味盐",
    difficulty: 2,
  },
  {
    id: "ingredient_lemon_lime",
    category: "ingredient",
    question: "柠檬和青柠在调酒中能互换吗？",
    answer: "不能。柠檬（Lemon）和青柠（Lime）的酸度、香气、甜度完全不同。柠檬：pH约2.0-2.6，酸味圆润带甜感，香气明亮清新。青柠：pH约2.0-2.4，酸味更尖锐更「绿色」，香气更浓郁更有辨识度。规则：金酒和朗姆偏爱青柠（Daiquiri、Mojito、Gimlet），威士忌和白兰地偏爱柠檬（Whiskey Sour、Sidecar）。例外：Margarita 必须用青柠（不用柠檬），Tom Collins 必须用柠檬（不用青柠）。替换会让酒彻底变味，不建议。",
    hint: "酸的方向不一样，不能随便换",
    difficulty: 1,
  },
  {
    id: "ingredient_egg",
    category: "ingredient",
    question: "调酒中蛋清的作用是什么？有什么用？",
    answer: "蛋清在鸡尾酒中有三个作用：①泡沫——干摇后蛋清打发成绵密细腻的白色泡沫，是 Gin Fizz、Whiskey Sour 的标志性外观；②口感——泡沫让酒体丝滑绵密，酸味变得圆润不刺激；③香气载体——泡沫能锁住酒的香气，喝的时候泡沫先接触嘴唇和鼻子，形成第一层风味体验。现代替代方案：鹰嘴豆水（Aquafaba，素食版蛋清替代品），效果接近但略有豆腥味。安全提示：新鲜鸡蛋的沙门氏菌风险极低，但孕妇和免疫功能低下者建议避免生蛋清。",
    hint: "泡沫、口感、香气三个作用",
    difficulty: 2,
  },
  {
    id: "ingredient_ice",
    category: "ingredient",
    question: "冰块在调酒中为什么这么重要？大冰小冰有什么区别？",
    answer: "冰块是鸡尾酒中被低估最多的材料。作用：①冷却（最基本）；②稀释（融化出的水是配方的一部分，不是失误）；③控制——不同大小和形状的冰融化速度不同。大冰块（Ice Cube/Rock）：表面积/体积比小，融化慢，适合短饮（Negroni、Old Fashioned）——慢慢喝不稀释太快。碎冰（Crushed Ice）：表面积大，融化快，适合热带长饮（Mint Julep、Swizzle类）——需要快速冷却和大量稀释。冰球（Ice Sphere）：最慢融化，纯饮威士忌首选。关键：冰块必须是新鲜透明的（不是冰箱里放了三天的混浊陈冰）——混浊说明里面含气泡和杂质，会更快融化并带来异味。",
    hint: "冰不只是降温，融化的水是配方的一部分",
    difficulty: 2,
  },
  {
    id: "ingredient_soda_tonic",
    category: "ingredient",
    question: "苏打水、汤力水、姜汁啤酒有什么区别？",
    answer: "苏打水（Soda Water/Club Soda）= 纯碳酸水，无味无糖，提供气泡和稀释。汤力水（Tonic Water）= 碳酸水+奎宁（苦味）+糖，有独特的微苦风味。金汤力用汤力水，不是苏打水。姜汁啤酒/姜汁汽水（Ginger Beer/Ginger Ale）= 碳酸水+姜味+糖。Ginger Beer 姜味更辣更浓（Moscow Mule、Dark 'n' Stormy），Ginger Ale 姜味更淡更甜。三者不能互换——把汤力水换成苏打水会毁掉金汤力，把姜汁啤酒换成苏打水会让 Moscow Mule 变成一杯无聊的伏特加苏打。",
    hint: "一个有奎宁苦味，一个有姜辣味，一个什么都没有",
    difficulty: 1,
  },
  {
    id: "ingredient_maraschino",
    category: "ingredient",
    question: "黑樱桃利口酒（Maraschino）和樱桃糖浆是一回事吗？",
    answer: "完全不是。Maraschino（黑樱桃利口酒）= 用 Marasca 樱桃（包括果肉和压碎的樱桃核）蒸馏而成的无色利口酒（32% ABV），有独特的杏仁和樱桃核苦味。樱桃糖浆 = 樱桃+糖熬的红色甜浆，就是调色的。Maraschino 是 Aviation、Last Word、Martinez 等经典鸡尾酒的灵魂材料——几滴就能改变整杯酒的风味走向。代表品牌：Luxardo Maraschino（意大利），白瓶绿标。提醒：Maraschino 风味极其浓郁，加多了会盖过所有其他材料——通常只需 5-15ml。",
    hint: "不是糖浆，是带杏仁味的烈性利口酒",
    difficulty: 2,
  },

  // ===== 鸡尾酒历史 =====
  {
    id: "history_prohibition",
    category: "history",
    question: "美国禁酒令（1920-1933）对鸡尾酒文化有什么影响？",
    answer: "禁酒令（Prohibition）是美国鸡尾酒史上最重要的事件。影响：①大批美国调酒师逃往欧洲、古巴、墨西哥——哈瓦那和巴黎成为新的鸡尾酒中心；②地下酒吧（Speakeasy）爆发——纽约从禁酒前的约15000家酒吧变成禁酒期的约32000家地下酒吧（是的，反而更多了）；③劣质私酿酒横行——为了遮掩劣酒的味道，调酒师加更多果汁、糖浆和利口酒，意外催生了大量果味鸡尾酒；④鸡尾酒文化国际化——逃到欧洲的美国调酒师在欧洲精英酒店传播鸡尾酒文化，1920年代的巴黎和伦敦成为鸡尾酒的黄金时代。《了不起的盖茨比》里的派对场景就是禁酒令时期的地下酒吧文化。",
    hint: "禁酒反而催生了地下酒吧和鸡尾酒国际化",
    difficulty: 1,
  },
  {
    id: "history_tiki",
    category: "history",
    question: "Tiki 文化是什么？它和鸡尾酒有什么关系？",
    answer: "Tiki 文化起源于1930年代的美国。Donn Beach（Don the Beachcomber）在好莱坞开了第一家 Tiki 酒吧——用朗姆酒、热带果汁、神秘香料和夸张的波利尼西亚风格装饰，把喝醉伪装成「去南太平洋度了个假」。1940年代 Victor「Trader Vic」Bergeron 发明了 Mai Tai——Tiki 文化最标志性的鸡尾酒。Tiki 文化的核心精神是「逃避现实」——二战后人们渴望热带度假的感觉，Tiki 酒吧提供了三个小时的假。Tiki 鸡尾酒的特点：多款朗姆酒混合、复杂香料（多香果、肉桂、肉豆蔻）、大量碎冰、夸张的陶瓷杯和水果装饰。今天，Tiki 文化在精酿鸡尾酒运动中复兴。",
    hint: "朗姆+热带+逃避现实的幻想",
    difficulty: 2,
  },
  {
    id: "history_martini_evolution",
    category: "history",
    question: "马天尼（Martini）是怎样从甜变干的？",
    answer: "19世纪末的 Martini（当时叫 Martinez）是甜的——用老汤姆金酒（偏甜）+ 甜味美思 + 黑樱桃利口酒。20世纪初，伦敦干金酒（不甜）取代老汤姆金酒，Martini 的甜度开始下降。禁酒令时期（1920-1933），私酿金酒品质太差，调酒师减少味美思用量来遮掩劣酒味道——意外让「Dry」成为一种风格。二战后，Dry Martini 成为文化符号——丘吉尔、海明威、弗兰克·辛纳屈都是 Dry Martini 的忠实拥趸。到了1960年代，极干 Martini（15:1甚至纯粹金酒）成为主流。今天，趋势回归平衡——精酿酒吧的 Dry Martini 通常在 5:1 到 6:1 之间。",
    hint: "从甜到干，禁酒令是关键转折点",
    difficulty: 2,
  },
  {
    id: "history_cocktail_origin",
    category: "history",
    question: "「鸡尾酒」（Cocktail）这个词是怎么来的？",
    answer: "没人确切知道，但有几种主流理论：①马尾巴说——赛马比赛中，混血马（不是纯种马）的尾巴会被剪短（cock tail），引申为「混合的酒」；②公鸡尾说——用公鸡尾羽装饰酒杯的旧习俗；③法国杯说——来自法式蛋杯（Coquetier），发音被英语化了。最早的文字记载：1806年纽约《The Balance》报纸定义 Cocktail 为「烈酒+糖+水+苦精的混合物」——其实就是 Old Fashioned 的配方。所以严格来说，最早的「鸡尾酒」就是 Old Fashioned。后来 Cocktail 的定义扩展到所有混合酒精饮品。",
    hint: "最早的定义就是 Old Fashioned 的配方",
    difficulty: 2,
  },
  {
    id: "history_jerry_thomas",
    category: "history",
    question: "谁是「鸡尾酒之父」？",
    answer: "Jerry Thomas（杰瑞·托马斯，1830-1885）被广泛认为是「美国调酒之父」。他在1862年出版了世界上第一本鸡尾酒书《How to Mix Drinks / The Bon Vivant's Companion》（调酒师指南）。他的标志性作品是 Blue Blazer——将燃烧的威士忌在两个金属杯之间来回倾倒，形成一道蓝色火焰弧线。这是19世纪最有表演性的调酒技法，也是 Rolling 技法的起源。Jerry Thomas 的传奇不只在于配方——他定义了「调酒师」这个职业：一个集技术、表演、社交和品味于一体的角色。他在纽约、旧金山、伦敦等地的酒吧都工作过，是调酒师中第一个真正的明星。",
    hint: "1862年写了第一本鸡尾酒书",
    difficulty: 2,
  },
  {
    id: "history_speakeasy",
    category: "history",
    question: "地下酒吧（Speakeasy）的名字是怎么来的？",
    answer: "禁酒令时期（1920-1933），非法经营的酒吧需要保密。Speakeasy 的字面意思是「轻声说话」——因为顾客被要求在酒吧里压低声音说话，避免被外面的警察听到。进入地下酒吧通常需要通过暗门（藏在书架后面、电话亭里、甚至殡仪馆的地下室），并且需要说出当天的密码。地下酒吧也是鸡尾酒民主化的重要推手——因为男女都可以去（不像禁酒令之前，正经女人不能单独去酒吧），女性顾客的出现改变了鸡尾酒的口味方向——更甜、更果味、更「好喝」而非「够烈」。如今「Speakeasy」风格的隐藏式酒吧仍然是精酿鸡尾酒界的一大趋势。",
    hint: "禁酒令时期要求顾客小声说话",
    difficulty: 1,
  },

  // ===== 餐酒搭配 =====
  {
    id: "pairing_steak",
    category: "pairing",
    question: "什么鸡尾酒配牛排最好？",
    answer: "牛排的油脂和焦香需要一个能「切断」它的酒——有结构感的、偏干的、带有苦味或草本味的鸡尾酒。首选：Manhattan（黑麦版）——黑麦的辛辣感和甜味美思的焦糖甜与牛排的焦香完美呼应。备选：Negroni——金巴利的苦味像红葡萄酒的单宁，能清洁口腔。Old Fashioned（波本版）——波本的香草甜配炭烤牛排。原则：牛排不要配酸甜果汁类鸡尾酒（Daiquiri、Margarita 都不适合），也不要配奶油类（Alexander 配牛排会很奇怪）。",
    hint: "有结构感的烈酒类鸡尾酒",
    difficulty: 2,
  },
  {
    id: "pairing_seafood",
    category: "pairing",
    question: "什么鸡尾酒配海鲜？",
    answer: "海鲜讲究清爽、干净、不抢夺食材的鲜味。首选：Dry Martini——干净利落，不会盖过生蚝或鱼肉的精致风味。Gin and Tonic——汤力水的微苦和奎宁味与海鲜的咸鲜味（Umami）是天作之合。White Lady（白色佳人）——金酒+柠檬+橙皮利口酒，清爽柑橘调，配白身鱼或虾。避免：威士忌类（太重）、甜奶油类（会盖过海鲜的鲜味）、红酒基底的（单宁会放大腥味）。日式刺身最适合配 Gin Fizz 或加了紫苏的金酒调酒。",
    hint: "清爽干净的风格，不抢夺鲜味",
    difficulty: 2,
  },
  {
    id: "pairing_dessert",
    category: "pairing",
    question: "什么鸡尾酒配甜点？",
    answer: "鸡尾酒配甜点有一个「甜度规则」：酒必须比甜点更甜或者同等甜度——如果酒比甜点干（不甜），酒会显得酸涩难喝。首选：Alexander（白兰地+可可+奶油）——液体提拉米苏，配巧克力甜点。Espresso Martini——咖啡+伏特加，配提拉米苏或咖啡甜点。Porto Flip（波特酒+蛋黄）——配坚果或焦糖甜点。配水果甜点：Daiquiri 或 Margarita（酸甜可以平衡甜点的甜度）。配奶酪（非甜点但常作为结尾）：Manhattan 或 Old Fashioned——烈酒和威士忌的复杂度能匹配陈年奶酪的浓郁。",
    hint: "酒要比甜点更甜，否则会显酸涩",
    difficulty: 2,
  },
  {
    id: "pairing_chinese",
    category: "pairing",
    question: "什么鸡尾酒配中餐？",
    answer: "中餐的复杂调味（酱油、花椒、豆瓣、醋、糖同时存在）对配酒是一个挑战。总原则：避开单宁重的红酒和过于复杂的烈酒，选择清爽干净的酒。川菜（麻辣）：适合 Gin and Tonic——苦味和草本味能抚慰麻感，气泡清洁口腔。粤菜（清淡鲜）：适合 French 75（金酒+香槟+柠檬）——气泡优雅、不抢夺食材鲜味。北京烤鸭：适合 Boulevardier（波本+金巴利+甜味美思）——波本的甜和烤鸭的焦糖皮呼应，苦味解腻。火锅：Mojito 或 Caipirinha——清爽酸甜能对抗油腻和辣味。",
    hint: "清爽干净，避开单宁和过烈的酒",
    difficulty: 2,
  },

  // ===== 名人与鸡尾酒 =====
  {
    id: "celebrity_hemingway",
    category: "history",
    question: "海明威和鸡尾酒有什么关系？",
    answer: "海明威可能是鸡尾酒史上最著名的酒鬼作家。他的标配：①Papa Doble（海明威特调 Daiquiri）——双倍朗姆、不加糖、加黑樱桃利口酒和葡萄柚汁，在哈瓦那 El Floridita 酒吧每天能喝十几杯；②Dry Martini——极干版（15:1），他在《太阳照常升起》中多次写到马天尼；③Death in the Afternoon——海明威发明的酒：苦艾酒+冰镇香槟，以他的同名斗牛著作为名。海明威说过一句被调酒师们又爱又恨的话：「不要为了别的东西放弃喝酒。喝酒是人生最爽的事情之一。」",
    hint: "Papa Doble 和 Death in the Afternoon",
    difficulty: 2,
  },
  {
    id: "celebrity_churchill",
    category: "history",
    question: "丘吉尔的马天尼到底怎么调的？",
    answer: "温斯顿·丘吉尔对 Dry Martini 的著名描述：「在金酒中加冰，然后向法国方向看一眼味美思瓶子。」这句玩笑被误解了很多年。实际上，丘吉尔的「配方」是：冰镇金酒倒入杯中，对着墙上一瓶未开封的 Noilly Prat 干味美思鞠躬（以示尊重），然后喝酒。这不是真的配方——丘吉尔是在讽刺那些越来越极端的 Dry Martini 派系（「我的比你更干」的攀比游戏）。事实上，丘吉尔确实喜欢非常干的马天尼，但他更多时候喝的是威士忌（Johnnie Walker Red Label + 大量苏打水）和 Pol Roger 香槟。",
    hint: "看一眼味美思瓶子就够了（是玩笑）",
    difficulty: 1,
  },
  {
    id: "celebrity_bond",
    category: "history",
    question: "007 的「Shaken, not stirred」马天尼真的是马天尼吗？",
    answer: "詹姆斯·邦德在《皇家赌场》中点的 Vesper Martini = 金酒 + 伏特加 + Kina Lillet（已停产的苦味开胃酒），「Shaken, not stirred」（摇的，不要搅拌）。这杯酒有三个争议：①按传统标准这不是马天尼——加了伏特加和 Kina Lillet 而不是干味美思；②Shaken 不是 Martini 的正确做法——全酒精类应该搅拌而不是摇和，摇和马天尼会产生气泡和碎冰让酒变浑浊；③但邦德的做法其实有其逻辑——摇和比搅拌的稀释度更高（约多40%稀释），酒精度更快下降。所以 Shaken Martini 实际上是更淡更水润的版本——适合一个需要保持清醒的特工。邦德效应让全世界无数人点了错误的马天尼。",
    hint: "他的做法其实是让酒更淡更水",
    difficulty: 2,
  },

  // ===== 进阶技法 =====
  {
    id: "technique_smoke",
    category: "technique",
    question: "烟熏技法在调酒中怎么用？",
    answer: "烟熏（Smoking）是近年精酿酒吧的热门技法。三种方式：①烟熏枪（Smoking Gun）——点燃木片（樱桃木、苹果木、山核桃木），将烟雾注入密闭的容器中盖住酒杯，烟熏30-60秒后移开，酒体带有淡淡的木烟味；②烟熏杯（Smoked Glass）——直接用烟熏枪喷杯子内壁（空杯），烟附着在杯壁上，倒酒后烟味慢慢释放；③燃木法——用喷枪灼烧一小块橡木或肉桂棒，将燃烧的木头放在杯口上方，用酒杯扣住捕获烟雾。适合烟熏的酒：Old Fashioned（烟熏波本）、Negroni（烟熏金巴利）、Manhattan。禁忌：不要烟熏含奶油或蛋清的酒——烟熏味和奶味冲突。",
    hint: "木头燃烧的烟熏味，配威士忌类最佳",
    difficulty: 3,
  },
  {
    id: "technique_clarification",
    category: "technique",
    question: "「澄清」（Clarification）是什么？怎么做？",
    answer: "澄清是将浑浊的鸡尾酒（含果汁、奶制品）变成清澈透明的液体的技法。最经典的方法是牛奶澄清法（Milk Punch）：将酸性混合酒液（含柠檬汁）缓慢倒入牛奶中，柠檬酸会让牛奶蛋白凝结形成絮状物，这些絮状物会「捕获」酒液中的色素、单宁和浑浊颗粒。然后通过咖啡滤纸或超细滤网缓慢过滤，最终得到一杯像白水一样清澈但风味浓郁的酒。这个过程需要4-12小时。这听起来很化学，它确实是——蛋白质凝结和吸附是纯粹的食品科学。经典例子：Clarified Milk Punch、Clarified Piña Colada（透明菠萝椰奶酒）。",
    hint: "让浑浊的酒变清澈，牛奶是澄清剂",
    difficulty: 4,
  },
  {
    id: "technique_carbonation",
    category: "technique",
    question: "调酒中如何给酒加碳酸（Carbonation）？",
    answer: "除了直接加苏打水，精酿酒吧还会用碳酸化器（Carbonator）或苏打枪给整杯酒加碳酸。原理和做苏打水一样：将混合好的酒液（不含冰块）装入碳酸瓶，注入 CO₂，摇晃让气体溶解。效果：整杯酒均匀地带有气泡（不是表面几层），口感更绵密细滑。适合碳酸化的酒：Negroni Sbagliato（碳酸化 Negroni，用气泡酒替代金酒）、Americano、含果汁的清爽长饮。注意：①含果肉的酒会堵住气瓶阀门；②奶油类酒不能碳酸化（会凝结）；③高度烈酒（>30% ABV）碳酸化后再开瓶会喷。",
    hint: "不是加苏打水，是给酒打气",
    difficulty: 4,
  },
  {
    id: "technique_infusion",
    category: "technique",
    question: "烈酒浸渍（Infusion）怎么做？有哪些经典配方？",
    answer: "浸渍 = 将风味材料（水果、草本、香料、茶、咖啡）泡在烈酒中，让酒精萃取风味。基础方法：材料放入密封罐 → 倒入烈酒 → 每天摇晃一次 → 2-7天后过滤 → 得到风味烈酒。时间控制很重要：草本（薄荷、罗勒）24-48小时足矣（泡久了变苦）；水果（草莓、菠萝）3-5天；香料（肉桂、香草）5-7天；茶（伯爵茶、焙茶）1-2小时即可（过度萃取会苦涩）。经典配方：菠萝朗姆（菠萝块+白朗姆泡3天）、草莓金酒、伯爵茶金酒（Earl Grey Gin）、辣椒龙舌兰（Serrano 辣椒去籽+龙舌兰泡2小时）。浸渍是调酒师创造「独家基酒」的最简单方法。",
    hint: "用烈酒浸泡风味材料，时间和比例很重要",
    difficulty: 3,
  },
]

/**
 * 从数据库中已加载的数据生成鸡尾酒相关的卡片
 */
function generateCocktailCards(cocktails, methodsMap, tipsMap, attrsMap) {
  const cards = []

  cocktails.forEach((c) => {
    const method = methodsMap[c.eng]
    const tip = tipsMap[c.eng]
    const attrs = attrsMap[c.eng]
    const chnName = (c.chn || c.eng).replace(/[（(][^）)]*[）)]/g, "").trim()
    const mainSpirit = c.ingredients?.[0]?.replace(/\d+\s*(毫升|ml|oz|份)\s*/, "").trim() || "未知"

    const diff = attrs?.difficulty || 1
    const diffLabel = diff === 1 ? "简单" : diff === 2 ? "中等" : diff === 3 ? "进阶" : "挑战"

    // 卡1：主基酒识别
    if (c.ingredients?.length >= 1) {
      cards.push({
        id: `cocktail_spirit_${c.eng.toLowerCase().replace(/\s+/g, "_")}`,
        category: "cocktail",
        question: `${chnName}（${c.eng}）的主基酒是什么？`,
        answer: `主基酒是 ${mainSpirit}。完整配方：${c.ingredients.join("、")}。`,
        hint: `${c.cat || "经典鸡尾酒"} · 共${c.ingredients.length}种原料`,
        difficulty: diff,
        source: c.eng,
      })
    }

    // 卡2：调制手法
    if (method) {
      cards.push({
        id: `cocktail_method_${c.eng.toLowerCase().replace(/\s+/g, "_")}`,
        category: "technique",
        question: `${chnName} 用什么手法调制？用的是什么杯型？`,
        answer: `调制手法：${method.method}，杯型：${method.glass}。步骤：${method.steps.join(" → ")}。装饰：${method.garnish || "无特殊装饰"}。`,
        hint: `${diffLabel}难度 · ${method.method}`,
        difficulty: diff,
        source: c.eng,
      })
    }

    // 卡3：调酒tips
    if (tip) {
      cards.push({
        id: `cocktail_tip_${c.eng.toLowerCase().replace(/\s+/g, "_")}`,
        category: "tip",
        question: `${chnName} 的调酒关键提醒是什么？`,
        answer: tip,
        hint: `${chnName} · 调酒师私房提醒`,
        difficulty: diff,
        source: c.eng,
      })
    }

    // 卡4：口感特征
    if (attrs?.taste_tags?.length) {
      cards.push({
        id: `cocktail_taste_${c.eng.toLowerCase().replace(/\s+/g, "_")}`,
        category: "cocktail",
        question: `${chnName} 的口感特征是什么？`,
        answer: `口感标签：${attrs.taste_tags.join("、")}。难度：${diffLabel}（${"⭐".repeat(diff)}）。适合场景：${(attrs.occasion || ["任意"]).join("、")}。`,
        hint: `${chnName} · ${attrs.taste_tags.slice(0, 3).join(" · ")}`,
        difficulty: diff,
        source: c.eng,
      })
    }
  })

  return cards
}

module.exports = {
  STATIC_CARDS,
  generateCocktailCards,
}
