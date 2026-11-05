import { type FC } from 'react'
import { Play, Download, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { downloadYdk } from '../utils/ydkParser'

const ActionBar: FC = () => {
  const { decks, mergeResult, executeMerge, clearAll } = useStore()

  if (decks.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2.5 animate-fade-in pt-1">
      <button
        onClick={executeMerge}
        className="
          flex items-center gap-2 px-4 py-2 text-[13px] font-medium
          bg-accent text-white hover:bg-[#336a4a]
          transition-colors duration-150
        "
      >
        <Play className="w-3.5 h-3.5" />
        合并卡组
      </button>

      {mergeResult && (
        <button
          onClick={() => downloadYdk(mergeResult)}
          className="
            flex items-center gap-2 px-4 py-2 text-[13px] font-medium
            bg-surface border border-line2 text-ink2
            hover:border-accent hover:text-accent
            transition-colors duration-150
          "
        >
          <Download className="w-3.5 h-3.5" />
          下载 .ydk
        </button>
      )}

      <button
        onClick={clearAll}
        className="
          flex items-center gap-2 px-3 py-2 text-[13px]
          text-muted hover:text-danger
          transition-colors duration-150
        "
      >
        <Trash2 className="w-3.5 h-3.5" />
        清空
      </button>
    </div>
  )
}

export default ActionBar
