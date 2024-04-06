const layout = () => import('../views/layout.vue')
const synthesisRouter = {
  path: '/synthesis',
  name: 'Synthesis',
  component: layout,
  redirect: '/synthesis/index',
  meta: { title: '综合区业务', roles: ['USER'] },
  children: [
    {
      path: 'index',
      component: () => import('../views/synthesis/index.vue'),
      name: 'SynthesisIndex',
      meta: { title: '综合区业务', roles: ['USER'] }
    },
    {
      path: 'pack',
      component: () => import('../views/synthesis/pack.vue'),
      name: 'SynthesisPack',
      meta: { title: '包装管理', roles: ['USER'] }
    },
    {
      path: 'warehouse',
      component: () => import('../views/synthesis/warehouse.vue'),
      name: 'SynthesisWarehouse',
      meta: { title: '仓库管理', roles: ['USER'] }
    }
  ]
}

export default synthesisRouter
