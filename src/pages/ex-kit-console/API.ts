import { request } from '@/utils/request'
export interface PageObject<T> {
  values?: T[]
  pagination: Pagination
}
export interface Pagination {
  total?: number
  pages?: number
  current: number
  pageSize: number
}
export interface ItemTagPO {
  id: string
  name: string
  schema: string
  module: string
  clz: string
  customAble: boolean
}

export interface ItemPO {
  id: string
  tag: string
  schema: string
  code: string
  name: string
  origin: string
  text: boolean
  status: string
  pid: string
}
export interface ExKitConsoleItemsParam {
  module?: string | null
  schema?: string | null
  tag?: string | null
  keyword?: string | null
  pagination?: Pagination
}

interface GET {
  '/ex-kit-console/item-tags': {
    req: null
    resp: ItemTagPO[]
  }
}

interface POST {
  '/ex-kit-console/items': {
    req: ExKitConsoleItemsParam
    resp: PageObject<ItemPO>
  }
}

export function get<URL extends keyof GET>(
  url: URL,
  params?: GET[URL]['req']
): Promise<GET[URL]['resp']> {
  return request.get<GET[URL]['resp']>({
    url,
    params,
  })
}
export function post<URL extends keyof POST>(
  url: URL,
  params?: POST[URL]['req']
): Promise<POST[URL]['resp']> {
  return request.post<POST[URL]['resp']>({
    url,
    params,
  })
}
