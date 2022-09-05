import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  // redirect: '/dashboard',
  children: [{
    path: '',
    name: 'employees',
    component: () => import('@/views/employees'),
    meta: { title: '员工', icon: 'people' }
  },
  {
    path: 'detail/:id',
    name: 'detail',
    component: () => import('@/views/employees/detail'),
    hidden: true
  },
  // 员工打印页
  {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '员工打印'
    }
  }
  ]
}
