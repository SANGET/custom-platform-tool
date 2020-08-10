/**
 * 页面类型详细定义
 */
type PageTypes =
  /** 通过配置生成 */
  | "config"
  /** 嵌入页面 */
  | "embed"

/**
 * 页面元数据
 */
export interface PageMetadata {
  /** 页面 ID */
  id: string
  /** 页面类型 */
  type: PageTypes
  /** 页面名称 */
  name: string
  /** 页面标准接口接口 */
  pageInterface: {
    /** 标准输入 */
    stdout: any
    /** 标准输出 */
    stdin: any
  };
}
