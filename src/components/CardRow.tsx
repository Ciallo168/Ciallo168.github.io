import { type FC, useState } from 'react'
import { cardImageUrl, type CardInfo } from '../utils/cardInfo'

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

const CardRow: FC<CardRowProps> = ({ id, count, info, size = 'md' }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const s = sizeMap[size]

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-line last:border-0">
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
