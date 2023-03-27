import { asyncRouterList } from '@/router'
// import { shallowRef } from 'vue'

/* TODO 补充后端权限和路由过筛 */
export function getMenu() {
  return asyncRouterList
}
