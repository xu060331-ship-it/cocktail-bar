// ====== 调酒知识百科数据 ======

const ENCYCLOPEDIA = {
  technique: {
    label: "调酒手法",
    emoji: "🔧",
    description: "从摇和到分层，每一种手法背后的原理与技巧。",
    entries: [
      {
        id: "shake",
        title: "摇和法（Shake）",
        summary: "最常用的调酒手法之一。将材料与冰在摇酒壶中剧烈摇晃，实现冷却、混合、稀释、乳化四种效果。",
        detail: [
          { subtitle: "适用场景", content: "配方中含有果汁、奶油、蛋清、糖浆等非酒精液体时必须使用摇和法。典型代表：Daiquiri、Whiskey Sour、Margarita、Gin Fizz。" },
          { subtitle: "为什么不能用搅拌替代？", content: "搅拌的能量不足以让果汁与烈酒充分融合，也无法让蛋清或奶油产生泡沫。摇和产生的剧烈碰撞让水分子与油脂充分乳化，酒体更丝滑。" },
          { subtitle: "手法要点", content: "双手握住摇酒壶，大块在下方、小杯在上方。用身体的力量而非手腕的力量来摇——肩膀带动手臂，节奏均匀，持续10-15秒。听到冰块声音从清脆变得闷钝，壶壁起霜发白时即可停止。" },
          { subtitle: "常见错误", content: "❌ 摇的时间太短（酒不够冷不够融合）\n❌ 摇的时间太长（冰融化过多，过度稀释）\n❌ 只用腕力（肩膀发力更持久，乳化效果更好）\n❌ 大块小杯方向反了（小杯应在上面，防止泄漏）" },
          { subtitle: "日式硬摇（Hard Shake）", content: "日本调酒大师上田和男发明的标志性技法。三节式摇酒壶、立体三角运动轨迹、精确到秒的节奏控制。硬摇追求的不是力量而是控制——每一块冰的运动轨迹都被精确计算，最大化冷却效率的同时最小化气泡和碎冰。" },
        ],
        related: ["stir", "dry_shake"],
      },
      {
        id: "stir",
        title: "搅拌法（Stir）",
        summary: "用于全酒精类鸡尾酒的温和调合法。用吧勺在搅拌杯中旋转，冷却稀释同时保持酒体清澈丝滑。",
        detail: [
          { subtitle: "适用场景", content: "配方中全部为酒精类材料时使用搅拌法。典型代表：Dry Martini、Manhattan、Negroni、Old Fashioned。" },
          { subtitle: "为什么不用摇和？", content: "全酒精类鸡尾酒追求的是清澈透亮的视觉效果和丝滑如绸的口感。摇和会产生气泡和微碎冰，让酒体变得浑浊——马天尼应该是透明如水的，而不是雾蒙蒙的。" },
          { subtitle: "手法要点", content: "吧勺背部贴着搅拌杯内壁，用指尖捻动勺柄旋转。冰块应该饱满填充杯体，勺子在冰块缝隙间旋转而非铲冰。搅拌30-45秒，当杯壁起霜、手指感觉明显变冷时停止。关键：看杯壁起霜的程度判断何时停止——起霜太薄说明不够冷，杯壁开始滴水说明过度稀释。" },
          { subtitle: "常见错误", content: "❌ 用勺面铲冰（会碎冰出水，稀释过快）\n❌ 搅拌速度太快（产生气泡，破坏丝滑口感）\n❌ 搅拌时间不足（酒体温热，材料未充分融合）" },
        ],
        related: ["shake", "strain"],
      },
      {
        id: "dry_shake",
        title: "干摇（Dry Shake）",
        summary: "不加冰先摇的技法。主要用于含蛋清的鸡尾酒，让蛋清在室温下充分打发成绵密泡沫。",
        detail: [
          { subtitle: "为什么要干摇？", content: "蛋清在室温下更容易打发——这是烘焙和调酒共同的原理。如果直接加冰，蛋清遇冷变稠、蛋白质凝结，打不出泡沫。先干摇乳化蛋清，再加冰湿摇冷却稀释，两步走。" },
          { subtitle: "手法要点", content: "将蛋清与其他材料加入摇酒壶（不加冰），用力摇晃1-2分钟。感觉到壶内液体变稠、听到的声音从水声变成闷响，说明蛋清已经打发。然后再加冰摇10-15秒完成冷却。Ramos Fizz 需要干摇2分钟以上——调酒师的手臂杀手。" },
          { subtitle: "反向干摇（Reverse Dry Shake）", content: "另一种流派：先加冰湿摇冷却所有材料，过滤掉冰块后，再不加冰干摇已经冷却的液体。优点是不需要控制两段温度，缺点是第一次过滤会损失部分蛋清。两种方法都可以，看个人偏好。" },
        ],
        related: ["shake"],
      },
      {
        id: "build",
        title: "直调法（Build）",
        summary: "最古老的调酒方法——直接在饮用杯中加冰、倒入材料、搅拌即可。简单不等于简陋。",
        detail: [
          { subtitle: "适用场景", content: "Highball 类长饮（加了大量苏打水/汤力水/可乐的酒）：金汤力、自由古巴、Dark 'n' Stormy、Mojito 等。也适用于部分只用烈酒+糖+苦精的短饮。" },
          { subtitle: "手法要点", content: "杯中先加满冰块 → 倒入烈酒和调味材料 → 轻轻搅动使材料混合 → 苏打水/汤力水沿杯壁最后倒入（保留气泡）→ 轻轻提拉搅拌一次（不要过度搅会跑气）。Mojito 的变体：先在杯底轻捣薄荷和糖，再加其他材料。" },
          { subtitle: "常见错误", content: "❌ 苏打水直接浇在冰上（气泡撞击冰面散失）\n❌ 过度搅拌（长饮不需要剧烈混合，气泡跑了就变成一杯死水）\n❌ 冰块不够（长饮靠冰保持温度和气泡，冰太少酒很快就温了）" },
        ],
        related: ["muddle", "highball"],
      },
      {
        id: "muddle",
        title: "捣压法（Muddle）",
        summary: "用捣棒在杯底轻轻按压草本或水果，释放精油与风味。力度控制是这个技法的核心。",
        detail: [
          { subtitle: "适用场景", content: "需要新鲜草本或水果风味的鸡尾酒：Mojito（薄荷）、Caipirinha（青柠）、Old Fashioned（方糖+苦精）、Mint Julep（薄荷）。" },
          { subtitle: "手法要点", content: "草本（薄荷、罗勒）：轻拍或轻压2-3下即可——目的是释放叶面的精油腺体，不是碾碎叶子。过度捣压会让叶绿素释放，变苦变黑。水果（青柠角、浆果）：皮朝下放入杯底，轻轻按压挤出汁水和皮的油脂。不要碾到果肉变泥。" },
          { subtitle: "常见错误", content: "❌ 像捣蒜一样用力碾磨——这是最常见的错误，结果薄荷变苦、柠檬皮释放白色内层的涩味\n❌ 捣压工具不对——用勺柄代替捣棒容易戳破杯底\n❌ 顺序错误——应该先捣压草本水果再加冰，否则冰块挡着捣不到" },
        ],
        related: ["build", "mojito"],
      },
      {
        id: "layer",
        title: "分层法（Layer / Float）",
        summary: "利用液体的密度差（含糖量），让不同颜色的酒在杯中形成层次分明的视觉效果。",
        detail: [
          { subtitle: "科学原理", content: "不同液体的密度由含糖量和酒精度决定。糖分越高密度越大（沉在下面），酒精度越高密度越小（浮在上面）。所以甜利口酒永远在下层、高度烈酒在上层。这个原理源自基础物理——阿基米德定律。" },
          { subtitle: "手法要点", content: "先倒入密度最大的酒作为底层；将吧勺的勺背轻轻贴在上层液面处，让第二层酒沿着吧勺背面缓缓流下——勺背分散了液体的冲击力，防止穿透下层。每加一层都要换干净的吧勺。分层速度要慢，越慢越清晰。" },
          { subtitle: "经典分层鸡尾酒", content: "B-52（咖啡利口酒+百利甜+君度，三层等量）、彩虹鸡尾酒（Pousse Café，可达5-7层）、Irish Flag（绿薄荷+百利甜+君度，爱尔兰国旗配色）。" },
          { subtitle: "常见错误", content: "❌ 倒酒速度太快直接穿透下层\n❌ 不换吧勺导致颜色混合\n❌ 搞反密度顺序——不熟悉各款酒的含糖量" },
        ],
        related: ["stir"],
      },
      {
        id: "strain",
        title: "过滤（Strain）",
        summary: "将混合好的酒从摇酒壶或搅拌杯倒入饮用杯时，用滤网拦住冰块和固体残渣。",
        detail: [
          { subtitle: "标准过滤", content: "使用摇酒壶自带的滤冰器（Hawthorne Strainer）或搅拌杯配的Julep滤网。拦住大块冰，让酒液通过。适用于大多数摇和或搅拌的鸡尾酒。" },
          { subtitle: "双重过滤（Double Strain）", content: "在滤冰器之外再加一个细网滤网（茶滤），过滤掉碎冰渣、果肉纤维、蛋清结块、香草碎片。Daiquiri 必须双重过滤以保证清爽口感；含新鲜水果泥或薄荷碎的酒也必须双重过滤。" },
          { subtitle: "手法要点", content: "一手握住摇酒壶控制滤冰器，另一手持细网滤网置于杯口上方。将酒液通过两层过滤倒入杯中。动作要流畅果断——不要中途停顿让酒在滤网中积存。" },
        ],
        related: ["shake", "stir"],
      },
      {
        id: "rolling",
        title: "滚动法（Rolling / Throwing）",
        summary: "将酒在两个容器之间来回倾倒，让酒充分接触空气。比搅拌更温和，比摇和更文雅。",
        detail: [
          { subtitle: "适用场景", content: "Bloody Mary（番茄汁不适合摇晃会起泡变浑浊）、部分老式调酒。近年在精酿酒吧复兴，被用于需要「微氧化」释放风味的调酒。" },
          { subtitle: "手法要点", content: "准备两个相同容量的容器（通常用两个调酒杯）。将酒和冰从第一个容器倒入第二个，再倒回来。重复3-5次。每次倾倒时抬高容器，让酒液在空中形成细长水柱，充分接触空气。" },
          { subtitle: "为什么不是摇和？", content: "摇和的剧烈碰撞会让番茄汁起泡变浑浊（Bloody Mary）、让某些精细风味被过度稀释。滚动法只做冷却和微氧化，不改变酒体质感。" },
        ],
        related: ["shake", "stir"],
      },
    ],
  },

  glassware: {
    label: "杯型图鉴",
    emoji: "🍷",
    description: "杯子的形状不是设计师的任性——每一种杯型都有它的功能和历史。",
    entries: [
      {
        id: "martini_glass",
        title: "马天尼杯（Martini Glass）",
        summary: "倒三角形高脚杯，鸡尾酒世界最标志性的杯型。V形设计让酒的表面积最大、香气上升路径更长。",
        detail: [
          { subtitle: "规格", content: "容量120-180ml。经典款约150ml。现代款越做越大（甚至到250ml以上），导致正常配方（约90-120ml）倒进去像空杯。近年趋势是回归小容量Coupe杯或Nick & Nora杯替代。" },
          { subtitle: "为什么是V形？", content: "①大面积液面让香气充分释放；②高脚让手不接触杯身保持酒温；③细长的杯柄优雅而正式；④V形角度让喝酒时鼻子刚好位于杯口上方，同时品尝酒和闻香气。" },
          { subtitle: "缺点", content: "极容易洒——V形意味着重心高、底面积小。在拥挤的酒吧里端马天尼杯走路需要一定技巧。这也是为什么越来越多酒吧改用Coupe杯。" },
          { subtitle: "适合的酒", content: "不加冰的纯酒精鸡尾酒（Up Cocktails）：Dry Martini、Manhattan、Daiquiri、Sidecar、Aviation 等。" },
        ],
        related: ["coupe", "nick_nora"],
      },
      {
        id: "rocks_glass",
        title: "古典杯（Old Fashioned / Rocks Glass）",
        summary: "矮身宽口厚底杯，也叫 Rock Glass 或 Lowball。厚底是它的标志特征。",
        detail: [
          { subtitle: "规格", content: "容量180-300ml。壁厚底更厚，重量感十足。单杯重量通常在300-500g。" },
          { subtitle: "为什么厚底？", content: "厚底不是装酷——它是为了捣压（Muddle）。Old Fashioned 需要在杯底捣压方糖和苦精，薄底杯子会被捣碎。厚底提供一个稳定、耐压的工作面。另外厚底也能保温，冰块融化更慢。" },
          { subtitle: "适合的酒", content: "加冰的短饮：Old Fashioned、Negroni、Whiskey on the rocks、Rusty Nail、Sazerac 等。也可以用作品鉴纯饮烈酒。" },
        ],
        related: ["highball"],
      },
      {
        id: "highball",
        title: "高球杯（Highball Glass）",
        summary: "直筒高身杯，长饮类鸡尾酒的标准容器。高个子设计不是偶然。",
        detail: [
          { subtitle: "规格", content: "容量250-350ml。高约15-18cm，口径约6-7cm。直筒造型。" },
          { subtitle: "为什么这么高？", content: "①高身保留气泡更久——气泡从杯底上升到液面的路程越长，酒保持「有气」的时间越长；②直筒造型方便加满冰块；③大容量容纳大量苏打水/汤力水的同时还有空间放冰。" },
          { subtitle: "适合的酒", content: "Highball 类长饮：金汤力、自由古巴、Gin Fizz、Tom Collins、Mojito、Dark 'n' Stormy 等。" },
          { subtitle: "有意思的细节", content: "Highball 这个词的来源有争议。一说来自铁路信号的高位球（表示前方畅通）；另一说来自调酒师把杯子举高（High）像球（Ball）。不管哪种说法，这杯酒的精神是「轻松的长饮」。不讲究的美国人经常直接用可乐罐当高球杯。" },
        ],
        related: ["rocks_glass", "collins"],
      },
      {
        id: "coupe",
        title: "库佩杯（Coupe Glass）",
        summary: "圆底碗形高脚杯，比马天尼杯更古老也更实用。近年精酿酒吧的首选。",
        detail: [
          { subtitle: "规格", content: "容量120-180ml。杯身呈浅碗状，边缘微向外翻。" },
          { subtitle: "历史", content: "Coupe 杯的起源可以追溯到17世纪的香槟杯。传说它的形状是模仿玛丽·安托瓦内特（法国路易十六的王后）的胸部铸造的——虽然这是个浪漫的谣言（时间线对不上），但故事一直在流传。20世纪初，Coupe 杯是喝香槟的标准杯型，后来被笛形杯（Flute）取代——因为笛形杯保留气泡更好。" },
          { subtitle: "为什么近年来复兴？", content: "①比马天尼杯更不洒——圆底和浅碗设计让重心更低；②容量更合理——经典Coupe杯约150ml，现代马天尼杯动辄250ml以上；③审美趋势——曲线比直线更受欢迎。" },
          { subtitle: "适合的酒", content: "与马天尼杯完全相同的酒款范围——所有 Up Cocktails。另外也适合喝香槟鸡尾酒（Champagne Cocktail、French 75 等）。" },
        ],
        related: ["martini_glass", "nick_nora"],
      },
      {
        id: "nick_nora",
        title: "Nick & Nora 杯",
        summary: "钟形小容量高脚杯，优雅内敛。名字来自1930年代的侦探电影《瘦子》。",
        detail: [
          { subtitle: "规格", content: "容量约120-150ml。杯身呈钟形（上窄下宽），杯口微收。可以说是马天尼杯和Coupe杯的结合体。" },
          { subtitle: "名字的由来", content: "1934年电影《瘦子》（The Thin Man）中，侦探 Nick Charles 和他的妻子 Nora 几乎每场戏都在喝酒。他们用的杯子就是一种优雅的小型高脚杯。2010年代，精酿鸡尾酒运动将这种杯型重新发掘并命名。" },
          { subtitle: "为什么选它？", content: "①容量刚好——120ml的酒倒进去不会像空杯；②比马天尼杯更不洒——杯口微收，液面晃动更小；③极简优雅——没有马天尼杯那种「我来喝酒了」的张扬感。现代精酿酒吧的首选杯型之一。" },
        ],
        related: ["martini_glass", "coupe"],
      },
      {
        id: "hurricane",
        title: "飓风杯（Hurricane Glass）",
        summary: "曲线形大容量高脚杯，像倒扣的郁金香花苞。新奥尔良的发明。",
        detail: [
          { subtitle: "规格", content: "容量450-600ml，是普通鸡尾酒杯的3-4倍。曲线形杯身带高脚。" },
          { subtitle: "历史", content: "1940年代，新奥尔良 Pat O'Brien's 酒吧发明了 Hurricane 鸡尾酒。当时二战期间玻璃短缺，酒商要求「买一箱朗姆送一箱杯子」才愿意供货。这些赠送的杯子就是最早的飓风杯——大得不合理，但你没法拒绝因为是送的。后来这种杯型反而成了新奥尔良的标志。" },
          { subtitle: "适合的酒", content: "热带朗姆长饮：Hurricane、Planters Punch、Blue Hawaii、Zombie、Mai Tai 等。大容量适合大量碎冰和果汁。" },
        ],
        related: ["highball", "tiki"],
      },
    ],
  },

  tools: {
    label: "调酒工具",
    emoji: "🛠️",
    description: "工欲善其事，必先利其器。认识吧台后的每一件装备。",
    entries: [
      {
        id: "shaker",
        title: "摇酒壶（Shaker）",
        summary: "调酒师最标志性的工具。三种主流类型各有优劣。",
        detail: [
          { subtitle: "波士顿摇酒壶（Boston Shaker）", content: "一大一小两个金属杯（或一个金属杯+一个玻璃杯）对接而成。专业调酒师的首选——容量大、易清洗、无卡死风险。需要搭配滤冰器使用。需要练习才能掌握「打」壶的技巧（用掌根敲击大杯侧面使两杯分离）。" },
          { subtitle: "三节式摇酒壶（Cobbler Shaker）", content: "大杯+滤冰盖+顶盖三件套，内置滤网。家用最方便——不需要额外滤冰器。缺点是滤网孔太大（滤不掉碎冰）、容易卡死（金属冷缩后盖子松不开）、容量偏小。日本调酒师偏爱三节式，更适合硬摇技法。" },
          { subtitle: "法式摇酒壶（French / Parisian Shaker）", content: "大杯+一个小盖，没有内置滤网。介于波士顿和三节式之间。外形优雅但不够实用——盖子太薄不好敲开。巴黎的高端酒吧常用，追求视觉美感。" },
        ],
        related: ["shake", "strain"],
      },
      {
        id: "barspoon",
        title: "吧勺（Bar Spoon）",
        summary: "细长螺旋柄的搅拌勺。搅拌、量取、引流、分层——一支勺有四种用途。",
        detail: [
          { subtitle: "规格", content: "长度约30-40cm，勺头约5ml容量。螺旋柄设计不是装饰——螺旋可以增加指尖旋转的摩擦力（捻动搅拌时不易滑脱），也能在分层时减缓酒液流速。" },
          { subtitle: "多功能用途", content: "①搅拌（Stir）：勺背贴杯壁旋转；②量取：一吧勺≈5ml，可替代量酒器量小份材料；③引流分层：勺背朝上，液体沿勺背缓缓流下；④叉取：勺尾通常有一个小叉或圆盘，用于叉取橄榄、樱桃等装饰物。" },
        ],
        related: ["stir", "layer"],
      },
      {
        id: "jigger",
        title: "量酒器（Jigger）",
        summary: "精确量取烈酒的工具。不用量酒器的调酒师要么是大师要么在偷懒。",
        detail: [
          { subtitle: "规格", content: "标准的双头量酒器：大杯约45ml（1.5oz），小杯约30ml（1oz）。也有日式量酒器（细长型，多种刻度线）和阶梯式量酒器（多个容量级）。" },
          { subtitle: "为什么必须用量酒器？", content: "鸡尾酒的配方是精确的——多5ml的味美思就能让马天尼从「Dry」变成「Wet」。即使是最有经验的调酒师也需要量酒器保证一致性。不用的有两种人：①在家随便调的自己喝；②大师——他们手感已经精确到了 ±2ml，但很少。" },
          { subtitle: "Free Pouring（自由倾倒）", content: "不用量酒器、通过计数控制倒入量的技法。酒吧比赛中常见的炫技环节。练习方法：拿一个空瓶装水，练习倒出30ml/45ml/60ml，用实际量杯验证，直到误差在 ±3ml 以内。一般需要数月的日常练习才能掌握。" },
        ],
        related: ["recipe"],
      },
      {
        id: "strainer",
        title: "滤冰器（Strainer）",
        summary: "拦住冰块和固体材料，只让酒液通过。三种类型各司其职。",
        detail: [
          { subtitle: "霍桑滤冰器（Hawthorne Strainer）", content: "最常用的滤冰器。扁平圆盘+弹簧线圈。弹簧线圈贴合摇酒壶内壁，拦住冰块的缝隙比Julep滤网更密。配合波士顿摇酒壶使用。" },
          { subtitle: "Julep 滤网", content: "碗形大孔金属滤网，配合搅拌杯使用。孔比霍桑滤网大——搅拌杯出来的酒通常没有碎冰，不需要太密的过滤。" },
          { subtitle: "细网滤网（Fine Mesh / Tea Strainer）", content: "双重过滤的第二层。超细网眼拦下碎冰渣、果肉纤维、蛋清结块。不是必须的，但用了酒质明显更干净。" },
        ],
        related: ["strain", "shaker"],
      },
      {
        id: "muddler_tool",
        title: "捣棒（Muddler）",
        summary: "在杯底捣压草本和水果的工具。选对材质比选对牌子更重要。",
        detail: [
          { subtitle: "材质选择", content: "木质（传统、手感好、不会刮花杯子，但需要保养防霉）、不锈钢（耐用卫生、可进洗碗机，但较硬容易捣碎杯子）、塑料/尼龙（便宜轻便、不会碎杯，家用首选）。" },
          { subtitle: "捣头设计", content: "平面捣头（适合捣压方糖和水果）、齿面捣头（适合捣压草本，齿面可以刺破叶面精油腺体同时不碾碎叶子）。" },
          { subtitle: "手法提醒", content: "捣压不是捣碎——目标是释放风味而非破坏结构。薄荷轻捣2-3下、青柠角皮朝下轻压出汁即可。过度用力是新手最常见的错误。" },
        ],
        related: ["muddle"],
      },
      {
        id: "mixing_glass",
        title: "搅拌杯（Mixing Glass）",
        summary: "专门用于搅拌法（Stir）的容器。大容量、厚玻璃、带嘴。",
        detail: [
          { subtitle: "规格", content: "容量500-700ml，比普通水杯大得多。厚玻璃壁（保温效果好）。杯口带一个倒嘴（Pouring Spout），方便过滤时单手操作。" },
          { subtitle: "为什么不用普通杯子？", content: "①大容量容纳大量冰+酒后仍有搅拌空间；②厚玻璃保温——搅拌30秒内温度不会明显上升；③倒嘴设计配合Julep滤网单手即可完成过滤——专业酒吧的效率工具；④颜值——搅拌杯通常是雕花水晶玻璃，摆出来就很专业。" },
        ],
        related: ["stir", "strainer"],
      },
    ],
  },

  terminology: {
    label: "调酒术语",
    emoji: "📖",
    description: "点酒和调酒时常用的英语术语。记住这些词，在任何酒吧都能点出你想要的酒。",
    entries: [
      {
        id: "term_dry",
        title: "Dry（干）",
        summary: "鸡尾酒中出现频率最高的术语之一。两个核心含义：对马天尼而言是「少放味美思」，对整体风味而言是「不甜」。",
        detail: [
          { subtitle: "马天尼语境", content: "Dry Martini = 金酒多、味美思少。标准 Dry Martini = 6:1（金酒:味美思），Extra Dry = 10:1或更高。丘吉尔的著名配方：冰镇金酒，向法国方向看一眼味美思瓶子就够了。Wet Martini = 3:1或更多味美思（更柔和更湿润的口感）。" },
          { subtitle: "其他鸡尾酒", content: "Dry Manhattan = 用干味美思替代甜味美思（不要和 Perfect Manhattan 搞混）。Dry 对应 Sweet——比如根据你的口味，调酒师可能会建议 'Do you want it dry or sweet?'" },
          { subtitle: "烈酒中的 Dry", content: "干味美思（Dry Vermouth）是不甜的加强葡萄酒。Dry Gin = 不加糖的金酒。Dry Curaçao = 不甜的橙皮利口酒（对比普通Curaçao）。" },
        ],
        related: ["term_perfect", "term_vermouth"],
      },
      {
        id: "term_perfect",
        title: "Perfect（完美）",
        summary: "不是「完美」的意思。Perfect = 一半干味美思 + 一半甜味美思。只出现在有「干/甜」之分的鸡尾酒中。",
        detail: [
          { subtitle: "具体含义", content: "Perfect Manhattan = 黑麦威士忌 + 干味美思 + 甜味美思（各半量的味美思，总量不变）。Perfect Martini = 金酒 + 干味美思 + 甜味美思。这个术语的本质是「平衡」——干和甜各取一半。" },
          { subtitle: "和 Dry 的区别", content: "Dry = 只用干味美思。Perfect = 干甜各半。Sweet = 只用甜味美思。三个词代表三种不同的味美思配比。" },
        ],
        related: ["term_dry"],
      },
      {
        id: "term_dirty",
        title: "Dirty（脏）",
        summary: "在 Dry Martini 中加入橄榄盐水，让酒变得浑浊（所以叫 Dirty）。咸鲜风味的马天尼。",
        detail: [
          { subtitle: "怎么做", content: "Dry Martini 的标准做法 + 橄榄盐水（Olive Brine）。从几滴到15ml都可以，越多越「脏」越咸。点酒时可以说 'Dirty Martini'（默认约7-10ml盐水）或 'Extra Dirty'（多加盐水）。更进阶的 Filthy Martini 用蓝纹奶酪橄榄的盐水——味道更重更野。" },
          { subtitle: "风味变化", content: "橄榄盐水带来的咸鲜味（Umami）完全改变了马天尼的风味走向。不再是一杯干净利落的草本烈酒，而是一杯咸鲜的、带海味的开胃酒。喜欢的人特别喜欢，不喜欢的人觉得毁了金酒。" },
        ],
        related: ["term_dry", "martini_glass"],
      },
      {
        id: "term_up_neat",
        title: "Up / On the Rocks / Neat",
        summary: "三个描述酒「怎么喝」的术语。区别仅在于：杯中是否有冰？酒碰过冰没有？",
        detail: [
          { subtitle: "Up（Straight Up）", content: "酒和冰一起冷却后过滤倒入高脚杯中，杯中无冰。例如：Martini Up、Manhattan Up。酒经过了冰的冷却和稀释，但上桌时杯中是干净的酒液。适合不加冰的短饮。" },
          { subtitle: "On the Rocks", content: "酒直接倒在冰块上，杯中一直有冰。例如：Whiskey on the Rocks、Negroni on the Rocks。酒持续被冰冷却和稀释，越喝越淡。适合慢慢喝、边聊边喝。" },
          { subtitle: "Neat", content: "纯饮，酒直接从瓶子倒入杯中，不冷却、不加冰、不加水。室温。例如：Scotch Neat、Bourbon Neat。只有高品质烈酒才经得起纯饮——酒精的刺激感和风味的复杂度没有冰的稀释，全部直接传达。" },
        ],
        related: ["term_dry"],
      },
      {
        id: "term_bitters",
        title: "Bitters（苦精）",
        summary: "高度浓缩的植物风味提取液。调酒师的「盐」——几滴就能改变整杯酒的平衡。",
        detail: [
          { subtitle: "什么是苦精？", content: "苦精是几十种药草、香料、树根、果皮在中性烈酒中浸泡萃取而成的浓缩液，酒精度通常在35-45% ABV。虽然酒精度高，但每次只用几滴（约1-2ml），所以实际摄入可以忽略不计。风味强度极高——1 dash 约等于0.8ml，足够调味一整杯酒。" },
          { subtitle: "经典品牌", content: "Angostura Bitters（特立尼达和多巴哥，配方机密——5个人分别知道不同部分）、Peychaud's Bitters（新奥尔良，Sazerac 的灵魂）、Orange Bitters（橙皮风味，Dry Martini 的秘密武器）。现代精酿苦精品牌有 Fee Brothers、Bittermens、Scrappy's 等。" },
          { subtitle: "没有苦精就没有...", content: "Old Fashioned（Angostura + 方糖 + 威士忌）、Manhattan（Angostura 平衡甜味美思）、Sazerac（Peychaud's 是灵魂）、Champagne Cocktail（Angostura 滴在方糖上）。苦精不是配角——它是很多经典鸡尾酒的基石。" },
        ],
        related: ["term_vermouth", "recipe_old_fashioned"],
      },
      {
        id: "term_vermouth",
        title: "Vermouth（味美思）",
        summary: "加了药草调味的加强葡萄酒。Dry Martini 和 Negroni 的灵魂。也是鸡尾酒世界最容易被忽视的主角。",
        detail: [
          { subtitle: "类型", content: "干味美思（Dry Vermouth / French Vermouth）：不甜、清爽、草本味，透明淡黄色。经典用途：Dry Martini。甜味美思（Sweet Vermouth / Italian Vermouth）：甜、厚重、焦糖色、带香料味。经典用途：Negroni、Manhattan。Blanc/Bianco（白味美思）：介于干和甜之间，偏甜但颜色浅。经典用途：El Presidente。" },
          { subtitle: "重要提醒：味美思是酒不是调料", content: "味美思的基底是白葡萄酒，开封后和葡萄酒一样会氧化。必须放冰箱保存，4-6周内用完。一瓶在常温下放了半年的味美思已经变成了醋——用这种味美思调的 Negroni 和 Martini 会很难喝。" },
          { subtitle: "推荐品牌", content: "干味美思：Dolin Dry（法国）、Noilly Prat（法国）。甜味美思：Cocchi Vermouth di Torino（意大利）、Carpano Antica Formula（意大利，厚重版）。入门必买：Dolin Dry + Cocchi di Torino。" },
        ],
        related: ["term_dry", "term_perfect"],
      },
      {
        id: "term_rinse",
        title: "Rinse（涮杯）",
        summary: "用少量酒涮杯后倒掉——只留香气在杯壁上，不喝酒液本身。嗅觉参与比味觉更高级。",
        detail: [
          { subtitle: "经典应用", content: "Sazerac：用苦艾酒涮杯——只闻茴香香气，不喝苦艾（苦艾酒太烈会盖过干邑）。Rob Roy（泥煤版）：用泥煤威士忌涮杯——只闻烟熏味，不喝泥煤（泥煤威士忌太重会毁掉鸡尾酒的平衡）。" },
          { subtitle: "手法", content: "将少量酒倒入冰镇的杯子，轻轻旋转让酒液均匀覆盖整个杯壁内面，然后倒掉多余的酒。好的涮杯标准：杯壁均匀湿润但底部没有积液。只留一层极薄的酒膜——厚度大概是一支香烟纸的级别。" },
        ],
        related: ["term_neat", "recipe_sazerac"],
      },
      {
        id: "term_abv",
        title: "ABV（酒精度）",
        summary: "Alcohol By Volume（酒精体积百分比）。不仅是法律标签，也是调酒师估算一杯酒「有多烈」的基础。",
        detail: [
          { subtitle: "怎么算？", content: "一杯鸡尾酒的总酒精度 = 所有酒精材料的（体积 × ABV）之和 ÷ 总体积。例如 Negroni（金酒40% + 金巴利25% + 甜味美思16%，各30ml）= (30×0.4 + 30×0.25 + 30×0.16) / 90ml = 27%。加上冰块融化稀释约20-25%之后，实际入口约20-22% ABV——大约等于一杯红酒的2倍。" },
          { subtitle: "标尺参考", content: "啤酒 4-8%、葡萄酒 12-15%、味美思 16-18%、利口酒 20-40%、烈酒 40-60%、桶强威士忌 50-65%。一杯标准鸡尾酒的实际入口酒精度通常在12-28%之间。" },
        ],
        related: ["recipe"],
      },
      {
        id: "term_aperitif_digestif",
        title: "餐前酒 vs 餐后酒",
        summary: "Aperitif（餐前）= 开胃、偏干偏苦。Digestif（餐后）= 助消化、偏烈偏甜。",
        detail: [
          { subtitle: "餐前酒（Aperitif）", content: "饭前喝，刺激食欲。通常偏干、偏苦、酒精度适中（不会太甜以免吃饱）。经典：Negroni（苦味开胃）、Dry Martini（干净利落）、Americano（清爽低度）、Aperol Spritz（意大利国民开胃酒）。纯饮：金巴利、Aperol、Lillet Blanc、干味美思。" },
          { subtitle: "餐后酒（Digestif）", content: "饭后喝，帮助消化。通常更烈、更甜、更厚重。经典：Alexander（奶油甜）、Sidecar（白兰地）、Rusty Nail（威士忌+蜂蜜利口酒）、Espresso Martini（咖啡+伏特加）。纯饮：干邑、雅邑、阿玛罗、Fernet-Branca、波特酒。" },
          { subtitle: "一句话记忆", content: "餐前偏苦偏干（开胃不想吃饱），餐后偏烈偏甜（饭后需要消化）。" },
        ],
        related: ["term_dry"],
      },
    ],
  },

  ingredients: {
    label: "原料百科",
    emoji: "🍋",
    description: "了解吧台后的每一瓶酒、每一种材料。调酒不仅是技法，更是对原料的理解。",
    entries: [
      {
        id: "ing_vermouth",
        title: "味美思（Vermouth）",
        summary: "调香加强葡萄酒，Dry Martini 和 Negroni 的灵魂。鸡尾酒世界最被低估的主角。",
        detail: [
          { subtitle: "什么是味美思？", content: "味美思是以白葡萄酒为基底，加入多种药草、香料、树皮、根茎浸泡调味后加强（加烈酒提高酒精度）的葡萄酒。酒精度通常在16-18% ABV。名字来自德语的「Wermut」（苦艾），因为早期味美思的主要风味来自苦艾草。" },
          { subtitle: "干味美思（Dry Vermouth）", content: "不甜、清爽、草本味主导、透明淡黄色。经典品牌：Dolin Dry（法国，柔和均衡，入门首选）、Noilly Prat Original Dry（法国，更干更植物味，老派马天尼专用）。经典用途：Dry Martini。用量通常在15-30ml（配合金酒45-60ml）。" },
          { subtitle: "甜味美思（Sweet Vermouth）", content: "甜、厚重、焦糖色、带香料和香草味。经典品牌：Cocchi Vermouth di Torino（意大利，可可和香草香，Negroni 的黄金搭档）、Carpano Antica Formula（意大利，厚重版，Manhattan 用这个会升一个档次）、Martini & Rossi Rosso（最普及最经济的入门选择）。经典用途：Negroni、Manhattan、Americano。用量通常30ml。" },
          { subtitle: "白味美思（Blanc/Bianco）", content: "介于干和甜之间——偏甜但颜色浅、风味更花香。经典品牌：Dolin Blanc。经典用途：El Presidente、Martini 的第三种选择（在白味美思和干味美思之间切换可以让马天尼有不同的风味层次）。" },
          { subtitle: "最重要的提醒", content: "味美思是葡萄酒基底的，开封后和葡萄酒一样会氧化。必须放冰箱保存，4-6周内用完。一瓶在常温下放了半年的味美思已经不是味美思——它变成了醋。如果你觉得 Negroni 或 Martini 不好喝，先检查你的味美思是不是放太久了——大概率是这个问题。" },
        ],
        related: ["term_dry", "term_perfect"],
      },
      {
        id: "ing_bitters",
        title: "苦精（Bitters）",
        summary: "高度浓缩的植物风味提取液。调酒师的「盐」——几滴就够，但没有它整杯酒就不对。",
        detail: [
          { subtitle: "什么是苦精？", content: "苦精是将几十种药草、香料、树根、果皮在中性烈酒（通常是朗姆或谷物酒精）中浸泡萃取而成的浓缩液，酒精度35-45% ABV。虽然酒精度高，但每次只用1-2 dash（约1-2ml），所以实际酒精摄入可忽略。风味强度极高——1 dash 足以调味一整杯120ml的鸡尾酒。" },
          { subtitle: "Angostura Bitters", content: "特立尼达和多巴哥生产，标志性的大标签瓶（标签比瓶子大是历史上贴错尺寸的乌龙——懒得改就一直这样了）。风味：肉桂、丁香、肉豆蔻的暖香料调，带轻微的苦味和甜味。配方是商业秘密——据说是5个人分别知道配方的不同部分。没有 Angostura 就没有 Old Fashioned 和 Manhattan。" },
          { subtitle: "Peychaud's Bitters", content: "新奥尔良特产，比 Angostura 更轻更甜，有独特的茴香和薄荷味，颜色更鲜红。Sazerac 鸡尾酒的灵魂——没有 Peychaud's 就不能叫 Sazerac。新奥尔良之外比较难买到，但值得专门找。" },
          { subtitle: "橙味苦精（Orange Bitters）", content: "橙皮（甜橙皮和苦橙皮混合）为主要风味的苦精。Dry Martini 的秘密武器——在经典金酒+干味美思的基础上加入2 dash 橙味苦精，整杯酒多一层柑橘香气的复杂度。也常用于 Old Fashioned 的变体。推荐品牌：Regan's Orange Bitters No.6、Fee Brothers West Indian Orange。" },
          { subtitle: "现代精酿苦精", content: "近20年来精酿苦精品牌爆发式增长：Fee Brothers（巧克力、葡萄柚、桃子）、Bittermens（墨西哥巧克力、地狱火辣味）、Scrappy's（西雅图产，有机材料）。苦精的世界已经从2-3种发展到上百种——相当于调酒师的「调料架」。" },
        ],
        related: ["term_bitters", "recipe_old_fashioned"],
      },
      {
        id: "ing_liqueurs",
        title: "利口酒（Liqueur）",
        summary: "蒸馏酒+糖+风味的组合。从橙皮到咖啡到药草，利口酒是鸡尾酒的「香料库」。",
        detail: [
          { subtitle: "什么是利口酒？", content: "利口酒 = 蒸馏烈酒基底 + 风味材料（水果、药草、坚果、咖啡、奶油等）+ 糖。酒精度通常在15-40% ABV。欧盟规定利口酒含糖量至少要100g/L（通常比这个高得多）。利口酒不是用来纯饮的（虽然好的可以），它们是鸡尾酒的调味剂。" },
          { subtitle: "橙皮家族", content: "Triple Sec（最基础，15-40% ABV）+ Cointreau 君度（40% ABV，清澈透明，Margarita 的金标准）+ Grand Marnier 柑曼怡（40% ABV，干邑基底，更厚重更深色）+ Curaçao（加勒比产，蓝色或橙色）。这四者可以互相替代但风味差异明显——Cointreau 替代 Triple Sec 会提升整杯酒的品质，Grand Marnier 替代 Cointreau 会引入白兰地味。" },
          { subtitle: "咖啡家族", content: "Kahlua（墨西哥产，朗姆基底，甜味重）+ Tia Maria（牙买加产，朗姆基底，更深焙更苦）+ Mr. Black（澳大利亚精酿，冷萃咖啡基底，苦味和咖啡味最真实）。Espresso Martini 标准用 Kahlua，但用 Mr. Black 会让咖啡味更正统更不甜。" },
          { subtitle: "草本/苦味家族", content: "Campari（金巴利，25% ABV，苦味重）、Aperol（11% ABV，甜味为主）、Fernet-Branca（45% ABV，极苦极药草味，调酒师的「工作酒」——很多调酒师每天晚上下班后喝一杯纯的）、Jägermeister（35% ABV，56种药草）、Chartreuse（法国修道院产，55% ABV，130种药草，绿色版和黄色版）、Bénédictine（40% ABV，27种药草，蜂蜜味）。" },
          { subtitle: "利口酒的储存", content: "奶油利口酒（Baileys、RumChata）开封后必须冷藏，2-3个月内用完（含乳制品）。非奶油利口酒（Cointreau、Campari 等）常温储存即可，几乎不会变质——高糖+高酒精就是天然防腐剂。" },
        ],
        related: ["ingredient_campari", "ingredient_triple_sec"],
      },
      {
        id: "ing_syrups",
        title: "糖浆与甜味剂",
        summary: "糖不只是为了「甜」——它平衡酸度、增加黏稠度、承载风味。调酒中最基础也最被忽视的材料。",
        detail: [
          { subtitle: "单糖浆（Simple Syrup）", content: "白砂糖:水 = 1:1（按重量）。调制方法：等量糖和水在小锅中加热搅拌至完全溶解，不要煮沸（煮沸会焦化改变风味）。冷却后装瓶冷藏，保质期约2-3周。用途最广：Daiquiri、Whiskey Sour、Tom Collins 等几乎所有需要糖的经典鸡尾酒。" },
          { subtitle: "浓糖浆（Rich Syrup）", content: "白砂糖:水 = 2:1。比单糖浆甜得多的同时黏稠度也更高。好处：①用量少（减少不必要的稀释）；②高浓度抑制细菌，冷藏可存数月；③口感更圆润。现代精酿酒吧的默认选择。换算：配方要求15ml 单糖浆 ≈ 10ml 浓糖浆。" },
          { subtitle: "蜂蜜糖浆（Honey Syrup）", content: "蜂蜜:温水 = 2:1 或 3:1。纯蜂蜜太黏稠无法在冷酒中均匀溶解，必须稀释成糖浆后使用。经典用途：Bee's Knees（金酒+柠檬+蜂蜜糖浆）、Gold Rush（波本+柠檬+蜂蜜糖浆）。注意：蜂蜜风味会被加热破坏，用温水而非热水混合。" },
          { subtitle: "风味糖浆", content: "将水果、草本、香料与糖浆一起加热浸泡后过滤：姜糖浆（Moscow Mule 升级版）、香草糖浆（朗姆酒类）、迷迭香糖浆（金酒类）、肉桂糖浆（威士忌类、秋冬特调）。制作比例：1杯水+1杯糖+1/2杯切碎的风味材料，小火加热5分钟，关火浸泡30分钟后过滤。" },
          { subtitle: "龙舌兰糖浆（Agave Syrup）", content: "来自墨西哥龙舌兰植物，比蜂蜜更甜但更薄。龙舌兰酒的天然搭档——Margarita、Tommy's Margarita（用龙舌兰糖浆替代橙皮利口酒的极简版 Margarita）指定甜味剂。注意：市售龙舌兰糖浆品质差异大，买浅色的（深色有焦糖味会改变酒的风味）。" },
        ],
        related: ["ingredient_syrup"],
      },
      {
        id: "ing_citrus",
        title: "柑橘类",
        summary: "柠檬和青柠是鸡尾酒的酸度来源——没有酸就没有平衡。学会选、榨、用柑橘是调酒的基本功。",
        detail: [
          { subtitle: "柠檬 vs 青柠", content: "柠檬（Lemon）：酸度约6%柠檬酸，酸味圆润带甜感，香气清新。青柠（Lime）：酸度约7-8%柠檬酸，酸味更尖锐更「绿色」，香气更浓郁。规则：金酒和朗姆常见的搭档是青柠（Daiquiri、Mojito），威士忌和白兰地常用柠檬（Whiskey Sour、Sidecar）。不要互换——用柠檬做 Margarita 会变成一个奇怪的白兰地酸味酒。" },
          { subtitle: "鲜榨 vs 瓶装", content: "这是调酒中最重要的品质分界线。新鲜柑橘汁的保质期是几个小时（最佳风味在榨取后30分钟内）。瓶装果汁经过了巴氏杀菌和脱氧处理——这两个过程会杀死新鲜果汁中的挥发性芳香物质，留下金属味和苦味。Daiquiri 只有三种材料——如果用瓶装青柠汁，你就是毁了整杯酒。没有任何例外。" },
          { subtitle: "榨汁技巧", content: "榨汁前先用手掌在台面上用力滚动柑橘——压破果肉细胞壁，出汁量增加20-30%。墨西哥弯刀式榨汁器（Mexican Elbow）是专业调酒师的最爱——单手操作、出汁率高、不会把柑橘皮的苦味油脂挤进汁里。电动榨汁机方便但会把部分皮的油脂带进汁里。" },
          { subtitle: "柑橘皮的用途", content: "柑橘皮不是废物——皮里的油脂（Essential Oils）是最天然的调酒香料。Twist（皮卷）：削一条皮，在杯口上方拧挤出油脂喷在酒面，然后用皮擦拭杯口边缘。Peel（皮片）：大片削下，皮面朝下挤在酒面。关键：只取最外层的彩色皮（Zest），不要白色内层（Pith）——Pith 是苦的，会毁掉整杯酒。" },
        ],
        related: ["ingredient_lemon_lime"],
      },
    ],
  },

  history: {
    label: "鸡尾酒史",
    emoji: "📜",
    description: "每一杯经典鸡尾酒的背后都有一段历史。从禁酒令到 Tiki 文化——酒的历史就是人的历史。",
    entries: [
      {
        id: "hist_prohibition",
        title: "禁酒令时代（1920-1933）",
        summary: "美国历史上最戏剧性的社会实验——禁止酒精反而让鸡尾酒文化繁荣起来。",
        detail: [
          { subtitle: "背景", content: "1920年1月17日，美国宪法第18修正案生效，禁止「制造、运输和销售致醉饮料」。推动禁酒令的力量来自宗教团体（认为酒精是道德腐败的根源）和女权运动（认为酒精导致家庭暴力）。讽刺的是，禁酒令反而创造了美国历史上最辉煌的鸡尾酒时代。" },
          { subtitle: "地下酒吧（Speakeasy）", content: "禁酒令期间，纽约的酒吧数量从约15,000家增加到约32,000家——没错，禁酒反而让酒吧数量翻倍了。这些地下酒吧藏在理发店后面、电话亭里、殡仪馆地下室。名字 Speakeasy 来自「轻声说话」的要求——避免被外面的警察听到。地下酒吧也是鸡尾酒民主化的推手：女人可以和男人一起喝酒（这在禁酒令前是不被社会接受的），女性顾客的出现让鸡尾酒变得更甜、更果味、更「好喝」。1920年代被称为「鸡尾酒的黄金时代」。" },
          { subtitle: "对鸡尾酒的影响", content: "禁酒令期间，优质烈酒极度稀缺。调酒师被迫使用劣质私酿酒——为了遮掩劣酒的味道，他们加更多果汁、糖浆、利口酒和苦精。结果是意外之喜：果味鸡尾酒（Clover Club、Bee's Knees、Southside）大受欢迎。另一个影响：大批美国调酒师逃往欧洲、古巴和墨西哥——哈瓦那、巴黎和伦敦成为国际鸡尾酒中心。" },
          { subtitle: "禁酒令的终结与遗产", content: "1933年12月5日，第21修正案废除了禁酒令——这是美国宪法史上唯一一次被废除的修正案。原因很简单：禁酒令行不通。它催生了世界上最大的黑市经济（Al Capone 的私酒帝国年收入超过1亿美元），让执法机构腐败从生，而且人民根本没停止喝酒。禁酒令虽然结束了，但它对鸡尾酒文化的影响持续至今——没有禁酒令就没有今天丰富多样的鸡尾酒世界。" },
        ],
        related: ["history_speakeasy", "history_prohibition"],
      },
      {
        id: "hist_tiki",
        title: "Tiki 文化的兴衰",
        summary: "用朗姆酒、热带果汁和波利尼西亚幻想编织的鸡尾酒童话——从巅峰到衰落再到复兴。",
        detail: [
          { subtitle: "诞生", content: "1934年（禁酒令刚结束），Ernest Gantt（化名 Donn Beach）在好莱坞开了第一家 Tiki 酒吧——Don the Beachcomber。他用朗姆酒、热带果汁、神秘香料（肉桂、多香果、肉豆蔻）和夸张的波利尼西亚风格装饰，创造了一个「花一美元就能逃离大萧条」的幻境。Tiki 不是真正的波利尼西亚文化——它是美国人幻想的南太平洋。但正是这种「假」让它如此迷人。" },
          { subtitle: "黄金时代", content: "1940-1960年代是 Tiki 的巅峰。Victor「Trader Vic」Bergeron 发明了 Mai Tai（1944年）。Tiki 酒吧遍布全美——用陶瓷杯（Tiki Mug）、竹子装饰、人造瀑布和雷雨声效营造热带幻境。Tiki 鸡尾酒的配方是商业机密——每个调酒师都有自己的秘密香料混合（Donn Beach 的配方至今未被完全解密）。这个时代的 Tiki 鸡尾酒代表：Mai Tai、Zombie（四款朗姆酒混合，限2杯/人）、Navy Grog、Hurricane。" },
          { subtitle: "衰落", content: "1970-80年代，Tiki 文化急剧衰落。原因：①旅游业的兴起让「热带度假」不再只是幻想——人们真的能飞去夏威夷了，Tiki 酒吧失去了「逃避」的意义；②鸡尾酒文化的整体衰落——这个时期是鸡尾酒的「黑暗时代」，伏特加+橙汁式的简单调酒取代了复杂配方；③便利食品文化让「浓缩果汁+甜味剂」替代了真正的热带果汁。大多数 Tiki 酒吧关闭或变成了廉价朗姆酒吧。" },
          { subtitle: "复兴", content: "2000年代至今，Tiki 文化在精酿鸡尾酒运动中复兴。新一代调酒师重新发掘 Donn Beach 和 Trader Vic 的配方，用新鲜果汁、优质朗姆酒和真正的香料取代了70年代的「浓缩液+糖精」。代表：纽约 PDT、旧金山 Smuggler's Cove、伦敦 Laki Kane。Tiki 今天的定位是「认真的鸡尾酒，不认真的态度」——酒是严肃的，体验是好玩的。" },
        ],
        related: ["history_tiki"],
      },
      {
        id: "hist_era",
        title: "鸡尾酒的五个时代",
        summary: "从19世纪初到21世纪，鸡尾酒经历了五个截然不同的时代。理解时代背景才能理解每一杯酒。",
        detail: [
          { subtitle: "第一时代：诞生（1800-1880）", content: "鸡尾酒的原始定义（1806年）：烈酒+糖+水+苦精。其实就是 Old Fashioned。Jerry Thomas 出版第一本鸡尾酒书（1862年）。这个时代的技术创新是用冰——在此之前喝烈酒要么纯饮要么室温加水。冰块在鸡尾酒中的应用（19世纪中期冰贸易兴起）是划时代的进步。" },
          { subtitle: "第二时代：黄金时代（1880-1920）", content: "工业革命带来制冰技术的普及、城市中产阶级的壮大、酒吧文化的大繁荣。这个时代诞生了 Manhattan、Martini、Daiquiri、Martinez 等绝大多数经典配方。调酒成为一种需要专业训练的职业。酒吧不仅是喝酒的地方——它是社交中心、政治论坛、商业谈判场所。" },
          { subtitle: "第三时代：禁酒令与国际化（1920-1940）", content: "美国禁酒令（1920-1933）让鸡尾酒的中心从纽约转移到巴黎、伦敦、哈瓦那。欧洲的奢华酒店酒吧（巴黎 Ritz、伦敦 Savoy）成为鸡尾酒的新圣殿。调酒师成为国际化的职业。禁酒令结束后，Tiki 文化在美国兴起。" },
          { subtitle: "第四时代：黑暗时代（1960-1990）", content: "鸡尾酒文化的低谷。工业化生产和便利食品文化让新鲜材料被预调混合物和浓缩果汁取代。伏特加成为万能基酒。Disco 时代的闪光灯和糖浆甜酒成为主流。如果这个时代有一个「代表作」，那就是 Sex on the Beach 或者 Blue Lagoon——甜到发腻、颜色鲜艳到不自然。" },
          { subtitle: "第五时代：精酿复兴（2000至今）", content: "新一代调酒师重新发掘经典配方、历史技法和新鲜材料。精酿鸡尾酒运动强调：新鲜果汁（不是瓶装的）、手工冰块（透明大冰块）、自制糖浆和苦精、复古技法（干摇、分层、烟熏）、历史配方的忠实复刻。鸡尾酒不再只是酒精饮料——它是一种关于风味、历史、文化和手工艺的综合体验。" },
        ],
        related: ["history_prohibition", "history_tiki"],
      },
    ],
  },

  classics: {
    label: "经典名酒",
    emoji: "🏛️",
    description: "穿越时间的考验，这六款酒定义了鸡尾酒的世界。了解它们，你就了解了鸡尾酒的灵魂。",
    entries: [
      {
        id: "classic_old_fashioned",
        title: "Old Fashioned（古典鸡尾酒）",
        summary: "鸡尾酒的原型。1806年对鸡尾酒的最早定义——「烈酒+糖+水+苦精」——就是一杯 Old Fashioned。",
        detail: [
          { subtitle: "历史", content: "Old Fashioned 的名字来自一个讽刺的事实：1880年代，当「新潮」鸡尾酒（加果汁、利口酒、苦艾酒等）流行时，有些客人开始要求调酒师「给我一杯老式（Old Fashioned）的鸡尾酒」——意思是不加那些花里胡哨的东西，回到烈酒+糖+苦精的原始配方。所以 Old Fashioned 就是「鸡尾酒的原型」——其他所有鸡尾酒都是它的变体。" },
          { subtitle: "标准配方", content: "波本威士忌（或黑麦）60ml + 方糖1块 + Angostura 苦精 4 dashes + 少许水。做法：方糖+苦精+水在古典杯中用捣棒碾压溶解→加威士忌→加大冰块→搅拌至冷却→橙皮卷+樱桃装饰。" },
          { subtitle: "关键细节", content: "方糖必须完全溶解。杯底残留的糖粒是 Old Fashioned 最经典的错误——它告诉客人：这杯酒做得匆忙。选择威士忌：波本（更甜更圆润，适合入门）vs 黑麦（更辛辣更有棱角，老派做法）。有些老派调酒师坚信 Old Fashioned 应该用黑麦——「波本是给新奥尔良的，黑麦是给绅士的。」" },
          { subtitle: "现代变体", content: "Oaxaca Old Fashioned（龙舌兰+Mezcal 替代威士忌，烟熏味）\nRum Old Fashioned（陈年朗姆替代威士忌，热带版）\nBenton's Old Fashioned（培根油浸洗波本，烟熏咸味复杂度）"},
        ],
        related: ["recipe_old_fashioned_sugar"],
      },
      {
        id: "classic_martini",
        title: "Dry Martini（干马天尼）",
        summary: "鸡尾酒之王。一杯酒只有两种材料——金酒和味美思——但它的变化无穷无尽。",
        detail: [
          { subtitle: "历史", content: "Dry Martini 起源于19世纪末的 Martinez（老汤姆金酒+甜味美思+黑樱桃利口酒）。20世纪初伦敦干金酒流行（不甜的版本），Martinez 逐渐演变成今天的形式。禁酒令时期进一步推动了「Dry」的趋势（少味美思、多金酒）。到了1960年代，Dry Martini 成为优雅和成熟的代名词——弗兰克·辛纳屈、迪恩·马丁和他们的「鼠帮」兄弟几乎每场演出都要先喝一杯 Dry Martini。" },
          { subtitle: "配方与比例", content: "金酒（London Dry）60ml + 干味美思 10ml（6:1）。做法：搅拌杯加冰→倒入金酒和味美思→搅拌30-45秒至杯壁起霜→过滤到冰镇的马天尼杯中→橙味苦精（可选，2 dashes）→橄榄或柠檬皮卷。这是现代标准的6:1比例。历史上 Dry Martini 经历了从2:1到15:1的「军备竞赛」——越干越像纯金酒。" },
          { subtitle: "搅拌 vs 摇和", content: "全酒精类鸡尾酒的标准做法是搅拌——保持酒体清澈丝滑。007的Vesper Martini要求Shaken（摇的）——结果是酒体会变浑浊、稀释更多、温度更低。摇和马天尼在技术上是不准确的，但它不是「错误」——它只是另一种风格。如果你想要更稀释更冷更柔和的金酒味，Shaken 是可以的。" },
          { subtitle: "定制你的马天尼", content: "Gin vs Vodka（伏特加马天尼用伏特加替代金酒，风味更干净但缺少金酒的药草层次）；比例（3:1 Wet → 6:1 Dry → 15:1 Extra Dry）；配饰（橄榄=咸鲜、柠檬皮卷=柑橘清香、珍珠洋葱=Gibson 不是 Martini）；Dirty（加橄榄盐水，咸鲜味）。Order a Martini 就是开启一场关于你个人偏好的对话——这正是它的魅力。" },
        ],
        related: ["recipe_dry_martini_ratio", "term_dry", "term_dirty"],
      },
      {
        id: "classic_negroni",
        title: "Negroni（内格罗尼）",
        summary: "意大利的骄傲。1:1:1 三等分——金酒的药草、金巴利的苦、味美思的甜，完美平衡。",
        detail: [
          { subtitle: "历史", content: "1919年，意大利佛罗伦萨，Camillo Negroni 伯爵走进 Caffè Casoni 酒吧，要求调酒师把他的 Americano（金巴利+甜味美思+苏打水）「加强一下」——用金酒替代苏打水。Negroni 诞生了。这个故事简单到不像真的，但佛罗伦萨人至今坚信不疑。Negroni 家族后裔在2019年（Negroni 100周年）在全世界举办了 Negroni Week 庆祝活动。" },
          { subtitle: "为什么 1:1:1？", content: "三等分是鸡尾酒世界最神奇的巧合。金酒（杜松子的植物香）+ 金巴利（苦味和橙皮油）+ 甜味美思（焦糖甜和香料味）——三种风格截然不同的材料在等量下达到了完美的平衡。多一分金酒则压倒味美思，多一分金巴利则太苦，多一分味美思则太甜。很多调酒师都试过调整比例——大多数最后回到了1:1:1。" },
          { subtitle: "配方与做法", content: "金酒30ml + 金巴利30ml + 甜味美思30ml。做法：古典杯中加大冰块→倒入三种材料→搅拌30-45秒→橙片或橙皮卷装饰。关键：不要用碎冰——Negroni 需要慢慢稀释，喝到一半时冰化出的那层水让苦甜比例刚好。如果用碎冰会化太快。" },
          { subtitle: "Negroni 家族", content: "Boulevardier（金酒换成波本，更甜更暖）\nOld Pal（金酒换成黑麦威士忌，更辛辣）\nNegroni Sbagliato（金酒换成气泡酒，清爽版）\nRosita（金酒换成龙舌兰，烟熏感）\nWhite Negroni（金巴利+甜味美思换成 Suze+白味美思，法国版）"},
        ],
        related: ["recipe_negroni_ratio"],
      },
      {
        id: "classic_daiquiri",
        title: "Daiquiri（大吉利）",
        summary: "三种材料，零遮掩。一杯好的 Daiquiri 是调酒师的基本功——一杯坏的 Daiquiri 是材料质检。",
        detail: [
          { subtitle: "历史", content: "Daiquiri 诞生于1898年古巴圣地亚哥附近的一个铁矿（Daiquiri 是当地地名）。美国采矿工程师 Jennings Cox 在招待客人时发现金酒用完了，只有朗姆酒——于是他混合了朗姆酒+青柠汁+糖，用当地的碎冰摇和。没想到这个即兴配方成为鸡尾酒史上最重要的发明之一。海明威在哈瓦那发现了 Daiquiri 并痴迷于此——他在 El Floridita 酒吧每天喝十几杯他自创的 Papa Doble（双倍朗姆无糖版）。" },
          { subtitle: "配方与做法", content: "白朗姆60ml + 新鲜青柠汁22ml + 单糖浆15ml。做法：全部材料加入摇酒壶→加冰用力摇晃10-15秒→双重过滤倒入冰镇的马天尼杯→青柠片装饰。关键：①青柠汁必须是现榨的（瓶装的金属味会毁了整杯酒）；②双重过滤——滤掉碎冰渣和果肉，保证清爽口感；③比例可调——如果你觉得甜了或酸了，调整糖浆量。" },
          { subtitle: "为什么说它是基本功的试金石？", content: "因为只有三种材料。每一种都赤裸裸地暴露在味蕾上：朗姆酒的品质、青柠汁的新鲜度、糖浆的浓度——任何一项不行立刻被舌头抓到。没有复杂的药草味、没有苦精的遮掩、没有气泡的稀释。Daiquiri 不给调酒师任何躲藏的地方——这就是为什么它是调酒师考试的标准题目。" },
          { subtitle: "变体", content: "Hemingway Daiquiri / Papa Doble（双倍朗姆+不加糖+黑樱桃利口酒+葡萄柚汁）\nFrozen Daiquiri（加碎冰在搅拌机打成冰沙状，海明威其实不喜欢这个版本）\nStrawberry Daiquiri（加新鲜草莓一起摇）"},
        ],
        related: ["recipe_daiquiri_fresh_lime"],
      },
      {
        id: "classic_manhattan",
        title: "Manhattan（曼哈顿）",
        summary: "威士忌+甜味美思+苦精。三样东西——和 Dry Martini 一样简单，但风格截然不同。",
        detail: [
          { subtitle: "历史", content: "Manhattan 据传诞生于1870年代的纽约曼哈顿俱乐部（Manhattan Club）。丘吉尔的母亲 Jennie Jerome 据说为当时的总统候选人 Samuel Tilden 举办了一场宴会，要求调酒师做一款特别的鸡尾酒。这个说法后来被质疑（时间线有点对不上），但 Manhattan 无疑是最早的「威士忌鸡尾酒」之一——它证明了威士忌也可以像金酒一样优雅。" },
          { subtitle: "配方与做法", content: "黑麦威士忌（Rye）60ml + 甜味美思30ml + Angostura 苦精 2 dashes。做法：搅拌杯加冰→倒入所有材料→搅拌30-45秒至杯壁起霜→过滤倒入冰镇的马天尼杯→酒渍樱桃装饰。关键：推荐用黑麦威士忌（Rye）而不是波本——黑麦的辛辣感和甜味美思的甜形成对比，波本的甜和味美思的甜互相叠加会让整杯酒偏甜。" },
          { subtitle: "变体", content: "Perfect Manhattan（干味美思+甜味美思各半=各15ml，更平衡）\nRob Roy（换成苏格兰威士忌，有泥煤烟熏感）\nBrooklyn（用黑麦+干味美思+黑樱桃利口酒替代甜味美思，更干燥更有层次）\nDry Manhattan（全部用干味美思替代甜味美思，2:1，更清爽）"},
          { subtitle: "和 Dry Martini 的对比", content: "Manhattan 和 Dry Martini 像鸡尾酒世界的阴阳两面：Martini=金酒（植物清香）+干味美思（干燥），清澈冰冷如水晶；Manhattan=威士忌（温暖香草）+甜味美思（甜厚），温暖红褐如琥珀。喜欢 Martini 的人不一定喜欢 Manhattan，反之亦然——它们是两种完全不同的美学。" },
        ],
        related: ["recipe_manhattan_rye"],
      },
      {
        id: "classic_margarita",
        title: "Margarita（玛格丽特）",
        summary: "全世界最受欢迎的鸡尾酒之一。龙舌兰+青柠+橙皮利口酒+盐——墨西哥的阳光和灵魂都在这一杯里。",
        detail: [
          { subtitle: "历史（有争议）", content: "至少有三种说法：①1938年墨西哥提华纳，Carlos「Danny」Herrera 为一个对除龙舌兰外所有烈酒都过敏的女演员创造了这杯酒（Margarita 是西班牙语的 Daisy，而 Daisy 是19世纪一种用烈酒+柠檬+橙皮利口酒调制的鸡尾酒——所以 Margarita 就是「龙舌兰版 Daisy」）；②1948年德克萨斯，Margarita Sames 在她家派对上发明的；③1941年墨西哥 Ensenada，调酒师 Don Carlos Orozco 以一位德国外交官的女儿 Margarita Henkel 命名。三种说法都有各自的证据——反正墨西哥人说「就是我们发明的」。最可信的理论是「Margarita = Tequila Daisy」——语言学和配方脉络都能对上。" },
          { subtitle: "配方与做法", content: "龙舌兰（Blanco/Silver）60ml + Cointreau（君度）30ml + 新鲜青柠汁30ml。做法：用青柠角擦半个杯口并蘸盐（Margarita 杯或古典杯）→所有材料加入摇酒壶→加冰用力摇晃10-15秒→过滤到准备好的杯中（加冰或不加冰均可）。关键细节：盐只蘸半个杯口——留一半不蘸，让客人可以选择从哪边喝。这是老派酒吧的体贴。" },
          { subtitle: "为什么用君度（Cointreau）而不是廉价 Triple Sec？", content: "普通 Triple Sec（15-30% ABV）太甜太单薄，会让整杯酒变成一杯糖浆味的龙舌兰饮料。Cointreau（40% ABV，纯蒸馏橙皮油）提供了干净的橙皮风味而不只是甜。用 Cointreau 的 Margarita 和用廉价 Triple Sec 的 Margarita 是两杯完全不同的酒。" },
          { subtitle: "变体", content: "Tommy's Margarita（去掉橙皮利口酒，用龙舌兰糖浆替代——极简版，旧金山 Tommy's 酒吧发明，龙舌兰纯正主义者最爱）\nFrozen Margarita（加冰在搅拌机打碎，1971年达拉斯发明——冷冻机的发明让 Margarita 成为全球最受欢迎的酒）\nMezcal Margarita（用 Mezcal 替代龙舌兰，烟熏味版本）"},
        ],
        related: ["recipe_margarita_triple_sec"],
      },
    ],
  },
}

