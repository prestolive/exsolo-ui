import { asyncRouterList } from '@/router'
// import { shallowRef } from 'vue'

/* TODO 补充后端权限和路由过筛 */
export function getMenu() {
  const tree = asyncRouterList.map((first) => {
    first.children = first.children?.filter((item) => !item.meta?.hidden)
    return first
  })
  return tree
}
