import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios'

import { ExSoleConfigWapper } from '.'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import cloneDeep from 'lodash/cloneDeep'
import { ACCESS_TOKEN_NAME } from '@/config/global'
import { Result } from '@/types/axios'
import { RssIcon } from 'tdesign-icons-vue-next'

// Axios模块
export class ExAxios {
  // axios句柄
  private instance: AxiosInstance

  private configWapper: ExSoleConfigWapper

  // axios选项
  private readonly options: AxiosRequestConfig

  constructor(options: AxiosRequestConfig, wapper: ExSoleConfigWapper) {
    this.options = options
    this.configWapper = wapper
    this.instance = axios.create(options)
    this.setupInterceptors(this.configWapper)
  }

  // 创建axios句柄
  private createAxios(config: AxiosRequestConfig): void {
    this.instance = axios.create(config)
  }

  // 获取句柄
  getAxios(): AxiosInstance {
    return this.instance
  }

  // 配置 axios
  configAxios(config: AxiosRequestConfig) {
    if (!this.instance) {
      return
    }
    this.createAxios(config)
  }

  // 设置拦截器
  private setupInterceptors(configWapper: ExSoleConfigWapper) {
    //
    window.console.log('set')
    //401错误拦截器
    this.instance.interceptors.response.use(
      undefined,
      configWapper.authRetryInterceptors
    )
  }

  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  async download(config: AxiosRequestConfig): Promise<any> {
    const res = await this.request({ ...config, method: 'POST' })
    const { data, headers } = res
    if (data) {
      const fileName = headers['content-disposition'].replace(
        /\w+;filename=(.*)/,
        '$1'
      )
      // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
      //const blob = new Blob([JSON.stringify(data)], ...)
      const blob = new Blob([data], { type: headers['content-type'] })
      const dom = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      dom.href = url
      dom.download = decodeURI(fileName)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom.parentNode?.removeChild(dom)
      window.URL.revokeObjectURL(url)
    }
  }

  // 请求
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const conf: AxiosRequestConfig = cloneDeep(config)
    if (conf.url?.substring(0, 1) != '/') {
      conf.url = '/' + conf.url
    }
    const token = localStorage.getItem(ACCESS_TOKEN_NAME)
    conf.headers = { Authorization: token }
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          try {
            window.console.log('then', res.status)
            if (!res) {
              reject(new Error('返回空的res!'))
              return
            }
            if (res.status === 204) {
              resolve(res.data)
            }
            if (res.status == 401) {
              this.configWapper.on401(res)
              return
            }
            const { data, headers } = res
            if ('application/json' == headers['content-type']) {
              if (res.status === 200) {
                const { code } = data
                const bizSuccess = code === 0
                if (bizSuccess) {
                  resolve(data.data)
                }
              } else {
                //感觉不会走到这里
                alert(`感觉不会走到这里, http: ${res.status}`)
                throw new Error(`感觉不会走到这里, http: ${res.status}`)
              }
            } else {
              resolve(res)
            }
          } catch (err) {
            reject(err || new Error('请求错误!'))
          }
          // resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          window.console.log('catch', e)
          if (axios.isAxiosError(e)) {
            //401
            const status = e.request.status
            if (status === 401) {
              //todo
              // alert(status)
              reject(e)
              this.configWapper.on401(e)
            } else if (status === 403) {
              // alert(status)
              reject(e)
            } else if (status === 500) {
              // alert(status)
              reject(e)
              return
            }
          } else {
            //TODO 直接放出消息，但是不做任何处理
            // alert(e.cause)
            reject(e)
          }
        })
    })
  }
}
