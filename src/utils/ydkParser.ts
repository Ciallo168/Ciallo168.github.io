import type { YdkDeck, CardCount, MergeResult, MergeConfig } from '../types'

/**
 * 解析单个 .ydk 文件内容
 */
export function parseYdkContent(content: string, fileName: string): YdkDeck {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '' && !l.startsWith('#created by'))

  const deck: YdkDeck = {
    fileName,
    main: [],
    extra: [],
    side: [],
    accessories: {},
  }

  let currentSection: 'main' | 'extra' | 'side' | 'accessory' | null = null
  let currentAccessoryKey = ''

  for (const line of lines) {
    if (line === '#main') {
      currentSection = 'main'
      continue
    }
    if (line === '#extra') {
      currentSection = 'extra'
      continue
    }
    if (line === '!side') {
      currentSection = 'side'
      continue
    }
    // 配件分区 (以 # 或 ! 开头的其他标记)
    if (line.startsWith('#') || line.startsWith('!')) {
      currentSection = 'accessory'
      currentAccessoryKey = line
      if (!(currentAccessoryKey in deck.accessories)) {
        deck.accessories[currentAccessoryKey] = 0
      }
      continue
    }

    // 跳过注释放的行 (以 # 开头但本身是卡片密码的ID格式)
    if (line.startsWith('#') && !/^\d+$/.test(line.slice(1))) {
      continue
    }

    const cardId = parseInt(line, 10)
    if (isNaN(cardId)) continue

    switch (currentSection) {
      case 'main':
        deck.main.push(cardId)
        break
      case 'extra':
        deck.extra.push(cardId)
        break
      case 'side':
        if (cardId > 0) deck.side.push(cardId)
        break
      case 'accessory':
        deck.accessories[currentAccessoryKey] = cardId
        break
      default:
        // 默认归入主卡组
        deck.main.push(cardId)
        break
    }
  }

  return deck
}

/**
 * 读取 .ydk 文件并解析
 */
export function readYdkFile(file: File): Promise<YdkDeck> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      resolve(parseYdkContent(content, file.name))
    }
    reader.onerror = () => reject(new Error(`无法读取文件: ${file.name}`))
    reader.readAsText(file)
  })
}

/**
 * 统计数组元素出现次数
 */
function countCards(cards: number[]): CardCount[] {
  const map = new Map<number, number>()
  for (const id of cards) {
    map.set(id, (map.get(id) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id - b.id)
}

/**
 * 合并多个卡组
 */
export function mergeDecks(decks: YdkDeck[], config: MergeConfig): MergeResult {
  const allMain: number[] = []
  const allExtra: number[] = []
  const allSide: number[] = []
  const accessories: Record<string, number> = {}

  // 收集每个分区所有卡片
  for (const deck of decks) {
    allMain.push(...deck.main)
    allExtra.push(...deck.extra)
    allSide.push(...deck.side)
    // 合并配件（后面的覆盖前面的）
    Object.assign(accessories, deck.accessories)
  }

  let mainCounts: CardCount[]
  let extraCounts: CardCount[]
  let sideCounts: CardCount[]

  if (config.deduplicate) {
    mainCounts = countCards(allMain)
    extraCounts = countCards(allExtra)
    sideCounts = countCards(allSide)

    // 限制每种卡片的数量
    if (config.maxCopies > 0) {
      mainCounts = mainCounts.map(c => ({ ...c, count: Math.min(c.count, config.maxCopies) }))
      extraCounts = extraCounts.map(c => ({ ...c, count: Math.min(c.count, config.maxCopies) }))
      sideCounts = sideCounts.map(c => ({ ...c, count: Math.min(c.count, config.maxCopies) }))
    }
  } else {
    // 不去重，直接计数（但保留多次出现）
    mainCounts = allMain.map(id => ({ id, count: 1 }))
    extraCounts = allExtra.map(id => ({ id, count: 1 }))
    sideCounts = allSide.map(id => ({ id, count: 1 }))
  }

  return {
    main: mainCounts,
    extra: extraCounts,
    side: sideCounts,
    accessories,
    totalMain: mainCounts.reduce((sum, c) => sum + c.count, 0),
    totalExtra: extraCounts.reduce((sum, c) => sum + c.count, 0),
    totalSide: sideCounts.reduce((sum, c) => sum + c.count, 0),
    sourceDeckCount: decks.length,
  }
}

/**
 * 将合并结果导出为 .ydk 文件内容
 */
export function exportToYdk(result: MergeResult): string {
  const lines: string[] = ['#created by YDK Merger', '#main']

  // 主卡组
  for (const card of result.main) {
    for (let i = 0; i < card.count; i++) {
      lines.push(card.id.toString())
    }
  }

  lines.push('#extra')
  for (const card of result.extra) {
    for (let i = 0; i < card.count; i++) {
      lines.push(card.id.toString())
    }
  }

  lines.push('!side')
  for (const card of result.side) {
    for (let i = 0; i < card.count; i++) {
      lines.push(card.id.toString())
    }
  }

  // 配件分区
  for (const [key, value] of Object.entries(result.accessories)) {
    lines.push(key)
    lines.push(value.toString())
  }

  return lines.join('\r\n')
}

/**
 * 下载 .ydk 文件
 */
export function downloadYdk(result: MergeResult, filename?: string) {
  const content = exportToYdk(result)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'merged_deck.ydk'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
