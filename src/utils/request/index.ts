import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { ExAxios } from './ExAxios'
import { ref } from 'vue'

import { ExSoleConfigWapper, Result } from './index.d'
import { DialogPlugin } from 'tdesign-vue-next'

import proxy from '@/config/proxy'
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  LOGIN_URL,
} from '@/config/global'

const env = import.meta.env.MODE || 'development'
// 如果是mock模式 或 没启用直连代理 就不配置host 会走本地Mock拦截 或 Vite 代理
const host = env === 'mock' ? '' : proxy[env].host

function createAxios() {
  return new ExAxios(
    <AxiosRequestConfig>{
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
      // 例如: authenticationScheme: 'Bearer'
      authenticationScheme: '',
      // 超时
      timeout: 10 * 1000,
      // 携带Cookie
      withCredentials: true,
      // 头信息
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
    <ExSoleConfigWapper>{
      host: host,
      authRetryInterceptors: (err: AxiosError) => {
        if (err.request.status && err.request.status == 401) {
          const config = err.config
          // If config does not exist or the retry option is not set, reject
          if (!config) return Promise.reject(err)
          // Set the variable for keeping track of the retry count
          config.__retryCount = config.__retryCount || 0
          // Check if we've maxed out the total number of retries
          if (config.__retryCount >= 1) {
            // Reject with the error
            return Promise.reject(err)
          }
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME)
          if (!refreshToken) {
            return Promise.reject(err)
          } else {
            // Increase the retry count
            config.__retryCount += 1
            return axios({
              method: 'post',
              url: '/api/auth/refresh-token',
              data: { refreshToken: refreshToken },
            })
              .then((res) => {
                if (res.status == 200) {
                  const accessToken = res.data ? res.data['data'] : ''
                  localStorage.setItem(ACCESS_TOKEN_NAME, accessToken)
                  config.headers = {
                    Authorization: accessToken,
                    'Content-Type': 'application/json;charset=UTF-8',
                  }
                }
              })
              .then(() => {
                return axios(config)
              })
              .catch((newErr) => {
                //返回原来的错误 FIXME
                return Promise.reject(err)
              })
            // Create new promise to handle exponential backoff
          }
        } else {
          return Promise.reject(err)
        }
      },
      on401: (e: AxiosError) => {
        const loadingText = ref('')
        const jumpLogin = () => {
          window.location.href = LOGIN_URL
        }
        const dialog = DialogPlugin.alert({
          header: '您已掉线',
          body: loadingText,
          confirmBtn: '立即跳转',
          closeBtn: false,
          closeOnOverlayClick: false,
          onConfirm: () => {
            jumpLogin()
          },
        })
        let times = 5
        const timerFn = () => {
          times--
          loadingText.value = +times + 's后自动跳转到登录页...'
          if (times < 0) {
            clearInterval(timer)
            jumpLogin()
            dialog.destroy()
          }
        }
        timerFn()
        const timer = setInterval(() => timerFn(), 1000)
      },
      onOtherErrors: (e: AxiosError) => {
        window.console.log('onOtherErrors', e)
        const httpStatus = e.response?.status
        const data = e.response?.data
        const header = httpStatus == 500 ? '服务错误' : httpStatus
        const errmsg = data?.errmsg
        const conetnt = errmsg ? errmsg : '未知错误'
        const dialog = DialogPlugin.alert({
          header: header,
          body: conetnt,
          onConfirm: () => {
            dialog.destroy()
          },
        })
      },
    }
  )
}
export const request = createAxios()
