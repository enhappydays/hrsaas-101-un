<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总记录数: {{ total }}条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button type="danger" size="small" @click="handleExport">excel导出</el-button>
          <el-button type="primary" size="small" @click="isShow=true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading" style="margin-top: 10px;">
        <el-table :data="list" border>
          <el-table-column label="序号" type="index" :index="indexMethod" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" sortable="">
            <template #default="{row}">
              <!-- {{ row.timeOfEntry | formatDate('YYYY-MM-DD') }} -->
              <img
                v-imgerror="errorImg"
                class="imgchange"
                :src="row.staffPhoto || defaultStaff"
                alt=""
                @click="handleStaffClick(row.staffPhoto||defaultStaff)"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" :formatter="formatEmployment" prop="formOfEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间 " sortable="">
            <template #default="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template #default="{row}">
              <el-button
                :disabled="!checkBtnAccess('POINT_USER_EDIT')"
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="handleAssignRole(row.id)"
              >角色</el-button>
              <el-button
                v-if="checkBtnAccess('POINT_USER_DEL')"

                type="text"
                size="small"
                @click="handleDel(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
          :current-page="page"
          :page-sizes="[1,2,3,4,5,6,7,8,9,10]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <!-- 增加员工 -->
        <add-employee
          :show-dialog.sync="isShow"
        />
        <div style="height: 60px; margin-top: 10px">
          <el-pagination layout="prev, pager, next" />
        </div>
      </el-card>
      <!-- 二维码显示 -->
      <el-dialog
        width="300px"
        title="扫码看图"
        :visible.sync="showQrcodeDialog"
      >
        <canvas ref="qrcodeCanvas" />
      </el-dialog>
      <!-- 分配角色 -->
      <assign-role
        :show-role-dialog.sync="showRoleDialog"
        :user-id="userId"
      />
    </div>
  </div>
</template>

<script>

// 引入二维码三方库
import QRCode from 'qrcode'
import addEmployee from './component/addEmployee.vue'
// 引入枚举文件
import employeesConstant from '@/constant/employees'
import { reqGetUserList, reqDelEmployee } from '@/api/employees'
// 引入本地图片
import errorImg from '@/assets/common/bigUserHeader.png'
// 引入dayjs
import dayjs from 'dayjs'
export default {
  name: 'Employees',
  components: {
    addEmployee
  },

  data() {
    return {
      page: 1,
      size: 5,
      list: [],
      total: 0,
      loading: false,
      isShow: false,
      // 7.默认头像地址
      defaultStaff: 'https://101-hrsass-1312445828.cos.ap-shanghai.myqcloud.com/01.jpg ',
      // 8.图片加载失败的指令用途
      errorImg,
      showQrcodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.loading = true
      const { data: { rows, total }} = await reqGetUserList(this.page, this.size)
      // console.log(res)
      this.list = rows
      this.total = total
      this.loading = false
    },
    handleSizeChange(val) {
      this.size = val
      // 回到第一页(规范)
      this.page = 1
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUserList()
    },
    indexMethod(index) {
      return index + 1 + this.size * (this.page - 1)
    },
    formatEmployment(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      // return cellValue === 1 ? '正式' : '临时'
      // 这种写法太局限, 可以用枚举解决
      // return cellValue === 1 ? '正式工' : '临时工'

      // ------------改造----------
      // console.log(cellValue, '++++++')
      const { hireType } = employeesConstant
      // 注意注意: 后端接口给回来的cellValue的值有number类型和string类型两种, 特殊处理
      const res = hireType.find(item => item.id === +cellValue)
      return res ? res.value : '未知工种'
    },
    handleDel(id) {
      this.$confirm('确定要删除该员工么,操作不可逆哟?', '温馨提示').then(async() => {
        const res = await reqDelEmployee(id)
        console.log(res)
        this.$message.success('删除成功')
        if (this.page > 0 && this.list.length === 1) {
          this.page--
        }
        this.getUserList()
      }).catch(() => {
        console.log('quxiao')
      })
    },
    async handleExport() {
      const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      // 多表头
      const multiHeader = [['主要信息', '', '', '', '', '', '']]
      // 合并单元格
      const merges = ['A1:G1']
      const headersRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      const { data: { rows }} = await reqGetUserList(1, this.total)
      console.log(rows)

      const resultsArr = this.formatFn(rows, headersArr, headersRelations)

      import('@/vendor/Export2Excel').then(excel => {
        console.log(excel)
        excel.export_json_to_excel({
          // 表格的表头
          header: headersArr,
          // 表格的主体数据(固定格式->二维数组)
          data: resultsArr,
          filename: '员工信息表',
          autoWidth: true, // 宽度自适应 非必填
          bookType: 'xlsx', // 文件格式 非必填
          multiHeader,
          merges

        })
      })
    },
    formatFn(rows, headersArr, headersRelations) {
      // 9.1 创建新数组(一维)
      const outerArr = []
      // 9.2 遍历原始数据数组
      rows.forEach(item => {
        // 9.3 创建内部数组
        const innerArr = []
        // 9.5 遍历组头数组按顺序取出内容
        headersArr.forEach(key => {
          // 9.6 从中英文对照表中取出英文键
          const englishKey = headersRelations[key]
          // 9.7 根据英文键从对象中取出对应的值
          let value = item[englishKey]
          // 特殊情况处理: 日期格式
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            value = dayjs(value).format('YYYY年MM月DD日')
          }
          // 特殊情况处理: 聘用形式转化
          if (['formOfEmployment'].includes(englishKey)) {
            const { hireType } = employeesConstant
            const res = hireType.find(v => v.id === +value) // 此处容易出错
            value = res ? res.value : '未知'
          }
          // 9.8 把值装入到小数组中
          innerArr.push(value)
        })
        // 9.4 把内部的数组装到外部的大数组中
        outerArr.push(innerArr)
      })
      return outerArr
    },
    handleStaffClick(imgSrc) {
      this.showQrcodeDialog = true
      this.$nextTick(() => {
        // 生成二维码进行绘制
        // 参数1: 绘制二维码的画布
        // 参数2: 生成二维码的内容(文字, url地址, 文件对象, ...)
        QRCode.toCanvas(this.$refs.qrcodeCanvas, imgSrc)
      })
    },
    handleAssignRole(id) {
      this.showRoleDialog = true
      this.userId = id
    },
    checkBtnAccess(str) {
      // 有权限返回true;否则返回false
      const roles = this.$store.getters.roles
      // 新增的员工是没有角色, 没有权限的, 会有null的可能
      if (roles) {
        return roles.points.includes(str)
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.imgchange{
 width: 100%;
 height: 150px;
}

</style>
