import { type FC, useRef, useState } from 'react'
import { cardImageUrl, type CardInfo } from '../utils/cardInfo'
import { useCardTip, scheduleHideTip, cancelHideTip } from '../store/useCardTip'

interface CardTileProps {
  id: number
  info?: CardInfo
}

const TIP_WIDTH = 288
const TIP_HEIGHT = 312
const GAP = 10

/** 卡组预览里的单个卡图格：一行一张，重复张数展开成多个格子 */
const CardTile: FC<CardTileProps> = ({ id, info }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const tileRef = useRef<HTMLAnchorElement>(null)
  const showTip = useCardTip(state => state.show)

  const handleEnter = () => {
    cancelHideTip()
    const rect = tileRef.current?.getBoundingClientRect()
    if (!rect) return

    let x = rect.right + GAP
    let y = rect.top - 8

    if (x + TIP_WIDTH > window.innerWidth - 8) {
      const leftX = rect.left - TIP_WIDTH - GAP
      if (leftX >= 8) {
        x = leftX
      } else {
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
    <a
      ref={tileRef}
      href="#"
      onClick={event => event.preventDefault()}
      onMouseEnter={handleEnter}
      onMouseLeave={scheduleHideTip}
      className="block w-[30px] h-[44px] shrink-0 bg-canvas border border-line overflow-hidden
        hover:border-line2 transition-colors duration-150"
      aria-label={info?.name ?? String(id)}
    >
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
    </a>
  )
}

export default CardTile
