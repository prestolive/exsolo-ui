<template>
  <div class="main">
    <h1>用户管理</h1>
    <page-table-normal v-bind="pageBind">
      <template #tableBar>
        <t-button theme="primary" @click="handleAdd">
          <template #icon> <t-icon name="add" /></template>创建用户
        </t-button>
      </template>
      <template #action="{ row }">
        <t-space>
          <t-button
            theme="default"
            variant="base"
            size="small"
            @click="handleInfo(row.id)"
          >
            <template #icon> <t-icon name="search" /></template>
          </t-button>
        </t-space>
      </template>
    </page-table-normal>
  </div>
</template>

<script lang="ts" setup>
import { createVNode, ref } from 'vue'
import { post, UserPO } from '../API'

import {
  Space as TSpace,
  Button as TButton,
  Icon as TIcon,
} from 'tdesign-vue-next'
import UserFormAdd from './UserFormAdd.vue'
import UserInfo from './UserInfo.vue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import Glue from '@/console/Glue'

const columns: BaseTableCol[] = [
  { colKey: 'loginCode', title: '登录名' },
  { colKey: 'userName', title: '称呼', ellipsis: true },
  { colKey: 'activeTs', title: '创建时间', ellipsis: true },
  { colKey: '_status.label', title: '状态' },
]
const conditions: BaseConditionCol[] = [
  {
    key: 'loginCode',
    title: '登录名',
    schema: 'text',
    compare: 'lk',
  },
  {
    key: 'userName',
    title: '姓名',
    schema: 'text',
    compare: 'lk',
  },
  {
    key: 'status',
    title: '状态',
    schema: 'option',
    options: [
      { value: 'NORMAL', label: '正常' },
      { value: 'BLOCK', label: '锁定' },
    ],
  },
]

const pageBind = useNormalPage<UserPO>({
  columns: columns,
  conditions: conditions,
  loadData: (param: object, pagination: Pagination) => {
    return post('api/ex-basic/user/page', {
      ...param,
      pagination: pagination,
    }).then((data) => {
      window.console.log('wuby', data)
      return Promise.resolve(data)
    })
  },
})
const handleInfo = (id: string) => {
  Glue.drawer(
    { title: '用户详情', width: '720px' },
    createVNode(UserInfo, {
      userId: id,
      onChange: () => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      },
    })
  )
  // router.push('/ex-basic/user-info/' + userId)
}
const handleAdd = () => {
  Glue.drawer(
    { title: '创建用户', width: '720px' },
    createVNode(UserFormAdd, {
      onChange: () => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      },
    })
  )
}
</script>
<style scoped>
.main {
  max-width: 1024px;
  min-height: 600px;
  padding: 24px;
}
</style>
