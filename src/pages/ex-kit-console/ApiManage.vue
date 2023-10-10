<template>
  <div class="main">
    <h1>RESP管理</h1>
    <div class="item-manage">
      <div class="item-tree">
        <t-input-adornment>
          <template #prepend
            ><div style="font-size: 1.2em; padding: 0px 6px; line-height: 28px">
              <SearchIcon />
            </div>
          </template>
          <t-input v-model="treeFilterText" @change="onTreeFilter" />
        </t-input-adornment>
        <t-tree
          ref="tree"
          :data="items"
          hover
          line
          :expand-level="1"
          :filter="treeFilterFn"
          activable
          @active="onTreeActive"
        >
          <template #icon="{ node }">
            <t-icon v-if="node.getChildren() && !node.expanded" name="folder" />
            <t-icon
              v-else-if="node.getChildren() && node.expanded"
              name="folder-open-1"
            />
            <t-icon v-else name="control-platform" />
          </template>
        </t-tree>
      </div>
      <div class="item-table">
        <div class="toolbar">
          <t-space>
            <t-button
              v-if="currModule"
              theme="default"
              variant="base"
              @click="handleDownoadModuleCode"
              >按模块生成API.ts</t-button
            >
            <t-button
              v-if="currClassName"
              theme="default"
              variant="base"
              @click="handleDownoadClassCode"
              >按类生成API.ts</t-button
            >
          </t-space>
        </div>
        <t-tree
          ref="descTree"
          :data="controllerDescTree"
          hover
          line
          :expand-level="2"
        >
          <template #label="{ node }">
            <div>
              <div v-if="!node.isLeaf()">
                <span
                  :style="{ fontWeight: node.getLevel() == 0 ? '600' : '500' }"
                  >{{ node.label }}</span
                >
                <span class="ts-type">[{{ node.data._value?.tsType }}]</span>
                <span v-if="node.data?._value?.listType" class="is-array"
                  >Array</span
                >
              </div>
              <div v-if="node.isLeaf()">
                <span>{{ node.label }}</span>
                <span class="ts-type">[{{ node.data._value?.tsType }}]</span>
                <!-- <span v-if="node.data._value.array" class="is-array">array</span -->
              </div>
            </div>
          </template>
        </t-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  InputAdornment as TInputAdornment,
  Input as TInput,
  Tree as TTree,
  Button as TButton,
  Space as TSpace,
  TreeNodeValue,
  TreeNodeModel,
  MessagePlugin,
  Icon as TIcon,
} from 'tdesign-vue-next'

import { post, download, ApiDocClzBO, ApiDocBO, ApiDocTypeBO } from './API'
import { anyTreeData, TreeNode } from '@/utils/exdash'

const items = ref<TreeNode[]>()
const treeFilterText = ref('')
const treeFilterFn = ref()
const onTreeFilter = () => {
  treeFilterFn.value = (node: TreeNodeModel) => {
    const label = node?.label || ''
    const rs =
      label.toLowerCase().indexOf(treeFilterText.value.toLowerCase()) >= 0
    return rs
  }
}
const onTreeActive = (
  value: TreeNodeValue[],
  context: { node: TreeNodeModel }
) => {
  currModule.value = context.node.getPath()[0].data.label
  currClassName.value = ''
  if (context.node.isLeaf() && value[0]) {
    currClassName.value = value[0] + ''
    handleLoadClassDoc()
  }
}

const currModule = ref('')
const currClassName = ref('')
const controllerDescTree = ref<TreeNode[]>()

const buildTypeNode = (rootName: string, typeBO: ApiDocTypeBO) => {
  let bo: TreeNode = {
    label: typeBO.name,
    value: rootName + typeBO.name,
    _value: typeBO,
  }
  if (typeBO.object) {
    rootName = rootName + typeBO.name
    bo.children = typeBO.fieldTypes?.map((p) => buildTypeNode(rootName, p))
  }
  return bo
}

const handleLoadClassDoc = () => {
  post('api/ex-kit-console/api-doc', { className: currClassName.value }).then(
    (data: ApiDocBO[]) => {
      const nodes: TreeNode[] = []
      //
      data.forEach((row) => {
        let returnTypes: TreeNode[] = []
        if (row.returnType) {
          returnTypes = [buildTypeNode(row.name, row.returnType)]
        }

        const paramTypes = row.paramTypes?.map((p) =>
          buildTypeNode(row.name, p)
        )
        const m: TreeNode = {
          label: row.path + ' [' + row.method + '] ',
          value: row.name,
          children: [
            {
              label: 'response',
              value: row.name + 'response',
              children: returnTypes,
            },
            {
              label: 'request',
              value: row.name + 'request',
              children: paramTypes,
            },
          ],
        }
        nodes.push(m)
      })
      controllerDescTree.value = nodes
    }
  )
}

const handleDownoadClassCode = () => {
  download('api/ex-kit-console/api-doc2code', {
    className: currClassName.value,
  }).then(() => {
    MessagePlugin.loading('已生成下载任务，请等待', 5000)
  })
}
const handleDownoadModuleCode = () => {
  download('api/ex-kit-console/api-docs2code', {
    module: currModule.value,
  }).then(() => {
    MessagePlugin.loading('已生成下载任务，请等待', 5000)
  })
}
const initTags = () => {
  post('api/ex-kit-console/api-previews', null).then((tags: ApiDocClzBO[]) => {
    items.value = anyTreeData(
      tags,
      (value) => {
        return {
          label: value.clz,
          value: value.clz,
          _value: value,
        }
      },
      (value) => value.module
    )
  })
}
onMounted(() => {
  initTags()
})
</script>

<style scoped>
.main {
  height: calc(100vh - 54.8px);
  padding: 24px;
}
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.item-manage {
  display: flex;
  flex-direction: row;
}
.item-tree {
  flex: 0 0 324px;
}
.item-table {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px solid var(--td-component-border);
}
.ts-type {
  color: var(--td-text-color-secondary);
  padding: 0px 3px;
}
.is-array {
  color: var(--td-warning-color-6);
}
</style>
