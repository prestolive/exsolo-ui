<template>
  <div v-show="dropdownOption.length > 0">
    <t-dropdown
      :options="dropdownOption"
      @click="(node) => onSelectChange(node.value + '')"
    >
      <t-button style="min-width: 80px">
        <template #suffix>
          <t-icon name="chevron-down" size="16" />
        </template>
        {{ options.find((row) => row.value == selectValue)?.label }}
      </t-button>
    </t-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, watch, computed } from 'vue'
import {
  Select as TSelect,
  Dropdown as TDropdown,
  Button as TButton,
  Icon as TIcon,
} from 'tdesign-vue-next'
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

const dropdownOption = computed(() => {
  return options.value.map((row) => {
    return {
      content: row.label,
      value: row.value,
    }
  })
})

watch(
  () => options.value,
  () => {
    if (options.value.length > 0 && !selectValue.value) {
      const defaultValue = options.value[0].value || ''
      onValueInit(defaultValue)
      emit('update:modelValue', defaultValue)
      emit('change', defaultValue)
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
