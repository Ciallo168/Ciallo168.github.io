import { type FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cardImageUrl } from '../utils/cardInfo'
import { useCardTip } from '../store/useCardTip'

/** 全局唯一的卡牌悬停浮层：显示卡名、类型与完整效果文本 */
const CardTooltip: FC = () => {
  const { id, info, x, y, hide } = useCardTip()

  useEffect(() => {
    if (id === null) return
    const onScroll = () => hide()
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [id, hide])

  if (id === null) return null

  return createPortal(
    <div
      className="
        fixed z-50 w-[288px] bg-surface border border-line p-3
        shadow-[0_2px_8px_rgba(0,0,0,0.08)] pointer-events-none
      "
      style={{ left: x, top: y }}
    >
      <div className="flex gap-2.5 items-start">
        <img
          src={cardImageUrl(id)}
          alt=""
          referrerPolicy="no-referrer"
          className="w-[48px] h-[70px] shrink-0 object-cover bg-canvas border border-line"
        />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-ink leading-snug">
            {info?.name ?? `卡片 ${id}`}
          </p>
          <p className="text-[11px] text-muted font-mono mt-0.5">{id}</p>
          {info?.types && (
            <p className="text-[11px] text-ink2 leading-relaxed mt-1.5 whitespace-pre-line">
              {info.types}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-line">
        <p className="text-[11.5px] text-ink2 leading-relaxed whitespace-pre-line max-h-[150px] overflow-hidden">
          {info?.desc || '暂无效果文本'}
        </p>
      </div>
    </div>,
    document.body
  )
}

export default CardTooltip
