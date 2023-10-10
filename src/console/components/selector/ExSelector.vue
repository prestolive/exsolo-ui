<template>
  <t-select
    :value="selectValue"
    :options="options"
    :disabled="disabled"
    @change="onSelectChange"
  ></t-select>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, watch } from 'vue'
import { Select as TSelect } from 'tdesign-vue-next'
import { useExSelector, ChangeCallBack } from './ExSelector'

const props = defineProps({
  tag: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    defalut: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'finish'])

const callback: ChangeCallBack = {
  onChange: (value: string) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
}

const { selectValue, options, onValueInit, onSelectChange } = useExSelector(
  props.tag,
  callback
)

watch(
  () => props?.modelValue,
  () => {
    onValueInit(props?.modelValue)
  },
  { immediate: true }
)
</script>

<style scoped></style>
