import { type FC, useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { fetchCardInfos, type CardInfo } from '../utils/cardInfo'
import type { CardCount } from '../types'
import CardTile from './CardTile'

type InfoMap = Record<number, CardInfo>

interface DeckSectionProps {
  title: string
  tag: string
  cards: CardCount[]
  total: number
  infos: InfoMap
}

const DeckSection: FC<DeckSectionProps> = ({ title, tag, cards, total, infos }) => {
  const copies = cards.flatMap(card => Array.from({ length: card.count }, (_, i) => ({ id: card.id, key: `${card.id}-${i}` })))

  return (
    <section className="bg-surface border border-line">
      <div className="flex items-baseline justify-between px-4 pt-3 pb-2">
        <h3 className="text-[13px] font-medium text-ink">
          {title}
          <span className="text-muted font-normal"> · </span>
          <span className="font-mono">{total}</span>
          <span className="text-muted font-normal text-[12px]"> 张</span>
        </h3>
        <span className="text-[11px] text-muted font-mono">{tag}</span>
      </div>

      <div className="flex flex-wrap gap-1 px-4 pb-3">
        {copies.map(item => (
          <CardTile key={item.key} id={item.id} info={infos[item.id]} />
        ))}
        {copies.length === 0 && (
          <span className="text-xs text-muted py-1">无卡片</span>
        )}
      </div>
    </section>
  )
}

const ResultPreview: FC = () => {
  const { mergeResult } = useStore()
  const [infos, setInfos] = useState<InfoMap>({})

  useEffect(() => {
    if (!mergeResult) {
      setInfos({})
      return
    }
    let cancelled = false
    const ids = [
      ...mergeResult.main,
      ...mergeResult.extra,
      ...mergeResult.side,
    ].map(card => card.id)

    fetchCardInfos(ids).then(map => {
      if (!cancelled) setInfos(map)
    })

    return () => { cancelled = true }
  }, [mergeResult])

  if (!mergeResult) return null

  return (
    <div className="animate-fade-in pt-2">
      <div className="flex items-baseline gap-2 mb-2.5">
        <h2 className="text-[13px] font-medium text-ink">合并结果</h2>
        <span className="text-xs text-muted">
          来自 {mergeResult.sourceDeckCount} 个卡组 · 共 {mergeResult.totalMain + mergeResult.totalExtra + mergeResult.totalSide} 张
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <DeckSection
          title="主卡组"
          tag="#main"
          cards={mergeResult.main}
          total={mergeResult.totalMain}
          infos={infos}
        />
        <DeckSection
          title="额外卡组"
          tag="#extra"
          cards={mergeResult.extra}
          total={mergeResult.totalExtra}
          infos={infos}
        />
        <DeckSection
          title="备牌"
          tag="!side"
          cards={mergeResult.side}
          total={mergeResult.totalSide}
          infos={infos}
        />
      </div>

      <p className="text-[11px] text-muted mt-2">
        按合并后的顺序逐张排列，重复卡牌展开显示；卡名与卡图来自 ygocdb.com，仅供识别使用
      </p>
    </div>
  )
}

export default ResultPreview
