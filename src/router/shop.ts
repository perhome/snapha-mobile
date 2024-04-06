const layout = () => import('../views/shop.vue')
const shopRouter = {
  path: '/shop',
  name: 'Shop',
  component: layout,
  redirect: '/shop/index',
  meta: { title: '在线购买' },
  children: [
    {
      path: 'index',
      component: () => import('../views/shop/index.vue'),
      name: 'ShopIndex',
      meta: { title: '导航' }
    }
  ]
}

export default shopRouter
