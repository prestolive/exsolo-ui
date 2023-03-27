<template>
  <section class="c-main">
    <ConsoleSider></ConsoleSider>
    <section class="c-right">
      <ConsoleHeader></ConsoleHeader>
      <ConsoleContent></ConsoleContent>
      <ConsoleFooter></ConsoleFooter>
    </section>
  </section>
</template>
<script lang="ts" setup>
import ConsoleHeader from './ConsoleHeader.vue'
import ConsoleContent from './ConsoleContent.vue'
import ConsoleSider from './ConsoleSider.vue'
import ConsoleFooter from './ConsoleFooter.vue'
import type { TRouterInfo, TTabRouterType } from '@/console/store/routerTabs.d'
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouterTabsStore } from './store/routerTabs'

const route = useRoute()
const routerTabsStroe = useRouterTabsStore()

const handleAppendTab = () => {
  const {
    path,
    query,
    meta: { title },
    name,
  } = route
  routerTabsStroe.addRouterTab({
    path,
    query,
    title: title as string,
    name,
    isAlive: true,
    meta: route.meta,
  })
}
onMounted(() => {
  handleAppendTab()
})

watch(
  () => route.path,
  () => {
    handleAppendTab()
    // document
    //   .querySelector(`.${prefix}-layout`)
    //   .scrollTo({ top: 0, behavior: 'smooth' })
  }
)
</script>
<style scoped>
.c-main {
  display: flex;
  flex-direction: row;
}

.c-right {
  flex: 1 1 auto;
  min-height: 100vh;
}
</style>
