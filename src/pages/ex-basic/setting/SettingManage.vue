<template>
  <div class="main">
    <div class="item-manage">
      <div class="center">
        <div class="title">
          <h1>系统设置</h1>
        </div>
        <div class="item-tree">
          <ul>
            <li
              v-for="mod in modules"
              :key="mod.moduleClz"
              :class="activeModuleClz == mod.moduleClz ? 'active' : ''"
              @click="onActive(mod.moduleClz)"
            >
              <div>{{ mod.moduleName }}</div>
              <div class="pkg">{{ mod.modulePackage }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <h3 style="padding-left: 12px">设置</h3>
        <div class="prop-list">
          <ul>
            <li v-for="sp in settingProps" :key="sp.fieldName">
              <SettingCell
                :setting-prop="sp"
                @change="onActive(sp.clzName || '')"
              ></SettingCell>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { post, ExSettingProviderVO, ExSettingInstanceVO } from '../API'
import SettingCell from './SettingCell.vue'
import {
  Space as TSpace,
  Button as TButton,
  Icon as TIcon,
  Input as TInput,
} from 'tdesign-vue-next'

const modules = ref<ExSettingProviderVO[]>()

const settingProps = ref<ExSettingInstanceVO[]>()

const activeModuleClz = ref('')

const init = () => {
  post('api/ex-basic/setting/modules').then((data) => {
    modules.value = data
  })
}

const onActive = (clzName: string) => {
  activeModuleClz.value = clzName || ''
  clzName && onLoadProps(clzName)
}

const onLoadProps = (clzName: string) => {
  post('api/ex-basic/setting/props', {
    clzName: clzName,
  }).then((data) => {
    settingProps.value = data
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.main {
  height: calc(100vh - 54.8px);
  /* padding: 12px 12px; */
}
.title {
  margin: 24px 24px 12px 24px;
  /* border-bottom: 1px solid #e4e6eb; */
}
.item-manage {
  display: flex;
  height: 100%;
}

.center {
  flex: 0 0 280px;
  /* padding: 24px; */
  height: 100%;
}
.right {
  flex: 1 1 auto;
  border-left: 1px solid var(--td-component-border);

  padding: 24px 12px;
}
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.es-table {
  margin-top: 12px;
}
.item-manage {
  display: flex;
  flex-direction: row;
}
.item-tree {
  flex: 0 0 324px;
  padding: 12px 0px;
  color: var(--td-text-color-primary);
}
.item-tree li {
  padding: 8px 24px;
  cursor: pointer;
}
.item-tree li:hover {
  background: var(--td-bg-color-container-hover);
}
.item-tree li.active {
  background: var(--td-bg-color-container-active);
}
.item-tree li .pkg {
  color: var(--td-text-color-placeholder);
  font-size: 9px;
}
.prop-list li {
  padding: 0px;
}
</style>
