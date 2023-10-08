import { request } from '@/utils/request/index'

export interface UserVO {
  name: string
  loginCode: string
  birthday: string
}

interface API_GET {
  '/get-user-info': {
    req: {
      id?: string
    }
    resp: UserVO
  }
}

interface API_POST {
  '/query-user-list': {
    req: {
      name?: string
    }
    resp: UserVO[]
  }
}
export function get<URL extends keyof API_GET>(
  url: URL,
  data?: API_GET[URL]['req']
): Promise<API_GET[URL]['resp']> {
  return request.get<API_GET[URL]['resp']>({
    url,
    data,
  })
}
export function post<URL extends keyof API_POST>(
  url: URL,
  data?: API_POST[URL]['req']
): Promise<API_POST[URL]['resp']> {
  return request.post<API_POST[URL]['resp']>({
    url,
    data,
  })
}
