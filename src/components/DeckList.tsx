import { type FC } from 'react'
import { FileText, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const DeckList: FC = () => {
  const { decks, removeDeck } = useStore()

  if (decks.length === 0) return null

  return (
    <div className="animate-fade-in">
      <div className="flex items-baseline gap-2 mb-2.5">
        <h2 className="text-[13px] font-medium text-ink">已载入卡组</h2>
        <span className="text-xs text-muted">{decks.length} 个文件</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {decks.map((deck, index) => (
          <div
            key={`${deck.fileName}-${index}`}
            className="
              flex items-center gap-2 px-2.5 py-1 text-[12.5px]
              bg-surface border border-line text-ink2
            "
          >
            <FileText className="w-3.5 h-3.5 text-muted" />
            <span className="max-w-[180px] truncate">{deck.fileName}</span>
            <span className="text-xs text-muted font-mono">
              {deck.main.length + deck.extra.length + deck.side.length}
            </span>
            <button
              onClick={() => removeDeck(index)}
              className="p-0.5 text-muted hover:text-danger transition-colors duration-150"
              title="移除"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeckList
