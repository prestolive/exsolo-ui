<template>
  <div class="main">
    <div class="bread">构建工具 / 对象管理</div>
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
          :filter="treeFilterFn"
          activable
          @active="onTreeActive"
        ></t-tree>
      </div>
      <div class="item-table">
        <div class="toolbar">
          <t-space><t-button>新增</t-button></t-space>
          <t-input
            v-model="searchValue"
            placeholder="请输入你需要搜索的内容"
            clearable
            auto-width
            @enter="handleLoadData"
          >
            <template #suffix-icon>
              <search-icon size="20px" />
            </template>
          </t-input>
        </div>
        <t-table
          hover
          size="small"
          row-key="index"
          :data="pageObject?.values"
          :columns="columns"
          :loading="loading"
          class="es-table"
          :pagination="pageObject?.pagination"
          @page-change="handlePageChange"
        ></t-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  Table as TTable,
  Button as TButton,
  Space as TSpace,
  InputAdornment as TInputAdornment,
  Input as TInput,
  Tree as TTree,
  PageInfo,
  TreeNodeValue,
  TreeNodeModel,
} from 'tdesign-vue-next'

import { SearchIcon } from 'tdesign-icons-vue-next'
import {
  get,
  post,
  ItemTagPO,
  ItemPO,
  PageObject,
  ExKitConsoleItemsParam,
} from './API'
import { anyTreeData, TreeNode } from '@/utils/exdash'

const columns = ref([
  { colKey: 'tag', title: '对象类型', width: 180 },
  { colKey: 'schema', title: '数据类型' },
  { colKey: 'code', title: '编码' },
  { colKey: 'name', title: '名称', ellipsis: true },
  { colKey: 'desc', title: '备注' },
])

const searchValue = ref('')

const param: ExKitConsoleItemsParam = {}

const loading = ref(false)

const pageObject = ref<PageObject<ItemPO>>({
  values: [],
  pagination: {
    pageSize: 10,
    current: 1,
  },
})

const handlePageChange = (pageInfo: PageInfo) => {
  pageObject.value = {
    ...pageObject.value,
    pagination: {
      pageSize: pageInfo.pageSize,
      current: pageInfo.current,
    },
  }
  handleLoadData()
}

const handleLoadData = () => {
  const arg: ExKitConsoleItemsParam = {
    ...param,
    keyword: searchValue.value,
    pagination: pageObject?.value?.pagination,
  }
  loading.value = true
  post('api/ex-kit-console/items', arg)
    .then((data) => {
      pageObject.value = data
    })
    .finally(() => [(loading.value = false)])
}

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
const onTreeActive = (
  value: TreeNodeValue[],
  context: { node: TreeNodeModel }
) => {
  const pathNodes = context.node.getPath()
  param.module = pathNodes[0]?.value?.toString() || null
  param.schema = pathNodes[1]?.value?.toString() || null
  param.tag = pathNodes[2]?.value?.toString() || null
  searchValue.value = ''
  handleLoadData()
}

const initTags = () => {
  get('api/ex-kit-console/item-tags', null)
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
        (value) => value.schema
      )
    })
    .then(() => {
      handleLoadData()
    })
}
onMounted(() => {
  initTags()
})
</script>

<style scoped>
.main {
  margin: 12px;
  /* padding: 24px; */
  background: #fff;
  min-height: 600px;
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
.item-table {
  border-left: 1px solid #e8e8e8;
  padding: 12px;
}
.bread {
  padding: 12px 12px 3px 12px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.8em;
}
</style>
