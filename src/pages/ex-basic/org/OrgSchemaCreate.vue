<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="组织类型名称" name="orgSchemaName">
      <t-input
        v-model="formData.orgSchemaName"
        placeholder="组织类型名称"
      ></t-input>
    </t-form-item>
    <t-form-item label="组织类型编码" name="orgSchemaCode">
      <t-input
        v-model="formData.orgSchemaCode"
        placeholder="组织类型编码"
      ></t-input>
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
  Input as TInput,
  Button as TButton,
  Space as TSpace,
  MessagePlugin,
  SubmitContext,
  FormInstanceFunctions,
} from 'tdesign-vue-next'
import { post, OrgSchemaPO } from '../API'

const emit = defineEmits(['finish', 'change'])

const FORM_RULES = {
  orgSchemaName: [{ required: true, message: '组织类型名称必填' }],
  orgSchemaCode: [{ required: true, message: '组织类型编码必填' }],
}
const formData = ref<OrgSchemaPO>({})
const form = ref<FormInstanceFunctions>()

const handleReset = () => {
  formData.value = {}
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    // MessagePlugin.success('提交成功')
    post('api/ex-basic/org/create-schema', {
      orgSchema: formData.value,
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
