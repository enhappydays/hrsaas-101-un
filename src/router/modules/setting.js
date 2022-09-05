import Layout from '@/layout'

export default {
  path: '/setting',
  component: Layout,
  // redirect: '/dashboard',
  children: [{
    path: '',
    name: 'settings',
    component: () => import('@/views/setting'),
    meta: { title: '公司设置', icon: 'setting' }
  }]
}
