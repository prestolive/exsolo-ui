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
      <t-select :value="vo.rolePO?.roleSchema" disabled placeholder="角色类型">
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
import { ref, onMounted, watchEffect } from 'vue'
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
import { post, RoleInfoVO, RolePO } from '../API'

const emit = defineEmits(['change', 'finish'])

const props = defineProps({
  roleId: {
    type: String,
    default: null,
  },
})

const roleId = ref(props.roleId)

const formData = ref<RolePO>({})
const form = ref<FormInstanceFunctions>()
const vo = ref<RoleInfoVO>({})

const handleLoadData = (roleId: string) => {
  post('api/ex-basic/role/info', { roleId: roleId }).then((data) => {
    vo.value = { ...data }
    formData.value = { ...data.rolePO }
  })
}

watchEffect(() => {
  if (roleId.value) {
    handleLoadData(roleId.value)
  }
})

const FORM_RULES = {
  roleName: [{ required: true, message: '角色名称必填' }],
}

const handleReset = () => {
  formData.value = {}
}

const handleSubmit = (context: SubmitContext) => {
  const { validateResult, firstError } = context
  if (validateResult === true) {
    // MessagePlugin.success('修改成功')
    post('api/ex-basic/role/modify', {
      roleId: vo.value.rolePO?.id,
      roleName: formData.value.roleName,
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
