import { request } from '@/utils/request'
export interface PageObject<T> {
  values?: T[]
  pagination: Pagination
}
export interface UserPO {
  id?: string
  userCode?: string
  userName?: string
  email?: string
  phone?: string
  status?: string
  activeTs?: string
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
  'api/ex-basic/security/user-add': {
    req: {
      userPO?: UserPO
      password?: string
    }
    resp: null
  }
  'api/ex-basic/security/user-modify': {
    req: {
      userPO?: UserPO
    }
    resp: null
  }
  'api/ex-basic/security/user-change-password': {
    req: {
      userId: string
      password: string
    }
    resp: null
  }
  'api/ex-basic/security/user-info': {
    req: {
      userId?: string
    }
    resp: UserPO
  }
  'api/ex-basic/security/user-locked': {
    req: {
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/security/user-recover': {
    req: {
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/security/user-deleted': {
    req: {
      userId?: string
    }
    resp: null
  }
  'api/ex-basic/security/users': {
    req: {
      cond?: ConditionItem[]
      pagination?: Pagination
    }
    resp: PageObject<UserPO>
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
