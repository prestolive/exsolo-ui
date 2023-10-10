<template>
  <div>
    <t-space align="center" style="padding: 12px 12px">
      <section title="显示Permission">
        <t-switch v-model="settingViewPermission"></t-switch>
      </section>
      <section title="显示所有权限">
        <t-switch v-model="settingViewAll" :disabled="editMode"></t-switch>
      </section>
      <t-button v-if="!editMode" theme="default" @click="handleEditMode">
        <template #icon> <lock-on-icon /></template>修改权限
      </t-button>
      <t-button v-if="editMode" theme="primary" @click="handlePermissionSet">
        <template #icon> <save-icon /></template>保存
      </t-button>
      <t-button v-if="editMode" theme="default" @click="handleViewMode">
        <template #icon> <rollback-icon /></template>取消
      </t-button>
    </t-space>
    <div>
      <div class="module-table">
        <table border="0" style="border-collapse: collapse; width: 100%">
          <tr>
            <th style="width= 48px">模块</th>
            <th style="min-width: 220px">节点</th>
            <th style="min-width: 64px">查看</th>
            <th style="min-width: 64px">编辑</th>
            <th style="min-width: 64px">配置</th>
            <th>通用</th>
            <th style="text-align: left">自定义</th>
          </tr>
          <tr v-if="!editMode && checkValues.length == 0">
            <td style="text-align: center" colspan="7">未分配权限</td>
          </tr>
          <template
            v-for="moduleTable in viewDataFilter"
            :key="moduleTable.name"
          >
            <template
              v-for="(nodeRow, index) in moduleTable.nodes"
              :key="nodeRow.node"
            >
              <tr>
                <td v-if="index == 0" :rowspan="moduleTable.nodes.length">
                  {{ moduleTable.name }}
                </td>
                <td style="text-align: left">
                  {{ nodeRow.moduleNodeLabel }}
                </td>
                <td>
                  <label v-if="nodeRow.viewPermissinon">
                    <input
                      v-model="checkValues"
                      type="checkbox"
                      :disabled="!editMode"
                      :value="nodeRow.viewPermissinon?.permission"
                    />
                    <div v-if="settingViewPermission" class="permission">
                      {{ nodeRow.viewPermissinon?.permission }}
                    </div>
                  </label>
                </td>
                <td>
                  <label v-if="nodeRow.editPermissinon">
                    <input
                      v-model="checkValues"
                      type="checkbox"
                      :disabled="!editMode"
                      :value="nodeRow.editPermissinon?.permission"
                    />
                    <div v-if="settingViewPermission" class="permission">
                      {{ nodeRow.editPermissinon?.permission }}
                    </div>
                  </label>
                </td>
                <td>
                  <label v-if="nodeRow.configPermissinon">
                    <input
                      v-model="checkValues"
                      type="checkbox"
                      :disabled="!editMode"
                      :value="nodeRow.configPermissinon?.permission"
                    />
                    <div v-if="settingViewPermission" class="permission">
                      {{ nodeRow.configPermissinon?.permission }}
                    </div>
                  </label>
                </td>
                <td>
                  <label v-if="nodeRow.commonPermissinon">
                    <input
                      v-model="checkValues"
                      type="checkbox"
                      :disabled="!editMode"
                      :value="nodeRow.commonPermissinon?.permission"
                    />

                    <div v-if="settingViewPermission" class="permission">
                      {{ nodeRow.commonPermissinon?.permission }}
                    </div>
                  </label>
                </td>
                <td style="text-align: left">
                  <div class="display:flex;">
                    <label
                      v-for="item in nodeRow.customPermissinon"
                      :key="item.permission"
                    >
                      <input
                        v-model="checkValues"
                        type="checkbox"
                        :disabled="!editMode"
                        :value="item.permission"
                      />
                      <span>{{ item.actionLabel }}</span>
                      <div v-if="settingViewPermission" class="permission">
                        {{ item.permission }}
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import {
  Switch as TSwitch,
  Button as TButton,
  Space as TSpace,
  MessagePlugin,
} from 'tdesign-vue-next'
import {
  EditIcon,
  DeleteIcon,
  LockOnIcon,
  SaveIcon,
  RollbackIcon,
} from 'tdesign-icons-vue-next'
import { post, RoleInfoVO, PermissionVO } from '../API'
import { groupBy } from 'lodash'
const emit = defineEmits(['change', 'finish'])

