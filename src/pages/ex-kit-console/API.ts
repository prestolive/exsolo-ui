import { request } from '@/utils/request'
export interface PageObject<T> {
  values?: T[]
  pagination: Pagination
}
export interface ApiDocBO {
  path?: string
  method?: string
  name?: string
  nameLower?: string
  returnType?: ApiDocTypeBO
  paramTypes?: ApiDocTypeBO[]
}
export interface ApiDocTypeBO {
  clz?: string
  datatype?: string
  name?: string
  tsType?: string
  isObject?: boolean
  isListType?: boolean
  isNullAble?: boolean
  fieldTypes?: ApiDocTypeBO[]
}
export interface ApiDocClzBO {
  module?: string
  clz?: string
}
export interface ItemTagPO {
  id?: string
  itemType?: string
  name?: string
  module?: string
  clz?: string
  customAble?: boolean
}
export interface ItemPO {
  id?: string
  tag?: string
  itemType?: string
  code?: string
  name?: string
  sys?: boolean
  text?: boolean
  status?: string
  pid?: string
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
  'api/ex-kit-console/api-doc2code': {
    req: {
      className?: string
    }
    resp: null
  }
  'api/ex-kit-console/api-docs2code': {
    req: {
      module?: string
    }
    resp: null
  }
  'api/ex-kit-console/api-doc': {
    req: {
      className?: string
    }
    resp: ApiDocBO[]
  }
  'api/ex-kit-console/api-previews': {
    req: null
    resp: ApiDocClzBO[]
  }
  'api/ex-kit-console/item-tags': {
    req: null
    resp: ItemTagPO[]
  }
  'api/ex-kit-console/get-tag': {
    req: {
      id?: string
    }
    resp: ItemTagPO
  }
  'api/ex-kit-console/create-item': {
    req: {
      item?: ItemPO
      tag?: string
    }
    resp: null
  }
  'api/ex-kit-console/delete-item': {
    req: {
      id?: string
    }
    resp: null
  }
  'api/ex-kit-console/items': {
    req: {
      module?: string
      itemType?: string
      tag?: string
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<ItemPO>
  }
}

export function post<URL extends keyof POST>(
  url: URL,
  data?: POST[URL]['req']
): Promise<POST[URL]['resp']> {
  window.console.log('API', url, data)
  return request.post<POST[URL]['resp']>({
    url,
    data,
  })
}
export function download(url: string, data: object): Promise<null> {
  return request.download({ url, data })
}
