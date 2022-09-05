<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="handleCloseDialog"
    @open="handleOpenDialog"
  >
    <!-- 这里准备复选框 -->
    <el-checkbox-group
      v-model="checkList"
      v-loading="loading"
    >
      <el-checkbox
        v-for="item in roleList"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="handleCloseDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { reqGetRoleList } from '@/api/setting'
import { reqGetBaseInfo } from '@/api/user'
import { reqAssignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 1. 所有的角色数组
      roleList: [],
      // 2. 选中的角色id数组
      checkList: [],
      // 3. 加载圈的显示和隐藏
      loading: false
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('update:showRoleDialog', false)
      // 清空选中的角色数组(防止把上一个用户的角色带到下一个用户角色中去)
      this.checkList = []
      this.roleList = []
    },
    async  handleSubmit() {
      // 5.1 发起请求
      await reqAssignRoles(this.userId, this.checkList)
      // 5.2 提示用户
      this.$message.success('分配角色成功')
      // 5.3 关闭对话框
      this.handleCloseDialog()
    },
    handleOpenDialog() {
      this.loading = true
      // created 发请求太早了, 组件是一直在的
      Promise.all([
        // 获取角色列表
        this.getRoleList(),
        // 获取当前员工角色信息用于回显
        this.getEmployeeDetail()
      ]).then(() => {
        this.loading = false
      })
    },
    async getRoleList() {
      const { data: { rows }} = await reqGetRoleList(1, 999999)
      // console.log(res)
      this.roleList = rows
    },
    async getEmployeeDetail() {
      const { data: { roleIds }} = await reqGetBaseInfo(this.userId)
      // console.log(res)
      this.checkList = roleIds
    }
  }
}
</script>
