import axios, {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { stringify } from 'qs'
import isFunction from 'lodash/isFunction'
import cloneDeep from 'lodash/cloneDeep'
import { CreateAxiosOptions } from './index.d'
import { AxiosCanceler } from './AxiosCancel'
import { AxiosRequestConfigRetry, RequestOptions, Result } from '@/types/axios'

// Axios模块
export class VAxios {
  // axios句柄
  private instance: AxiosInstance

  // axios选项
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.instance = axios.create(options)
    this.setupInterceptors()
  }

  // 创建axios句柄
  private createAxios(config: CreateAxiosOptions): void {
    this.instance = axios.create(config)
  }

  // 获取数据处理
  private getTransform() {
    const { transform } = this.options
    return transform
  }

  // 获取句柄
  getAxios(): AxiosInstance {
    return this.instance
  }

  // 配置 axios
  configAxios(config: CreateAxiosOptions) {
    if (!this.instance) {
      return
    }
    this.createAxios(config)
  }

  // 设置通用头信息
  setHeader(headers: Record<string, string>): void {
    if (!this.instance) {
      return
    }
    Object.assign(this.instance.defaults.headers, headers)
  }

  // 设置拦截器
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform
    const axiosCanceler = new AxiosCanceler()

    // 请求配置处理
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      const ignoreRepeat = this.options.requestOptions?.ignoreRepeatRequest
      if (!ignoreRepeat) axiosCanceler.addPending(config)

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options)
      }
      return config
    }, undefined)

    // 请求错误处理
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.instance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      )
    }

    // 响应结果处理
    this.instance.interceptors.response.use((res: AxiosResponse) => {
      if (res) axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.instance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch
      )
    }
  }

  // 支持Form Data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== 'application/x-www-form-urlencoded;charset=UTF-8' ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config
    }

    return {
      ...config,
      data: stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  get<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  patch<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'PATCH' }, options)
  }
  async download(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<any> {
    const res = await this.request({ ...config, method: 'POST' }, options)
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
      dom.parentNode.removeChild(dom)
      window.URL.revokeObjectURL(url)
    }
  }

  // 请求
  async request<T = any>(
    config: AxiosRequestConfigRetry,
    options?: RequestOptions
  ): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config)
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt: RequestOptions = { ...requestOptions, ...options }

    const { beforeRequestHook, requestCatchHook, transformRequestHook } =
      transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<Result>>(!config.retryCount ? conf : config)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('请求错误!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (axios.isAxiosError(e)) {
            //401
            const status = e.request.status
            if (status === 401) {
              //todo
              alert(status)
            } else if (status === 403) {
              alert(status)
            } else if (status === 500) {
              if (requestCatchHook && isFunction(requestCatchHook)) {
                reject(requestCatchHook(e, opt))
                return
              } else {
                reject(e)
                return
              }
            }
          } else {
            //TODO 直接放出消息，但是不做任何处理
            alert(e.cause)
          }
        })
    })
  }
}
