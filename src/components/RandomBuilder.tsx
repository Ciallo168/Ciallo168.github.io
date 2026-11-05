import { type FC, useState, useCallback } from 'react'
import { Shuffle, Loader2, Download } from 'lucide-react'
import { useStore } from '../store/useStore'
import { parseYdkContent, mergeDecks, downloadYdk } from '../utils/ydkParser'
import type { YdkDeck } from '../types'

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

const numInput = `
  w-14 px-2 py-1 text-[13px] text-center font-mono text-ink
  bg-surface border border-line
  focus:outline-none focus:border-accent transition-colors duration-150
`

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
    <div className="animate-fade-in space-y-5">
      {/* 标题 */}
      <div>
        <h2 className="text-[13px] font-medium text-ink">随机构筑</h2>
        <p className="text-xs text-muted mt-1">
          从预置卡组中随机抽取，合并结果可直接导出。
        </p>
      </div>

      {/* 设置面板 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="col-span-2 sm:col-span-1 space-y-1">
          <label className="text-xs text-muted">自选卡组</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number" min={0} max={CUSTOM_DECKS.length}
              value={deckCount}
              onChange={e => setDeckCount(Math.max(0, Math.min(CUSTOM_DECKS.length, parseInt(e.target.value) || 0)))}
              className={numInput}
            />
            <span className="text-xs text-muted">/ {CUSTOM_DECKS.length}</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted">小轴</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number" min={0} max={ENGINES.length}
              value={engineCount}
              onChange={e => setEngineCount(Math.max(0, Math.min(ENGINES.length, parseInt(e.target.value) || 0)))}
              className={numInput}
            />
            <span className="text-xs text-muted">/ {ENGINES.length}</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted">怪兽</label>
          <input
            type="number" min={0} max={99}
            value={monsterCount}
            onChange={e => setMonsterCount(Math.max(0, parseInt(e.target.value) || 0))}
            className={numInput}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted">魔法</label>
          <input
            type="number" min={0} max={99}
            value={spellCount}
            onChange={e => setSpellCount(Math.max(0, parseInt(e.target.value) || 0))}
            className={numInput}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted">陷阱</label>
          <input
            type="number" min={0} max={99}
            value={trapCount}
            onChange={e => setTrapCount(Math.max(0, parseInt(e.target.value) || 0))}
            className={numInput}
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || (deckCount === 0 && engineCount === 0 && monsterCount === 0 && spellCount === 0 && trapCount === 0)}
        className="
          flex items-center gap-2 px-4 py-2 text-[13px] font-medium
          bg-accent text-white hover:bg-[#336a4a]
          disabled:bg-line disabled:text-muted disabled:cursor-not-allowed
          transition-colors duration-150
        "
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            正在生成
          </>
        ) : (
          <>
            <Shuffle className="w-3.5 h-3.5" />
            随机生成卡组
          </>
        )}
      </button>

      {/* 选中结果展示 */}
      {selectedInfo && !isGenerating && (
        <div className="animate-fade-in space-y-1.5 pt-1">
          <p className="text-xs text-muted">本次随机选取</p>
          <div className="space-y-1 text-xs text-ink2">
            {selectedInfo.decks.length > 0 && (
              <p>
                <span className="text-muted">卡组</span>
                <span className="font-mono ml-2">({selectedInfo.decks.length})</span>
                <span className="ml-2">{selectedInfo.decks.join('、')}</span>
              </p>
            )}
            {selectedInfo.engines.length > 0 && (
              <p>
                <span className="text-muted">小轴</span>
                <span className="font-mono ml-2">({selectedInfo.engines.length})</span>
                <span className="ml-2">{selectedInfo.engines.join('、')}</span>
              </p>
            )}
            {(selectedInfo.monsters > 0 || selectedInfo.spells > 0 || selectedInfo.traps > 0) && (
              <p>
                <span className="text-muted">卡池</span>
                <span className="ml-2 font-mono">
                  怪兽 {selectedInfo.monsters} · 魔法 {selectedInfo.spells} · 陷阱 {selectedInfo.traps}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* 结果预览 + 下载 */}
      {mergeResult && !isGenerating && (
        <div className="animate-fade-in space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-medium text-ink">随机结果</h2>
            <button
              onClick={() => downloadYdk(mergeResult, 'random_deck.ydk')}
              className="
                flex items-center gap-2 px-4 py-2 text-[13px] font-medium
                bg-surface border border-line2 text-ink2
                hover:border-accent hover:text-accent
                transition-colors duration-150
              "
            >
              <Download className="w-3.5 h-3.5" />
              下载 random_deck.ydk
            </button>
          </div>

          <div className="grid grid-cols-3 border border-line bg-surface">
            <div className="p-4 border-r border-line">
              <p className="text-xs text-muted mb-2">主卡组</p>
              <span className="text-[22px] font-semibold font-mono text-ink leading-none">
                {mergeResult.totalMain}
              </span>
              <span className="text-xs text-muted ml-1.5">张</span>
            </div>
            <div className="p-4 border-r border-line">
              <p className="text-xs text-muted mb-2">额外卡组</p>
              <span className="text-[22px] font-semibold font-mono text-ink leading-none">
                {mergeResult.totalExtra}
              </span>
              <span className="text-xs text-muted ml-1.5">张</span>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted mb-2">备牌</p>
              <span className="text-[22px] font-semibold font-mono text-ink leading-none">
                {mergeResult.totalSide}
              </span>
              <span className="text-xs text-muted ml-1.5">张</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomBuilder
