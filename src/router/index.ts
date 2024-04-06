import { createRouter, createWebHashHistory, RouteMeta, RouteRecordRaw } from 'vue-router'
import { App } from 'vue'

import myRouter from './my'
import livestockRouter from './livestock'
import farmlandRouter from './farmland'
import shopRouter from './shop'
import styRouter from './sty'
import packRouter from './pack'
import warehouseRouter from './warehouse'
import toolsRouter from './tools'

const layout = () => import('../views/layout.vue')
const login = () => import('../views/login.vue')
const e404 = () => import('../views/404.vue')

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Welcome',
    redirect: '/my',
    meta: {
      title: '默认页面'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: login,
    meta: {
      title: '用户登陆'
    }
  },
  {
    path: '/unkown',
    name: 'Unkown',
    component: layout,
    redirect: '/unkown/index',
    meta: {
      title: '未知页面'
    },
    children: [
      {
        path: 'index',
        component: () => import('../views/unkown.vue'),
        name: 'UnkownIndex',
        meta: { title: '业务功能', roles: ['USER'] }
      },
      {
        path: 'task',
        component: () => import('../views/unkown.vue'),
        name: 'UnkownTask',
        meta: { title: '业务工单', roles: ['USER'] }
      }
    ]
  },
  shopRouter,
  {
    path: '/:pathMatch(.*)',
    component: e404,
    name: 'NoFind',
    meta: {
      title: '404'
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/flowable',
    name: 'Flowable',
    component: layout,
    redirect: '/flowable/pending',
    meta: { title: '待办', roles: ['USER'] },
    children: [
      {
        path: 'pending',
        component: () => import('../views/my/flowable.vue'),
        name: 'FlowableIndex',
        meta: { title: '待办中心', roles: ['USER'] }
      },
      {
        path: 'task-form/:formUrl/:taskId',
        component: () => import('../views/flowable/task-form.vue'),
        name: 'FlowableTaskForm',
        meta: { title: '流程表单', roles: ['USER'] }
      }
    ]
  },
  {
    path: '/issues',
    name: 'Issues',
    component: layout,
    redirect: '/issues/add',
    meta: { title: '待办', roles: ['USER'] },
    children: [
      {
        path: 'add',
        component: () => import('../views/issues-add.vue'),
        name: 'IssuesAdd',
        meta: { title: '现场问题', roles: ['USER'] }
      }
    ]
  },
  myRouter,
  toolsRouter,
  styRouter,
  livestockRouter,
  packRouter,
  warehouseRouter,
  farmlandRouter
]
// console.log(asyncRouterMap)
export const generateAsyncRoutes = (
  routes: AppRouteRecordRaw[],
  keys: string[],
  basePath = '/'
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const meta = route.meta as RouteMeta
    const data: Nullable<AppRouteRecordRaw> = null

    for (const item of keys) {
    }
    // recursive child routes
    if (route.children && data) {
      // data.children = generateAsyncRoutes(route.children, keys, pathResolve(basePath, data.path))
    }
    if (data) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: asyncRouterMap.concat(constantRouterMap) as RouteRecordRaw[]
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
