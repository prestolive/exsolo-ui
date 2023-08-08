<template>
  <section class="c-main">
    <ConsoleSider></ConsoleSider>
    <section class="c-right">
      <ConsoleHeader></ConsoleHeader>
      <div id="c-router-tabs" class="c-router-tabs">
        <div
          v-for="(routerTab, index) in routerTabsList"
          :key="`${routerTab.path}_${index}`"
          :class="routerTab.isAlive ? 'c-router-tab active' : 'c-router-tab'"
          @click="handleRouterTabActive(routerTab)"
        >
          <div
            v-if="!(routerTab.path == '/' || routerTabsList.length == 1)"
            class="c-router-close"
            @click.stop="handleRouterTabClose(index)"
          >
            x
          </div>
          {{ routerTab.meta.title }}
        </div>
      </div>
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
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouterTabsStore } from '@/console/store/routerTabs'
import type { RouterTabItem } from '@/console/store/routerTabs.d'

const route = useRoute()

const routerTabsStroe = useRouterTabsStore()

const { routerTabsList } = routerTabsStroe

const router = useRouter()

const handleRouterTabActive = (routerTab: RouterTabItem) => {
  routerTabsStroe.addRouterTab(routerTab)
  router.push({ path: routerTab.path, query: routerTab.query })
}

const handleRouterTabClose = (routeIdx: number) => {
  window.console.log('close', routeIdx)
  const back = routerTabsStroe.closeRouterTab(routeIdx)
  router.replace({ path: back.path, query: back.query })
}

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
    window.console.log('handle', route.path)
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
  height: 100vh;
  overflow: hidden;
}

.c-router-tabs {
  display: flex;
  background: #fff;
  /* font-size: 0.8em; */
  padding: 6px 12px 3px 12px;
  position: relative;
  /* position: sticky;
  top: 0px;
  left: 0px;
  z-index: 10; */
  z-index: 10;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 21, 41, 0.08);
}
.c-router-tab {
  /* background: #eee; */
  padding: 0px 16px;
  min-width: 100px;
  text-align: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  line-height: 28px;
  font-size: 0.8em;
}
.c-router-tab:not(:first-child) {
  /* border-left: 1px solid #ccc; */
}
.c-router-tab.active {
  background: #ddd;
  /* border-radius: 8px; */
  /* box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15); */
  /* border: 1px solid #ccc; */
  /* border-left: none; */
  z-index: 2;
}
.c-router-tab.active:hover {
  /* background-color: #fff; */
  border-left: none;
  /* border-radius: 8px; */
}
.c-router-tab:hover {
  background-color: #efefef;
  border-left: none;
  /* border-radius: 8px; */
}
.c-router-tab:hover + div {
  border-left: none;
}
.c-router-tab.active + div {
  border-left: none;
}

.c-router-close {
  position: absolute;
  right: 8px;
  top: -1px;
  cursor: pointer;
  color: #bbb;
}
</style>
