import { BaseTableCol as TDBaseTableCol } from 'tdesign-vue-next'
export type BaseTableCol = TDBaseTableCol
export interface PageInfo {
  current: number
  previous: number
  pageSize: number
}
export interface Pagination {
  total?: number
  pages?: number
  current?: number
  pageSize?: number
}
export interface PageObject<T> {
  values?: T[]
  pagination: Pagination
}
type BaseConditionCompare =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'ge'
  | 'le'
  | 'lk'
  | 'lkl'
  | 'lkr'
type BaseConditionSchema =
  | 'text'
  | 'option'
  | 'number'
  | 'decimal'
  | 'date'
  | 'datetime'
export interface BaseConditionCol {
  key: string
  title: string
  schema: BaseConditionSchema
  required?: boolean
  compare?: BaseConditionCompare
  options?: object[]
}
/* 查询选项，用于推送到后端 */
export interface ConditionItem {
  key: string
  action: string
  value: string
}
