<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    :colon="true"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="登录名" name="userCode">
      <t-input
        v-model="formData.userCode"
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
    <t-form-item>
      <t-space size="small">
        <t-button theme="primary" type="submit">提交</t-button>
        <t-button theme="default" variant="base" type="reset">重置</t-button>
      </t-space>
    </t-form-item>
  </t-form>
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

const handleLoadData = (userId: string) => {
  post('api/ex-basic/security/user-info', { userId: userId }).then((data) => {
    formData.value = { ...data }
  })
}

watchEffect(() => {
  if (userId.value) {
    handleLoadData(userId.value)
  }
})

const FORM_RULES = {
  userName: [{ required: true, message: '称呼必填' }],
  userCode: [
    { required: true, message: '登录名必填' },
    {
      pattern: /^[a-z]([_a-zA-Z0-9]{4,20})$/,
      message: '小写英文字母、数字4~20个字符',
    },
  ],
}
const formData = ref<UserPO>({})
const form = ref<FormInstanceFunctions>()

const handleReset = () => {
  formData.value = {}
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    // MessagePlugin.success('修改成功')
    post('api/ex-basic/security/user-modify', {
      userPO: formData.value,
    }).then(() => {
      MessagePlugin.success('修改成功')
      handleReset()
      emit('change')
      emit('finish')
    })
  } else {
    console.log('Validate Errors: ', firstError, validateResult)
    MessagePlugin.warning(firstError || '')
  }
}
</script>

<style scoped></style>
