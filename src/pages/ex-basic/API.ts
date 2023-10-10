import { request } from '@/utils/request'
export interface PageObject<T> {
  values?: T[]
  pagination: Pagination
}
export interface RolePO {
  id?: string
  roleName?: string
  roleSchema?: string
  operator?: string
  moduleCount?: number
  permissionCount?: number
}
export interface RoleInfoVO {
  rolePO?: RolePO
  permissions?: RolePermissionPO[]
}
export interface RolePermissionPO {
  id?: string
  roleId?: string
  permission?: string
  operator?: string
}
export interface UserPO {
  id?: string
  loginCode?: string
  userName?: string
  email?: string
  phone?: string
  status?: string
  activeTs?: string
}
export interface Condition {
  ASC?: string
  DESC?: string
  existFilters?: ConditionFilter[]
  unExistFilters?: ConditionFilter[]
  orders?: OrderBaseBean[]
}
export interface ConditionFilter {
  key?: string
  table?: string
  tableAlias?: string
  joinKey?: string
}
export interface OrderBaseBean {
  type?: string
  field?: string
}
export interface Pagination {
  total?: number
  pages?: number
  current?: number
  pageSize?: number
}
export interface PermissionVO {
  module?: string
  node?: string
  action?: string
  permission?: string
  moduleNodeLabel?: string
  actionLabel?: string
}
export interface ExPickerOptionBO {
  value?: string
  label?: string
  sub?: string
  echo1?: string
  echo2?: string
  echo3?: string
  echo4?: string
  echo5?: string
}
export interface CommItemVO {
  label?: string
  value?: string
}
export interface ExSettingInstanceVO {
  id?: string
  moduleName?: string
  groupName?: string
  propName?: string
  clzName?: string
  fieldName?: string
  propValue?: string
  lastModifyBy?: string
  lstModifyTs?: string
  inputType?: string
  dataRefCode?: string
  desc?: string
  sortNo?: number
  prefix?: string
  suffix?: string
  isProtect?: boolean
  isRequire?: boolean
  isRequireInInit?: boolean
}
export interface ExSettingProviderVO {
  moduleName?: string
  modulePackage?: string
  moduleClz?: string
}
export interface OrgNodePO {
  id?: string
  schemaCode?: string
  orgName?: string
  orgCode?: string
  innerCode?: string
  parentId?: string
  status?: string
  sortNo?: number
  childCounts?: number
  modifiedBy?: string
}
export interface OrgTreeNodeVO {
  value?: string
  label?: string
  code?: string
  innerCode?: string
  parentId?: string
  sortNo?: number
  childCounts?: number
  children?: OrgTreeNodeVO[]
}
export interface OrgSchemaPO {
  id?: string
  orgSchemaName?: string
  orgSchemaCode?: string
  defaultSchema?: boolean
  orderNo?: number
}

interface POST {
  'api/ex-basic/role/add': {
    req: {
      role?: RolePO
    }
    resp: null
  }
  'api/ex-basic/role/info': {
    req: {
      roleId?: string
    }
    resp: RoleInfoVO
  }
  'api/ex-basic/role/user-page': {
    req: {
      roleId?: string
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<UserPO>
  }
  'api/ex-basic/role/delete': {
    req: {
      roleId?: string
    }
    resp: null
  }
  'api/ex-basic/role/modify': {
    req: {
      roleId?: string
      roleName?: string
    }
    resp: null
  }
  'api/ex-basic/role/permission-all': {
    req: null
    resp: PermissionVO[]
  }
  'api/ex-basic/role/permission-set': {
    req: {
      roleId?: string
      permissions?: string[]
    }
    resp: null
  }
  'api/ex-basic/role/user-set': {
    req: {
      roleId?: string
      userIds?: string[]
    }
    resp: null
  }
  'api/ex-basic/role/user-delete': {
    req: {
      roleId?: string
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/role/page': {
    req: {
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<RolePO>
  }
  'api/console/picker/get': {
    req: {
      code?: string
      ids?: string[]
    }
    resp: ExPickerOptionBO[]
  }
  'api/console/picker/find': {
    req: {
      code?: string
      keyword?: string
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<ExPickerOptionBO>
  }
  'api/console/select/list': {
    req: {
      tag?: string
    }
    resp: CommItemVO[]
  }
  'api/ex-basic/user/add': {
    req: {
      userPO?: UserPO
      password?: string
    }
    resp: null
  }
  'api/ex-basic/user/modify': {
    req: {
      userPO?: UserPO
    }
    resp: null
  }
  'api/ex-basic/user/info': {
    req: {
      userId?: string
    }
    resp: UserPO
  }
  'api/ex-basic/user/locked': {
    req: {
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/user/deleted': {
    req: {
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/user/recover': {
    req: {
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/user/change-password': {
    req: {
      userId?: string
      password?: string
    }
    resp: null
  }
  'api/ex-basic/user/page': {
    req: {
      status?: string[]
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<UserPO>
  }
  'api/ex-basic/setting/props': {
    req: {
      clzName?: string
    }
    resp: ExSettingInstanceVO[]
  }
  'api/ex-basic/setting/set': {
    req: {
      clzName?: string
      fieldName?: string
      propValue?: string
    }
    resp: null
  }
  'api/ex-basic/setting/modules': {
    req: null
    resp: ExSettingProviderVO[]
  }
  'api/ex-basic/org/create-node': {
    req: {
      orgNode?: OrgNodePO
      parentId?: string
    }
    resp: null
  }
  'api/ex-basic/org/tree-node': {
    req: {
      schemaCode?: string
      parentId?: string
    }
    resp: OrgTreeNodeVO[]
  }
  'api/ex-basic/org/create-schema': {
    req: {
      orgSchema?: OrgSchemaPO
    }
    resp: null
  }
  'api/ex-basic/org/delete-schema': {
    req: {
      id?: string
    }
    resp: null
  }
  'api/ex-basic/org/get': {
    req: {
      id?: string
    }
    resp: OrgNodePO
  }
  'api/ex-basic/org/modify-schema': {
    req: {
      orgSchema?: OrgSchemaPO
    }
    resp: null
  }
  'api/ex-basic/org/modify-node': {
    req: {
      orgNode?: OrgNodePO
    }
    resp: null
  }
  'api/ex-basic/org/delete-node': {
    req: {
      id?: string
    }
    resp: null
  }
  'api/ex-basic/org/schemas': {
    req: null
    resp: OrgSchemaPO[]
  }
  'api/ex-basic/org/children-page': {
    req: {
      schemaCode?: string
      parentId?: string
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<OrgNodePO>
  }
}

export function get<URL extends keyof GET>(
  url: URL,
  data?: GET[URL]['req']
): Promise<GET[URL]['resp']> {
  return request.get<GET[URL]['resp']>({
    url,
    data,
  })
}
export function post<URL extends keyof POST>(
  url: URL,
  data?: POST[URL]['req']
): Promise<POST[URL]['resp']> {
  return request.post<POST[URL]['resp']>({
    url,
    data,
  })
}
export function download(url: string, data: object): Promise<null> {
  return request.download({ url, data })
}
