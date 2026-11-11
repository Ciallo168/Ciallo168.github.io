import { type FC } from 'react'
import type { CardCount } from '../types'
import type { CardInfo } from '../utils/cardInfo'
import CardTile from './CardTile'

type InfoMap = Record<number, CardInfo>

interface DeckSectionProps {
  title: string
  tag: string
  cards: CardCount[]
  total: number
  infos: InfoMap
}

/** 卡组视图里的一节：标题行 + 逐张平铺的卡图 */
const DeckSection: FC<DeckSectionProps> = ({ title, tag, cards, total, infos }) => {
  const copies = cards.flatMap(card =>
    Array.from({ length: card.count }, (_, i) => ({ id: card.id, key: `${card.id}-${i}` }))
  )

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

export default DeckSection
