import { AxiosError, AxiosResponse } from 'axios'
import { Result } from '@/types/axios'
export interface ExSoleConfigWapper {
  host: string
  tokenKey?: string
  authRetryInterceptors(err: AxiosError): Promise
  on401(err: AxiosError): void
}
