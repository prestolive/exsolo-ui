<template>
  <div class="main">
    <h1>角色管理</h1>
    <page-table-normal v-bind="pageBind">
      <template #tableBar>
        <t-button theme="primary" @click="handleAdd"> 创建角色 </t-button>
      </template>
      <template #action="{ row }">
        <t-space>
          <t-button
            theme="default"
            variant="text"
            size="small"
            @click="onInfo(row.id)"
          >
            <template #icon> <t-icon name="search" /></template>
          </t-button>
          <t-button
            theme="default"
            variant="text"
            size="small"
            @click="onJump(row.id)"
          >
            <template #icon> <t-icon name="jump" /></template>
          </t-button>
        </t-space>
      </template>
    </page-table-normal>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'

import { post, UserPO } from '../API'
import {
  Space as TSpace,
  Button as TButton,
  Icon as TIcon,
} from 'tdesign-vue-next'
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
  { colKey: 'roleSchema', title: '角色类型' },
  { colKey: 'moduleCount', title: '关联模块数量' },
  { colKey: 'powerCount', title: '关联权限数量' },
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
})
const onInfo = (id: string) => {
  Glue.drawer(
    { title: '角色详情', width: '75%' },
    h(RoleInfo, {
      roleId: id,
      onChange: () => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      },
    })
  )
}
const onJump = (id: string) => {
  router.push('/ex-basic/role-info/' + id)
}

const handleAdd = () => {
  Glue.drawer(
    { title: '创建角色', width: '720px' },
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
  max-width: 1024px;
  min-height: 600px;
  padding: 24px;
}
</style>
