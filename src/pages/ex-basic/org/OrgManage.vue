<template>
  <div class="main">
    <div class="org">
      <div class="center">
        <div class="title">
          <h1 @click="test">组织管理</h1>
        </div>
        <t-space style="margin: 6px 24px 12px 24px" size="0px">
          <ex-selector-dropdown
            v-model="schemaCode"
            tag="EX_ORG_SCHEMA"
            @change="(value) => onSchemaActive(value)"
          ></ex-selector-dropdown>
        </t-space>
        <div v-if="schemaCode" class="schemas">
          <t-space>
            <t-button theme="default" size="small" @click="onNodeCreate('')">
              <template #icon> <t-icon name="add" /></template>创建根节点
            </t-button>

            <t-button theme="default" size="small" @click="onSorter">
              <template #icon> <t-icon name="arrow-up-down-1" /></template
              >调整顺序
            </t-button>
          </t-space>
        </div>
        <div style="padding: 0px 12px 12px 24px">
          <t-tree
            ref="tree"
            v-model:actived="activedNode"
            v-model:expanded="expanded"
            :data="treeItems"
            hover
            line
            activable
            :expand-level="2"
            @active="onNodeActive"
          >
            <template #operations="{ node }">
              <t-space v-if="node.value == activedNode" size="0">
                <t-button
                  size="small"
                  theme="default"
                  variant="text"
                  @click="onNodeCreate(node.value)"
                >
                  <template #icon><t-icon name="git-merge" /></template>
                  创建子节点
                </t-button>
                <t-dropdown
                  :options="nodeMoreOptions"
                  @click="(option) => onNodeAction(option, node.value)"
                >
                  <t-button theme="default" variant="text" size="small">
                    <t-icon name="ellipsis" size="16"
                  /></t-button>
                </t-dropdown>
              </t-space>
            </template>
            <template #icon="{ node }">
              <t-icon
                v-if="node.getChildren() && !node.expanded"
                name="folder"
              />
              <t-icon
                v-else-if="node.getChildren() && node.expanded"
                name="folder-open-1"
              />
              <t-icon v-else name="control-platform" />
            </template>
          </t-tree>
        </div>
      </div>
      <div class="right">
        <t-card
          v-if="activedOrgPO"
          :title="activedOrgPO?.orgName"
          hover-shadow
          style="margin-bottom: 12px"
        >
          <template #actions>
            <t-space size="0px">
              <t-button theme="default">
                <template #icon> <t-icon name="edit" /></template>修改
              </t-button>
              <t-dropdown :options="nodeMoreOptions">
                <t-button theme="default" variant="text">
                  <t-icon name="ellipsis" size="16"
                /></t-button>
              </t-dropdown>
            </t-space>
          </template>

          <template #content>
            <section title="编码">{{ activedOrgPO?.orgCode }}</section>
            <section title="内码">{{ activedOrgPO?.innerCode }}</section>
            <section title="状态">{{ activedOrgPO?.status }}</section>
            <section title="修改人">{{ activedOrgPO?.modifiedBy }}</section>
          </template>
        </t-card>
        <h3>所有子节点</h3>
        <ex-table v-bind="pageBind" />
      </div>
    </div>

    <t-dialog
      v-model:visible="createNodeVisible"
      header="创建节点"
      :confirm-btn="createNodeLoading"
      :on-confirm="onCreateNodeDialogConfirm"
      :on-close="onCreateNodeDialogClose"
    >
      <template #body> </template>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import {
  Space as TSpace,
  Button as TButton,
  Dropdown as TDropdown,
  Tree as TTree,
  Icon as TIcon,
  Dialog as TDialog,
  Card as TCard,
  TdButtonProps,
  DialogPlugin,
  DropdownOption,
} from 'tdesign-vue-next'
import OrgNodeCreate from './OrgNodeCreate.vue'

import {
  BaseTableCol,
  Pagination,
  BaseConditionCol,
  ExPlugin,
  ExSelectorDropdown,
  ExTable,
  useExTable,
} from '@/console/index.d'
import { post, OrgNodePO } from '../API'
import { TreeNode } from '@/utils/exdash'

const nodeMoreOptions = [{ content: '删除', value: 'delete' }]

const schemaCode = ref('')

const expanded = ref([])

