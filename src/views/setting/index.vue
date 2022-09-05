<template>
  <div class="setting-container">
    <!-- 提供了一些默认的内边距 padding -->
    <div class="app-container">
      <el-card v-loading="loading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <el-button
              type="primary"
              @click="showDialog = true"
            >+ 新增角色

            </el-button>
            <el-table :data="list">
              <el-table-column label="序号" type="index" :index="indexFn" width="80" />
              <el-table-column label="角色名称" prop="name" width="150" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button
                    size="small"
                    type="text"
                    @click="handleAssignRole(row.id)"
                  >分配权限</el-button>

                  <el-button size="small" type="text" @click="handleEdit(row.id)">编辑</el-button>
                  <el-button size="small" type="text" @click="handleDeL(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="page"
              :page-sizes="[1,2,3,4,5]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="company">
            <!-- 警告信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyForm.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyForm.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyForm.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyForm.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 添加/编辑 对话框 - begin -->
      <el-dialog title="showTitle" :visible="showDialog" @close="handleClose">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </template>
      </el-dialog>
      <!-- 分配权限的弹层 -->
      <el-dialog
        v-loading="loading"
        title="分配权限"
        :visible="showAssignDialog"
        @close="closeAssignDialog"
      >
        <el-tree
          ref="tree"
          node-key="id"
          show-checkbox
          check-strictly
          default-expand-all
          :data="permissionList"
          :props="{label: 'name'}"
        />
        <template #footer>
          <el-button @click="closeAssignDialog">取消</el-button>
          <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { reqGetRoleList, reqDelRole, reqAddRole, reqGetRoleDetail, reqUpdateRole } from '@/api/setting'
import { reqGetCompanyById } from '@/api/company'
import { reqGetPermissionList, reqAssignPerm } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'role',
      list: [],
      page: 1,
      pagesize: 3,
      total: 0,
      loading: false,
      showDialog: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: ['change', 'blur'] }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: ['change', 'blur'] }
        ]
      },
      companyForm: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      showAssignDialog: false,
      permissionList: [],
      // 角色id
      roleId: ''

    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    showTitle() {
      return this.form.id ? '编辑角色' : '添加角色'
    }
  },
  created() {
    this.getCompanyInfo() // 获取公司信息
    this.getRoleList()
  },
  methods: {
    async getCompanyInfo() {
      const { data } = await reqGetCompanyById(this.userInfo.companyId)
      this.companyForm = data
    },
    async getRoleList() {
      this.loading = true
      const { data: { total, rows }} = await reqGetRoleList(this.page, this.pagesize)
      // console.log(res)
      this.list = rows
      this.total = total
      this.loading = false
    },
    handleClose() {
      this.showDialog = false
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 每页条数变化后, 需要重置成第一页(规范)
      // 比如一共100条数据, 现在每页一条, 你现在可以在第80页, 但是切换成每页100条后, 你只有1页, 只能在第1页!!
      this.page = 1
      this.getRoleList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getRoleList()
    },
    indexFn(index) {
      return index + 1 + (this.pagesize * (this.page - 1))
    },
    handleDeL(id) {
      console.log(id, 88)
      this.$confirm('确定删除该角色么?', '温馨提示').then(async() => {
        const res = await reqDelRole(id)
        console.log(res)
        this.$message.success('删除角色成功')
        // 不是第一页, 而且当前页列表中的数据只有一条
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        // 重新获取列表数据
        this.getRoleList()
      }).catch(() => {
        console.log('取消')
      })
    },
    handleSubmit() {
      this.$refs.form.validate(async(flag) => {
        if (!flag) return
        if (this.form.id) {
          await reqUpdateRole(this.form)
          this.$message.success('更新角色成功')
        } else {
          const res = await reqAddRole(this.form)
          console.log(res)
          this.$message.success('添加角色成功')
        }

        this.handleClose()
        this.getRoleList()
      })
    },
    async handleEdit(id) {
      const { data } = await reqGetRoleDetail(id)
      this.form = data
      this.showDialog = true
    },
    // 关闭分配权限弹窗
    closeAssignDialog() {
      // 关闭弹窗
      this.showAssignDialog = false
      // 重置选中项为空 (清空选中的, 防止上一次勾选的遗留到下一次展示中)
      this.$refs.tree.setCheckedKeys([])
    },
    async handleAssignRole(id) {
      this.showAssignDialog = true
      this.loading = true
      console.log(id)
      const { data } = await reqGetPermissionList()
      this.permissionList = transListToTree(data, '0')
      // 获取角色之前的权限(就是获取角色详情那个接口)
      const { data: { permIds }} = await reqGetRoleDetail(id)
      console.log(permIds)
      // 设置树形结构选中(配合node-key)
      this.$refs.tree.setCheckedKeys(permIds)
      // 记录要分配权限的角色id
      this.roleId = id
      this.loading = false
    },
    async  handleAssignSubmit() {
      const permIds = this.$refs.tree.getCheckedKeys()
      // 注意: roleId要从打开弹窗的方法中获取
      const res = await reqAssignPerm(this.roleId, permIds)
      console.log(res)
      this.$message.success('分配权限成功')
      this.closeAssignDialog()
    }

  }

}
</script>
