import console from '@/console/layout/ConsoleIndex.vue'
import BaseBlock from '@/assets/icon/BaseBlock.svg'

export default [
  {
    path: '/ex-basic',
    component: console,
    name: 'ex-base-security',
    meta: { title: '授权管理', icon: BaseBlock },
    redirect: '/ex-basic/user-manage',
    children: [
      {
        path: '/ex-basic/user-manage',
        name: 'user-manage',
        component: () => import('@/pages/ex-basic/user/UserManage.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: '/ex-basic/user-info/:userId',
        name: 'user-info',
        component: () => import('@/pages/ex-basic/user/UserInfo.vue'),
        meta: { title: '用户基本信息', hidden: true },
      },
    ],
  },
]
