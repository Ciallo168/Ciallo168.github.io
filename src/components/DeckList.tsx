import { type FC } from 'react'
import { FileText, X, Layers } from 'lucide-react'
import { useStore } from '../store/useStore'

const DeckList: FC = () => {
  const { decks, removeDeck } = useStore()

  if (decks.length === 0) return null

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-cyber-purple" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          已加载卡组 ({decks.length})
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {decks.map((deck, index) => (
          <div
            key={`${deck.fileName}-${index}`}
            className="
              group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
              bg-cyber-card border border-cyber-border
              hover:border-cyber-purple/40 transition-all duration-200
            "
          >
            <FileText className="w-3.5 h-3.5 text-cyber-purple/70" />
            <span className="text-gray-300 max-w-[160px] truncate">{deck.fileName}</span>
            <span className="text-xs text-gray-500">
              ({deck.main.length + deck.extra.length + deck.side.length})
            </span>
            <button
              onClick={() => removeDeck(index)}
              className="
                ml-1 p-0.5 rounded hover:bg-red-500/20 text-gray-500
                hover:text-red-400 transition-all duration-200
              "
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
