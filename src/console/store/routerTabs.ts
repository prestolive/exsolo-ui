import { ref } from 'vue'

import { defineStore } from 'pinia'
import { TRouterInfo, TTabRouterType } from './routerTabs.d'

export const useRouterTabsStore = defineStore('router-tabs', () => {
  const routerTabsList = ref<TRouterInfo>([])

  const addRouterTab = (newRoute: TRouterInfo) => {
    let exist
    routerTabsList.value.forEach((row) => {
      row.isAlive = false
      if (row.path == newRoute.path) {
        row.isAlive = true
        exist = row
      }
    })
    if (!exist) {
      routerTabsList.value.push({ ...newRoute, isAlive: true })
    }
  }

  const closeRouterTab = (routeIdx: number) => {
    routerTabsList.value = routerTabsList.value.slice(routeIdx)
  }

  return { routerTabsList, addRouterTab, closeRouterTab }
})