/**
 * 获取所有分类列表
 */
function listCategories() {
  return Object.entries(ENCYCLOPEDIA).map(([key, cat]) => ({
    key,
    label: cat.label,
    emoji: cat.emoji,
    description: cat.description,
    entryCount: cat.entries.length,
  }))
}

/**
 * 获取指定分类的所有词条
 */
function getCategory(key) {
  const cat = ENCYCLOPEDIA[key]
  if (!cat) return null
  return {
    key,
    label: cat.label,
    emoji: cat.emoji,
    description: cat.description,
    entries: cat.entries.map((e) => ({
      id: e.id,
      title: e.title,
      summary: e.summary,
      detail: e.detail,
      related: e.related,
    })),
  }
}

/**
 * 搜索词条（按标题和摘要）
 */
function searchEntries(query) {
  const q = query.toLowerCase()
  const results = []
  Object.entries(ENCYCLOPEDIA).forEach(([catKey, cat]) => {
    cat.entries.forEach((entry) => {
      if (
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q)
      ) {
        results.push({
          ...entry,
          category: catKey,
          categoryLabel: cat.label,
          categoryEmoji: cat.emoji,
        })
      }
    })
  })
  return results
}

module.exports = {
  ENCYCLOPEDIA,
  listCategories,
  getCategory,
  searchEntries,
}
