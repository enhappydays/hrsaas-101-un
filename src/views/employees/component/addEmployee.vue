<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    top="8vh"
    @close="handleClose"
    @click.native="handleDialogClick"
  >
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item
        label="聘用形式"
        prop="formOfEmployment"
      >
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          :value="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @click.native.stop="handleClick"
        />
        <div v-if="isTreeShow" class="tree-box">
          <el-scrollbar>
            <el-tree
              v-loading="isTreeLoading"
              :data="treeData"
              :props="{ label: 'name' }"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 引入枚举文件
import employeesConstant from '@/constant/employees'
import { reqGetDepartments } from '@/api/departments'
import { reqAddEmployee } from '@/api/employees'
import { transListToTree } from '@/utils'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      treeData: [],
      isTreeShow: false,
      isTreeLoading: false,
      hireType: employeesConstant.hireType

    }
  },
  methods: {
    handleClose() {
      this.$emit('update:showDialog', false)
      this.$refs.addForm.resetFields()
      // 编辑不打算复用添加的dialog了, 所以不用重置表单之外的数据了...
    },
    async handleClick() {
      this.isTreeShow = !this.isTreeShow
      if (this.isTreeShow === false) return

      this.isTreeLoading = true
      const { data: { depts }} = await reqGetDepartments()
      const res = transListToTree(depts, '')
      // console.log(res)
      this.treeData = res
      this.isTreeLoading = false
    },
    handleDialogClick() {
      console.log('hahah')
      this.isTreeShow = false
    },
    handleNodeClick(data) {
      // console.log(data)
      if (data.children && data.children.length > 0) return

      console.log('确认选择')
      this.formData.departmentName = data.name

      this.isTreeShow = false
    },
    formatEmployment(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      // return cellValue === 1 ? '正式' : '临时'
      const { hireType } = employeesConstant
      const res = hireType.find(item => item.id === +cellValue)
      return res ? res.value : '未知'
    },
    handleSubmit() {
      this.$refs.addForm.validate(async(flag) => {
        if (!flag) return
        const res = await reqAddEmployee(this.formData)
        console.log(res)
        this.$message.success('新增员工成功')
        this.handleClose()
        this.$emit('add-employee')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  // min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  background-color: #fff;
  // max-height: 250px;
  height: 250px;
  // overflow: auto;

  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
