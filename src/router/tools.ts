const layout = () => import('../views/layout.vue')
const toolsRouter = {
  path: '/tools',
  name: 'Tools',
  component: layout,
  redirect: '/tools/index',
  meta: { title: '常用业务', roles: ['USER'] },
  children: [
    {
      path: 'break-add',
      component: () => import('../views/tools/break-add.vue'),
      name: 'ToolsBreakAdd',
      meta: { title: '登记休班', roles: ['USER'] }
    }
  ]
}

export default toolsRouter
