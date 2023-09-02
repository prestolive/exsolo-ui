<template>
  <div>
    <div class="bar">
      <div class="left-action">
        <div class="title">角色管理</div>
        <div class="divider"></div>
        <t-button theme="primary" @click="handleAdd">
          <template #icon> <add-icon /></template>新增角色
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
import RoleAdd from './RoleAdd.vue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import Glue from '@/console/Glue'
import { useRouter } from 'vue-router'
import RoleInfo from './RoleInfo.vue'

const router = useRouter()

const columns: BaseTableCol[] = [
  { colKey: 'roleName', title: '角色名称' },
  { colKey: 'roleSchema', title: '角色类型', width: 150 },
  { colKey: 'moduleCount', title: '关联模块数量', width: 150 },
  { colKey: 'powerCount', title: '关联权限数量', width: 150 },
  {
    colKey: 'action',
    title: '操作',
    fixed: 'right',
    width: 120,
  },
]
const conditions: BaseConditionCol[] = [
  {
    key: 'roleName',
    title: '角色名称',
    schema: 'text',
  },
]

const pageBind = useNormalPage<UserPO>({
  columns: columns,
  conditions: conditions,
  loadData: (param: object, pagination: Pagination) => {
    return post('api/ex-basic/role/page', {
      ...param,
      pagination: pagination,
    })
  },

  handleInfo: (id: string) => {
    // Glue.drawer(
    //   { title: '角色详情', width: '75%' },
    //   h(RoleInfo, {
    //     roleId: id,
    //     onChange: () => {
    //       pageBind.handleRefresh && pageBind.handleRefresh()
    //     },
    //   })
    // )
    router.push('/ex-basic/role-info/' + id)
  },
})

const handleAdd = () => {
  Glue.drawer(
    { title: '新增角色', width: '720px' },
    h(RoleAdd, {
      onChange: () => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      },
    })
  )
}
</script>

<style scoped>
.main {
  min-height: 600px;
  max-width: 1024px;
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
