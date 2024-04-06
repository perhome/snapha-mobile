const layout = () => import('../views/layout.vue')
const styRouter = {
  path: '/sty',
  name: 'Sty',
  component: layout,
  redirect: '/sty/index',
  meta: { title: '园区公开数据', roles: ['USER'] },
  children: [
    {
      path: 'index',
      component: () => import('../views/sty/index.vue'),
      name: 'StyIndex',
      meta: { title: '数据项目列表', roles: ['USER'] }
    },
    {
      path: 'accounts',
      component: () => import('../views/sty/accounts.vue'),
      name: 'StyAccounts',
      meta: { title: '账本列表', roles: ['USER'] }
    },
    {
      path: 'accounts-detail',
      component: () => import('../views/sty/accounts-detail.vue'),
      name: 'StyAccountsDetail',
      meta: { title: '账本明细', roles: ['USER'] }
    },
    {
      path: 'spot-issue',
      component: () => import('../views/sty/spot-issue.vue'),
      name: 'StySpotIssue',
      meta: { title: '园区检查记录', roles: ['USER'] }
    },
    {
      path: 'feedback',
      component: () => import('../views/sty/feedback.vue'),
      name: 'StyFeedback',
      meta: { title: '外部满意度', roles: ['USER'] }
    },
    {
      path: 'memo',
      component: () => import('../views/sty/memo.vue'),
      name: 'StyMemo',
      meta: { title: '业务备忘录', roles: ['USER'] }
    },
    {
      path: 'files',
      component: () => import('../views/sty/files.vue'),
      name: 'StyFiles',
      meta: { title: '公司文件', roles: ['USER'] }
    }
  ]
}
export default styRouter
