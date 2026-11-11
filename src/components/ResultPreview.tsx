import { type FC, useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { fetchCardInfos, type CardInfo } from '../utils/cardInfo'
import DeckSection from './DeckSection'

type InfoMap = Record<number, CardInfo>

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
          来自 {mergeResult.sourceDeckCount} 个卡组 · 共 {mergeResult.totalMain + mergeResult.totalExtra + mergeResult.totalSide} 张
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <DeckSection
          title="主卡组"
          tag="#main"
          cards={mergeResult.main}
          total={mergeResult.totalMain}
          infos={infos}
        />
        <DeckSection
          title="额外卡组"
          tag="#extra"
          cards={mergeResult.extra}
          total={mergeResult.totalExtra}
          infos={infos}
        />
        <DeckSection
          title="备牌"
          tag="!side"
          cards={mergeResult.side}
          total={mergeResult.totalSide}
          infos={infos}
        />
      </div>

      <p className="text-[11px] text-muted mt-2">
        按合并后的顺序逐张排列，重复卡牌展开显示；卡名与卡图来自 ygocdb.com，仅供识别使用
      </p>
    </div>
  )
}

export default ResultPreview
