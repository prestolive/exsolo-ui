import console from '@/console/layout/ConsoleIndex.vue'
import BaseBlock from '@/assets/icon/BaseBlock.svg'

export default [
  {
    path: '/ex-basic',
    component: console,
    name: 'ex-basic',
    meta: { title: '基础数据管理', icon: BaseBlock },
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
      {
        path: '/ex-basic/role-manage',
        name: 'role-manage',
        component: () => import('@/pages/ex-basic/role/RoleManage.vue'),
        meta: { title: '角色管理' },
        children: [
          {
            path: '/ex-basic/role-info/:roleId',
            name: 'role-info',
            component: () => import('@/pages/ex-basic/role/RoleInfo.vue'),
            meta: { title: '角色详情', hidden: true },
          },
        ],
      },
      {
        path: '/ex-basic/org-manage',
        name: 'org-manage',
        component: () => import('@/pages/ex-basic/org/OrgManage.vue'),
        meta: { title: '组织管理' },
      },
    ],
  },
]
