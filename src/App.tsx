import { type FC, useState } from 'react'
import { ArrowRightLeft, Dices } from 'lucide-react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DeckList from './components/DeckList'
import MergeConfigPanel from './components/MergeConfigPanel'
import ActionBar from './components/ActionBar'
import ResultPreview from './components/ResultPreview'
import DeckResources from './components/DeckResources'
import RandomBuilder from './components/RandomBuilder'

type Mode = 'manual' | 'random'

const App: FC = () => {
  const [mode, setMode] = useState<Mode>('manual')

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <div className="max-w-[720px] w-full mx-auto px-5 pb-14 flex flex-col gap-6">
        <Header />

        {/* 模式切换 */}
        <div className="flex animate-fade-in">
          <div className="inline-flex border border-line bg-surface p-0.5 gap-0.5">
            <button
              onClick={() => setMode('manual')}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium
                transition-colors duration-150
                ${mode === 'manual'
                  ? 'bg-ink text-white'
                  : 'text-ink2 hover:text-ink'
                }
              `}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              手动合并
            </button>
            <button
              onClick={() => setMode('random')}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium
                transition-colors duration-150
                ${mode === 'random'
                  ? 'bg-ink text-white'
                  : 'text-ink2 hover:text-ink'
                }
              `}
            >
              <Dices className="w-3.5 h-3.5" />
              随机构筑
            </button>
          </div>
        </div>

        {mode === 'manual' ? (
          <>
            <UploadZone />
            <DeckList />
            <MergeConfigPanel />
            <ActionBar />
            <ResultPreview />
          </>
        ) : (
          <RandomBuilder />
        )}

        <DeckResources />
      </div>

      <footer className="mt-auto py-5 border-t border-line text-center text-xs text-muted">
        YDK Merger · 纯前端工具 · 数据不上传服务器
      </footer>
    </div>
  )
}

export default App
