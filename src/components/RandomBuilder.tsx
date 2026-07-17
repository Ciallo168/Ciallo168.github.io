import { type FC, useState, useCallback } from 'react'
import { Shuffle, Loader2, Download, Dices, Layers, Zap, Shield } from 'lucide-react'
import { useStore } from '../store/useStore'
import { parseYdkContent, mergeDecks, downloadYdk } from '../utils/ydkParser'
import type { YdkDeck, MergeResult } from '../types'

/* ========== 卡组资源清单 ========== */

const CUSTOM_DECKS = [
  'll.ydk', '十二兽.ydk', '兽带.ydk', '勇者.ydk', '忍者.ydk',
  '地中.ydk', '幽鬼.ydk', '斗魂.ydk', '春化.ydk', '海造.ydk',
  '皮尔.ydk', '遗式.ydk', '雷龙.ydk', '魔弹.ydk',
]

const ENGINES = [
  '刻魔小轴.ydk', '反转壶小轴.ydk', '幽鬼小轴.ydk', '恐龙小轴.ydk',
  '救祓小轴.ydk', '教导小轴.ydk', '旅鸟小轴.ydk', '日月书小轴.ydk',
  '暗黑界小轴.ydk', '灵魂小轴.ydk', '白银城小轴.ydk', '竹光小轴.ydk',
  '苦命鸳鸯小轴.ydk', '赌狗小轴.ydk', '闪刀小轴.ydk',
]

const BASE_URL = './ydk-decks'

/* ========== 工具函数 ========== */

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, arr.length))
}

async function fetchAndParse(path: string): Promise<YdkDeck> {
  const resp = await fetch(`${BASE_URL}/${path}`)
  if (!resp.ok) throw new Error(`加载失败: ${path}`)
  const text = await resp.text()
  return parseYdkContent(text, path.split('/').pop() || path)
}

async function fetchPoolCards(path: string, count: number): Promise<number[]> {
  const resp = await fetch(`${BASE_URL}/${path}`)
  if (!resp.ok) return []
  const text = await resp.text()
  const deck = parseYdkContent(text, path)
  const pool = deck.main  // 随机卡池文件卡片都在 #main 区
  return pickRandom(pool, count)
}

/* ========== 组件 ========== */

interface SelectedInfo {
  decks: string[]
  engines: string[]
  monsters: number
  spells: number
  traps: number
}

