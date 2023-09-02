<template>
  <div class="c-content">
    <router-view v-slot="{ route, Component }">
      <transition name="fade" mode="out-in">
        <!--key="route.path" 要放在component才对，放在keep-alive会导致缓存失效-->
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup></script>

<style scoped>
.c-content {
  height: calc(100vh - 38px);
  position: relative;
  background-color: #f6f7fa;
  overflow-y: auto;
}

.c-main {
  /* margin: 8px; */
  /* padding: 12px; */
  /* background: #fff; */
  min-height: 450px;
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
