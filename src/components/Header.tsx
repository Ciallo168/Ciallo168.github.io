import { type FC } from 'react'
import { Sparkles } from 'lucide-react'

const Header: FC = () => {
  return (
    <header className="text-center pt-10 pb-6 animate-fade-in">
      <div className="inline-flex items-center gap-3 mb-2">
        <Sparkles className="w-7 h-7 text-cyber-gold" />
        <h1 className="text-4xl font-bold font-mono neon-text text-cyber-purple tracking-tight">
          YDK Merger
        </h1>
        <Sparkles className="w-7 h-7 text-cyber-gold" />
      </div>
      <p className="text-gray-400 text-sm font-light tracking-wide">
        游戏王卡组文件合并工具 — 上传多个 .ydk 文件，一键合并导出
      </p>
      <div className="mt-3 flex justify-center">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent" />
      </div>
    </header>
  )
}

export default Header
