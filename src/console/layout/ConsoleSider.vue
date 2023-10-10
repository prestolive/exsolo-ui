<template>
  <aside class="c-side">
    <div class="c-logo">
      管理中台
      <t-icon v-if="darkMode" name="mode-dark" @click="setLightMode" />
      <t-icon v-if="!darkMode" name="mode-light" @click="setDarkMode" />
    </div>
    <div class="c-side-main">
      <ul class="c-menu">
        <ConsoleSiderMenuItem
          v-for="block in menu"
          :key="block.path"
          :model="block"
        />
      </ul>
    </div>
  </aside>
</template>
<script lang="ts" setup>
import { getMenu } from '@/console/store/permission'
import ConsoleSiderMenuItem from './components/ConsoleSiderMenuItem.vue'
import { ref } from 'vue'
import { Icon as TIcon } from 'tdesign-vue-next'

const menu = ref(getMenu())
const darkMode = ref(false)
const setDarkMode = () => {
  darkMode.value = true
  document.documentElement.setAttribute('theme-mode', 'dark')
}
const setLightMode = () => {
  darkMode.value = false
  document.documentElement.removeAttribute('theme-mode')
}
setDarkMode()
</script>
<style scoped>
.c-side {
  flex: 0 0 200px;
  position: relative;
  box-sizing: border-box;
  border-right: 1px solid var(--td-component-border);
  background: var(--td-bg-color-secondarycontainer);
  color: var(--td-text-color-primary);
  /* background: #f2f2f2; */
}

.c-side-main {
  width: 200px;
  position: fixed;
  overflow: scroll;
  height: 100vh;
}

.c-logo {
  font-size: 1.6em;
  padding: 8px 12px;
  height: 48px;
  width: auto;
  /* border-bottom: 1px dashed #ccc; */
  /* background: #fff; */
}

.c-menu {
  width: auto;
  padding-bottom: 12px;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--td-component-border);
  border-radius: 0px;
}
</style>