const props = defineProps({
  roleId: {
    type: String,
    default: null,
  },
})
interface ModuleTable {
  name: string
  nodes: NodeRow[]
}
interface NodeRow {
  module: string
  node: string
  moduleNodeLabel: string
  hasPermssion: boolean
  viewPermissinon: PermissionVO | null
  editPermissinon: PermissionVO | null
  configPermissinon: PermissionVO | null
  commonPermissinon: PermissionVO | null
  customPermissinon: PermissionVO[]
}

const roleId = ref(props.roleId)

const vo = ref<RoleInfoVO>({})
const permissions = ref<PermissionVO[]>([])
const viewData = ref<ModuleTable[]>([])
const viewDataFilter = computed<ModuleTable[]>(() => {
  if (settingViewAll.value) {
    return viewData.value
  } else {
    const arr = viewData.value.map((origin) => {
      const moduleTable = { ...origin }
      moduleTable.nodes = origin.nodes.filter((node) => node.hasPermssion)
      return moduleTable
    })
    return arr.filter((moduleTable) => moduleTable.nodes.length > 0)
  }
})
const checkValues = ref<string[]>([])

const settingViewPermission = ref(false)

const settingViewAll = ref(false)

const editMode = ref(false)

const handleEditMode = () => {
  if (roleId.value) {
    handleLoadData(roleId.value).then(() => {
      editMode.value = true
      settingViewAll.value = true
    })
  }
}

const handleViewMode = () => {
  if (roleId.value) {
    handleLoadData(roleId.value).then(() => {
      editMode.value = false
      // settingViewAll.value = false
    })
  }
}

const handlePermissionSet = () => {
  post('api/ex-basic/role/permission-set', {
    roleId: roleId.value,
    permissions: checkValues.value,
  }).then(() => {
    handleViewMode()
    MessagePlugin.success({
      content: '设置成功',
    })
  })
}

const updateView = () => {
  const result: ModuleTable[] = []
  const moduleMap = groupBy(permissions.value, (row) => row.module)
  const nodeSet = vo.value.permissions?.map((row) =>
    row.permission?.split(':').slice(0, 2).join(':')
  )
  //按照模块分组
  for (var moduleCode in moduleMap) {
    const allActions: PermissionVO[] = moduleMap[moduleCode]
    const moduleTable: ModuleTable = {
      name: moduleCode,
      nodes: [],
    }
    //然后再按照节点分组
    const nodeMap = groupBy(allActions, (row) => row.node)
    for (var node in nodeMap) {
      const actions: PermissionVO[] = nodeMap[node]
      const nodeRow: NodeRow = {
        module: moduleCode,
        node: node,
        moduleNodeLabel: actions[0].moduleNodeLabel || '',
        hasPermssion: nodeSet.indexOf(moduleCode + ':' + node) >= 0,
        viewPermissinon: null,
        editPermissinon: null,
        configPermissinon: null,
        commonPermissinon: null,
        customPermissinon: [],
      }
      actions.forEach((action) => {
        if (action.action == 'view') {
          nodeRow.viewPermissinon = action
        } else if (action.action == 'edit') {
          nodeRow.editPermissinon = action
        } else if (action.action == 'common') {
          nodeRow.commonPermissinon = action
        } else if (action.action == 'config') {
          nodeRow.configPermissinon = action
        } else {
          nodeRow.customPermissinon?.push(action)
        }
      })
      moduleTable.nodes.push(nodeRow)
    }
    result.push(moduleTable)
  }
  viewData.value = result
}

const handleLoadData = (roleId: string) => {
  return post('api/ex-basic/role/info', { roleId: roleId })
    .then((data) => {
      vo.value = { ...data }
      checkValues.value =
        vo.value.permissions?.map((row) => row.permission ?? '') ?? []
    })
    .then(() => {
      post('api/ex-basic/role/permission-all', null).then((data) => {
        permissions.value = data
        updateView()
      })
    })
}

watchEffect(() => {
  if (roleId.value) {
    handleLoadData(roleId.value)
  }
})
</script>

<style scoped>
.module-table {
  border-color: #ccd4e0;
  border-top: 1px solid var(--td-component-border);
  border-left: 1px solid var(--td-component-border);
  border-right: 1px solid var(--td-component-border);
  line-height: var(--td-line-height-body-medium);
  border-radius: var(--td-radius-medium);
  display: inline-block;
}
.module-table td,
.module-table th {
  text-align: left;
  border-bottom: 1px solid var(--td-component-border);
  padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
}
.module-table input[type='checkbox'] {
  vertical-align: bottom;
  height: 16px;
  width: 16px;
}
.permission {
  font-size: 11px;
  /* background: var(--td-bg-color-secondarycontainer); */
  color: var(--td-text-color-secondary);
  padding-left: 3px;
}
</style>
