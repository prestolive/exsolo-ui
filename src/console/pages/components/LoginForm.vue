<template>
  <div class="login-form">
    <t-form ref="form" :data="formData" :rules="FORM_RULES" label-width="0">
      <t-form-item name="loginCode">
        <t-input v-model="formData.loginCode" size="large" placeholder="账号">
          <template #prefix-icon>
            <UserIcon />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码：admin"
        >
          <template #prefix-icon>
            <LockOnIcon />
          </template>
          <template #suffix-icon>
            <BrowseIcon v-if="showPsw" @click="showPsw = !showPsw" />
            <BrowseOffIcon v-if="!showPsw" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  Form as TForm,
  FormItem as TFormItem,
  Input as TInput,
} from 'tdesign-vue-next'

import {
  UserIcon,
  LockOnIcon,
  BrowseIcon,
  BrowseOffIcon,
} from 'tdesign-icons-vue-next'
const FORM_RULES = {
  loginCode: [{ required: true, message: '请填写账号' }],
  password: [{ required: true, message: '请填写密码' }],
}

const formData = ref({})
const showPsw = ref(false)
</script>

<style scoped>
.login-form >>> input[type='password']::-ms-reveal {
  display: none;
}
</style>
