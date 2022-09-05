import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  // redirect: '/dashboard',
  children: [{
    path: '',
    name: 'salarys',
    component: () => import('@/views/salarys'),
    meta: { title: '工资', icon: 'money' }
  }]
}
