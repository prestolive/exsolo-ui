<template>
  <div>
    <page-table-normal v-bind="pageBind"></page-table-normal>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue'

import { post, UserPO } from '../API'
import UserFormAdd from './UserFormAdd.vue'
import UserInfo from './UserInfo.vue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import Glue from '@/console/Glue'

const columns: BaseTableCol[] = [
  { colKey: 'loginCode', title: '登录名', width: 120 },
  { colKey: 'userName', title: '称呼', width: 120, ellipsis: true },
  { colKey: 'activeTs', title: '创建时间', width: 120, ellipsis: true },
  { colKey: 'status', title: '状态', width: 120 },
  {
    colKey: 'action',
    title: '操作',
    fixed: 'right',
    width: 120,
  },
]
const conditions: BaseConditionCol[] = [
  {
    key: 'loginCode',
    title: '登录名',
    schema: 'text',
  },
  {
    key: 'userName',
    title: '姓名',
    schema: 'text',
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
    })
  },
  handleAdd: () => {
    Glue.drawer(
      { title: '新增用户', width: '720px' },
      h(UserFormAdd, {
        onChange: () => {
          pageBind.handleRefresh && pageBind.handleRefresh()
        },
      })
    )
  },
  handleInfo: (id: string) => {
    Glue.drawer(
      { title: '用户详情', width: '720px' },
      h(UserInfo, {
        userId: id,
        onChange: () => {
          pageBind.handleRefresh && pageBind.handleRefresh()
        },
      })
    )
    // router.push('/ex-basic/user-info/' + userId)
  },
})
</script>
<style scoped>
.main {
  margin: 8px;
  padding: 12px 24px;
  background: #fff;
  min-height: 600px;
}
</style>
