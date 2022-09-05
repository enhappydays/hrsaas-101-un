import Layout from '@/layout'

export default {
  path: '/permission',
  component: Layout,
  // redirect: '/dashboard',
  children: [{
    path: '',
    name: 'permissions',
    component: () => import('@/views/permission'),
    meta: { title: '权限管理', icon: 'lock' }
  }]
}
