import console from '@/console/ConsoleIndex.vue'
import BaseBlock from '@/assets/icon/BaseBlock.svg'

export default [
  {
    path: '/ex-kit-console',
    component: console,
    redirect: '/ex-kit-console/data-render',
    name: 'data-render',
    meta: { title: '构建工具', icon: BaseBlock },
    children: [
      {
        path: '/ex-kit-console/data-render-manage',
        name: 'data rander manage',
        component: () => import('@/pages/ex-kit-console/DataRenderList.vue'),
        meta: { title: '数据渲染器' },
      },
      {
        path: '/ex-kit-console/ref-manage',
        name: 'ref manage',
        component: () => import('@/pages/ex-kit-console/DataRenderList.vue'),
        meta: { title: '参照管理' },
      },
      {
        path: '/ex-kit-console/item-manage',
        name: 'item manage',
        component: () => import('@/pages/ex-kit-console/ItemManage.vue'),
        meta: { title: '对象管理' },
      },

      {
        path: '/ex-kit-console/api-manage',
        name: 'requestmapping manage',
        component: () => import('@/pages/ex-kit-console/ApiManage.vue'),
        meta: { title: 'RequestMapping管理' },
      },
      {
        path: '/ex-kit-console/ds-manage',
        name: 'ds manage',
        component: () => import('@/pages/ex-kit-console/DataRenderList.vue'),
        meta: { title: '数据源管理' },
      },
      {
        path: '/ex-kit-console/i18n-manage',
        name: 'i18n manage',
        component: () => import('@/pages/ex-kit-console/DataRenderList.vue'),
        meta: { title: '国际化' },
      },
    ],
  },
]
