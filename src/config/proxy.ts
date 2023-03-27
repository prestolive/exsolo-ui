export default {
  isRequestProxy: true,
  development: {
    //本地开发默认用代理（如果用个人用host方式可以在这里调整）
    host: '',
    cdn: '',
  },
  sit: {
    host: 'https://www.xxxxx.com',
    cdn: '',
  },
  uat: {
    host: 'https://www.xxxxx.com',
    cdn: '',
  },
  prod: {
    host: 'https://www.xxxxx.com',
    cdn: '',
  },
}
