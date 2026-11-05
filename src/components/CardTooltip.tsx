import { type FC, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cardImageUrl } from '../utils/cardInfo'
import { useCardTip, cancelHideTip, scheduleHideTip } from '../store/useCardTip'

/** 全局唯一的卡牌悬停浮层：显示卡名、类型与完整效果文本，效果区可滚动 */
const CardTooltip: FC = () => {
  const { id, info, x, y, hide } = useCardTip()
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id === null) return
    const onScroll = (e: Event) => {
      // 浮层内部滚动不算页面滚动，不收起
      if (boxRef.current && e.target instanceof Node && boxRef.current.contains(e.target)) return
      hide()
    }
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [id, hide])

  if (id === null) return null

  return createPortal(
    <div
      ref={boxRef}
      onMouseEnter={cancelHideTip}
      onMouseLeave={scheduleHideTip}
      className="
        fixed z-50 w-[288px] bg-surface border border-line p-3
        shadow-[0_2px_8px_rgba(0,0,0,0.08)]
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
        <div className="max-h-[190px] overflow-y-auto overscroll-contain pr-1.5">
          <p className="text-[11.5px] text-ink2 leading-relaxed whitespace-pre-line">
            {info?.desc || '暂无效果文本'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CardTooltip
