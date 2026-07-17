import { type FC } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DeckList from './components/DeckList'
import MergeConfigPanel from './components/MergeConfigPanel'
import ActionBar from './components/ActionBar'
import ResultPreview from './components/ResultPreview'
import DeckResources from './components/DeckResources'

const App: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
        <Header />
        <UploadZone />
        <DeckList />
        <MergeConfigPanel />
        <ActionBar />
        <ResultPreview />
        <DeckResources />
      </div>

      <footer className="mt-auto py-4 text-center text-xs text-gray-600">
        YDK Merger · 纯前端工具 · 数据不上传服务器
      </footer>
    </div>
  )
}

export default App
