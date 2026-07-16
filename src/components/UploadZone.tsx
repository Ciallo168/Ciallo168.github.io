import { type FC, useCallback, useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'

const UploadZone: FC = () => {
  const { addDecks, isLoading, error, clearError } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | File[]) => {
    addDecks(Array.from(files))
  }, [addDecks])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div className="animate-slide-up">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragging
            ? 'border-cyber-purple bg-cyber-purple/10 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
            : 'border-cyber-border hover:border-cyber-purple/60 hover:bg-cyber-purple/5'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".ydk"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-cyber-purple animate-spin" />
            <span className="text-gray-400 text-sm">正在解析文件...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="
              w-14 h-14 rounded-full bg-cyber-purple/10 flex items-center justify-center
              group-hover:bg-cyber-purple/20 transition-colors duration-300
            ">
              <Upload className="w-7 h-7 text-cyber-purple group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <p className="text-gray-300 font-medium">
                拖拽 .ydk 文件到此处
              </p>
              <p className="text-gray-500 text-xs mt-1">
                或点击选择文件（支持多选）
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between animate-fade-in">
          <span className="text-red-400 text-sm">{error}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300 text-xs ml-2 transition-colors"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadZone
