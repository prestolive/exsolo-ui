<template>
  <div class="main">
    <div class="org">
      <div class="left">
        <div class="title">
          <h1>组织管理</h1>
        </div>
        <ul class="org-list">
          <li>法定组织（默认）</li>
          <li class="active">人力管理组织</li>
          <li>风委会</li>
          <li>党委会</li>
        </ul>
        <div style="padding: 12px 0px 0px 12px">
          <t-button theme="default" size="small">
            <template #icon> <t-icon name="add" /></template>创建组织
          </t-button>
        </div>
      </div>

      <div class="center">
        <!-- <div style="margin: 24px 12px 12px 12px"><h1>组织树</h1></div> -->
        <t-tree
          ref="tree"
          :data="items"
          hover
          line
          :filter="treeFilterFn"
          activable
          @active="onTreeActive"
        ></t-tree>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'

import {
  Space as TSpace,
  Button as TButton,
  Tree as TTree,
  Icon as TIcon,
  TreeNodeModel,
} from 'tdesign-vue-next'
import OrgAdd from './OrgAdd.vue'
import Glue from '@/console/Glue'
import { TreeNode } from '@/utils/exdash'

const items = ref<TreeNode[]>()
const treeFilterText = ref('')
const treeFilterFn = ref()
const onTreeFilter = () => {
  treeFilterFn.value = (node: TreeNodeModel) => {
    const label = node?.label || ''
    const rs = label.indexOf(treeFilterText.value) >= 0
    return rs
  }
}

// const handleAdd = () => {
// Glue.drawer(
//   { title: '新增组织', width: '720px' },
//   h(OrgAdd, {
//     onChange: () => {},
//   })
// )
// }
</script>

<style scoped>
.main {
  height: calc(100vh - 54.8px);
  /* padding: 12px 12px; */
}
.title {
  margin: 24px 12px 12px 12px;
  border-bottom: 1px solid #e4e6eb;
}
.org {
  display: flex;
  height: 100%;
}
.left {
  flex: 0 0 280px;
  /* background: #f5f6f7; */
  border-right: 1px solid #ccc;
  height: 100%;
}
.center {
  flex: 1 1 auto;
  padding: 24px;
  height: 100%;
}
.org-list {
}
.org-list li {
  padding: 6px 18px 6px 18px;
  cursor: pointer;
}
.org-list li.active {
  background: #f6f6f9;
  font-weight: 600;
  color: #6360e6;
}
.org-list li:hover {
  background: #f5f6f7;
}
</style>
