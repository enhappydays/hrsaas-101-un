import http from '@/utils/request'

/**
 * 获取员工列表-包含详细信息
 * @param {*} page 当前页 默认1
 * @param {*} size 每页条数 默认5
 */
export const reqGetUserList = (page = 1, size = 5) => {
  return http({
    method: 'get',
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}
/**
 * 删除员工 (直接 C)
 * @param {*} id
 * @returns
 */
export function reqDelEmployee(id) {
  return http({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
/**
 * 添加员工
 * @param {*} form
 * @returns
 */
export const reqAddEmployee = (form) => {
  return http({
    method: 'post',
    url: '/sys/user',
    data: form
  })
}
/**
 * 批量添加员工
 * @param {*} arr
 * @returns
 */
export const reqAddEmployeeBatch = (arr) => {
  return http({
    method: 'post',
    url: '/sys/user/batch',
    data: arr
  })
}
/**
 * 保存员工的基本信息
 * @param {*} data
 * @returns
 */
export const reqSaveUserDetailById = (data) => {
  return http({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}
/**
 * 读取员工详情的基础信息 (个人详情-下面的接口)
 * @param {*} id
 * @returns
 */
export const reqGetPersonalDetail = (id) => {
  return http({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}
/**
 * 更新员工详情的基础信息 (个人详情-下面的接口)
 * @param {*} data
 * @returns
 */
export const reqUpdatePersonal = (data) => {
  return http({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}
/**
 * 获取用户的岗位信息  (岗位信息)
 * @param {*} id
 * @returns
 */
export function reqGetJobDetail(id) {
  return http({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息  (岗位信息)
 * @param {*} data
 * @returns
 */
export function reqUpdateJob(data) {
  return http({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}
/**
 * 给员工分配角色
 * @param { string } id 员工的id
 * @param { array } roleIds 角色id数组
 * @returns
 */
export const reqAssignRoles = (id, roleIds) => {
  return http({
    method: 'put',
    url: `/sys/user/assignRoles`,
    data: {
      id,
      roleIds
    }
  })
}
