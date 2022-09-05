<template>
  <!-- 对话框 -->
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="dialogTitle"
    :visible="isShow"
    @close="handleCloseDialog"
    @open="getSimpleUserList"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />

        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <template #footer>
      <el-button @click="handleCloseDialog">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetSimpleUserList, reqAddDepartment, reqGetDepartDetail, reqUpdateDepartDetail } from '@/api/departments'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    // 2. 父级部门的数据
    nodeData: {
      type: Object,
      default: () => {}
    },
    // 3. 整体部门的对象数组
    deptsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    /**
     * 自定义校验-同部门下不能有相同的部门名称
     */
    const checkName = (rule, value, callback) => {
      // 根据老父亲id, 可以找到所有兄弟
      // 除了父级部门的id, 还需要原始数据(部门列表),
      console.log(value, this.nodeData.id, this.deptsList)

      let arr = []
      if (this.form.id) {
        // 编辑时, 如果名称没有改, 则直接通过
        if (this.nodeData.name === value) {
          callback()
          return
        }
        // 找自己同级的部门
        arr = this.deptsList.filter(item => item.pid === this.nodeData.pid)
      } else {
        arr = this.deptsList.filter(item => item.pid === this.nodeData.id)
      }

      const isRepeat = arr.some(item => item.name === value)
      isRepeat ? callback(new Error('同级部门已经出现该部门名称了')) : callback()
    }
    const checkCode = (rule, value, callback) => {
      // this.form.id有值, 则在编辑状态下
      if (this.form.id && value === this.nodeData.code) {
        // 编辑情况下, code可以和原来的一样, 通过校验
        callback()
        return
      }
      // 部门编码不能在所有部门中重复 => item.code
      const isRepeat = this.deptsList.some(item => item.code === value)
      isRepeat ? callback(new Error('部门编码已经重复了')) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '部门名称只能是1-10位', trigger: ['blur', 'change'] },
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 10, message: '部门编码只能是1-10位', trigger: ['blur', 'change'] },
          // 自定义校验部门名称
          { validator: checkCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍只能是1-300位', trigger: ['blur', 'change'] }
        ]
      },
      userList: [],
      dialogTitle: '大标题'
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeDialog')
      // 1.2 重置表单
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    async getSimpleUserList() {
      // console.log('发请求获取员工列表了!!!')
      const { data } = await reqGetSimpleUserList()
      // console.log(res)
      this.userList = data
    },
    handleSubmit() {
      this.$refs.form.validate(async(flag) => {
        if (!flag) return
        if (this.form.id) {
          // 编辑
          const res = await reqUpdateDepartDetail(this.form)
          console.log(res)
          this.$message.success('编辑部门成功')
          // 这里部门编码校验有问题, 部门名称也是有问题  注意!!
        } else {
          // 添加
          const res = await reqAddDepartment({
            ...this.form,
            pid: this.nodeData.id
          })
          console.log(res)
          this.$message.success('新增部门成功')
        }

        this.handleCloseDialog()
        this.$emit('add-dept')
      })
    },
    async getDepartDetail(id) {
      const { data } = await reqGetDepartDetail(id)
      // console.log(res)
      this.form = data
    }

  }
}
</script>

<style>

</style>
