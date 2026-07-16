import { type FC } from 'react'
import { Layers, Zap, Shield } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { CardCount } from '../types'

interface SectionCardProps {
  title: string
  icon: React.ReactNode
  color: string
  cards: CardCount[]
  total: number
}

const SectionCard: FC<SectionCardProps> = ({ title, icon, color, cards, total }) => {
  return (
    <div className="
      flex-1 min-w-[200px] rounded-xl p-4
      bg-cyber-card border border-cyber-border
      hover:border-cyber-purple/30 transition-all duration-300
    ">
      <div className="flex items-center gap-2 mb-3">
        <div className={`${color}`}>{icon}</div>
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
      </div>

      <div className="mb-3">
        <span className="text-2xl font-bold font-mono text-white">{total}</span>
        <span className="text-xs text-gray-500 ml-1">张</span>
      </div>

      <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
        {cards.slice(0, 20).map(card => (
          <div
            key={card.id}
            className="flex items-center justify-between text-xs py-0.5"
          >
            <span className="text-gray-400 font-mono">{card.id}</span>
            {card.count > 1 && (
              <span className="text-cyber-purple/80 font-mono">x{card.count}</span>
            )}
          </div>
        ))}
        {cards.length > 20 && (
          <div className="text-xs text-gray-500 pt-1">
            ... 还有 {cards.length - 20} 种卡片
          </div>
        )}
        {cards.length === 0 && (
          <div className="text-xs text-gray-600">暂无卡片</div>
        )}
      </div>
    </div>
  )
}

const ResultPreview: FC = () => {
  const { mergeResult } = useStore()

  if (!mergeResult) return null

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-cyber-gold" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          合并结果 · {mergeResult.sourceDeckCount} 个卡组
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <SectionCard
          title="主卡组 #main"
          icon={<Layers className="w-4 h-4" />}
          color="text-cyber-purple"
          cards={mergeResult.main}
          total={mergeResult.totalMain}
        />
        <SectionCard
          title="额外卡组 #extra"
          icon={<Zap className="w-4 h-4" />}
          color="text-cyber-cyan"
          cards={mergeResult.extra}
          total={mergeResult.totalExtra}
        />
        <SectionCard
          title="备牌 !side"
          icon={<Shield className="w-4 h-4" />}
          color="text-cyber-gold"
          cards={mergeResult.side}
          total={mergeResult.totalSide}
        />
      </div>
    </div>
  )
}

export default ResultPreview
