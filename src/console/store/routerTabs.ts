import { ref } from 'vue'

import { defineStore } from 'pinia'
import { RouterTabItem } from './routerTabs.d'

export const useRouterTabsStore = defineStore('router-tabs', () => {
  const routerTabsList = ref<RouterTabItem[]>([])

  const addRouterTab = (newRoute: RouterTabItem) => {
    let exists = false
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
      routerTabsList.value.push({ ...newRoute, isAlive: true })
    }
  }
  const closeRouterTab2 = (routeIdx: number): RouterTabItem => {
    const curr = routerTabsList.value[routeIdx]
    routerTabsList.value.splice(routeIdx, 1)
    return curr
  }

  const closeRouterTab = (routeIdx: number): RouterTabItem => {
    const back =
      routerTabsList.value[routeIdx + 1] || routerTabsList.value[routeIdx - 1]
    routerTabsList.value.splice(routeIdx, 1)
    // route
    // addRouterTab(back)
    return back
  }

  const updateRouterTab = () => {
    routerTabsList.value.forEach((row, idx) => {
      if (row) {
        window.console.log(row)
      }
    })
  }

  const closeRouterTabByPath = (fullPath: string) => {
    const routeIdx = routerTabsList.value.findIndex(
      (row) => row.path == fullPath
    )
    if (routeIdx >= 0) {
      return closeRouterTab(routeIdx)
    }
  }

  return {
    routerTabsList,
    addRouterTab,
    closeRouterTab,
    closeRouterTab2,
    closeRouterTabByPath,
    updateRouterTab,
  }
})
