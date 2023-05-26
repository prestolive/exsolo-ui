<template>
  <div>
    <page-table-normal v-bind="pageBind"></page-table-normal>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue'

import { post, UserPO } from '../API'
import RoleFormAdd from './RoleFormAdd.vue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import Glue from '@/console/Glue'
import { useRouter } from 'vue-router'

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
  handleAdd: () => {
    Glue.drawer(
      { title: '新增用户', width: '720px' },
      h(RoleFormAdd, {
        onChange: () => {
          pageBind.handleRefresh && pageBind.handleRefresh()
        },
      })
    )
  },
  handleInfo: (id: string) => {
    // Glue.drawer(
    //   { title: '用户详情', width: '720px' },
    //   h(UserInfo, {
    //     userId: id,
    //     onChange: () => {
    //       // handleLoadData()
    //     },
    //   })
    // )
    router.push('/ex-basic/role-info/' + id)
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
