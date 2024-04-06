const layout = () => import('../views/layout.vue')
const warehouseRouter = {
  path: '/warehouse',
  name: 'Warehouse',
  component: layout,
  redirect: '/warehouse/index',
  meta: { title: '仓储', roles: ['WAREHOUSE'] },
  children: [
    {
      path: 'index',
      component: () => import('../views/warehouse/index.vue'),
      name: 'WarehouseIndex',
      meta: { title: '仓储管理', roles: ['WAREHOUSE'] }
    }
  ]
}

export default warehouseRouter
