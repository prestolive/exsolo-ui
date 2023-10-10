<template>
  <div class="main">
    <div class="header">
      <t-card :title="vo?.rolePO?.roleName" hover-shadow>
        <template #actions>
          <t-space>
            <t-button theme="default" size="small" @click="handleModify">
              <template #icon> <t-icon name="edit" /></template>修改
            </t-button>
            <t-button
              theme="default"
              variant="text"
              size="small"
              @click="onDelete"
            >
              <template #icon> <t-icon name="delete" /></template>删除
            </t-button>
          </t-space>
        </template>
        <template #content>
          <section title="名称">{{ vo?.rolePO?.roleName }}</section>
          <section title="类型">{{ vo?.rolePO?.roleSchema }}</section>
          <section title="最后修改时间">{{ vo?.rolePO?.ts }}</section>
          <section title="创建人">{{ vo?.rolePO?.operator }}</section>
        </template>
      </t-card>
    </div>
    <t-tabs :default-value="1" class="role-content" size="medium">
      <t-tab-panel :value="1" label="权限清单">
        <RolePermissionSet :role-id="roleId" />
      </t-tab-panel>
      <t-tab-panel :value="2" label="已分配用户">
        <RoleUserSet :role-id="roleId" />
      </t-tab-panel>
      <t-tab-panel :value="3" label="已分配组织">
        <p style="margin: 20px">选项卡2内容区</p>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, h, Ref } from 'vue'
import {
  Space as TSpace,
  Button as TButton,
  Tabs as TTabs,
  TabPanel as TTabPanel,
  Badge as TBadge,
  Dropdown as TDropdown,
  Card as TCard,
  Icon as TIcon,
  MessagePlugin,
  DialogPlugin,
} from 'tdesign-vue-next'
import { post, RoleInfoVO } from '../API'
import { useRoute } from 'vue-router'
import RoleModify from './RoleModify.vue'
import RolePermissionSet from './RolePermissionSet.vue'

import RoleUserSet from './RoleUserSet.vue'
import { ExPlugin } from '@/console/index.d'

const props = defineProps({
  roleId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['change', 'finish', 'close', 'title'])

let roleId: Ref
if (props.roleId) {
  roleId = ref(props.roleId)
} else {
  const route = useRoute()
  roleId = ref(route.params.roleId)
}

const vo = ref<RoleInfoVO>()

const handleLoadData = (roleId: string) => {
  post('api/ex-basic/role/info', { roleId: roleId }).then((data) => {
    vo.value = { ...data }
    emit('title', `角色#${vo.value.rolePO?.roleName}`)
  })
}

watchEffect(() => {
  if (roleId.value) {
    handleLoadData(roleId.value)
  }
})

const handleModify = () => {
  ExPlugin.drawer(
    { title: '修改名称', width: '520px' },
    h(RoleModify, {
      roleId: roleId.value,
      onChange: () => {
        handleLoadData(roleId.value)
      },
    })
  )
}
const onDelete = () => {
  const confirmDialog = DialogPlugin.confirm({
    header: '删除确认',
    body: '确认删除？已分配给用户的权限将同时收回',
    onConfirm: () => {
      post('api/ex-basic/role/delete', { roleId: roleId.value }).then(() => {
        MessagePlugin.success('删除成功')
        emit('change')
        emit('finish')
        emit('close')
      })
      confirmDialog.destroy()
    },
  })
}
</script>

<style scoped>
.main {
  max-width: 1024px;
  padding: 24px;
}
.t-drawer__body .main {
  padding: 0px !important;
}
.role-content {
  margin-top: 12px;
}
</style>
