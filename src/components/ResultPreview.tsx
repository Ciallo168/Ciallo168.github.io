import { type FC, useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { fetchCardInfos, cardImageUrl, type CardInfo } from '../utils/cardInfo'
import type { CardCount } from '../types'

type InfoMap = Record<number, CardInfo>

interface SectionCardProps {
  title: string
  tag: string
  cards: CardCount[]
  total: number
  infos: InfoMap
  limit?: number
}

const CardRow: FC<{ card: CardCount; info?: CardInfo }> = ({ card, info }) => {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-line last:border-0">
      <div className="w-[30px] h-[44px] shrink-0 bg-canvas border border-line overflow-hidden">
        {!imgFailed && (
          <img
            src={cardImageUrl(card.id)}
            alt={info?.name ?? String(card.id)}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-ink2 truncate leading-tight">
          {info?.name ?? '—'}
        </p>
        <p className="text-[11px] text-muted font-mono leading-tight mt-0.5">{card.id}</p>
      </div>

      {card.count > 1 && (
        <span className="text-[11px] text-muted font-mono shrink-0">×{card.count}</span>
      )}
    </div>
  )
}

const SectionCard: FC<SectionCardProps> = ({ title, tag, cards, total, infos, limit = 20 }) => {
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

      <div className="max-h-[260px] overflow-y-auto">
        {cards.slice(0, limit).map(card => (
          <CardRow key={card.id} card={card} info={infos[card.id]} />
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
            infos={infos}
            limit={30}
          />
        </div>
        <SectionCard
          title="额外卡组"
          tag="#extra"
          cards={mergeResult.extra}
          total={mergeResult.totalExtra}
          infos={infos}
        />
        <SectionCard
          title="备牌"
          tag="!side"
          cards={mergeResult.side}
          total={mergeResult.totalSide}
          infos={infos}
        />
      </div>

      <p className="text-[11px] text-muted mt-2">
        卡名与卡图来自 ygocdb.com，仅供识别使用
      </p>
    </div>
  )
}

export default ResultPreview
