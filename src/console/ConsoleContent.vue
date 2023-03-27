<template>
  <div class="c-content">
    <div id="c-router-tabs" class="c-router-tabs">
      <div
        v-for="(routerTab, index) in routerTabsList"
        :key="`${routerTab.path}_${index}`"
        :class="routerTab.isAlive ? 'c-router-tab active' : 'c-router-tab'"
        @click="handleRouterTabActive(routerTab)"
      >
        <div class="c-router-close" @click.stop="handleRouterTabClose(index)">
          x
        </div>
        {{ routerTab.meta.title }}
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
import { useRouterTabsStore } from './store/routerTabs'
import { useRoute, useRouter } from 'vue-router'
import type { RouterTabItem } from '@/console/store/routerTabs.d'
const routerTabsStroe = useRouterTabsStore()
const { routerTabsList } = routerTabsStroe

const router = useRouter()

const handleRouterTabActive = (routerTab: RouterTabItem) => {
  routerTabsStroe.addRouterTab(routerTab)
  router.push({ path: routerTab.path, query: routerTab.query })
}

const handleRouterTabClose = (routeIdx: number) => {
  routerTabsStroe.closeRouterTab(routeIdx)
}
</script>

<style scoped>
.c-content {
  min-height: calc(100vh - 96px);
  position: relative;
  background-color: #eee;
  padding: 1px;
  /* overflow: hidden; */
}

.c-content::after {
  content: 'content';
  position: absolute;
  top: 12px;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.45);
  width: 100%;
  text-align: center;
}
.c-router-tabs {
  display: flex;
  background: #eee;
  /* font-size: 0.8em; */
  padding: 6px 12px 3px 12px;
  position: sticky;
  top: 0px;
  left: 0px;
}
.c-router-tab {
  background: #eee;
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
  border-left: 1px solid #ccc;
}
.c-router-tab.active {
  background: #fff;
  border-radius: 8px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  border: 1px solid #ccc;
  border-left: none;
  z-index: 2;
}
.c-router-tab.active:hover {
  background-color: #fff;
  border-left: none;
  border-radius: 8px;
}
.c-router-tab:hover {
  background-color: #e2e2e2;
  border-left: none;
  border-radius: 8px;
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
