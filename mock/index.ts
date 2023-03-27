import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
  {
    url: '/api/query-user-list',
    method: 'post',
    response: () => ({
      code: 0,
      ...Mock.mock({
        'data|10': [
          {
            id: /S115950[0-9][0-9][0-9]/,
            name: '@cname()',
            birthday: '@date("yyyy-MM-dd")',
          },
        ],
      }),
    }),
  },
  {
    url: '/api/get-user-info',
    method: 'get',
    response: () => ({
      code: 0,
      ...Mock.mock({
        data: {
          id: /S115950[0-9][0-9][0-9]/,
          name: '@cname()',
          birthday: '@date("yyyy-MM-dd")',
        },
      }),
    }),
  },
  {
    url: '/api/a-delay-3s',
    method: 'post',
    timeout: 3000,
    response: () => ({
      code: 0,
      data: '网络请求返回啦',
    }),
  },
  {
    url: '/api/a-delay-3s-error',
    method: 'post',
    timeout: 3000,
    response: () => ({
      code: 1,
      message: '系统发生了些小错误',
      data: null,
    }),
  },
] as MockMethod[]
