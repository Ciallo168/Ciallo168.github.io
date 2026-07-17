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
    <div className="min-h-screen flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
        <Header />

        {/* 模式切换 */}
        <div className="flex justify-center animate-fade-in">
          <div className="
            inline-flex rounded-lg border border-cyber-border bg-cyber-card
            p-0.5
          ">
            <button
              onClick={() => setMode('manual')}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                ${mode === 'manual'
                  ? 'bg-cyber-purple/20 text-cyber-purple shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-gray-500 hover:text-gray-300'
                }
              `}
            >
              <ArrowRightLeft className="w-4 h-4" />
              手动合并
            </button>
            <button
              onClick={() => setMode('random')}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                ${mode === 'random'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'text-gray-500 hover:text-gray-300'
                }
              `}
            >
              <Dices className="w-4 h-4" />
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

      <footer className="mt-auto py-4 text-center text-xs text-gray-600">
        YDK Merger · 纯前端工具 · 数据不上传服务器
      </footer>
    </div>
  )
}

export default App
