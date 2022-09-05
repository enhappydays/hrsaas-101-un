// 引入组件
import PageTools from '@/components/PageTools'
import dayjs from 'dayjs'
import UploadExcel from './UploadExcel'
import UploadImage from '@/components/UploadImage'
import AssignRole from '@/views/employees/component/AssignRole'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.filter('formatTime', function(value, str = 'YYYY年MM月DD日') {
      return dayjs(value).format(str)
    })
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('upload-image', UploadImage)
    Vue.component('AssignRole', AssignRole)
  }
}
