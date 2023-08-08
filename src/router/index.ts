import {
  useRoute,
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router'
import uniq from 'lodash/uniq'
import web404 from '@/console/pages/web404.vue'
import Login from '@/console/pages/Login.vue'
import Home from '@/console/pages/Home.vue'
import console from '@/console/layout/ConsoleIndex.vue'
import HomeIcon from '@/assets/icon/Home.svg'

const env = import.meta.env.MODE || 'development'

// 自动导入modules文件夹下所有ts文件
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })

// 路由暂存
const routeModuleList: Array<RouteRecordRaw> = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

// 关于单层路由，meta 中设置 { single: true } 即可为单层路由，{ hidden: true } 即可在侧边栏隐藏该路由

// 存放动态路由
export const asyncRouterList: Array<RouteRecordRaw> = [...routeModuleList]
asyncRouterList.unshift({
  path: '/',
  name: 'home',
  meta: { title: '首页', icon: HomeIcon },
})

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: console,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: { title: '首页' },
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
  // {
  //   path: '/:w+',
  //   name: '404Page w+',
  //   redirect: '/result/404',
  // },
  {
    path: '/result/404',
    name: '404Page',
    component: web404,
  },
]

export const allRoutes = [...defaultRouterList, ...asyncRouterList]

export const getRoutesExpanded = (): string[] => {
  const expandedRoutes: string[] = []
  allRoutes.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path)
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path)
          expandedRoutes.push(`${item.path}/${child.path}`)
        })
    }
  })
  return uniq(expandedRoutes)
}

export const getActive = (maxLevel = 3): string => {
  const route = useRoute()
  if (!route.path) {
    return ''
  }
  return route.path
    .split('/')
    .filter((_item, index) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('')
}
const router = createRouter({
  history: createWebHistory(env === 'site' ? '/' : '/'),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#c-router-tabs',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export default router
