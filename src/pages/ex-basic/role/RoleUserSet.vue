<template>
  <div class="main">
    <div style="margin: 8px 0px">
      <t-space>
        <t-button theme="primary" @click="onUserSet">
          <template #icon> <UserAddIcon /></template>选择新增用户
        </t-button>
      </t-space>
    </div>
    <div>
      <page-table-normal v-bind="pageBind"></page-table-normal>
    </div>
    <div>
      <t-dialog
        v-model:visible="userSetDialogVisible"
        header="添加用户到角色"
        :confirm-btn="userSetLoading"
        :on-confirm="onUserSetDialgConfirm"
        :on-close="onUserSetDialogClose"
      >
        <template #body>
          <section title="用户">
            <ex-picker code="default_user_picker" :multiple="true"></ex-picker>
          </section>
        </template>
      </t-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import {
  Space as TSpace,
  Button as TButton,
  Dialog as TDialog,
  TdButtonProps,
} from 'tdesign-vue-next'
import { UserAddIcon } from 'tdesign-icons-vue-next'
import { post, RoleInfoVO, UserPO } from '../API'

import PageTableNormal from '@/console/components/PageTableNormal.vue'
import { BaseTableCol, Pagination, BaseConditionCol } from '@/console/type'
import { useNormalPage } from '@/console/components/hooks/PageTableHooks'
import ExPicker from '@/console/components/picker/ExPicker.vue'
import Glue from '@/console/Glue'
const emit = defineEmits(['change', 'finish'])

const props = defineProps({
  roleId: {
    type: String,
    default: null,
  },
})
const roleId = ref(props.roleId)

const columns: BaseTableCol[] = [
  { colKey: 'userName', title: '用户名', width: 150 },
  { colKey: 'loginCode', title: '登录名', width: 150 },
  { colKey: 'phone', title: '手机号', width: 150 },
  { colKey: 'status', title: '状态', width: 150 },
  {
    colKey: 'action',
    title: '操作',
    fixed: 'right',
    // width: 120,
  },
]
const conditions: BaseConditionCol[] = [
  {
    key: 'userName',
    title: '用户名',
    schema: 'text',
  },
  {
    key: 'loginCode',
    title: '登录名',
    schema: 'text',
  },
  {
    key: 'phone',
    title: '手机号',
    schema: 'text',
  },
]

const pageBind = useNormalPage<UserPO>({
  columns: columns,
  conditions: conditions,
  loadData: (param: object, pagination: Pagination) => {
    return post('api/ex-basic/role/user-page', {
      roleId: roleId.value,
      ...param,
      pagination: pagination,
    })
  },
  handleInfo: (id: string) => {
    alert('click:' + id)
  },
})

const userSetDialogVisible = ref(false)
const userSetLoading = ref<TdButtonProps>({
  content: '保存',
  theme: 'primary',
  loading: false,
})
const onUserSet = () => {
  userSetDialogVisible.value = true
}
const onUserSetDialogClose = () => {
  userSetDialogVisible.value = false
}
const onUserSetDialgConfirm = () => {
  userSetLoading.value.loading = true
}
</script>

<style scoped>
.main {
  padding: 8px;
}
</style>
