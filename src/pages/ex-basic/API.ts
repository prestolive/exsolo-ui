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
  powerCount?: number
}
export interface RoleInfoVO {
  rolePO?: RolePO
  powers?: RolePowerPO[]
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
export interface RolePowerPO {
  id?: string
  roleId?: string
  powerCode?: string
  operator?: string
}
export interface Condition {
  ASC?: string
  DESC?: string
  compares?: ICompareBean[]
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

export interface ConditionItem {
  key: string
  action: string
  value: string
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
  'api/ex-basic/role/page': {
    req: {
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<RolePO>
  }
  'api/ex-basic/role/modify': {
    req: {
      roleId?: string
      roleName?: string
    }
    resp: null
  }
  'api/ex-basic/role/delete': {
    req: {
      roleId?: string
    }
    resp: null
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
  'api/ex-basic/user/page': {
    req: {
      status?: string[]
      cond?: Condition
      pagination?: Pagination
    }
    resp: PageObject<UserPO>
  }
  'api/ex-basic/user/change-password': {
    req: {
      userId?: string
      password?: string
    }
    resp: null
  }
  'api/ex-basic/user/recover': {
    req: {
      userId?: string
    }
    resp: null
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
}

export function post<URL extends keyof POST>(
  url: URL,
  params?: POST[URL]['req']
): Promise<POST[URL]['resp']> {
  return request.post<POST[URL]['resp']>({
    url,
    params,
  })
}
