<template>
  <div>
    <div>{{ vo.rolePO?.roleName }}</div>
    <div style="padding: 12px">
      <div>
        <t-switch v-model="settingViewPermission"></t-switch>显示Permission
      </div>
    </div>
    <table border="1" style="border-collapse: collapse" class="module-table">
      <tr>
        <th style="text-align: left">模块</th>
        <th style="text-align: left">节点</th>
        <th>查看</th>
        <th>编辑</th>
        <th>配置</th>
        <th>通用</th>
        <th style="text-align: left">自定义</th>
      </tr>
      <template v-for="moduleTable in viewData" :key="moduleTable.name">
        <tr v-for="(nodeRow, index) in moduleTable.nodes" :key="nodeRow.node">
          <td v-if="index == 0" :rowspan="moduleTable.nodes.length">
            {{ moduleTable.name }}
          </td>
          <td style="text-align: left">{{ nodeRow.moduleNodeLabel }}</td>
          <td>
            <label v-if="nodeRow.viewPermissinon">
              <input
                v-model="checkValues"
                type="checkbox"
                :value="nodeRow.viewPermissinon?.permission"
              />
              <span v-if="settingViewPermission" class="permission">
                {{ nodeRow.viewPermissinon?.permission }}
              </span>
            </label>
          </td>
          <td>
            <label v-if="nodeRow.editPermissinon">
              <input
                v-model="checkValues"
                type="checkbox"
                :value="nodeRow.editPermissinon?.permission"
              />
              <span v-if="settingViewPermission" class="permission">
                {{ nodeRow.editPermissinon?.permission }}
              </span>
            </label>
          </td>
          <td>
            <label v-if="nodeRow.configPermissinon">
              <input
                v-model="checkValues"
                type="checkbox"
                :value="nodeRow.configPermissinon?.permission"
              />
              <span v-if="settingViewPermission" class="permission">
                {{ nodeRow.configPermissinon?.permission }}
              </span>
            </label>
          </td>
          <td>
            <label v-if="nodeRow.commonPermissinon">
              <input
                v-model="checkValues"
                type="checkbox"
                :value="nodeRow.commonPermissinon?.permission"
              />

              <span v-if="settingViewPermission" class="permission">
                {{ nodeRow.commonPermissinon?.permission }}
              </span>
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
                  :value="item.permission"
                />
                <span v-if="settingViewPermission" class="permission">
                  {{ item.permission }}
                </span>
                <span>{{ item.actionLabel }}</span>
              </label>
            </div>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { Switch as TSwitch } from 'tdesign-vue-next'
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
const checkValues = ref<string[]>(['sys:role:edit'])

const settingViewPermission = ref(false)

const updateView = () => {
  const result: ModuleTable[] = []
  const moduleMap = groupBy(permissions.value, (row) => row.module)
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
  post('api/ex-basic/role/info', { roleId: roleId })
    .then((data) => {
      vo.value = { ...data }
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
.module-table td,
.module-table th {
  padding: 3px 6px;
  text-align: left;
}
.module-table input[type='checkbox'] {
  vertical-align: bottom;
  height: 16px;
  width: 16px;
}
.permission {
  /* font-size: 11px; */
  background: #f2f2f2;
  padding: 0px 3px;
}
</style>
