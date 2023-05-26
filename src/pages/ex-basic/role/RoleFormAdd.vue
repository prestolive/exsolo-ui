<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    :colon="true"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="角色名称" name="roleName">
      <t-input v-model="formData.roleName" placeholder="角色名称"></t-input>
    </t-form-item>
    <t-form-item label="角色类型" name="roleSchema">
      <t-select v-model="formData.roleSchema" placeholder="角色类型">
        <t-option key="NORMAL" label="一般用户" value="NORMAL" />
        <t-option key="ADMIN" label="系统管理" value="ADMIN" />
      </t-select>
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
import { ref } from 'vue'
import {
  Form as TForm,
  FormItem as TFormItem,
  Button as TButton,
  Space as TSpace,
  Input as TInput,
  Select as TSelect,
  Option as TOption,
  MessagePlugin,
  SubmitContext,
  FormInstanceFunctions,
} from 'tdesign-vue-next'
import { post, RolePO } from '../API'

const emit = defineEmits(['finish', 'change'])

const FORM_RULES = {
  roleName: [{ required: true, message: '角色名称必填' }],
}
const formData = ref<RolePO>({})
const form = ref<FormInstanceFunctions>()

const handleReset = () => {
  formData.value = {}
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    // MessagePlugin.success('提交成功')
    post('api/ex-basic/role/add', {
      role: formData.value,
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
</script>

<style scoped></style>
