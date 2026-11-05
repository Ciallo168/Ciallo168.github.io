import { type FC } from 'react'
import { useStore } from '../store/useStore'

const MergeConfigPanel: FC = () => {
  const { mergeConfig, updateConfig, decks } = useStore()

  if (decks.length === 0) return null

  return (
    <div className="animate-fade-in">
      <h2 className="text-[13px] font-medium text-ink mb-2.5">合并选项</h2>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={mergeConfig.deduplicate}
              onChange={e => updateConfig({ deduplicate: e.target.checked })}
              className="sr-only peer"
            />
            <div className="
              w-9 h-[18px] bg-line2 transition-colors duration-150
              peer-checked:bg-accent
            " />
            <div className="
              absolute top-[2px] left-[2px] w-[14px] h-[14px] bg-white
              transition-transform duration-150
              peer-checked:translate-x-[18px]
            " />
          </div>
          <span className="text-[13px] text-ink2">自动去重</span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-[13px] text-muted">每卡上限</span>
          <input
            type="number"
            min={1}
            max={99}
            value={mergeConfig.maxCopies}
            onChange={e => updateConfig({ maxCopies: Math.max(1, parseInt(e.target.value) || 3) })}
            disabled={!mergeConfig.deduplicate}
            className={`
              w-12 px-2 py-1 text-[13px] text-center font-mono text-ink
              bg-surface border border-line
              focus:outline-none focus:border-accent
              transition-colors duration-150
              ${!mergeConfig.deduplicate ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          />
          <span className="text-xs text-muted">张</span>
        </label>
      </div>
    </div>
  )
}

export default MergeConfigPanel
