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

  const closeRouterTab = (routeIdx: number): RouterTabItem => {
    const back =
      routerTabsList.value[routeIdx + 1] || routerTabsList.value[routeIdx - 1]
    routerTabsList.value.splice(routeIdx, 1)
    addRouterTab(back)
    return back
  }

  const updateRouterTab = () => {
    routerTabsList.value.forEach((row, idx) => {
      if (row) {
        window.console.log(row)
      }
    })
  }

  return { routerTabsList, addRouterTab, closeRouterTab, updateRouterTab }
})
