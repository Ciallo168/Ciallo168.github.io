import { create } from 'zustand'
import type { YdkDeck, MergeConfig, MergeResult } from '../types'
import { readYdkFile, mergeDecks } from '../utils/ydkParser'

interface AppState {
  decks: YdkDeck[]
  mergeConfig: MergeConfig
  mergeResult: MergeResult | null
  isLoading: boolean
  error: string | null

  addDecks: (files: File[]) => Promise<void>
  removeDeck: (index: number) => void
  updateConfig: (config: Partial<MergeConfig>) => void
  executeMerge: () => void
  clearAll: () => void
  clearError: () => void
}

export const useStore = create<AppState>((set, get) => ({
  decks: [],
  mergeConfig: {
    deduplicate: true,
    maxCopies: 3,
  },
  mergeResult: null,
  isLoading: false,
  error: null,

  addDecks: async (files: File[]) => {
    set({ isLoading: true, error: null })
    try {
      const ydkFiles = files.filter(f => f.name.toLowerCase().endsWith('.ydk'))
      if (ydkFiles.length === 0) {
        set({ isLoading: false, error: '请选择 .ydk 格式的文件' })
        return
      }
      const newDecks = await Promise.all(ydkFiles.map(readYdkFile))
      set(state => ({
        decks: [...state.decks, ...newDecks],
        isLoading: false,
        mergeResult: null,
      }))
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : '解析文件时出错',
      })
    }
  },

  removeDeck: (index: number) => {
    set(state => ({
      decks: state.decks.filter((_, i) => i !== index),
      mergeResult: null,
    }))
  },

  updateConfig: (config: Partial<MergeConfig>) => {
    set(state => ({
      mergeConfig: { ...state.mergeConfig, ...config },
      mergeResult: null,
    }))
  },

  executeMerge: () => {
    const { decks, mergeConfig } = get()
    if (decks.length === 0) {
      set({ error: '请先上传至少一个卡组文件' })
      return
    }
    const result = mergeDecks(decks, mergeConfig)
    set({ mergeResult: result, error: null })
  },

  clearAll: () => {
    set({
      decks: [],
      mergeResult: null,
      error: null,
    })
  },

  clearError: () => set({ error: null }),
}))
