import { type FC, useRef, useState } from 'react'
import { cardImageUrl, type CardInfo } from '../utils/cardInfo'
import { useCardTip, scheduleHideTip, cancelHideTip } from '../store/useCardTip'

interface CardRowProps {
  id: number
  count?: number
  info?: CardInfo
  size?: 'sm' | 'md'
}

const sizeMap = {
  sm: { box: 'w-[24px] h-[35px]', name: 'text-[11.5px]', id: 'text-[10.5px]' },
  md: { box: 'w-[30px] h-[44px]', name: 'text-[12px]', id: 'text-[11px]' },
}

const TIP_WIDTH = 288
const TIP_HEIGHT = 312
const GAP = 10

const CardRow: FC<CardRowProps> = ({ id, count, info, size = 'md' }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const showTip = useCardTip(state => state.show)
  const s = sizeMap[size]

  const handleEnter = () => {
    cancelHideTip()
    const rect = rowRef.current?.getBoundingClientRect()
    if (!rect) return

    let x = rect.right + GAP
    let y = rect.top - 8

    if (x + TIP_WIDTH > window.innerWidth - 8) {
      const leftX = rect.left - TIP_WIDTH - GAP
      if (leftX >= 8) {
        x = leftX
      } else {
        // 左右都放不下时改为贴在行的下方/上方，避免遮住正在悬停的这一行
        x = Math.min(Math.max(8, rect.left), window.innerWidth - TIP_WIDTH - 8)
        if (rect.bottom + GAP + TIP_HEIGHT <= window.innerHeight - 8) {
          y = rect.bottom + GAP
        } else if (rect.top - TIP_HEIGHT - GAP >= 8) {
          y = rect.top - TIP_HEIGHT - GAP
        } else {
          y = 8
        }
      }
    }

    if (y + TIP_HEIGHT > window.innerHeight - 8) y = window.innerHeight - TIP_HEIGHT - 8
    if (y < 8) y = 8

    showTip(id, info, x, y)
  }

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={scheduleHideTip}
      className="flex items-center gap-2 py-1.5 border-b border-line last:border-0"
    >
      <div className={`${s.box} shrink-0 bg-canvas border border-line overflow-hidden`}>
        {!imgFailed && (
          <img
            src={cardImageUrl(id)}
            alt={info?.name ?? String(id)}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`${s.name} text-ink2 truncate leading-tight`}>
          {info?.name ?? '—'}
        </p>
        <p className={`${s.id} text-muted font-mono leading-tight mt-0.5`}>{id}</p>
      </div>

      {count !== undefined && count > 1 && (
        <span className="text-[11px] text-muted font-mono shrink-0">×{count}</span>
      )}
    </div>
  )
}

export default CardRow
