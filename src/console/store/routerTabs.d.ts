import { RouteRecordName, LocationQueryRaw } from 'vue-router'

export interface RouterTabItem {
  path: string
  query?: LocationQueryRaw
  routeIdx?: number
  title?: string
  name?: RouteRecordName
  isAlive?: boolean
  isHome?: boolean
  meta?: any
}
