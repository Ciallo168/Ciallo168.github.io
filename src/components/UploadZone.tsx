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
    <div className="animate-fade-in">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          border border-dashed p-10 text-center cursor-pointer
          transition-colors duration-150
          ${isDragging
            ? 'border-accent bg-accent-soft'
            : 'border-line2 bg-surface hover:border-accent hover:bg-accent-soft'
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
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
            <span className="text-ink2 text-[13px]">正在解析文件</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-5 h-5 text-ink2" />
            <div>
              <p className="text-ink text-[13.5px] font-medium">
                将 .ydk 文件拖到这里
              </p>
              <p className="text-muted text-xs mt-1">
                或点击选择文件，支持多选
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 px-3 py-2 bg-surface border border-danger/30 flex items-center justify-between animate-fade-in">
          <span className="text-danger text-[13px]">{error}</span>
          <button
            onClick={clearError}
            className="text-muted hover:text-danger text-xs transition-colors duration-150"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadZone
