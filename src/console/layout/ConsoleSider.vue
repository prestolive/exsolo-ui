<template>
  <aside class="c-side">
    <div class="c-logo">Logo</div>
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
import ConsoleSiderMenuItem from '@/console/components/ConsoleSiderMenuItem.vue'
import { ref } from 'vue'

const menu = ref(getMenu())
</script>
<style scoped>
.c-side {
  flex: 0 0 200px;
  position: relative;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
  background: #fafafa;
  /* background: #f2f2f2; */
}

.c-side-main {
  width: 200px;
  position: fixed;
  overflow: scroll;
  height: 100vh;
}

.c-logo {
  font-size: 24px;
  padding: 3px 6px;
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
  background-color: #bfbfbf;
  border-radius: 0px;
}
</style>
