<template>
  <div class="cell-panel">
    <div class="cell" @blur="onBlur">
      <div class="title">{{ sp?.propName }}</div>
      <div class="content">
        <div v-if="!editMode" class="content-value">
          <t-switch
            v-if="sp?.inputType == 'BOOLEAN'"
            :value="sp?.propValue"
            :disabled="true"
          ></t-switch>
          <ex-picker
            v-else-if="sp?.inputType == 'PICKER'"
            :value="sp?.propValue"
            :code="sp?.pickerCode"
            :disabled="true"
          ></ex-picker>
          <span v-else>{{ sp?.propValue }}</span>
        </div>
        <div v-if="editMode" class="content-editor">
          <t-input
            v-if="sp?.inputType == 'STRING'"
            v-model="editValue"
          ></t-input>
          <t-input-number
            v-if="sp?.inputType == 'INTEGER'"
            v-model="editValue"
            :decimal-places="0"
          ></t-input-number>
          <t-switch
            v-if="sp?.inputType == 'BOOLEAN'"
            v-model="editValue"
          ></t-switch>
          <t-input-number
            v-if="sp?.inputType == 'DECIMAL'"
            v-model="editValue"
          ></t-input-number>
          <ex-picker
            v-if="sp?.inputType == 'PICKER'"
            v-model="editValue"
            :code="sp?.pickerCode"
          ></ex-picker>
          <t-date-picker
            v-if="sp?.inputType == 'DATE'"
            v-model="editValue"
          ></t-date-picker>
          <t-date-picker
            v-if="sp?.inputType == 'YEAR'"
            v-model="editValue"
            mode="year"
          ></t-date-picker>
          <t-date-picker
            v-if="sp?.inputType == 'MONTH'"
            v-model="editValue"
            mode="month"
          ></t-date-picker>
          <t-date-picker
            v-if="sp?.inputType == 'DATETIME'"
            v-model="editValue"
            enable-time-picker
            allow-input
            clearable
            format="YYYY-MM-DD HH:mm:ss"
          ></t-date-picker>
        </div>
      </div>
      <div class="action">
        <t-space size="0px">
          <t-button v-if="editMode" size="small" @click="onEditConifrm">
            <t-icon name="check"></t-icon>
          </t-button>
          <t-button
            v-if="editMode"
            size="small"
            variant="text"
            @click="onEditCancel"
          >
            <t-icon name="close"></t-icon>
          </t-button>
          <t-button
            v-if="!editMode"
            size="small"
            variant="text"
            @click="onEditOn"
          >
            <t-icon name="edit"></t-icon>
          </t-button>
        </t-space>
      </div>
    </div>
    <div v-if="sp.desc" class="desc">{{ sp.desc }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { post, ExSettingInstanceVO } from '../API'
import ExPicker from '@/console/components/picker/ExPicker.vue'
import {
  Space as TSpace,
  Button as TButton,
  Icon as TIcon,
  Input as TInput,
  Switch as TSwitch,
  InputNumber as TInputNumber,
  DatePicker as TDatePicker,
  MessagePlugin,
} from 'tdesign-vue-next'

const props = defineProps<{
  settingProp: ExSettingInstanceVO
}>()

const emit = defineEmits(['change'])

const sp = ref<ExSettingInstanceVO>()

watch(
  () => props.settingProp,
  () => {
    sp.value = { ...props.settingProp }
  },
  { immediate: true }
)

const editMode = ref(false)

const editValue = ref('')

const onEditOn = () => {
  editMode.value = true
  editValue.value = sp.value.propValue || ''
}
const onEditCancel = () => {
  editMode.value = false
  editValue.value = ''
}

const onEditConifrm = () => {
  if (sp.value.isRequire && !editValue.value) {
    MessagePlugin.error('该参数为必填参数')
    return
  }
  post('api/ex-basic/setting/set', {
    clzName: sp.value.clzName,
    fieldName: sp.value.fieldName,
    propValue: editValue.value,
  }).then(() => {
    MessagePlugin.success('参数设置成功')
    emit('change')
  })
  editMode.value = false
}
const onBlur = () => {
  alert('dd')
}
</script>
<style scoped>
.cell {
  display: flex;
  line-height: 22px;
  height: 32px;
}
.title {
  color: var(--td-text-color-secondary);
  min-width: 180px;
  margin: auto 0px;
}
.content {
  display: flex;
  margin-left: 12px;
  margin: auto 0px;
  color: var(--td-text-color-primary);
}
.content-value {
  min-width: 220px;
  padding: 0 var(--td-comp-paddingLR-s);
}
.content-editor {
  min-width: 220px;
  border-radius: 3px;
}
.action {
  padding-top: 1px;
  margin: auto 12px auto 24px;
}
.desc {
  color: var(--td-text-color-placeholder);
  font-size: 11px;
}
.cell-panel {
  padding: 12px 12px;
  position: relative;
}
.cell-panel:hover:before {
  content: '';
  display: block;
  position: absolute;
  left: 0px;
  top: 20px;
  width: 3px;
  height: 38px;
  background: var(--td-bg-color-container-active);
}
</style>
