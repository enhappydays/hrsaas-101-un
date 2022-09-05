<template>
  <!-- tree子节点的宽度默认由内容撑开,  -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <!-- 两个内容 -->
        <el-col :span="12">{{ nodeData.manager }}</el-col>
        <el-col :span="12">
          <!-- 下拉菜单 element -->
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!root" command="del">删除部门</el-dropdown-item>
              <el-dropdown-item v-if="!root" command="edit">编辑部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDepartment } from '@/api/departments'
export default {
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    },
    root: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // del() {
    //   console.log('我被删除了')
    // },
    handleCommand(type) {
      // console.log('被点击了', type)
      if (type === 'add') {
        console.log('添加操作')
        this.$emit('add-depts', this.nodeData)
      }
      if (type === 'del') {
        this.$confirm('此操作将永久删除该部门,是否继续', '温馨提示').then(async() => {
          await reqDelDepartment(this.nodeData.id)
          this.$message.success('删除成功')
          this.$emit('del-depts')
        }).catch(() => {})
      }
      if (type === 'edit') {
        this.$message.success('编辑')
        this.$emit('edit-dept', this.nodeData)
      }
    }
  }
}
</script>

<style>

</style>
