// 企业相关
import http from '@/utils/request'

// 根据 id 查询企业
export const reqGetCompanyById = (id) => {
  return http({
    method: 'get',
    url: `/company/${id}`
  })
}
