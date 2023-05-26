<template>
  <aside class="c-side">
    <div></div>
    <section class="c-side-main">
      <div class="c-logo">Logo</div>
      <ul class="c-menu">
        <ConsoleSiderMenuItem
          v-for="block in menu"
          :key="block.path"
          :model="block"
        />
      </ul>
    </section>
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
  border-right: 1px dashed #ccc;
  background: #fafafa;
  /* background: #f2f2f2; */
}

.c-side-main {
  width: 200px;
  position: fixed;
}

.c-logo {
  font-size: 24px;
  padding: 3px 6px;
  height: 48px;
  width: auto;
  border-bottom: 1px dashed #ccc;
  background: #fff;
}

.c-menu {
  padding: 12px 0;
  width: auto;
}

.c-side-main::after {
  content: 'sider';
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
</style>
