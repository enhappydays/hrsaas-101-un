import http from '@/utils/request'

// 获取权限
export function reqGetPermissionList() {
  return http({
    method: 'get',
    url: '/sys/permission'
  })
}

// 新增权限
export function reqAddPermission(data) {
  return http({
    method: 'post',
    url: '/sys/permission',
    data
  })
}

// 更新权限
export function reqUpdatePermission(data) {
  return http({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}

// 删除权限
export function reqDelPermission(id) {
  return http({
    method: 'delete',
    url: `/sys/permission/${id}`
  })
}

// 获取单个权限详情回显
export function reqGetPermissionDetail(id) {
  return http({
    method: 'get',
    url: `/sys/permission/${id}`
  })
}
/**
 * 给角色分配权限
 * @param {*} id 角色id
 * @param {*} permIds 权限id的数组
 */
export function reqAssignPerm(id, permIds) {
  return http({
    method: 'put',
    url: '/sys/role/assignPrem',
    data: {
      id,
      permIds
    }
  })
}
