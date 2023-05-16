<template>
  <div>
    <t-form
      ref="form"
      :rules="FORM_RULES"
      :data="formData"
      :colon="true"
      @submit="handleSubmit"
    >
      <t-form-item label="登录名">
        <t-input
          v-model="vo.userCode"
          placeholder="英文数字4~12个字符"
          disabled
        ></t-input>
      </t-form-item>
      <t-form-item label="称呼">
        <t-input
          v-model="vo.userName"
          placeholder="请输入内容"
          disabled
        ></t-input>
      </t-form-item>
      <t-form-item label="新密码" name="password">
        <t-space size="small">
          <t-input
            v-model="formData.password"
            placeholder="请输入密码"
          ></t-input>
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
        </t-space>
      </t-form-item>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'
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

const emit = defineEmits(['change', 'finish'])

const props = defineProps({
  userId: {
    type: String,
    default: null,
  },
})

const userId = ref(props.userId)
const vo = ref<UserPO>({})

const handleLoadData = (userId: string) => {
  post('api/ex-basic/security/user-info', { userId: userId }).then((data) => {
    vo.value = { ...data }
  })
}

watchEffect(() => {
  if (userId.value) {
    handleLoadData(userId.value)
  }
})

const FORM_RULES = {
  password: [{ required: true, message: '新密码必填' }],
}
const formData = ref({
  password: '',
})
const form = ref<FormInstanceFunctions>()

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    post('api/ex-basic/security/user-change-password', {
      userId: userId.value,
      password: formData.value.password,
    }).then(() => {
      MessagePlugin.success('修改成功')
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
  formData.value.password = str
}

onMounted(() => {
  handleGenerateRandomPassword()
})
</script>

<style scoped></style>
