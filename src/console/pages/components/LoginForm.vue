<template>
  <div class="login-form">
    <t-form
      ref="form"
      :data="formData"
      :rules="FORM_RULES"
      label-width="0"
      @reset="onReset"
      @submit="onSubmit"
    >
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
      <t-form-item v-if="captchaRequire" name="captchaValue">
        <t-input
          v-model="formData.captchaValue"
          size="large"
          type="text"
          :clearable="false"
          placeholder="请输入验证码"
        >
          <template #prefix-icon>
            <LogoAndroidIcon />
          </template>

          <template #suffix>
            <div
              style="
                padding: 3px;
                height: 40px;
                box-sizing: border-box;
                cursor: pointer;
              "
              @click="updateCaptchaImage"
            >
              <img :src="captchaBase64Img" style="height: 34px" />
            </div>
          </template>
        </t-input>
      </t-form-item>
      <t-form-item>
        <t-button theme="primary" type="submit" block :disabled="submitDisable"
          >登录</t-button
        >
      </t-form-item>
    </t-form>

    <div
      style="
        color: #e22;
        line-height: 24px;
        margin-top: 6px;
        text-align: center;
      "
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import {
  Form as TForm,
  FormItem as TFormItem,
  Button as TButton,
  Input as TInput,
  DialogPlugin,
  MessagePlugin,
} from 'tdesign-vue-next'

import {
  UserIcon,
  LockOnIcon,
  BrowseIcon,
  BrowseOffIcon,
  LogoAndroidIcon,
} from 'tdesign-icons-vue-next'
import {
  post as AuthServerPost,
  get as AuthServerGet,
} from '@/console/AuthServerAPI'

import { TOKEN_NAME } from '@/config/global'

const FORM_RULES = {
  loginCode: [{ required: true, message: '请填写账号' }],
  password: [{ required: true, message: '请填写密码' }],
}

const formData = ref({})
const showPsw = ref(false)
const errorMessage = ref('')
const captchaRequire = ref(false)
const captchaTicket = ref('')
const captchaBase64Img = ref('')
const submitDisable = ref(false)

const onReset = () => {
  formData.value = {}
}

const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    formData.value.captchaTicket = captchaTicket.value
    submitDisable.value = true
    AuthServerPost('api/auth/verify', formData.value)
      .then((data) => {
        errorMessage.value = ''
        if (data.success) {
          localStorage.setItem(TOKEN_NAME, data.token || '')
          setAuthMeta(data.captchaRequire, data.captchaExpireTime)
          //TOOD 跳转
          MessagePlugin.success({
            content: '登录成功',
            // placement: 'center',
          })
          setTimeout(() => {
            window.location.href = '/'
          }, 500)
        }
      })
      .catch((err) => {
        errorMessage.value = err.message
        submitDisable.value = false
        setAuthMeta(err.data.captchaRequire, err.data.captchaExpireTime)
        updateCaptchaImage()
      })
  }
}

const updateCaptchaImage = () => {
  AuthServerGet('api/auth/captcha').then((data) => {
    captchaTicket.value = data.ticket || ''
    captchaBase64Img.value = data.captchaBase64 || ''
    formData.value.captchaValue = ''
  })
}

const setAuthMeta = (cr: boolean, ce: number) => {
  localStorage.setItem('captchaRequire', cr + '')
  localStorage.setItem('captchaExpireTime', ce + '')
  captchaRequire.value = cr
}
onMounted(() => {
  const cr = Boolean(localStorage.getItem('captchaRequire') == 'true')
  if (cr) {
    const ce = Number(localStorage.getItem('captchaExpireTime'))
    window.console.log('local', Date.now())
    window.console.log('stron', ce)
    if (ce > Date.now()) {
      captchaRequire.value = true
    } else {
      captchaRequire.value = false
    }
  } else {
    captchaRequire.value = false
  }
  if (captchaRequire.value) {
    updateCaptchaImage()
  }
})
</script>

<style scoped>
.login-form >>> input[type='password']::-ms-reveal {
  display: none;
}
</style>
