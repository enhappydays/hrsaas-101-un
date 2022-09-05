import Layout from '@/layout'

export default {
  path: '/social',
  component: Layout,
  // redirect: '/dashboard',
  children: [{
    path: '',
    name: 'social_securitys',
    component: () => import('@/views/social'),
    meta: { title: '社保', icon: 'table' }
  }]
}
