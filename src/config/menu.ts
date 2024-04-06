export const publicActionMenuList = [
  // { url: '/tools/shift-add', name: '登记值班' },
  { url: '/tools/break-add', name: '登记休班' },
  // { url: '/tools/goods-add', name: '登记账外物资' },
  // { url: '/issues', name: '现场问题' },
  { url: '/sty/index', name: '园区公开数据' }
]

export const unkownMenuList = {
  main: [
    { url: '/unkown/task', name: '工单', id: 'unkownTask' },
    { url: '/unkown', name: '业务', id: 'unkown' }
  ],
  action: [...publicActionMenuList]
}


