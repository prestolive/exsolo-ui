<template>
  <div>
    <page-table-normal v-bind="pageBind"></page-table-normal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h } from 'vue'

import { post, UserPO } from '../API'
import UserFormAdd from './UserFormAdd.vue'
import UserInfo from './UserInfo.vue'
import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import Glue from '@/console/Glue'

const columns: BaseTableCol[] = [
  { colKey: 'userCode', title: '登录名', width: 120 },
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
    key: 'userCode',
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
    return post('api/ex-basic/security/users', {
      ...param,
      pagination: pagination,
    })
  },
  handleAdd: () => {
    Glue.drawer(
      { title: '新增用户', width: '720px' },
      h(UserFormAdd, {
        onChange: () => {
          // handleLoadData()
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
          // handleLoadData()
        },
      })
    )
    // router.push('/ex-basic/user-info/' + userId)
  },
})
onMounted(() => {
  // handleLoadData()
})
</script>
<style scoped>
.main {
  margin: 8px;
  padding: 12px 24px;
  background: #fff;
  min-height: 600px;
}
.search-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 18px;
}
.search-conds {
  display: flex;
  flex-direction: row;
}
.table-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin-bottom: 12px; */
  background: #fafafa;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}
.ex-table {
  /* margin-top: 12px; */
  width: calc(100vw - 280px);
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
  padding-top: 12px;
}

.item-table >>> .t-table thead tr {
  background: #fafafa;
}
.item-table >>> .t-table thead tr th:first-child {
  border-left: 1px solid #f0f0f0;
}

.item-table >>> .t-table thead tr th:last-child {
  border-right: 1px solid #f0f0f0;
}
.item-table >>> .t-table thead tr th {
  border-top: 1px solid #f0f0f0;
}
.item-table >>> .table-bar + .t-table th {
  border-top: none;
}
</style>
