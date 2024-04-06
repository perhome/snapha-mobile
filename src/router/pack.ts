const layout = () => import('../views/layout.vue')
const packRouter = {
  path: '/pack',
  name: 'Pack',
  component: layout,
  redirect: '/pack/index',
  meta: { title: '包装区业务' },
  children: [
    {
      path: 'index',
      component: () => import('../views/pack/index.vue'),
      name: 'PackIndex',
      meta: { title: '包装区业务' }
    },
  ]
}

export default packRouter
