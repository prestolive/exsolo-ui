<template>
  <div>
    <span v-for="node in nodeOptions" :key="node.content" class="breadcrumb">{{
      node.content
    }}</span>
  </div>
  <!-- <t-breadcrumb :max-item-width="'150'" :options="nodeOptions"></t-breadcrumb> -->
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import {
  Breadcrumb as TBreadcrumb,
  BreadcrumbItem as TBreadcrumbItem,
} from 'tdesign-vue-next'

import { useRoute } from 'vue-router'
import { useRouterTabsStore } from '@/console/store/routerTabs'

const route = useRoute()

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
        // to: row.path,
      })
      return true
    } else {
      if (row.children && row.children.length > 0) {
        const finded = loopPath(leafName, nodes, row.children || [])
        if (finded) {
          nodes.unshift({
            content: row.meta?.title || '',
            // to: row.path,
          })
          return true
        }
      }
    }
  }
  return false
}
const nodeOptions = ref<Node[]>([])

const refence = () => {
  let nodes: Node[] = []
  const finded = loopPath(route.name, nodes, route.matched)
  if (finded) {
    nodes[nodes.length - 1].to = route.fullPath
  } else {
    nodes = []
  }
  nodeOptions.value = nodes
}

watch(
  () => route.fullPath,
  () => {
    refence()
  }
)

onMounted(() => {
  refence()
})
</script>
<style scoped>
.breadcrumb {
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.45);
  padding-right: 3px;
}
.breadcrumb:not(:last-child)::after {
  content: '/';
  padding-left: 3px;
}
.breadcrumb:last-child {
  color: #000;
}
</style>
