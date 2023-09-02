import { ref } from 'vue'

import { defineStore } from 'pinia'
import { RouterTabItem } from './routerTabs.d'

/**
 * router的自定义索引类，存储自定义的信息，理论上和router同步
 */
export const useRouterTabsStore = defineStore('router-tabs', () => {
  const routerTabsList = ref<RouterTabItem[]>([])
  let count = 0
  const addRouterTab = (newRoute: RouterTabItem): string => {
    let exists = false
    let instanceName = newRoute.name?.toString() || 'any'
    routerTabsList.value.forEach((row, idx) => {
      if (row) {
        if (row.path == newRoute.path) {
          exists = true
          routerTabsList.value.splice(idx, 1, { ...row, isAlive: true })
        } else {
          routerTabsList.value.splice(idx, 1, { ...row, isAlive: false })
        }
      }
    })
    if (!exists) {
      instanceName = instanceName + count++
      routerTabsList.value.push({ ...newRoute, isAlive: true })
    }
    // routerTabsList.value.sort((a, b) => b.path.localeCompare(a.path))
    return instanceName
  }

  const closeRouterTab = (routeIdx: number): RouterTabItem => {
    const curr = routerTabsList.value.splice(routeIdx, 1)[0]
    return curr
  }

  const closeCurrRouterTab = (): RouterTabItem => {
    const currIndex = routerTabsList.value.findIndex((row) => row.isAlive)
    return closeRouterTab(currIndex)
  }

  /**
   * 找个个最合适的返回页
   */
  const findSuggestBack = (path: string): RouterTabItem => {
    //FIXME 先默认最后一个以后再改
    return routerTabsList.value.slice(-1)[0]
  }

  const updateTitle = (path: string, title: string) => {
    const tab = routerTabsList.value.find((item) => item.path == path)
    if (tab) {
      tab.meta.title = title
    }
  }

  return {
    routerTabsList,
    addRouterTab,
    closeRouterTab,
    closeCurrRouterTab,
    updateTitle,
    findSuggestBack,
  }
})
