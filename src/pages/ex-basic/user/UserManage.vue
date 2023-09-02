<template>
  <div>
    <div class="bar">
      <div class="left-action">
        <div class="title">用户管理</div>
        <div class="divider"></div>
        <t-button theme="primary" @click="handleAdd">
          <template #icon> <add-icon /></template>新增用户
        </t-button>
      </div>
      <div class="right-action"></div>
    </div>
    <div class="main">
      <page-table-normal v-bind="pageBind"></page-table-normal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'

import { post, UserPO } from '../API'

import { Space as TSpace, Button as TButton } from 'tdesign-vue-next'
import { AddIcon } from 'tdesign-icons-vue-next'
import UserFormAdd from './UserFormAdd.vue'
import UserInfo from './UserInfo.vue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import Glue from '@/console/Glue'
import { eq } from 'lodash'

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
    })
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
const handleAdd = () => {
  Glue.drawer(
    { title: '新增用户', width: '720px' },
    h(UserFormAdd, {
      onChange: () => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      },
    })
  )
}
</script>
<style scoped>
.main {
  /* margin: 8px; */
  /* padding: 12px 24px; */
  /* background: #fff; */
  min-height: 600px;
  padding: 8px;
}
.bar {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fff;
  border-bottom: 1px solid #ccd4e0;
}
.left-action {
  display: flex;
}
.divider {
  margin: 2px 15px;
  border: 1px solid #d7d9dc;
  border-width: 0 0 0 1px;
}
.title {
  color: #121315;
  font-size: 18px;
  font-weight: 600;
  line-height: 32px;
}
</style>
