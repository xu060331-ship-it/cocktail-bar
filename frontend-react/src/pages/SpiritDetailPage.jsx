import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink } from "lucide-react"

const spiritData = {
  gin: {
    name: "金酒", eng: "Gin", emoji: "🍸",
    hero: "杜松子、药草与酒精的三重奏。从伦敦的蒸馏厂到西班牙的海岸酒吧，金酒是鸡尾酒世界最活跃的分子——它几乎能和任何风味对话。",
    sections: [
      {
        title: "金酒的分类",
        items: [
          { label: "伦敦干金 London Dry Gin", desc: "最经典的金酒风格。杜松子主导，柑橘和香料的复杂层次。不甜、不添加人工风味。代表：Beefeater、Tanqueray。" },
          { label: "老汤姆金 Old Tom Gin", desc: "比伦敦干金稍甜，是18世纪金酒热潮的遗存。马天尼的前身马丁内斯用的就是它。代表：Hayman's Old Tom。" },
          { label: "普利茅斯金 Plymouth Gin", desc: "受地理标志保护，只能在普利茅斯市生产。比伦敦干金更土质、更柔和。代表：Plymouth Gin。" },
          { label: "新西部金 New Western Gin", desc: "杜松子不再是绝对主角。花香、黄瓜、玫瑰、柑橘可以走到前台。代表：Hendrick's（黄瓜+玫瑰）、Monkey 47（47种药草）。" },
          { label: "荷兰金酒 Genever", desc: "金酒的祖先。用麦芽酒为基底蒸馏，口感更接近威士忌。荷兰和比利时的国饮。代表：Bols Genever。" },
          { label: "老式金酒 Old Tom / Navy Strength", desc: "海军强度金酒：57% ABV 以上。历史上英国海军用火药测试——酒精度不够火药点不着。代表：Plymouth Navy Strength。" },
        ],
      },
      {
        title: "金酒的经典配方",
        items: [
          { label: "干马天尼 Dry Martini", desc: "金酒 + 干味美思。鸡尾酒之王。搅拌、冰镇、橄榄。越干越好是有极限的——邱吉尔的理想比例是“看一眼味美思瓶子就够了。”" },
          { label: "内格罗尼 Negroni", desc: "金酒 + 金巴利 + 甜味美思，1:1:1。佛罗伦萨的骄傲。苦、甜、药草在冰球上缓慢融合。" },
          { label: "金菲士 Gin Fizz", desc: "金酒 + 柠檬汁 + 糖浆 + 苏打水。清爽长饮的标杆。" },
          { label: "飞行 Aviation", desc: "金酒 + 樱桃利口酒 + 紫罗兰利口酒 + 柠檬汁。淡紫色的天空，禁酒令时期的地下酒吧最爱。" },
          { label: "白色佳人 White Lady", desc: "金酒 + 橙皮利口酒 + 柠檬汁。1920年代巴黎的优雅。" },
          { label: "新加坡司令 Singapore Sling", desc: "金酒 + 樱桃利口酒 + 菠萝汁 + 青柠汁 + 石榴糖浆。莱佛士酒店的粉红色传奇。" },
        ],
      },
    ],
  },
  vodka: {
    name: "伏特加", eng: "Vodka", emoji: "🍶",
    hero: "水与乙醇的终极净化。伏特加不争不抢——它把自己的性格降到最低，成为其他风味最忠实的载体。",
    sections: [
      {
        title: "伏特加的流派",
        items: [
          { label: "俄罗斯伏特加", desc: "黑麦和小麦为主。醇厚、微甜、有明显的谷物口感。代表：Russian Standard、Stolichnaya。" },
          { label: "波兰伏特加", desc: "马铃薯为主。更奶油、更饱满。代表：Chopin、Belvedere。" },
          { label: "北欧伏特加", desc: "冬小麦和冰川水。极致的纯净和柔顺。代表：Absolut（瑞典）、Finlandia（芬兰）。" },
          { label: "法国伏特加", desc: "葡萄为原料。微妙的果香，比谷物伏特加更圆润。代表：Cîroc、Grey Goose。" },
          { label: "精酿伏特加", desc: "小批量、单一原料、本地水源。美国的精酿蒸馏运动也影响了伏特加。代表：Tito's（玉米）、Hangar 1。" },
        ],
      },
      {
        title: "伏特加的经典配方",
        items: [
          { label: "大都会 Cosmopolitan", desc: "伏特加 + 橙皮利口酒 + 青柠汁 + 蔓越莓汁。《欲望都市》让这杯酒火遍全球。" },
          { label: "血腥玛丽 Bloody Mary", desc: "伏特加 + 番茄汁 + 柠檬汁 + 伍斯特酱 + 辣酱。早午餐之王，宿醉救星。" },
          { label: "莫斯科骡子 Moscow Mule", desc: "伏特加 + 姜汁啤酒 + 青柠汁。铜杯是标配——传说是三个推销员在酒吧里一拍脑袋的营销杰作。" },
          { label: "咖啡马天尼 Espresso Martini", desc: "伏特加 + 咖啡利口酒 + 浓缩咖啡。1980年代伦敦传奇调酒师 Dick Bradsell 的发明。" },
          { label: "黑俄罗斯 Black Russian", desc: "伏特加 + 咖啡利口酒。简单到你可以在任何地方自己做。加奶油就是白俄罗斯。" },
          { label: "长岛冰茶 Long Island Iced Tea", desc: "伏特加 + 金酒 + 朗姆 + 龙舌兰 + 橙皮利口酒 + 柠檬汁 + 可乐。披着茶外衣的烈酒炸弹。" },
        ],
      },
    ],
  },
}

export default function SpiritDetailPage() {
  const { name } = useParams()
  const data = spiritData[name] || null

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">该基酒详情页尚未完成</p>
          <Link to="/spirits" className="text-[var(--color-accent)] hover:underline">返回基酒百科</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-white font-serif pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        {/* 返回 */}
        <Link
          to="/spirits"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-gray)] hover:text-[var(--color-accent)] transition-colors mb-12"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          返回基酒百科
        </Link>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{data.emoji}</span>
            <div>
              <h1 className="text-5xl text-white font-serif">{data.name}</h1>
              <p className="text-lg text-[var(--color-text-muted)] italic">{data.eng}</p>
            </div>
          </div>
          <p className="text-base text-[var(--color-text-gray)] leading-relaxed max-w-2xl mt-4">{data.hero}</p>
        </motion.div>

        {/* 分类区块 + 配方区块 */}
        {data.sections.map((section, si) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: si * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="text-xl text-[var(--color-accent)] font-serif mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-accent)]" />
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.label} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)] transition-colors duration-300">
                  <h3 className="text-base text-white font-serif mb-2">{item.label}</h3>
                  <p className="text-sm text-[var(--color-text-gray)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* 探索更多 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center pt-12 border-t border-[var(--color-border)]"
        >
          <Link
            to="/cocktails"
            className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline text-sm"
          >
            在酒谱中查找所有{data.name}基鸡尾酒 <ExternalLink size={14} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
