<template>
  <div>
    <div class="info">
      <div class="header">
        <div class="role-name">
          <h1>{{ vo?.rolePO?.roleName }}</h1>
          <div style="color: orange; padding-left: 11px">
            {{ vo?.rolePO?.roleSchema }}
          </div>
        </div>
        <t-space class="operate">
          <t-button theme="default" @click="handleModify">修改</t-button>
          <t-button theme="default" variant="text" @click="handleDelete">
            <template #icon> <delete-icon /></template>删除
          </t-button>
        </t-space>
      </div>
      <t-tabs :default-value="1" class="role-content">
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
  MessagePlugin,
  DialogPlugin,
} from 'tdesign-vue-next'
import { EditIcon, DeleteIcon, LockOnIcon } from 'tdesign-icons-vue-next'
import { post, RoleInfoVO, UserPO } from '../API'
import { useRoute, useRouter } from 'vue-router'
import { useRouterTabsStore } from '@/console/store/routerTabs'
import RoleModify from './RoleModify.vue'
import RolePermissionSet from './RolePermissionSet.vue'

import RoleUserSet from './RoleUserSet.vue'
import Glue from '@/console/Glue'

const props = defineProps({
  roleId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['change', 'finish', 'close', 'title'])

//
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
  Glue.drawer(
    { title: '修改名称', width: '520px' },
    h(RoleModify, {
      roleId: roleId.value,
      onChange: () => {
        handleLoadData(roleId.value)
      },
    })
  )
}
const handleDelete = () => {
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
.header {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background: #f9fafc;
}
.role-name {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
.info {
  /* padding: 8px 16px; */
}
.info h1 {
  font-size: 1.5em;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.item-block {
  display: flex;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.95);
}
.item-block h1 {
  width: 150px;
  font-weight: normal;
  text-align: left;
  font-size: 1em;
  margin-block-start: 0em;
  margin-block-end: 0em;
  color: rgba(0, 0, 0, 0.65);
}
.bread {
  padding: 12px 12px 3px 12px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 0.8em;
}
.role-content {
  padding: 12px;
}
</style>
