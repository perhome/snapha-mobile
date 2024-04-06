const layout = () => import('../views/layout.vue')
const farmlandRouter = {
  path: '/farmland',
  name: 'Farmland',
  component: layout,
  redirect: '/farmland/index',
  meta: { title: '种植组用户', roles: ['USER'] },
  children: [
    {
      path: 'admin',
      component: () => import('../views/farmland/admin/index.vue'),
      name: 'FarmlandAdmin',
      meta: { title: '种植区', roles: ['USER'] }
    },
    {
      path: 'admin/activity',
      component: () => import('../views/farmland/admin/activity.vue'),
      name: 'FarmlandAdminActivity',
      meta: { title: '今日活动', roles: ['USER'] }
    },
    {
      path: 'admin/cfr-workspace',
      component: () => import('../views/farmland/admin/cfr-workspace.vue'),
      name: 'FarmlandAdminCfrWorkspace',
      meta: { title: '茬口轮作计划', roles: ['USER'] }
    },
    {
      path: 'admin/output-nextday',
      component: () => import('../views/farmland/admin/output-nextday.vue'),
      name: 'FarmlandAdminOutputNextday',
      meta: { title: '生成预估菜报表', roles: ['USER'] }
    },
    {
      path: 'admin/import-shop-goods',
      component: () => import('../views/farmland/admin/import-shop-goods.vue'),
      name: 'FarmlandAdminImportShopGoods',
      meta: { title: '导入预估菜', roles: ['USER'] }
    },
    {
      path: 'admin/goods-add',
      component: () => import('../views/farmland/admin/goods-add.vue'),
      name: 'FarmlandAdminGoodsAdd',
      meta: { title: '快速物料添加', roles: ['USER'] }
    },
    {
      path: 'admin/cfr-add',
      component: () => import('../views/farmland/admin/cfr-add.vue'),
      name: 'FarmlandAdminCfrAdd',
      meta: { title: '快速茬口添加', roles: ['USER'] }
    },
    {
      path: 'index',
      component: () => import('../views/farmland/index.vue'),
      name: 'FarmlandIndex',
      meta: { title: '种植区业务', roles: ['USER'] }
    },
    {
      path: 'cfr/output',
      component: () => import('../views/farmland/cfr-output.vue'),
      name: 'FarmlandCfrOutput',
      meta: { title: '小组内的下菜单', roles: ['USER'] }
    },
    {
      path: 'cfr/output-add',
      component: () => import('../views/farmland/cfr-output-add.vue'),
      name: 'FarmlandCfrOutputAdd',
      meta: { title: '登记下菜单', roles: ['USER'] }
    },
    {
      path: 'cfr/output-nextday',
      component: () => import('../views/farmland/cfr/output-nextday.vue'),
      name: 'FarmlandCfrOutputNextday',
      meta: { title: '预估菜历史', roles: ['USER'] }
    },
    {
      path: 'cfr/output-nextday-add',
      component: () => import('../views/farmland/cfr/output-nextday-add.vue'),
      name: 'FarmlandCfrOutputNextdayAdd',
      meta: { title: '登记预估菜', roles: ['USER'] }
    },
    {
      path: 'admin/output-checkin',
      component: () => import('../views/farmland/admin/output-checkin.vue'),
      name: 'FarmlandAdminOutputCheckin',
      meta: { title: '下菜单业务汇总确认', roles: ['USER'] }
    },
    {
      path: 'goods-add',
      component: () => import('../views/farmland/goods-add.vue'),
      name: 'FarmlandGoodsAdd',
      meta: { title: '添加使用物料', roles: ['USER'] }
    },
    {
      path: 'cfr',
      component: () => import('../views/farmland/cfr.vue'),
      name: 'FarmlandCfr',
      meta: { title: '茬口档案', roles: ['USER'] }
    },
    {
      path: 'cfr-add',
      component: () => import('../views/farmland/cfr-add.vue'),
      name: 'FarmlandCfrAdd',
      meta: { title: '登记新茬口', roles: ['USER'] }
    },
    {
      path: 'goods/user-index',
      component: () => import('../views/farmland/goods/user-index.vue'),
      name: 'FarmlandGoodsUserIndex',
      meta: { title: '物料单历史', roles: ['USER'] }
    },
    {
      path: 'goods/user-add',
      component: () => import('../views/farmland/goods/user-add.vue'),
      name: 'FarmlandGoodsUserAdd',
      meta: { title: '登记物料单', roles: ['USER'] }
    },
    {
      path: 'task',
      component: () => import('../views/farmland/task.vue'),
      name: 'FarmlandTask',
      meta: { title: '派工单', roles: ['USER'] }
    }
  ]
}

export default farmlandRouter
