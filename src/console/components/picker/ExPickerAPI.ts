import { request } from '@/utils/request'
export interface PageObject<T> {
  values?: T[]
  pagination: Pagination
}
export interface ExPickerOptionBO {
  value?: string
  label?: string
  sub?: string
  echo1?: string
  echo2?: string
  echo3?: string
  echo4?: string
  echo5?: string
}
export interface Condition {
  ASC?: string
  DESC?: string
  existFilters?: ConditionFilter[]
  unExistFilters?: ConditionFilter[]
  orders?: OrderBaseBean[]
}
export interface ConditionFilter {
  key?: string
  table?: string
  tableAlias?: string
  joinKey?: string
}
export interface OrderBaseBean {
  type?: string
  field?: string
}
export interface Pagination {
  total?: number
  pages?: number
  current?: number
  pageSize?: number
}

interface POST {
  'api/console/picker/get': {
    req: {
      code?: string
      ids?: string[]
    }
    resp: ExPickerOptionBO[]
  }
  'api/console/picker/find': {
    req: {
      code?: string
      keyword?: string
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<ExPickerOptionBO>
  }
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
