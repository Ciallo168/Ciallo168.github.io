import { type FC } from 'react'
import { Home } from 'lucide-react'

const Header: FC = () => {
  return (
    <header className="pt-6 pb-5 border-b border-line">
      <nav className="flex items-center gap-2 mb-5 text-xs text-muted">
        <a
          href="/"
          className="
            inline-flex items-center gap-1 px-2 py-1 border border-line bg-surface
            text-ink2 hover:text-accent hover:border-accent
            transition-colors duration-150
          "
        >
          <Home className="w-3.5 h-3.5" />
          首页
        </a>
        <span className="text-line2">/</span>
        <span>YDK 卡组合并工具</span>
      </nav>

      <h1 className="text-[22px] font-semibold tracking-tight text-ink leading-snug">
        YDK 卡组合并工具
      </h1>
      <p className="text-[13px] text-muted mt-1.5 leading-relaxed max-w-[46em]">
        上传多个 .ydk 文件，按主卡组、额外卡组、备牌三段合并后导出。文件只在浏览器本地处理。
      </p>
    </header>
  )
}

export default Header
