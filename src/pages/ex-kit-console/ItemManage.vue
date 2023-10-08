<template>
  <div class="main">
    <div class="item-manage">
      <div class="center">
        <div class="title">
          <h1>枚举管理</h1>
        </div>
        <div class="item-tree">
          <t-input-adornment>
            <template #prepend>
              <div
                style="font-size: 1.2em; padding: 0px 6px; line-height: 28px"
              >
                <SearchIcon />
              </div>
            </template>
            <t-input v-model="treeFilterText" @change="onTreeFilter" />
          </t-input-adornment>
          <t-tree
            ref="tree"
            v-model:actived="activedNode"
            :data="items"
            hover
            line
            expand-all
            activable
            :filter="treeFilterFn"
            @active="onTreeActive"
          >
          </t-tree>
        </div>
      </div>
      <div class="right">
        <div v-if="itemQueryParam.tag" style="margin-bottom: 12px">
          <h3>对象类型</h3>
          <t-card :title="activedItem?.name" hover-shadow>
            <template #actions>
              <t-space size="0px">
                <t-button theme="default" @click="onItemCreate">
                  <template #icon> <t-icon name="edit" /></template>创建对象
                </t-button>
              </t-space>
            </template>
            <template #content>
              <section title="编码">{{ activedItem?.id }}</section>
              <section title="模组">{{ activedItem?.module }}</section>
              <section title="类名">{{ activedItem?.clz }}</section>
              <section title="类型">{{ activedItem?.itemType }}</section>
              <section title="允许手工创建">
                <t-switch
                  :value="activedItem?.customAble"
                  :disabled="true"
                ></t-switch>
              </section>
            </template>
          </t-card>
        </div>
        <h3>对象查询</h3>
        <page-table-normal
          v-bind="pageBind"
          class="item-table"
        ></page-table-normal>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h } from 'vue'
import {
  Button as TButton,
  Space as TSpace,
  InputAdornment as TInputAdornment,
  Input as TInput,
  Card as TCard,
  Tree as TTree,
  Icon as TIcon,
  Switch as TSwitch,
  TreeNodeValue,
  TreeNodeModel,
} from 'tdesign-vue-next'

import { SearchIcon } from 'tdesign-icons-vue-next'
import { post, ItemTagPO, ItemPO } from './API'
import { anyTreeData, TreeNode } from '@/utils/exdash'

import ItemCreate from './ItemCreate.vue'
import Glue from '@/console/Glue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'

interface ItemQueryParam {
  module?: string
  itemType?: string
  tag?: string
  keyword?: string
}

const columns: BaseTableCol[] = [
  { colKey: 'tag', title: '对象类型' },
  { colKey: 'itemType', title: '数据类型' },
  { colKey: 'code', title: '编码' },
  { colKey: 'name', title: '名称', ellipsis: true },
]
const conditions: BaseConditionCol[] = [
  {
    key: 'name',
    title: '名称',
    schema: 'text',
    compare: 'lk',
  },
  {
    key: 'code',
    title: '编码',
    schema: 'text',
    compare: 'lk',
  },
]

const pageBind = useNormalPage<ItemPO>({
  columns: columns,
  conditions: conditions,
  loadData: (param: object, pagination: Pagination) => {
    return post('api/ex-kit-console/items', {
      ...param,
      ...itemQueryParam,
      pagination: pagination,
    })
  },
})

const itemQueryParam: ItemQueryParam = {}

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
const activedNode = ref([])

const activedItem = ref<ItemTagPO>({})

const onTreeActive = (
  value: TreeNodeValue[],
  context: { node: TreeNodeModel }
) => {
  const pathNodes = context.node.getPath()
  itemQueryParam.module = pathNodes[0]?.label?.toString()
  itemQueryParam.itemType = pathNodes[1]?.label?.toString()
  itemQueryParam.tag = pathNodes[2]?.value?.toString()
  if (itemQueryParam.tag) {
    post('api/ex-kit-console/get-tag', { id: itemQueryParam.tag }).then(
      (data) => {
        activedItem.value = data
        pageBind.handleRefresh && pageBind.handleRefresh()
      }
    )
  } else {
    pageBind.handleRefresh && pageBind.handleRefresh()
  }
}

const initTags = () => {
  post('api/ex-kit-console/item-tags', null)
    .then((tags: ItemTagPO[]) => {
      items.value = anyTreeData(
        tags,
        (value) => {
          return {
            label: value.name,
            value: value.id,
            _value: value,
          }
        },
        (value) => value.module,
        (value) => value.itemType
      )
    })
    .then(() => {
      pageBind.handleRefresh && pageBind.handleRefresh()
    })
}
const onItemCreate = () => {
  Glue.drawer(
    { title: '创建对象', width: '720px' },
    h(ItemCreate, {
      tag: activedItem.value.id,
      onChange: () => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      },
    })
  )
}

onMounted(() => {
  initTags()
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
  flex: 1 0 320px;
  /* padding: 24px; */
  height: 100%;
}
.right {
  flex: 1 1 auto;
  border-left: 1px solid var(--td-component-border);

  padding: 24px;
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
  padding: 12px;
}
</style>