const activedNode = ref([])
const activedOrgPO = ref<OrgNodePO>()
const createNodeVisible = ref(false)
const createNodeLoading = ref<TdButtonProps>({
  content: '保存',
  theme: 'primary',
  loading: false,
})
const onCreateNodeDialogClose = () => {
  createNodeVisible.value = false
}
const onCreateNodeDialogConfirm = () => {
  createNodeVisible.value = false
}

const treeItems = ref<TreeNode[]>([])

const onSchemaActive = (code: string) => {
  onLoadTree(code, undefined)
  pageBind.handleRefresh && pageBind.handleRefresh()
}

const onLoadTree = (code: string, parentId: string | undefined) => {
  if (code) {
    post('api/ex-basic/org/tree-node', {
      schemaCode: code,
      parentId: parentId,
    }).then((data) => {
      treeItems.value = data
    })
  }
}

const onNodeCreate = (parentId: string | '') => {
  ExPlugin.drawer(
    { title: '创建节点', width: '720px' },
    h(OrgNodeCreate, {
      schemaCode: schemaCode.value,
      parentId: parentId,
      onChange: () => {
        onLoadTree(schemaCode.value, undefined)
        expanded.value.push(parentId)
      },
    })
  )
}

const onNodeActive = (node: string[]) => {
  activedOrgPO.value = {}
  post('api/ex-basic/org/get', { id: node[0] + '' })
    .then((data) => {
      activedOrgPO.value = data
    })
    .then(() => {
      pageBind.handleRefresh && pageBind.handleRefresh()
    })
}

const columns: BaseTableCol[] = [
  { colKey: 'orgName', title: '名称' },
  { colKey: 'orgCode', title: '编码' },
  { colKey: 'innerCode', title: '内码' },
  { colKey: '_modifiedBy.userName', title: '修改人' },
]
const conditions: BaseConditionCol[] = [
  {
    key: 'orgName',
    title: '名称',
    schema: 'text',
    compare: 'lk',
  },
  {
    key: 'orgCode',
    title: '编码',
    schema: 'text',
    compare: 'lk',
  },
]
const pageBind = useExTable<OrgNodePO>({
  columns: columns,
  conditions: conditions,
  loadData: (param: object, pagination: Pagination) => {
    if (schemaCode.value) {
      return post('api/ex-basic/org/children-page', {
        ...param,
        schemaCode: schemaCode.value,
        parentId: activedNode.value.length > 0 ? activedNode.value[0] : '',
        pagination: pagination,
      })
    }
  },
})

const onNodeAction = (option: DropdownOption, nodeId: string) => {
  if ('delete' == option.value) {
    const confirmDialog = DialogPlugin.confirm({
      header: '确认删除？',
      onConfirm: () => {
        post('api/ex-basic/org/delete-node', {
          id: nodeId,
        }).then(() => {
          onLoadTree(schemaCode.value, undefined)
        })
        confirmDialog.destroy()
      },
    })
  }
}

const onSorter = () => {
  ExPlugin.drawer(
    { title: '创建节点', width: '720px' },
    h(OrgNodeCreate, {
      schemaCode: schemaCode.value,
      parentId: '',
      onChange: () => {
        onLoadTree(schemaCode.value, undefined)
        // expanded.value.push('')
      },
    })
  )
}
</script>

<style scoped>
.main {
  height: calc(100vh - 54.8px);
  /* padding: 12px 12px; */
}
.title {
  margin: 24px 24px 12px 24px;
  /* border-bottom: 1px solid #e4e6eb; */
}
.schemas {
  margin: 0px 24px 12px 24px;
  padding-top: 12px;
  border-top: 1px solid var(--td-component-border);
}
.org {
  display: flex;
  height: 100%;
}
.left {
  flex: 0 0 0px;
  /* background: #f5f6f7; */
  border-right: 1px solid var(--td-component-border);
  height: 100%;
}
.center {
  flex: 1 0 380px;
  /* padding: 24px; */
  height: 100%;
}
.right {
  flex: 1 1 auto;
  border-left: 1px solid var(--td-component-border);

  padding: 24px;
}
.org-list li {
  padding: 6px 24px 6px 24px;
  cursor: pointer;
}
.org-list li.active {
  background: #f6f6f9;
  font-weight: 600;
  color: #6360e6;
}
.org-list li:hover {
  background: #f5f6f7;
}
.center >>> .t-is-active {
  background: var(--td-bg-color-container-active);
}
</style>
@/console/plugin
