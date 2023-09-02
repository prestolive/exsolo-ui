<template>
  <div class="c-main">
    <ConsoleSider></ConsoleSider>
    <div class="c-right">
      <div id="c-router-tabs" class="c-router-tabs">
        <div
          v-for="(routerTab, index) in routerTabsList"
          :key="`${routerTab.path}_${index}`"
          :class="routerTab.isAlive ? 'c-router-tab active' : 'c-router-tab'"
          @click="onRouterTabActive(routerTab)"
        >
          <div
            v-if="!(routerTab.path == '/' || routerTabsList.length == 1)"
            class="c-router-close"
            @click.stop="onRouterTabClose(index)"
          >
            ×
          </div>
          {{ routerTab.meta.title }}
        </div>
      </div>
      <div class="c-content">
        <router-view v-slot="{ route, Component }">
          <transition name="fade" mode="out-in">
            <!--key="route.path" 要放在component才对，放在keep-alive会导致缓存失效-->
            <keep-alive>
              <component
                :is="Component"
                :key="route.path + route.meta.key"
                @close="onComponentClose"
                @title="(title:string) => onTitleUpdate(route.path,title)"
              />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ConsoleSider from './ConsoleSider.vue'
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouterTabsStore } from '@/console/store/routerTabs'
import type { RouterTabItem } from '@/console/store/routerTabs.d'

const route = useRoute()

const routerTabsStroe = useRouterTabsStore()

const { routerTabsList } = routerTabsStroe

const router = useRouter()

const onRouterTabActive = (routerTab: RouterTabItem) => {
  routerTabsStroe.addRouterTab(routerTab)
  router.push({
    path: routerTab.path,
    query: routerTab.query,
  })
}

const onRouterTabClose = (routeIdx: number) => {
  const closed = routerTabsStroe.closeRouterTab(routeIdx)
  // router.removeRoute(closed.name)
  const suggest = routerTabsStroe.findSuggestBack('')
  router.replace({ path: suggest.path, query: suggest.query })
}

const onComponentClose = () => {
  const closed = routerTabsStroe.closeCurrRouterTab()
  const suggest = routerTabsStroe.findSuggestBack('')
  // router.removeRoute(closed.name)
  router.push({
    path: suggest.path,
    query: suggest.query,
  })
}

const onTitleUpdate = (path: string, title: string) => {
  routerTabsStroe.updateTitle(path, title)
}

const handleAppendTab = () => {
  const {
    path,
    query,
    meta: { title },
    name,
  } = route
  const instanceName = routerTabsStroe.addRouterTab({
    path,
    query,
    title: title as string,
    name,
    isAlive: true,
    meta: route.meta,
  })
  route.meta['key'] = instanceName
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
  height: 100vh;
  overflow: hidden;
}

.c-router-tabs {
  display: flex;
  background: #fff;
  /* font-size: 0.8em; */
  padding: 5px 12px 5px 12px;
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
  /* min-width: 100px; */
  text-align: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  line-height: 28px;
  font-size: 0.8em;
  height: 28px;
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
  right: 5px;
  top: -7px;
  cursor: pointer;
  color: #bbb;
  display: none;
}
.c-router-tab:hover .c-router-close {
  display: block;
}

.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.22s cubic-bezier(0.38, 0, 0.24, 1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 0px;
}
</style>
