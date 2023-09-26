<template>
  <div class="main">
    <div class="toolbar">
      <t-space><t-button>创建</t-button></t-space>
      <t-input
        v-model="searchValue"
        placeholder="请输入你需要搜索的内容"
        clearable
        auto-width
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
      :data="page.list"
      :columns="columns"
      class="s-table"
    ></t-table>
    <t-pagination
      v-model="page.current"
      v-model:pageSize="page.pageSize"
      :total="page.total"
      show-jumper
      @change="onChange"
      @page-size-change="onPageSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Table as TTable,
  Button as TButton,
  Space as TSpace,
  Input as TInput,
  Pagination as TPagination,
  PageInfo,
} from 'tdesign-vue-next'

import { SearchIcon } from 'tdesign-icons-vue-next'
import { PageObject } from '@/console/types/ui'

const columns = ref([
  { colKey: 'module', title: '模块', width: 180 },
  { colKey: 'code', title: '编码' },
  { colKey: 'name', title: '名称', ellipsis: true },
  { colKey: 'desc', title: '备注' },
])
const data = ref([
  {
    module: 'sdfsdf',
  },
  {
    module: 'sdfsdf',
  },
  {
    module: 'sdfsdf',
  },
  {
    module: 'sdfsdf',
  },
])

const page = ref<PageObject<any>>({
  total: 100,
  current: 1,
  pageSize: 30,
})
const searchValue = ref('')

const onChange = (pageInfo: PageInfo) => {
  console.log(pageInfo)
}
const onPageSizeChange = (size: number) => {
  console.log('page-size:', size)
}

const onCurrentChange = (index: number, pageInfo: PageInfo) => {
  console.log(pageInfo)
}
</script>

<style scoped>
.main {
  margin: 8px;
  padding: 24px;
  background: #fff;
  min-height: 600px;
}
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.s-table {
  margin-top: 12px;
}
</style>
