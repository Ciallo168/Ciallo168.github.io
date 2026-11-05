/* 卡牌信息查询：ygocdb.com 的批量接口 + 卡图 CDN 缩略图 */

export interface CardInfo {
  id: number
  cid: number
  name: string
}

const CACHE_KEY = 'ydk-card-info-v1'
const API_URL = 'https://ygocdb.com/api/v0/cardset'
const CHUNK_SIZE = 60
const REQUEST_TIMEOUT = 8000

type CacheMap = Record<string, CardInfo>

function loadCache(): CacheMap {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) as CacheMap : {}
  } catch {
    return {}
  }
}

const cache: CacheMap = loadCache()

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // 存储写满时忽略，内存缓存仍然有效
  }
}

/** 卡图缩略图地址（CDN 建议直接用 !thumb，避免拉原图） */
export function cardImageUrl(id: number): string {
  return `https://cdn.233.momobako.com/ygopro/pics/${id}.jpg!thumb`
}

interface CardsetEntry {
  id?: number
  cid?: number
  text?: { name?: string; cn_name?: string }
}

async function requestChunk(ids: number[]): Promise<void> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
      signal: controller.signal,
    })
    if (!resp.ok) return
    const data = await resp.json() as Record<string, CardsetEntry>
    for (const key of Object.keys(data)) {
      const entry = data[key]
      const id = Number(entry?.id ?? key)
      const name = entry?.text?.name || entry?.text?.cn_name
      if (!id || !name) continue
      cache[String(id)] = { id, cid: Number(entry?.cid ?? 0), name }
    }
  } catch {
    // 网络异常时保留已有缓存，未命中的卡片只显示编号
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 批量查询卡牌信息。命中缓存的直接返回，只请求缺失的部分。
 * 失败时不抛错，返回已拿到的结果。
 */
export async function fetchCardInfos(ids: number[]): Promise<Record<number, CardInfo>> {
  const unique = [...new Set(ids)].filter(id => Number.isFinite(id) && id > 0)
  const missing = unique.filter(id => !cache[String(id)])

  if (missing.length > 0) {
    const chunks: number[][] = []
    for (let i = 0; i < missing.length; i += CHUNK_SIZE) {
      chunks.push(missing.slice(i, i + CHUNK_SIZE))
    }
    await Promise.all(chunks.map(requestChunk))
    saveCache()
  }

  const result: Record<number, CardInfo> = {}
  for (const id of unique) {
    const info = cache[String(id)]
    if (info) result[id] = info
  }
  return result
}
