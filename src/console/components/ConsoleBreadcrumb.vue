<template>
  <t-breadcrumb :max-item-width="'150'" :options="nodes"></t-breadcrumb>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import {
  Breadcrumb as TBreadcrumb,
  BreadcrumbItem as TBreadcrumbItem,
} from 'tdesign-vue-next'

import { useRoute } from 'vue-router'
import { useRouterTabsStore } from '@/console/store/routerTabs'

const route = useRoute()
const currNodeName = route.name

interface Node {
  content: string
  to?: string
}
interface LoopItem {
  name: string
  path?: string
  meta: {
    title: string
  }
  children: LoopItem[]
}

const loopPath = (
  leafName: string,
  nodes: Node[],
  routerMatchs: LoopItem[]
): boolean => {
  for (let i = 0; i < routerMatchs.length; i++) {
    const row = routerMatchs[i]

    if (row.name == leafName) {
      nodes.push({
        content: row.meta?.title || '',
        to: row.path,
      })
      return true
    } else {
      if (row.children && row.children.length > 0) {
        const finded = loopPath(leafName, nodes, row.children || [])
        if (finded) {
          nodes.unshift({
            content: row.meta?.title || '',
            to: row.path,
          })
          return true
        }
      }
    }
  }
  return false
}
let nodes: Node[] = []
const finded = loopPath(currNodeName, nodes, route.matched)
if (finded) {
  nodes[nodes.length - 1].to = route.fullPath
} else {
  nodes = []
}

window.console.log(finded, nodes)
</script>
<style scoped></style>
