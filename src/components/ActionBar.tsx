import { type FC } from 'react'
import { Play, Download, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { downloadYdk } from '../utils/ydkParser'

const ActionBar: FC = () => {
  const { decks, mergeResult, executeMerge, clearAll } = useStore()

  if (decks.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3 animate-slide-up">
      <button
        onClick={executeMerge}
        className="
          flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm
          bg-cyber-purple hover:bg-cyber-purple/80 text-white
          shadow-[0_0_20px_rgba(168,85,247,0.3)]
          hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
          transition-all duration-300 active:scale-95
        "
      >
        <Play className="w-4 h-4" />
        合并卡组
      </button>

      {mergeResult && (
        <button
          onClick={() => downloadYdk(mergeResult)}
          className="
            flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm
            bg-cyber-gold hover:bg-cyber-gold/80 text-cyber-bg
            shadow-[0_0_20px_rgba(245,158,11,0.3)]
            hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]
            transition-all duration-300 active:scale-95
          "
        >
          <Download className="w-4 h-4" />
          下载 .ydk
        </button>
      )}

      <button
        onClick={clearAll}
        className="
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
          border border-cyber-border text-gray-400
          hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5
          transition-all duration-300
        "
      >
        <Trash2 className="w-4 h-4" />
        清空
      </button>
    </div>
  )
}

export default ActionBar
