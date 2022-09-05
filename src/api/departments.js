import http from '@/utils/request'

/**
 * 获取部门列表
 */
export const reqGetDepartments = () => {
  return http({
    method: 'get',
    url: '/company/department'
  })
}
/**
 * 根据id删除部门
 * @param {*} id 部门id
 */
export const reqDelDepartment = (id) => {
  return http({
    method: 'delete',
    url: '/company/department/' + id
  })
}
/**
 * 获取员工简单列表
 * @returns
 */
export const reqGetSimpleUserList = () => {
  return http({
    method: 'get',
    url: '/sys/user/simple'
  })
}
/**
 *  新增部门
 * @param {*} data
 * @returns
 */
export const reqAddDepartment = (data) => {
  return http({
    method: 'post',
    url: '/company/department',
    data
  })
}
/**
 * 根据id查询部门详情
 * @param {*} id
 * @returns
 */
export const reqGetDepartDetail = (id) => {
  return http({
    method: 'get',
    url: '/company/department/' + id
  })
}
/**
 * 根据id修改部门详情
 * @param {*} form
 * @returns
 */
export const reqUpdateDepartDetail = (form) => {
  return http({
    method: 'put',
    url: '/company/department/' + form.id,
    data: form
  })
}
