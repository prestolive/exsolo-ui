<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="登录名" name="loginCode">
      <t-input
        v-model="formData.loginCode"
        placeholder="英文数字4~12个字符"
      ></t-input>
    </t-form-item>
    <t-form-item label="称呼" name="userName">
      <t-input v-model="formData.userName" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="邮箱" name="email">
      <t-input v-model="formData.email" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="手机" name="phone">
      <t-input v-model="formData.phone" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-divider>密码</t-divider>
    <t-form-item label="密码" name="password">
      <t-space size="small">
        <t-input v-model="password" placeholder="请输入密码"></t-input>
        <t-button
          theme="default"
          variant="base"
          @click="handleGenerateRandomPassword"
          >生成随机密码</t-button
        >
      </t-space>
    </t-form-item>
    <t-form-item>
      <t-space size="small">
        <t-button theme="primary" type="submit">提交</t-button>
        <t-button theme="default" variant="base" type="reset">重置</t-button>
      </t-space>
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  Form as TForm,
  FormItem as TFormItem,
  Button as TButton,
  Space as TSpace,
  Input as TInput,
  Divider as TDivider,
  MessagePlugin,
  SubmitContext,
  FormInstanceFunctions,
} from 'tdesign-vue-next'
import { post, UserPO } from '../API'

const emit = defineEmits(['finish', 'change'])

const FORM_RULES = {
  userName: [{ required: true, message: '称呼必填' }],
  loginCode: [
    { required: true, message: '登录名必填' },
    {
      pattern: /^[a-z]([_a-zA-Z0-9]{3,20})$/,
      message: '小写英文字母、数字4~20个字符',
    },
  ],
}
const formData = ref<UserPO>({})
const password = ref('')
const form = ref<FormInstanceFunctions>()

const handleReset = () => {
  formData.value = {}
  handleGenerateRandomPassword()
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    // MessagePlugin.success('提交成功')
    post('api/ex-basic/user/add', {
      userPO: formData.value,
      password: password.value,
    }).then(() => {
      MessagePlugin.success('提交成功')
      handleReset()
      //先change再finish，先finish界面会被干掉
      emit('change')
      emit('finish')
    })
  } else {
    console.log('Validate Errors: ', firstError, validateResult)
    MessagePlugin.warning(firstError || '')
  }
}

const handleGenerateRandomPassword = () => {
  const chars = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'j',
    'k',
    'm',
    'n',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  let str = ''
  for (let i = 0; i < 8; i++) {
    var id = Math.ceil(Math.random() * (chars.length - 1))
    str += chars[id]
  }
  password.value = str
}

onMounted(() => {
  handleGenerateRandomPassword()
})
</script>

<style scoped></style>
