<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button
            type="primary"
            size="small"
            @click="handleAddPremission(1, '0')"
          >添加权限</el-button>
        </div>
        <el-table :data="list" row-key="id" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                size="small"
                type="text"
                @click="handleAddPremission(2, row.id)"
              >添加权限点</el-button>
              <el-button
                size="small"
                type="text"
                @click="handleEdit(row.id)"
              >查看</el-button>
              <el-button size="small" type="text" @click="handelDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 新增/编辑的弹层 -->
      <el-dialog
        :visible="showDialog"
        :title="showTitle"
        @close="handleCloseDialog"
      >
        <!-- 表单内容 -->
        <el-form label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="handleCloseDialog">取消</el-button>
            <el-button type="primary" @click="handlesubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqUpdatePermission, reqGetPermissionDetail } from '@/api/permission'
import { transListToTree } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 权限名称
        code: '', // 权限标识,用于将来判断
        description: '', // 权限描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const { data } = await reqGetPermissionList()
      // console.log(res)
      // 把列表数据转成树形数据
      this.list = transListToTree(data, '0')
      console.log(this.list)
    },
    handleCloseDialog() {
      this.showDialog = false
      // 没有校验 手动重置
      this.formData = {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 权限名称
        code: '', // 权限标识,用于将来判断
        description: '', // 权限描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    },
    handleAddPremission(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    async handlesubmit() {
      if (this.formData.id) {
        // 编辑
        const res = await reqUpdatePermission(this.formData)
        console.log(res)
        this.$message.success('编辑权限成功')
      } else {
        const res = await reqAddPermission(this.formData)
        console.log(res)
        this.$message.success('添加权限成功')
      }

      this.handleCloseDialog()
      this.getPermissionList()
    },
    handelDel(id) {
      this.$confirm('您确定删除吗？', '不可逆', { type: 'warning' }).then(async() => {
        await reqDelPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      })
    },
    async handleEdit(id) {
      this.showDialog = true
      const { data } = await reqGetPermissionDetail(id)
      console.log(data)
      this.formData = data
    }
  }
}
</script>
