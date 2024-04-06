const layout = () => import('../views/layout.vue')
const livestockRouter = {
  path: '/livestock',
  name: 'Livestock',
  component: layout,
  redirect: '/livestock/index',
  meta: { title: '养殖区业务', roles: ['USER'] },
  children: [
    {
      path: 'index',
      component: () => import('../views/livestock/index.vue'),
      name: 'LivestockIndex',
      meta: { title: '养殖区业务', roles: ['USER'] }
    },
    {
      path: 'task',
      component: () => import('../views/livestock/task.vue'),
      name: 'LivestockTask',
      meta: { title: '派工单', roles: ['USER'] }
    },
    {
      path: 'admin',
      component: () => import('../views/livestock/admin/index.vue'),
      name: 'LivestockAdmin',
      meta: { title: '养殖区', roles: ['USER'] }
    },
    {
      path: 'admin/activity',
      component: () => import('../views/livestock/admin/activity.vue'),
      name: 'LivestockAdminActivity',
      meta: { title: '今日活动', roles: ['USER'] }
    },
    {
      path: 'inout-index',
      component: () => import('../views/livestock/inout-index.vue'),
      name: 'LivestockInout',
      meta: { title: '出入栏记录', roles: ['USER'] }
    },
    {
      path: 'feeding-add',
      component: () => import('../views/livestock/feeding-add.vue'),
      name: 'LivestockFeedingAdd',
      meta: { title: '生成饲喂记录单' }
    },
    {
      path: 'feeding-batch',
      component: () => import('../views/livestock/feeding-batch.vue'),
      name: 'LivestockFeedingBatch',
      meta: { title: '生成饲喂记录单' }
    },
    {
      path: 'feeding-index',
      component: () => import('../views/livestock/feeding-index.vue'),
      name: 'LivestockFeedingIndex',
      meta: { title: '饲喂记录单' }
    },
    {
      path: 'weight-add',
      component: () => import('../views/livestock/weight-add.vue'),
      name: 'LivestockWeightAdd',
      meta: { title: '添加体重记录' }
    },
    {
      path: 'inout-report',
      component: () => import('../views/livestock/inout-report.vue'),
      name: 'LivestockInoutReport',
      meta: { title: '养殖出栏数据汇总' }
    },
    {
      path: 'stock-report',
      component: () => import('../views/livestock/stock-report.vue'),
      name: 'LivestockStockReport',
      meta: { title: '养殖存栏数据汇总' }
    },
    {
      path: 'output-index',
      component: () => import('../views/livestock/output-index.vue'),
      name: 'LivestockOutputIndex',
      meta: { title: '出栏产品记录' }
    },
    {
      path: 'output-add',
      component: () => import('../views/livestock/output-add.vue'),
      name: 'LivestockOutputAdd',
      meta: { title: '添加产品记录' }
    },
    {
      path: 'weight-index',
      component: () => import('../views/livestock/weight-index.vue'),
      name: 'LivestockWeightIndex',
      meta: { title: '体重记录' }
    },
    {
      path: 'reproduction-add',
      component: () => import('../views/livestock/reproduction-add.vue'),
      name: 'LivestockReproductionAdd',
      meta: { title: '添加繁殖记录' }
    },
    {
      path: 'reproduction-index',
      component: () => import('../views/livestock/reproduction-index.vue'),
      name: 'LivestockReproductionIndex',
      meta: { title: '繁殖记录' }
    },
    {
      path: 'inout-add',
      component: () => import('../views/livestock/inout-add.vue'),
      name: 'LivestockInoutAdd',
      meta: { title: '添加出入栏记录' }
    },
    {
      path: 'inventory-add',
      component: () => import('../views/livestock/inventory-add.vue'),
      name: 'LivestockInventoryAdd',
      meta: { title: '添加月度盘点' }
    }
  ]
}
export default livestockRouter
