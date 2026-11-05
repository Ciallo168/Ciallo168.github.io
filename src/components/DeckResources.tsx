import { type FC, useState, useCallback } from 'react'
import { ChevronDown, Download, Plus, Check, Loader2, Dices, Layers, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useStore } from '../store/useStore'

interface DeckGroup {
  name: string
  icon: LucideIcon
  files: { name: string; main: number; extra: number; side: number }[]
}

const deckGroups: DeckGroup[] = [
  {
    name: '随机卡池',
    icon: Dices,
    files: [
      { name: '怪兽.ydk', main: 16, extra: 15, side: 13 },
      { name: '魔法.ydk', main: 40, extra: 0, side: 2 },
      { name: '陷阱.ydk', main: 26, extra: 0, side: 1 },
    ],
  },
  {
    name: '自选卡组',
    icon: Layers,
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
    icon: Wrench,
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
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set())
  const [loadingName, setLoadingName] = useState<string | null>(null)
  const { addDecks } = useStore()

  const handleAddToMerger = useCallback(async (groupName: string, fileName: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (loadingName) return

    setLoadingName(fileName)
    try {
      const url = `./ydk-decks/${encodeURIComponent(groupName)}/${encodeURIComponent(fileName)}`
      const resp = await fetch(url)
      if (!resp.ok) throw new Error('加载失败')
      const text = await resp.text()
      const file = new File([text], fileName, { type: 'text/plain' })
      await addDecks([file])

      setAddedNames(prev => {
        const next = new Set(prev)
        next.add(fileName)
        return next
      })
      setTimeout(() => {
        setAddedNames(prev => {
          const next = new Set(prev)
          next.delete(fileName)
          return next
        })
      }, 1500)
    } catch {
      // silently fail, user can still download manually
    } finally {
      setLoadingName(null)
    }
  }, [addDecks, loadingName])

  return (
    <div className="border border-line bg-surface">
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          w-full flex items-center justify-between px-4 py-3
          text-[13px] text-ink2 hover:text-ink transition-colors duration-150
        "
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">卡组资源</span>
          <span className="text-xs text-muted">32 个预置文件</span>
        </div>
        <ChevronDown className={`
          w-4 h-4 text-muted transition-transform duration-150
          ${expanded ? 'rotate-180' : ''}
        `} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in border-t border-line">
          <p className="text-xs text-muted leading-relaxed pt-3">
            点击文件名加载到上方合并区，点击右侧图标下载到本地。
          </p>
          {deckGroups.map(group => {
            const GroupIcon = group.icon
            return (
              <div key={group.name}>
                <h4 className="flex items-center gap-1.5 text-xs font-medium text-ink2 mb-2">
                  <GroupIcon className="w-3.5 h-3.5 text-muted" />
                  {group.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.files.map(file => {
                    const isAdded = addedNames.has(file.name)
                    const isLoading = loadingName === file.name
                    return (
                      <div
                        key={file.name}
                        className="
                          inline-flex items-center text-xs
                          bg-surface border border-line
                          hover:border-line2 transition-colors duration-150
                        "
                      >
                        <button
                          onClick={(e) => handleAddToMerger(group.name, file.name, e)}
                          disabled={isLoading}
                          className="
                            inline-flex items-center gap-1.5 px-2 py-1
                            text-ink2 hover:text-accent
                            disabled:opacity-60 disabled:cursor-wait
                            transition-colors duration-150
                          "
                          title={`主 ${file.main} / 额外 ${file.extra} / 备牌 ${file.side}`}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isAdded ? (
                            <Check className="w-3 h-3 text-accent" />
                          ) : (
                            <Plus className="w-3 h-3 text-muted" />
                          )}
                          {file.name.replace('.ydk', '')}
                        </button>
                        <a
                          href={`./ydk-decks/${group.name}/${file.name}`}
                          download
                          className="
                            px-2 py-1 border-l border-line
                            text-muted hover:text-ink2
                            transition-colors duration-150
                          "
                          title="下载到本地"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-3 h-3" />
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DeckResources
