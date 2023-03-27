export interface PageObject<T> {
  list?: T[]
  total: number
  current: number
  pageSize: number
}
