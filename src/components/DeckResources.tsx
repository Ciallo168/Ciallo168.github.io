import { type FC, useState } from 'react'
import { Package, ChevronDown, Download } from 'lucide-react'

interface DeckGroup {
  name: string
  icon: string
  files: { name: string; main: number; extra: number; side: number }[]
}

const deckGroups: DeckGroup[] = [
  {
    name: '随机卡池',
    icon: '🎲',
    files: [
      { name: '怪兽.ydk', main: 16, extra: 15, side: 13 },
      { name: '魔法.ydk', main: 40, extra: 0, side: 2 },
      { name: '陷阱.ydk', main: 26, extra: 0, side: 1 },
    ],
  },
  {
    name: '自选卡组',
    icon: '🏗️',
    files: [
      { name: 'll.ydk', main: 15, extra: 5, side: 1 },
      { name: '十二兽.ydk', main: 15, extra: 5, side: 2 },
      { name: '兽带.ydk', main: 15, extra: 1, side: 5 },
      { name: '勇者.ydk', main: 15, extra: 0, side: 1 },
      { name: '忍者.ydk', main: 15, extra: 3, side: 1 },
      { name: '地中.ydk', main: 15, extra: 0, side: 0 },
      { name: '幽鬼.ydk', main: 5, extra: 0, side: 0 },
      { name: '斗魂.ydk', main: 15, extra: 2, side: 0 },
      { name: '春化.ydk', main: 15, extra: 0, side: 0 },
      { name: '海造.ydk', main: 15, extra: 6, side: 0 },
      { name: '皮尔.ydk', main: 15, extra: 6, side: 0 },
      { name: '遗式.ydk', main: 15, extra: 0, side: 0 },
      { name: '雷龙.ydk', main: 15, extra: 6, side: 0 },
      { name: '魔弹.ydk', main: 15, extra: 1, side: 1 },
    ],
  },
  {
    name: '自选小轴',
    icon: '🔧',
    files: [
      { name: '刻魔小轴.ydk', main: 4, extra: 2, side: 0 },
      { name: '反转壶小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '幽鬼小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '恐龙小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '救祓小轴.ydk', main: 4, extra: 2, side: 0 },
      { name: '教导小轴.ydk', main: 4, extra: 1, side: 0 },
      { name: '旅鸟小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '日月书小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '暗黑界小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '灵魂小轴.ydk', main: 3, extra: 2, side: 0 },
      { name: '白银城小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '竹光小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '苦命鸳鸯小轴.ydk', main: 3, extra: 2, side: 0 },
      { name: '赌狗小轴.ydk', main: 5, extra: 0, side: 0 },
      { name: '闪刀小轴.ydk', main: 3, extra: 2, side: 0 },
    ],
  },
]

const DeckResources: FC = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="
      rounded-xl border border-cyber-border bg-cyber-card/50
      hover:border-cyber-purple/20 transition-all duration-300
    ">
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          w-full flex items-center justify-between px-4 py-3
          text-sm text-gray-400 hover:text-gray-300 transition-colors
        "
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-cyber-gold" />
          <span>卡组资源下载</span>
          <span className="text-xs text-gray-600">(32个文件)</span>
        </div>
        <ChevronDown className={`
          w-4 h-4 transition-transform duration-300
          ${expanded ? 'rotate-180' : ''}
        `} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {deckGroups.map(group => (
            <div key={group.name}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {group.icon} {group.name}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {group.files.map(file => (
                  <a
                    key={file.name}
                    href={`./ydk-decks/${group.name}/${file.name}`}
                    download
                    className="
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs
                      bg-cyber-bg border border-cyber-border
                      text-gray-400 hover:text-cyber-purple
                      hover:border-cyber-purple/50 hover:bg-cyber-purple/5
                      transition-all duration-200
                    "
                    title={`主卡组:${file.main} 额外:${file.extra} 备牌:${file.side}`}
                  >
                    <Download className="w-3 h-3" />
                    {file.name.replace('.ydk', '')}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DeckResources
