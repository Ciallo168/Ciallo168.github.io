/* YDK 文件解析后的结构 */
export interface YdkDeck {
  fileName: string;
  main: number[];
  extra: number[];
  side: number[];
  accessories: Record<string, number>;
}

/* 合并配置 */
export interface MergeConfig {
  deduplicate: boolean;
  maxCopies: number;
}

/* 合并后的卡片统计 */
export interface CardCount {
  id: number;
  count: number;
}

/* 合并结果 */
export interface MergeResult {
  main: CardCount[];
  extra: CardCount[];
  side: CardCount[];
  accessories: Record<string, number>;
  totalMain: number;
  totalExtra: number;
  totalSide: number;
  sourceDeckCount: number;
}
