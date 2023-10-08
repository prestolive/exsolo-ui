import { request } from '@/utils/request'

export interface AuthResultVO {
  success?: boolean
  accessToken?: string
  refreshToken?: string
  captchaRequire?: boolean
  captchaExpireTime?: number
}
export interface CaptchaVO {
  ticket?: string
  captchaBase64?: string
}

interface POST {
  'api/auth/verify': {
    req: {
      loginCode?: string
      password?: string
      captchaTicket?: string
      captchaValue?: string
    }
    resp: AuthResultVO
  }
  'api/auth/captcha': {
    req: null
    resp: CaptchaVO
  }
  'api/auth/refresh-token': {
    req: {
      refreshToken?: string
    }
    resp: string
  }
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
