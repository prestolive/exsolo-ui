<template>
  <div>
    <div class="item-manage">
      <div class="item-table">
        <div class="search-bar">
          <PageTableConditionPanel @change="handleQueryPanelChange" />
        </div>

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
                <t-button @click="handleAdd">
                  <template #icon> <add-icon /></template>新增
                </t-button>
              </div>
              <div class="table-config">
                <t-button theme="default" variant="text">
                  <refresh-icon />
                </t-button>
                <t-button theme="default" variant="text">
                  <download-icon />
                </t-button>
                <t-button theme="default" variant="text">
                  <setting-icon />
                </t-button>
                <t-button theme="default" variant="text">
                  <fullscreen-icon />
                </t-button>
              </div>
            </div>
          </template>
          <template #action="{ row }">
            <t-space>
              <t-button
                theme="default"
                variant="base"
                size="small"
                @click="handleInfo(row.id)"
              >
                <template #icon> <search-icon /></template>
              </t-button>
            </t-space>
          </template>
        </t-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, provide, defineProps } from 'vue'
import {
  Table as TTable,
  Button as TButton,
  Space as TSpace,
  PageInfo,
  BaseTableCol,
} from 'tdesign-vue-next'

import {
  SearchIcon,
  RefreshIcon,
  FullscreenIcon,
  SettingIcon,
  AddIcon,
  DownloadIcon,
} from 'tdesign-icons-vue-next'

import {
  PageObject,
  Pagination,
  BaseConditionCol,
  ConditionItem,
} from '@/console/type'
import PageTableConditionPanel from '@/console/components/render/PageTableConditionPanel'

interface PageHooksLocal {
  columns: BaseTableCol[]
  pageObject: PageObject
  conditions: Array<BaseConditionCol>
  loading: boolean
  loadData: (param: object, pagination: Pagination) => Promise<PageObject>
  handleAdd: () => void
  handleInfo: (id: string) => void
  handlePageChange: (pageInfo: PageInfo) => void
  handleConditionChange?: (params: object) => void
}

const props = defineProps<PageHooksLocal>()

provide('conditions', props.conditions)
const pageHooks = reactive<PageHooksLocal>(props)

const handleQueryPanelChange = (items: Array<ConditionItem>) => {
  window.console.log('items', items)
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
.search-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 18px;
}
.search-conds {
  display: flex;
  flex-direction: row;
}
.table-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin-bottom: 12px; */
  background: #fafafa;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}
.ex-table {
  /* margin-top: 12px; */
  width: calc(100vw - 280px);
}
.item-manage {
  display: flex;
  flex-direction: row;
}
.item-tree {
  flex: 0 0 324px;
  padding: 12px;
}
.item-table {
  padding-top: 12px;
}

.item-table >>> .t-table thead tr {
  background: #fafafa;
}
.item-table >>> .t-table thead tr th:first-child {
  border-left: 1px solid #f0f0f0;
}

.item-table >>> .t-table thead tr th:last-child {
  border-right: 1px solid #f0f0f0;
}
.item-table >>> .t-table thead tr th {
  border-top: 1px solid #f0f0f0;
}
.item-table >>> .table-bar + .t-table th {
  border-top: none;
}
</style>
