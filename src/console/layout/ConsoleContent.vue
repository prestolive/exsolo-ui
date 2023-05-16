<template>
  <div class="c-content">
    <div class="c-main">
      <router-view v-slot="{ route, Component }">
        <transition name="fade" mode="out-in">
          <keep-alive :key="route.fullPath">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style scoped>
.c-content {
  height: calc(100vh - 85px);
  position: relative;
  background-color: #eee;
  overflow-y: scroll;
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
.c-main {
  /* margin: 8px; */
  padding: 12px;
  background: #fff;
  min-height: 500px;
}
.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.22s cubic-bezier(0.38, 0, 0.24, 1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
