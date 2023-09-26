<template>
  <li>
    <div :class="isOpen ? 'c-menu-block open' : 'c-menu-block'" @click="toggle">
      <!-- <span v-html="model.meta.icon"></span> -->
      <div>
        <component :is="model?.meta.icon?.render"></component>
        <component :is="!model?.meta.icon && ConsoleDefaultMenu"></component>
        <!-- <BaseBlock></BaseBlock> -->
        {{ model?.meta.title }}
      </div>
      <span v-if="model?.children" class="c-menu-toggle">
        <DirectRight v-if="!isOpen" />
        <DirectDown v-if="isOpen" />
      </span>
    </div>
    <ul
      v-if="model?.children"
      :class="isOpen ? 'c-menu-sub active' : 'c-menu-sub'"
    >
      <li
        v-for="item in model?.children"
        :key="item.path"
        :class="getActiveStyle(item)"
      >
        <router-link :to="item.path">
          {{ item.meta.title }}
        </router-link>
      </li>
    </ul>
  </li>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { getActive } from '@/router'
import DirectRight from '@/assets/icon/DirectRight.svg'
import DirectDown from '@/assets/icon/DirectDown.svg'
import ConsoleDefaultMenu from '@/assets/icon/ConsoleDefaultMenu.svg'

const props = defineProps({
  model: Object,
})

const isOpen = ref(true)
const active = computed(() => getActive())

function toggle() {
  isOpen.value = !isOpen.value
}
const getActiveStyle = (item) => {
  if (active.value.startsWith(item.path)) {
    return 'active'
  }
  return 'normal'
}
</script>
<style scoped>
.c-menu-block {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
  line-height: 36px;
  margin-left: 6px;
  padding-left: 28px;
  padding-right: 12px;
  position: relative;
  font-size: 0.9em;
  letter-spacing: 1px;
  display: flex;
  justify-content: space-between;
}

.c-menu-block.open {
  color: rgba(0, 0, 0, 0.9);
}

.c-menu-block span {
  /* margin-left: 6px; */
}

.c-menu-block svg {
  width: 22px;
  height: 22px;
  position: absolute;
  left: 0;
  top: 5px;
  opacity: 0.7;
}

.c-menu-block.open svg {
  opacity: 0.9;
}

.c-menu-toggle svg {
  width: 12px;
  height: 12px;
  position: relative;
  top: 2px;
}
.c-menu-sub {
  max-height: 0px;
  overflow: hidden;
  transition: all 0.5s;
}
.c-menu-sub.active {
  max-height: 500px;
  transition: all 0.5s;
}
.c-menu-sub li {
  padding-left: 34px;
  line-height: 36px;
  font-size: 1em;
  letter-spacing: 1px;
}

.c-menu-sub li.active {
  background: rgb(242, 243, 255);
  color: #0052d9;
  border-right: 1px solid #ccc;
}

.c-menu-sub li.active a {
  /* background: rgb(242, 243, 255); */
  color: #0052d9;
}

.c-menu-sub li:hover {
  background: rgb(243, 243, 243);
  border-right: 1px solid #ccc;
}

li a {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.8);
  display: block;
}

li a:link {
  text-decoration: none;
}

li a:visited {
  text-decoration: none;
}

li a:hover {
  text-decoration: none;
}

li a:active {
  text-decoration: none;
}
</style>
