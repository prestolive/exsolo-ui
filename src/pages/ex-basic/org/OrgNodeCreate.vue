<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="组织名称" name="orgName">
      <t-input v-model="formData.orgName" placeholder="组织名称"></t-input>
    </t-form-item>
    <t-form-item label="组织编码" name="orgCode">
      <t-input v-model="formData.orgCode" placeholder="组织编码"></t-input>
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
import { post, OrgNodePO } from '../API'

const emit = defineEmits(['finish', 'change'])

const props = defineProps({
  schemaCode: {
    type: String,
    default: null,
  },
  parentId: {
    type: String,
    default: null,
  },
})

const FORM_RULES = {
  orgName: [{ required: true, message: '组织名称必填' }],
  orgCode: [{ required: true, message: '组织编码必填' }],
}
const formData = ref<OrgNodePO>({})
const form = ref<FormInstanceFunctions>()

const handleReset = () => {
  formData.value = {}
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    formData.value.schemaCode = props.schemaCode
    post('api/ex-basic/org/create-node', {
      orgNode: formData.value,
      parentId: props.parentId,
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
