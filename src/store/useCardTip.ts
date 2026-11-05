import { create } from 'zustand'
import type { CardInfo } from '../utils/cardInfo'

interface CardTipState {
  id: number | null
  info?: CardInfo
  x: number
  y: number
  show: (id: number, info: CardInfo | undefined, x: number, y: number) => void
  hide: () => void
}

export const useCardTip = create<CardTipState>(set => ({
  id: null,
  info: undefined,
  x: 0,
  y: 0,
  show: (id, info, x, y) => set({ id, info, x, y }),
  hide: () => set({ id: null, info: undefined }),
}))

/* 行与浮层之间留出 10px 间隙，离开后延迟收起，给鼠标移入浮层留出时间 */
let hideTimer: ReturnType<typeof setTimeout> | undefined

export function scheduleHideTip() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => useCardTip.getState().hide(), 300)
}

export function cancelHideTip() {
  clearTimeout(hideTimer)
}