const RandomBuilder: FC = () => {
  const [deckCount, setDeckCount] = useState(2)
  const [engineCount, setEngineCount] = useState(1)
  const [monsterCount, setMonsterCount] = useState(5)
  const [spellCount, setSpellCount] = useState(5)
  const [trapCount, setTrapCount] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo | null>(null)

  const { mergeResult, setMergeResult } = useStore()

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setSelectedInfo(null)
    try {
      // 1. 随机选择大轴和小轴文件
      const selectedDecks = pickRandom(CUSTOM_DECKS, deckCount)
      const selectedEngines = pickRandom(ENGINES, engineCount)

      // 2. 并行加载所有文件
      const deckPromises = [
        ...selectedDecks.map(f => fetchAndParse(`自选/${f}`)),
        ...selectedEngines.map(f => fetchAndParse(`自选小轴/${f}`)),
      ]
      const loadedDecks = await Promise.all(deckPromises)

      // 3. 从随机卡池抽取卡片
      const [monsterCards, spellCards, trapCards] = await Promise.all([
        fetchPoolCards('随机卡池/怪兽.ydk', monsterCount),
        fetchPoolCards('随机卡池/魔法.ydk', spellCount),
        fetchPoolCards('随机卡池/陷阱.ydk', trapCount),
      ])

      // 4. 构造卡池卡组
      const poolDeck: YdkDeck = {
        fileName: '随机卡池',
        main: [...monsterCards, ...spellCards, ...trapCards],
        extra: [],
        side: [],
        accessories: {},
      }

      const allDecks = [...loadedDecks, poolDeck]

      // 5. 合并
      const result = mergeDecks(allDecks, { deduplicate: true, maxCopies: 3 })
      result.sourceDeckCount = selectedDecks.length + selectedEngines.length + 1

      setMergeResult(result)
      setSelectedInfo({
        decks: selectedDecks.map(f => f.replace('.ydk', '')),
        engines: selectedEngines.map(f => f.replace('.ydk', '')),
        monsters: monsterCards.length,
        spells: spellCards.length,
        traps: trapCards.length,
      })
    } catch {
      // ignore
    } finally {
      setIsGenerating(false)
    }
  }, [deckCount, engineCount, monsterCount, spellCount, trapCount, setMergeResult])

  return (
    <div className="animate-slide-up space-y-4">
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <Dices className="w-4 h-4 text-cyber-cyan" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          随机构筑
        </h2>
        <span className="text-xs text-gray-600">自动随机合并 · 一键导出</span>
      </div>

      {/* 设置面板 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="col-span-2 sm:col-span-1 space-y-1">
          <label className="text-xs text-gray-500">自选卡组</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={CUSTOM_DECKS.length}
              value={deckCount}
              onChange={e => setDeckCount(Math.max(0, Math.min(CUSTOM_DECKS.length, parseInt(e.target.value) || 0)))}
              className="
                w-14 px-2 py-1.5 rounded-md text-sm text-center font-mono
                bg-cyber-bg border border-cyber-border text-gray-300
                focus:outline-none focus:border-cyber-purple/60 transition-colors
              "
            />
            <span className="text-xs text-gray-600">/ {CUSTOM_DECKS.length} 个</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">小轴</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={ENGINES.length}
              value={engineCount}
              onChange={e => setEngineCount(Math.max(0, Math.min(ENGINES.length, parseInt(e.target.value) || 0)))}
              className="
                w-14 px-2 py-1.5 rounded-md text-sm text-center font-mono
                bg-cyber-bg border border-cyber-border text-gray-300
                focus:outline-none focus:border-cyber-purple/60 transition-colors
              "
            />
            <span className="text-xs text-gray-600">/ {ENGINES.length} 个</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">怪兽</label>
          <input
            type="number" min={0} max={99}
            value={monsterCount}
            onChange={e => setMonsterCount(Math.max(0, parseInt(e.target.value) || 0))}
            className="
              w-14 px-2 py-1.5 rounded-md text-sm text-center font-mono
              bg-cyber-bg border border-cyber-border text-gray-300
              focus:outline-none focus:border-cyber-purple/60 transition-colors
            "
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">魔法</label>
          <input
            type="number" min={0} max={99}
            value={spellCount}
            onChange={e => setSpellCount(Math.max(0, parseInt(e.target.value) || 0))}
            className="
              w-14 px-2 py-1.5 rounded-md text-sm text-center font-mono
              bg-cyber-bg border border-cyber-border text-gray-300
              focus:outline-none focus:border-cyber-purple/60 transition-colors
            "
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">陷阱</label>
          <input
            type="number" min={0} max={99}
            value={trapCount}
            onChange={e => setTrapCount(Math.max(0, parseInt(e.target.value) || 0))}
            className="
              w-14 px-2 py-1.5 rounded-md text-sm text-center font-mono
              bg-cyber-bg border border-cyber-border text-gray-300
              focus:outline-none focus:border-cyber-purple/60 transition-colors
            "
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || (deckCount === 0 && engineCount === 0 && monsterCount === 0 && spellCount === 0 && trapCount === 0)}
        className="
          flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-sm
          bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-bg
          shadow-[0_0_20px_rgba(34,211,238,0.3)]
          hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
          transition-all duration-300 active:scale-95
        "
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            正在生成...
          </>
        ) : (
          <>
            <Shuffle className="w-4 h-4" />
            随机生成卡组
          </>
        )}
      </button>

      {/* 选中结果展示 */}
      {selectedInfo && !isGenerating && (
        <div className="
          rounded-xl p-4 border border-cyber-border bg-cyber-card/50
          animate-fade-in space-y-2
        ">
          <p className="text-xs text-gray-400">本次随机选取：</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {selectedInfo.decks.length > 0 && (
              <span className="text-cyber-purple">
                🏗️ 卡组 ({selectedInfo.decks.length})：{selectedInfo.decks.join('、')}
              </span>
            )}
            {selectedInfo.engines.length > 0 && (
              <span className="text-cyber-cyan">
                🔧 小轴 ({selectedInfo.engines.length})：{selectedInfo.engines.join('、')}
              </span>
            )}
            {(selectedInfo.monsters > 0 || selectedInfo.spells > 0 || selectedInfo.traps > 0) && (
              <span className="text-cyber-gold">
                🎲 卡池：怪兽{selectedInfo.monsters}张 + 魔法{selectedInfo.spells}张 + 陷阱{selectedInfo.traps}张
              </span>
            )}
          </div>
        </div>
      )}

      {/* 结果预览 + 下载 */}
      {mergeResult && !isGenerating && (
        <div className="animate-slide-up space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyber-gold" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                随机结果
              </h2>
            </div>
            <button
              onClick={() => downloadYdk(mergeResult, 'random_deck.ydk')}
              className="
                flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm
                bg-cyber-gold hover:bg-cyber-gold/80 text-cyber-bg
                shadow-[0_0_20px_rgba(245,158,11,0.3)]
                hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]
                transition-all duration-300 active:scale-95
              "
            >
              <Download className="w-4 h-4" />
              下载 random_deck.ydk
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] rounded-xl p-4 bg-cyber-card border border-cyber-border">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-cyber-purple" />
                <h3 className="text-sm font-semibold text-gray-300">主卡组 #main</h3>
              </div>
              <span className="text-2xl font-bold font-mono text-white">{mergeResult.totalMain}</span>
              <span className="text-xs text-gray-500 ml-1">张</span>
            </div>
            <div className="flex-1 min-w-[200px] rounded-xl p-4 bg-cyber-card border border-cyber-border">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cyber-cyan" />
                <h3 className="text-sm font-semibold text-gray-300">额外卡组 #extra</h3>
              </div>
              <span className="text-2xl font-bold font-mono text-white">{mergeResult.totalExtra}</span>
              <span className="text-xs text-gray-500 ml-1">张</span>
            </div>
            <div className="flex-1 min-w-[200px] rounded-xl p-4 bg-cyber-card border border-cyber-border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-cyber-gold" />
                <h3 className="text-sm font-semibold text-gray-300">备牌 !side</h3>
              </div>
              <span className="text-2xl font-bold font-mono text-white">{mergeResult.totalSide}</span>
              <span className="text-xs text-gray-500 ml-1">张</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomBuilder
