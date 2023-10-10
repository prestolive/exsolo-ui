<template>
  <div class="ex-select-input">
    <t-select-input
      v-model:value="selected"
      v-model:inputValue="inputValue"
      :allow-input="allowInput"
      placeholder="请选择或搜索"
      clearable
      multiple
      :disabled="props.disabled"
      :popup-visible="popupVisible"
      @popup-visible-change="(val) => onPopupChange(val)"
      @clear="onClear"
      @tag-change="onTagChange"
      @input-change="onInputChange"
      @blur="onBlur"
    >
      <template #suffixIcon>
        <chevron-down-icon />
      </template>
      <template #valueDisplay>
        <div v-if="onlyFirstValue && !multiple" class="single-content">
          {{ onlyFirstValue.label
          }}<span class="sub">{{ onlyFirstValue.sub }}</span>
        </div>

        <template v-if="multiple">
          <span v-for="(item, index) in selected" :Key="item.value" class="tag">
            {{ item.label }}<span class="sub">{{ item.sub }}</span>
            <span class="close-btn" @click="onTagRemove(index)"
              ><svg fill="none" viewBox="0 0 16 16" width="1em" height="1em">
                <path
                  fill="currentColor"
                  d="M8 8.92L11.08 12l.92-.92L8.92 8 12 4.92 11.08 4 8 7.08 4.92 4 4 4.92 7.08 8 4 11.08l.92.92L8 8.92z"
                  fill-opacity="0.9"
                ></path>
              </svg>
            </span>
          </span>
        </template>
      </template>
      <template #panel>
        <ul class="select-list">
          <li
            v-for="op in options"
            :key="op.value"
            :class="isOptionSelected(op) ? 'yes' : ''"
            @click="onSelect(op)"
          >
            {{ op.label }}<span class="sub">{{ op.sub }}</span>
          </li>
        </ul>
      </template>
    </t-select-input>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect, computed, onMounted } from 'vue'
import {
  SelectInput as TSelectInput,
  TagInputChangeContext,
  SelectInputValue,
} from 'tdesign-vue-next'

import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import { post, ExPickerOptionBO } from '@/console/api/PubDataAPI'
import debouncedRef from '../ts/DebouncedRef'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    defalut: false,
  },
})
//事件
const emit = defineEmits(['update:modelValue', 'change', 'finish'])
//porp参数
const code = ref(props.code)
const multiple = ref(props.multiple)

//被选中的对象，如果v-model有值则要加载进来
const selected = ref<ExPickerOptionBO[]>([])
const onlyFirstValue = computed(() => {
  return selected.value[0]
})
//输入状态
const inputMode = ref(false)
//快捷搜索的输入值
const inputValue = ref('')
//快捷收入的输入值防抖后的值
const keyword = debouncedRef('', 300, false)

const allowInput = computed(() => {
  if (!multiple.value && onlyFirstValue.value) {
    return false
  } else {
    return true
  }
})
const options = ref<ExPickerOptionBO[]>([])
const popupVisible = ref(false)
const isOptionSelected = (op: ExPickerOptionBO) => {
  return selected.value.some((row) => row.value == op.value)
}
const onPopupChange = (val: boolean) => {
  if (val) {
    onFind().then(() => {
      if (options.value.length > 0) {
        popupVisible.value = true
      } else {
        popupVisible.value = false
      }
    })
  } else {
    keyword.value = ''
    inputValue.value = ''
    popupVisible.value = false
  }
}
const onSelect = (item: ExPickerOptionBO) => {
  if (multiple.value) {
    const array = selected.value as ExPickerOptionBO[]
    const existIndex = array.findIndex((row) => row.value == item.value)
    if (existIndex < 0) {
      array.push(item)
    }
    selected.value = array
    if (options.value.length == 1) {
      popupVisible.value = false
    }
  } else {
    selected.value = [item]
    popupVisible.value = false
  }
  onBlur()
  onSelecChange()
}
const onTagChange = (
  currentTags: SelectInputValue,
  context: TagInputChangeContext
) => {
  const { trigger, index } = context
  if (trigger === 'clear') {
    onClear()
  }
  if (['tag-remove', 'backspace'].includes(trigger)) {
    selected.value?.splice(index as number, 1)
    onSelecChange()
  }
}
const onTagRemove = (index: number) => {
  selected.value?.splice(index, 1)
  onSelecChange()
}
const onClear = () => {
  selected.value.splice(0, selected.value.length)
  onSelecChange()
  inputValue.value = ''
}
const onSelecChange = () => {
  const values = selected.value.map((item) => item.value).join(',')
  emit('update:modelValue', values)
  emit('change', values)
}
const onBlur = () => {
  inputValue.value = ''
  keyword.value = ''
  inputMode.value = false
}
const onInputChange = (val: string) => {
  keyword.value = val
  inputMode.value = true
}
const onFind = () => {
  return post('api/console/picker/find', {
    code: code.value || '',
    keyword: keyword.value,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  }).then((data) => {
    options.value = data.values || []
    popupVisible.value = options.value.length > 0
  })
}

const onModelValueChange = (values: string) => {
  const ids = values.split(',')
  const requireIds = ids.filter(
    (id) => id && !selected.value.some((item) => item.value == id)
  )
  const arr = selected.value.filter(
    (item) => ids.indexOf(item.value || '') >= 0
  )
  if (requireIds.length > 0) {
    post('api/console/picker/get', {
      code: code.value || '',
      ids: requireIds,
    }).then((data) => {
      if (data) {
        data.forEach((item) => arr.push(item))
        selected.value = [...arr]
      }
    })
  }
}

watchEffect(() => {
  if (multiple.value) {
    selected.value = []
    inputValue.value = ''
  }
})

watch(keyword, () => {
  if (inputMode.value) {
    onFind()
  } else {
    inputMode.value = false
  }
})
watch(
  () => props.modelValue,
  () => {
    onModelValueChange(props.modelValue)
    //todo 更新 selected
  },
  { immediate: true }
)
watch(
  () => props.value,
  () => {
    onModelValueChange(props.value)
    //todo 更新 selected
  },
  { immediate: true }
)
</script>
<style scoped>
.select-list li {
  display: flex;
  cursor: pointer;
  vertical-align: middle;
  padding: 6px 6px;
}
.select-list li.yes:after {
  content: url('data:image/svg+xml;%20charset=utf8,%3Csvg%20t%3D%221691767885200%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%225661%22%20width%3D%2214%22%20height%3D%2214%22%3E%3Cpath%20d%3D%22M512%2065.984C266.08%2065.984%2065.984%20266.08%2065.984%20512c0%20245.952%20200.064%20446.016%20446.016%20446.016%20245.952%200%20446.016-200.064%20446.016-446.016C958.016%20266.08%20757.952%2065.984%20512%2065.984zM727.232%20438.432l-256.224%20259.008c-0.064%200.064-0.192%200.096-0.256%200.192-0.096%200.064-0.096%200.192-0.192%200.256-2.048%201.984-4.576%203.2-6.944%204.544-1.184%200.672-2.144%201.696-3.392%202.176-3.84%201.536-7.904%202.336-11.968%202.336-4.096%200-8.224-0.8-12.096-2.4-1.28-0.544-2.304-1.632-3.52-2.304-2.368-1.344-4.832-2.528-6.88-4.544-0.064-0.064-0.096-0.192-0.16-0.256-0.064-0.096-0.192-0.096-0.256-0.192l-126.016-129.504c-12.32-12.672-12.032-32.928%200.64-45.248%2012.672-12.288%2032.896-12.064%2045.248%200.64l103.264%20106.112%20233.28-235.84c12.416-12.576%2032.704-12.704%2045.248-0.256C739.52%20405.6%20739.648%20425.856%20727.232%20438.432z%22%20p-id%3D%225662%22%20fill%3D%22%23efb336%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E');
  display: block;
  position: relative;
  top: 3px;
  left: 6px;
}
.select-list li:hover {
  background: var(--td-bg-color-container-hover);
}
.sub {
  padding-left: 8px;
  color: var(--td-text-color-secondary);
}

.close-btn {
  width: calc(var(--td-font-size-body-medium) + 2px);
  height: calc(var(--td-font-size-body-medium) + 2px);
  flex-shrink: 0;
  font-size: 16px;
  margin-left: 6px;
  cursor: pointer;
}
.tag {
  vertical-align: middle;
  animation: t-fade-in 0.2s ease-in-out;
  margin: 3px var(--td-comp-margin-xs) 3px 0;
  color: var(--td-text-color-primary);
  background-color: var(--td-bg-color-component);
  list-style: none;
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  padding: 0px var(--td-comp-paddingLR-s);
  height: var(--td-comp-size-xs);
  font: var(--td-font-body-small);
  border-radius: var(--td-radius-default);
  border: 1px solid transparent;
  white-space: nowrap;
}
.single-content {
  line-height: 32px;
}
</style>
