import { AxiosError, AxiosResponse } from 'axios'
import { Result } from '@/types/axios'
export interface ExSoleConfigWapper {
  host: string
  tokenKey?: string
  authRetryInterceptors(err: AxiosError): Promise
  on401(err: AxiosError): void
  onOtherErrors(err: AxiosError): void
}

export interface Result<T = any> {
  code: number
  data: T
  errcode: string
  errmsg: string
}
