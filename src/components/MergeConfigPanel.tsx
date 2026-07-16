import { type FC } from 'react'
import { Settings2 } from 'lucide-react'
import { useStore } from '../store/useStore'

const MergeConfigPanel: FC = () => {
  const { mergeConfig, updateConfig, decks } = useStore()

  if (decks.length === 0) return null

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Settings2 className="w-4 h-4 text-cyber-gold" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          合并选项
        </h2>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={mergeConfig.deduplicate}
              onChange={e => updateConfig({ deduplicate: e.target.checked })}
              className="sr-only peer"
            />
            <div className="
              w-10 h-5 rounded-full bg-cyber-border transition-colors duration-200
              peer-checked:bg-cyber-purple/60
            " />
            <div className="
              absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white
              transition-transform duration-200
              peer-checked:translate-x-5
            " />
          </div>
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            自动去重
          </span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-400">每卡上限</span>
          <input
            type="number"
            min={1}
            max={99}
            value={mergeConfig.maxCopies}
            onChange={e => updateConfig({ maxCopies: Math.max(1, parseInt(e.target.value) || 3) })}
            disabled={!mergeConfig.deduplicate}
            className={`
              w-14 px-2 py-1 rounded-md text-sm text-center font-mono
              bg-cyber-card border border-cyber-border
              focus:outline-none focus:border-cyber-purple/60
              transition-colors duration-200 text-gray-300
              ${!mergeConfig.deduplicate ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          />
          <span className="text-xs text-gray-500">张</span>
        </label>
      </div>
    </div>
  )
}

export default MergeConfigPanel
