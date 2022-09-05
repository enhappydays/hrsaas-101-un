<template>
  <div>
    <UploadExcel

      :on-success="handleSuccess"
    />
  </div>
</template>

<script>
import { reqAddEmployeeBatch } from '@/api/employees'
export default {
  name: 'Import',
  methods: {
    formatExcelDate(numb, format) {
      const time = new Date(numb * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    handleSuccess({ header, results }) {
      console.log(header, results)
      if (this.$route.query.type === 'user') {
        this.handleEmployeeBatch(header, results)
      }
      if (this.$route.query.type === 'money') {
        console.log('工资的批量导入')
      }
      if (this.$route.query.type === 'social') {
        console.log('社保的批量导入')
      }
    },
    async handleEmployeeBatch(header, results) {
      // 中英文对照表
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 遍历
      const dataArr = []
      results.forEach(item => {
        const obj = {}
        for (const key in item) {
          const englishKey = userRelations[key]
          if (englishKey === 'timeOfEntry' || englishKey === 'correctionTime') {
            obj[englishKey] = this.formatExcelDate(item[key], '-')
          } else {
            obj[englishKey] = item[key]
          }
        }
        dataArr.push(obj)
      })
      // 1.3 发起网络请求
      const res = await reqAddEmployeeBatch(dataArr)
      console.log(res)
      this.$message.success('批量导入员工成功!')
      this.$router.push('/employees')
    }
  }

}
</script>

<style>

</style>
