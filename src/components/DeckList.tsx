import { type FC, useEffect, useMemo, useState } from 'react'
import { FileText, X, ChevronDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import { fetchCardInfos, type CardInfo } from '../utils/cardInfo'
import type { CardCount } from '../types'
import CardRow from './CardRow'

type InfoMap = Record<number, CardInfo>

function aggregate(ids: number[]): CardCount[] {
  const counts = new Map<number, number>()
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1)
  return [...counts.entries()].map(([id, count]) => ({ id, count }))
}

const Section: FC<{ title: string; cards: CardCount[]; infos: InfoMap }> = ({ title, cards, infos }) => {
  if (cards.length === 0) return null
  return (
    <div>
      <p className="text-[11px] text-muted mb-1.5">
        {title} · {cards.reduce((sum, c) => sum + c.count, 0)} 张
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
        {cards.map(card => (
          <CardRow key={card.id} id={card.id} count={card.count} info={infos[card.id]} size="sm" />
        ))}
      </div>
    </div>
  )
}

const DeckList: FC = () => {
  const { decks, removeDeck } = useStore()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [infos, setInfos] = useState<InfoMap>({})

  const preview = expanded !== null ? decks[expanded] : undefined

  useEffect(() => {
    if (!preview) {
      setInfos({})
      return
    }
    let cancelled = false
    fetchCardInfos([...preview.main, ...preview.extra, ...preview.side]).then(map => {
      if (!cancelled) setInfos(map)
    })
    return () => { cancelled = true }
  }, [preview])

  const sections = useMemo(() => {
    if (!preview) return null
    return {
      main: aggregate(preview.main),
      extra: aggregate(preview.extra),
      side: aggregate(preview.side),
    }
  }, [preview])

  if (decks.length === 0) return null

  const handleRemove = (index: number) => {
    if (expanded === index) setExpanded(null)
    else if (expanded !== null && expanded > index) setExpanded(expanded - 1)
    removeDeck(index)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-baseline gap-2 mb-2.5">
        <h2 className="text-[13px] font-medium text-ink">已载入卡组</h2>
        <span className="text-xs text-muted">{decks.length} 个文件 · 点击查看卡片</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {decks.map((deck, index) => {
          const isOpen = expanded === index
          return (
            <div
              key={`${deck.fileName}-${index}`}
              className={`
                flex items-center text-[12.5px] border transition-colors duration-150
                ${isOpen
                  ? 'bg-accent-soft border-accent text-ink'
                  : 'bg-surface border-line text-ink2 hover:border-line2'
                }
              `}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex items-center gap-2 pl-2.5 pr-1.5 py-1"
              >
                <FileText className="w-3.5 h-3.5 text-muted" />
                <span className="max-w-[180px] truncate">{deck.fileName}</span>
                <span className="text-xs text-muted font-mono">
                  {deck.main.length + deck.extra.length + deck.side.length}
                </span>
                <ChevronDown className={`
                  w-3.5 h-3.5 text-muted transition-transform duration-150
                  ${isOpen ? 'rotate-180' : ''}
                `} />
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="p-1 pr-2 text-muted hover:text-danger transition-colors duration-150"
                title="移除"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {preview && sections && (
        <div className="mt-2.5 border border-line bg-surface p-3.5 animate-fade-in">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[12.5px] text-ink font-medium truncate">{preview.fileName}</p>
            <p className="text-[11px] text-muted shrink-0 ml-3">
              主 {preview.main.length} · 额外 {preview.extra.length} · 备牌 {preview.side.length}
            </p>
          </div>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            <Section title="主卡组" cards={sections.main} infos={infos} />
            <Section title="额外卡组" cards={sections.extra} infos={infos} />
            <Section title="备牌" cards={sections.side} infos={infos} />
          </div>
        </div>
      )}
    </div>
  )
}

export default DeckList
