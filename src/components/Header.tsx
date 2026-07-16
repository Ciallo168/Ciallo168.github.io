import { type FC } from 'react'
import { Sparkles, ArrowLeft, Home } from 'lucide-react'

const Header: FC = () => {
  return (
    <header className="pt-6 pb-6 animate-fade-in">
      {/* 分级导航面包屑 */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <a
          href="/"
          className="
            flex items-center gap-1 px-3 py-1.5 rounded-lg
            text-gray-400 bg-cyber-card border border-cyber-border
            hover:text-cyber-purple hover:border-cyber-purple/40
            hover:shadow-[0_0_10px_rgba(168,85,247,0.15)]
            transition-all duration-300
          "
        >
          <Home className="w-3.5 h-3.5" />
          首页
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-cyber-purple font-medium">YDK 卡组合并工具</span>
      </div>

      <div className="text-center">
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
      </div>
    </header>
  )
}

export default Header
