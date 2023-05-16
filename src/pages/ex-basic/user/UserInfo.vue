<template>
  <div>
    <div class="info">
      <t-space class="operate">
        <t-button theme="default" variant="base" @click="handleModifyUser">
          <template #icon> <edit-icon /></template>修改基本信息
        </t-button>
        <t-button theme="default" variant="base" @click="handleChangePassword">
          <template #icon> <lock-on-icon /></template>修改密码
        </t-button>
        <t-button theme="default" variant="base">
          <template #icon> <secured-icon /></template>修改权限
        </t-button>
        <t-button theme="default" variant="text">
          <template #icon> <search-icon /></template>完整权限视图
        </t-button>
      </t-space>
      <h1>基本信息</h1>
      <div class="item-block">
        <h1>状态</h1>
        <span>{{ vo?.status }}</span>
      </div>
      <div class="item-block">
        <h1>登录名</h1>
        <span>{{ vo?.userCode }}</span>
      </div>
      <div class="item-block">
        <h1>称呼</h1>
        <span>{{ vo?.userName }}</span>
      </div>
      <div class="item-block">
        <h1>创建时间</h1>
        <span>{{ vo?.activeTs }}</span>
      </div>
      <div class="item-block">
        <h1>邮箱</h1>
        <span>{{ vo?.email }}</span>
      </div>
      <div class="item-block">
        <h1>手机号码</h1>
        <span>{{ vo?.phone }}</span>
      </div>
      <h1>权限信息</h1>
      <div>building....</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, h, Ref } from 'vue'
import { Space as TSpace, Button as TButton } from 'tdesign-vue-next'
import {
  SearchIcon,
  EditIcon,
  LockOnIcon,
  SecuredIcon,
} from 'tdesign-icons-vue-next'
import { post, UserPO } from '../API'
import { useRoute } from 'vue-router'
import { useRouterTabsStore } from '@/console/store/routerTabs'
import UserFormModify from './UserFormModify.vue'
import UserFormChangePassword from './UserFormChangePassword.vue'
import Glue from '@/console/Glue'

const props = defineProps({
  userId: {
    type: String,
    default: null,
  },
})

const routerTabsStroe = useRouterTabsStore()

//
let userId: Ref
if (props.userId) {
  userId = ref(props.userId)
} else {
  const route = useRoute()
  userId = ref(route.params.userId)
}

const vo = ref<UserPO>()

const handleLoadData = (userId: string) => {
  post('api/ex-basic/security/user-info', { userId: userId }).then((data) => {
    vo.value = { ...data }
    routerTabsStroe.updateRouterTab()
  })
}

watchEffect(() => {
  if (userId.value) {
    handleLoadData(userId.value)
  }
})

const handleModifyUser = () => {
  Glue.drawer(
    { title: '修改用户', width: '520px' },
    h(UserFormModify, {
      userId: userId.value,
      onChange: () => {
        handleLoadData(userId.value)
      },
    })
  )
}

const handleChangePassword = () => {
  Glue.drawer(
    { title: '修改密码', width: '520px' },
    h(UserFormChangePassword, {
      userId: userId.value,
      onChange: () => {
        handleLoadData(userId.value)
      },
    })
  )
}
</script>

<style scoped>
.operate {
  margin-bottom: 12px;
}
.info {
  padding: 24px;
}
.info h1 {
  font-size: 1.3em;
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
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
</style>
