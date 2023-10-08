<template>
  <t-form
    ref="form"
    :rules="FORM_RULES"
    :data="formData"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="名称" name="name">
      <t-input v-model="formData.name" placeholder="名称"></t-input>
    </t-form-item>
    <t-form-item label="编码" name="code">
      <t-input v-model="formData.code" placeholder="编码"></t-input>
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
  MessagePlugin,
  SubmitContext,
  FormInstanceFunctions,
} from 'tdesign-vue-next'
import { post, ItemPO } from './API'

const emit = defineEmits(['finish', 'change'])

const props = defineProps({
  tag: {
    type: String,
    default: null,
  },
})

const FORM_RULES = {
  name: [{ required: true, message: '名称必填' }],
  code: [{ required: true, message: '编码必填' }],
}
const formData = ref<ItemPO>({})
const form = ref<FormInstanceFunctions>()

const handleReset = () => {
  formData.value = {}
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    post('api/ex-kit-console/create-item', {
      item: formData.value,
      tag: props.tag,
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
