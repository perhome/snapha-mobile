import router from './router'

import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useNProgress } from '@/hooks/useNProgress'

const permissionStore = usePermissionStoreWithOut()

const { start, done } = useNProgress()

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  start()
  const appStore = useAppStoreWithOut()
  if (appStore.getAccessToken) {
    if (to.path === '/login') {
      next({ path: '/my' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  done()
})
