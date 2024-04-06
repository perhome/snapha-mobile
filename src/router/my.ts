const layout = () => import('../views/layout.vue')
const myRouter = {
  path: '/my',
  name: 'My',
  component: layout,
  redirect: '/my/index',
  meta: { title: '用户', roles: ['USER'] },
  children: [
    {
      path: 'index',
      component: () => import('../views/my/index.vue'),
      name: 'MyIndex',
      meta: { title: '个人信息', roles: ['USER'] }
    },
    {
      path: 'profile',
      component: () => import('../views/my/profile.vue'),
      name: 'MyProfile',
      meta: { title: '个人信息', roles: ['USER'] }
    },
    {
      path: 'password',
      component: () => import('../views/my/password.vue'),
      name: 'MyPassword',
      meta: { title: '重置个人密码', roles: ['USER'] }
    },
    {
      path: 'flowable',
      component: () => import('../views/my/flowable.vue'),
      name: 'MyFlowable',
      meta: { title: '我的待办', roles: ['USER'] }
    },
    {
      path: 'message',
      component: () => import('../views/my/message.vue'),
      name: 'MyMessage',
      meta: { title: '我的消息', roles: ['USER'] }
    },
    {
      path: 'goods',
      component: () => import('../views/my/goods.vue'),
      name: 'MyGoods',
      meta: { title: '我的物料', roles: ['USER'] }
    },
    {
      path: 'attendance',
      component: () => import('../views/my/attendance.vue'),
      name: 'MyAttendance',
      meta: { title: '我的考勤', roles: ['USER'] }
    },
    {
      path: 'attendance/index',
      component: () => import('../views/my/attendance/index.vue'),
      name: 'MyAttendanceIndex',
      meta: { title: '我的考勤与休班', roles: ['USER'] }
    },
    {
      path: 'attendance/exception-checkin',
      component: () => import('../views/my/attendance/exceptionCheckin.vue'),
      name: 'MyAttendanceExceptionCheckin',
      meta: { title: '考勤缺卡登记', roles: ['USER'] }
    },
    {
      path: 'break-day',
      component: () => import('../views/my/attendance/break-day.vue'),
      name: 'MyBreakDay',
      meta: { title: '我的休班记录', roles: ['USER'] }
    },
    {
      path: 'absence-checkin',
      component: () => import('../views/my/attendance/absence-checkin.vue'),
      name: 'MyAbsenceCheckin',
      meta: { title: '我的休班记录', roles: ['USER'] }
    },
    {
      path: 'break-left-day',
      component: () => import('../views/my/break-left-day.vue'),
      name: 'MyBreakLeftDay',
      meta: { title: '我的剩余假期', roles: ['USER'] }
    },
    {
      path: 'salary',
      component: () => import('../views/my/salary.vue'),
      name: 'MySalary',
      meta: { title: '我的工资', roles: ['USER'] }
    },
    {
      path: 'issues',
      component: () => import('../views/my/issues.vue'),
      name: 'MyIssues',
      meta: { title: '现场问题', roles: ['USER'] }
    }
  ]
}

export default myRouter
