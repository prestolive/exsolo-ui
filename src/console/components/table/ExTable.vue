<template>
  <div class="ex-table-portal">
    <t-table
      hover
      size="small"
      row-key="index"
      :data="pageObject?.values"
      :columns="columns"
      :loading="loading"
      :pagination="pageObject?.pagination"
      class="ex-table"
      @page-change="handlePageChange"
    >
      <template #topContent>
        <div class="table-bar">
          <div class="table-action">
            <ExTableConditionPanel @change="handleQueryPanelChange" />
          </div>
          <div class="table-config">
            <t-space size="0">
              <t-button theme="default" variant="text">
                <t-icon name="refresh" />
              </t-button>
              <t-button theme="default" variant="text">
                <t-icon name="download" />
              </t-button>
              <t-button theme="default" variant="text">
                <t-icon name="setting" />
              </t-button>
              <t-button theme="default" variant="text">
                <t-icon name="fullscreen" />
              </t-button>
            </t-space>
            <slot name="tableBar"></slot>
          </div>
        </div>
      </template>
      <template #actionColumn="{ row }">
        <slot name="action" :row="row"></slot>
      </template>
    </t-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, provide, useSlots } from 'vue'
import {
  Table as TTable,
  Button as TButton,
  Space as TSpace,
  Icon as TIcon,
} from 'tdesign-vue-next'

import { BaseTableCol, ConditionItem } from '@/console/index.d'

import ExTableConditionPanel from './ExTableConditionPanel'

import { ExTableHooks } from './ExTableHooks'

const props = defineProps<ExTableHooks>()

const realColumns = ref<BaseTableCol[]>(props.columns)

const slots = useSlots()
if (slots['action']) {
  realColumns.value.push({
    colKey: 'actionColumn',
    title: '操作',
    fixed: 'right',
  })
}

provide('conditions', props.conditions)

const pageHooks = reactive<ExTableHooks>(props)

const handleQueryPanelChange = (items: Array<ConditionItem>) => {
  pageHooks.handleConditionChange &&
    pageHooks.handleConditionChange({ cond: items })
}
</script>
<style scoped>
.main {
  margin: 8px;
  padding: 12px 24px;
  background: #fff;
  min-height: 600px;
}
/* .search-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 18px;
} */
.search-conds {
  display: flex;
  flex-direction: row;
}

.ex-table-portal {
}
.table-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin-bottom: 12px; */
  /* background: #f5f6f7; */
  margin-bottom: 12px;
  /* border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0; */
}
.table-action {
  display: flex;
}
.ex-table >>> th {
  background: var(--td-bg-color-secondarycontainer);
}
.ex-table >>> th:not(:first-child)::after {
  content: '';
  display: block;
  border-right: 1px solid var(--td-component-border);
  height: 14px;
  position: absolute;
  top: 12px;
  left: 0px;
}
.ex-table >>> .t-pagination {
  color: var(--td-text-color-secondary);
}
.ex-table >>> .t-table__content {
  border: 1px solid var(--td-component-border);
  border-radius: 3px;
}
</style>
