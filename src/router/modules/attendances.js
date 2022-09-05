import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  // redirect: '/dashboard',
  children: [{
    path: '',
    name: 'attendances',
    component: () => import('@/views/attendances'),
    meta: { title: '考勤', icon: 'skill' }
  }]
}
