import { type FC } from 'react'
import { useStore } from '../store/useStore'
import type { CardCount } from '../types'

interface SectionCardProps {
  title: string
  tag: string
  cards: CardCount[]
  total: number
  limit?: number
}

const SectionCard: FC<SectionCardProps> = ({ title, tag, cards, total, limit = 20 }) => {
  return (
    <div className="bg-surface border border-line p-4 h-full">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[13px] font-medium text-ink">{title}</h3>
        <span className="text-[11px] text-muted font-mono">{tag}</span>
      </div>

      <div className="mb-3 pb-3 border-b border-line">
        <span className="text-[22px] font-semibold font-mono text-ink leading-none">{total}</span>
        <span className="text-xs text-muted ml-1.5">张</span>
      </div>

      <div className="space-y-0 max-h-[220px] overflow-y-auto">
        {cards.slice(0, limit).map(card => (
          <div
            key={card.id}
            className="flex items-center justify-between text-xs py-1 border-b border-line last:border-0"
          >
            <span className="text-ink2 font-mono">{card.id}</span>
            {card.count > 1 && (
              <span className="text-muted font-mono">×{card.count}</span>
            )}
          </div>
        ))}
        {cards.length > limit && (
          <div className="text-xs text-muted pt-2">
            还有 {cards.length - limit} 种未显示
          </div>
        )}
        {cards.length === 0 && (
          <div className="text-xs text-muted py-1">无卡片</div>
        )}
      </div>
    </div>
  )
}

const ResultPreview: FC = () => {
  const { mergeResult } = useStore()

  if (!mergeResult) return null

  return (
    <div className="animate-fade-in pt-2">
      <div className="flex items-baseline gap-2 mb-2.5">
        <h2 className="text-[13px] font-medium text-ink">合并结果</h2>
        <span className="text-xs text-muted">
          来自 {mergeResult.sourceDeckCount} 个卡组
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2 sm:row-span-2">
          <SectionCard
            title="主卡组"
            tag="#main"
            cards={mergeResult.main}
            total={mergeResult.totalMain}
            limit={30}
          />
        </div>
        <SectionCard
          title="额外卡组"
          tag="#extra"
          cards={mergeResult.extra}
          total={mergeResult.totalExtra}
        />
        <SectionCard
          title="备牌"
          tag="!side"
          cards={mergeResult.side}
          total={mergeResult.totalSide}
        />
      </div>
    </div>
  )
}

export default ResultPreview
