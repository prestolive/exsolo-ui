import { request } from '@/utils/request'

export interface AuthResultVO {
  success?: boolean
  token?: string
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
      captchaTicketId?: string
      captchaValue?: string
    }
    resp: AuthResultVO
  }
}
interface GET {
  'api/auth/captcha': {
    req: null
    resp: CaptchaVO
  }
}

export function get<URL extends keyof GET>(
  url: URL,
  params?: GET[URL]['req']
): Promise<GET[URL]['resp']> {
  return request.get<GET[URL]['resp']>({
    url,
    params,
  })
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
