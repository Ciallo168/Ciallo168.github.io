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
