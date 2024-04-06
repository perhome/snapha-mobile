import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap, generateAsyncRoutes } from '@/router'

import { store } from '@/store'
import { cloneDeep } from 'lodash-es'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  persist: true,
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    }
  },
  actions: {
    generateRoutes(rolesList: string[]): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        routerMap = generateAsyncRoutes(asyncRouterMap, rolesList)
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
