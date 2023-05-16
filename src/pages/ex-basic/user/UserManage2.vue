<template>
  <div>
    <div class="item-manage">
      <div class="item-table">
        <div class="search-bar">
          <div class="search-conds">
            <t-input
              v-model="searchValue"
              placeholder="请输入你需要搜索的内容"
              clearable
              auto-width
              @enter="handleLoadData"
            >
              <template #suffix-icon>
                <search-icon size="20px" />
              </template>
            </t-input>
            <t-dropdown
              :options="options"
              :max-column-width="120"
              :max-height="200"
            >
              <t-button theme="default" variant="text">
                <filter-icon size="20px" />
              </t-button>
            </t-dropdown>
            <t-button theme="default" variant="text">
              <search-icon size="20px" />
            </t-button>
          </div>
          <div class="search-action"></div>
        </div>
        <div class="table-bar">
          <div class="table-action">
            <t-button @click="handleAddUser">
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
          <template #action="{ row }">
            <t-space>
              <t-button
                theme="default"
                variant="base"
                size="small"
                @click="handleUserInfo(row.id)"
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
import { ref, onMounted, h } from 'vue'
import {
  Table as TTable,
  Button as TButton,
  Space as TSpace,
  Input as TInput,
  Dropdown as TDropdown,
  PageInfo,
} from 'tdesign-vue-next'

import {
  SearchIcon,
  EditIcon,
  RefreshIcon,
  FullscreenIcon,
  SettingIcon,
  FilterIcon,
  AddIcon,
  DownloadIcon,
} from 'tdesign-icons-vue-next'
import { post, UserPO, PageObject } from '../API'
import UserFormAdd from './UserFormAdd.vue'
import UserInfo from './UserInfo.vue'
import Glue from '@/console/Glue'
const columns = ref([
  { colKey: 'userCode', title: '登录名', width: 120 },
  { colKey: 'userName', title: '称呼', width: 120, ellipsis: true },
  { colKey: 'activeTs', title: '创建时间', width: 120, ellipsis: true },
  { colKey: 'status', title: '状态', width: 120 },
  {
    colKey: 'action',
    title: '操作',
    fixed: 'right',
    width: 120,
  },
])

const searchValue = ref('')

const param = ref({
  userCode: '',
  userName: '',
  status: [],
})

const loading = ref(false)

const pageObject = ref<PageObject<UserPO>>({
  values: [],
  pagination: {
    pageSize: 10,
    current: 1,
  },
})

const handlePageChange = (pageInfo: PageInfo) => {
  pageObject.value = {
    ...pageObject.value,
    pagination: {
      pageSize: pageInfo.pageSize,
      current: pageInfo.current,
    },
  }
  handleLoadData()
}

const handleLoadData = () => {
  loading.value = true
  post('api/ex-basic/security/users', {
    ...param.value,
    pagination: pageObject?.value?.pagination,
  })
    .then((data) => {
      pageObject.value = data
    })
    .finally(() => [(loading.value = false)])
}

const handleAddUser = () => {
  Glue.drawer(
    { title: '新增用户', width: '720px' },
    h(UserFormAdd, {
      onChange: () => {
        handleLoadData()
      },
    })
  )
}

const handleUserInfo = (userId: string) => {
  Glue.drawer(
    { title: '用户详情', width: '720px' },
    h(UserInfo, {
      userId: userId,
      onChange: () => {
        handleLoadData()
      },
    })
  )
  // router.push('/ex-basic/user-info/' + userId)
}

onMounted(() => {
  handleLoadData()
})

const options = [
  {
    content: '选项一',
    value: 1,
    children: [
      {
        content: '选项九',
        value: 9,
      },
    ],
  },
  {
    content: '选项二',
    value: 2,
    children: [
      {
        content: '选项五',
        value: 5,
      },
      {
        content: '选项六',
        value: 6,
      },
    ],
  },
  {
    content: '选项三',
    value: 3,
    children: [
      {
        content: '选项十',
        value: 10,
      },
    ],
  },
  {
    content: '选项四',
    value: 4,
    children: [
      {
        content: '选项十一',
        value: 11,
      },
    ],
  },
  {
    content: '选项五',
    value: 5,
    children: [
      {
        content: '选项十二',
        value: 12,
      },
    ],
  },
  {
    content: '选项六',
    value: 6,
    children: [
      {
        content: '选项十三',
        value: 13,
      },
    ],
  },
  {
    content: '选项七',
    value: 7,
  },
  {
    content: '选项八',
    value: 8,
  },
  {
    content: '选项十八',
    value: 18,
    children: [
      {
        content: '选项十四',
        value: 14,
      },
      {
        content: '选项十五',
        value: 15,
      },
      {
        content: '选项十六',
        value: 16,
        children: [
          {
            content: '三级选项一',
            value: 20,
          },
          {
            content: '三级选项二',
            value: 21,
          },
        ],
      },
      {
        content: '选项十七',
        value: 17,
      },
    ],
  },
]
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
  justify-content: space-between;
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
