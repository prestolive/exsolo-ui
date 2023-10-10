<template>
  <div>
    <div style="padding: 12px 12px 12px 0px">
      <t-space>
        <t-button theme="primary" @click="onUserSet">
          <template #icon> <t-icon name="user-add" /></template>选择新增用户
        </t-button>
      </t-space>
    </div>
    <div>
      <ex-table v-bind="pageBind">
        <template #action="{ row }">
          <t-space>
            <t-button
              theme="default"
              variant="base"
              size="small"
              @click="onUserDelete(row.id)"
            >
              <template #icon> <t-icon name="delete" /></template>
            </t-button> </t-space
        ></template>
      </ex-table>
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
            <ex-picker
              v-model="userSetValues"
              code="DEFAULT_USER_PICKER"
              :multiple="true"
            ></ex-picker>
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
  Icon as TIcon,
  TdButtonProps,
  DialogPlugin,
} from 'tdesign-vue-next'
import { post, UserPO } from '../API'

import {
  BaseTableCol,
  Pagination,
  BaseConditionCol,
  ExTable,
  useExTable,
} from '@/console/index.d'
import ExPicker from '@/console/components/picker/ExPicker.vue'
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

const pageBind = useExTable<UserPO>({
  columns: columns,
  conditions: conditions,
  loadData: (param: object, pagination: Pagination) => {
    return post('api/ex-basic/role/user-page', {
      roleId: roleId.value,
      ...param,
      pagination: pagination,
    })
  },
})

const userSetDialogVisible = ref(false)
const userSetValues = ref('')
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
  if (userSetValues.value) {
    userSetLoading.value.loading = true
    post('api/ex-basic/role/user-set', {
      roleId: roleId.value,
      userIds: userSetValues.value.split(','),
    })
      .then(() => {
        userSetLoading.value.loading = false
        userSetDialogVisible.value = false
        userSetValues.value = ''
        pageBind.handleRefresh && pageBind.handleRefresh()
      })
      .finally(() => {
        userSetLoading.value.loading = false
      })
  }
}
const onUserDelete = (userId: string) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '确认删除？',
    // body: '确认删除？',
    onConfirm: () => {
      post('api/ex-basic/role/user-delete', {
        roleId: roleId.value,
        userId: userId,
      }).then(() => {
        pageBind.handleRefresh && pageBind.handleRefresh()
      })
      confirmDialog.destroy()
    },
  })
}
</script>

<style scoped></style>
