import http from '@/utils/request'

/**
 * 获取所有角色列表
 * @param {*} page
 * @param {*} pagesize
 * @returns
 */
export const reqGetRoleList = (page, pagesize = 5) => {
  return http({
    method: 'get',
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}
/**
 * 删除角色
 * @param {*} id
 * @returns
 */
export const reqDelRole = (id) => {
  return http({
    method: 'delete',
    url: `/sys/role/${id}`
  })
}
/**
 * 添加角色
 * @param {*} form
 * @returns
 */
export const reqAddRole = (form) => {
  return http({
    method: 'post',
    url: '/sys/role',
    data: form
  })
}
/**
 * 根据id获取角色详情
 * @param {*} id
 * @returns
 */
export const reqGetRoleDetail = (id) => {
  return http({
    method: 'get',
    url: `/sys/role/${id}`
  })
}
/**
 * 更新角色详情(form中需要有id以及其他信息)
 * @param {*} form
 * @returns
 */
export const reqUpdateRole = (form) => {
  return http({
    method: 'put',
    url: '/sys/role/' + form.id,
    data: form
  })
}
