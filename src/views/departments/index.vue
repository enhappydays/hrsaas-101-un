<template>
  <div class="departments-container">
    <!-- 提供了一些默认的内边距 padding -->
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card">
        <!-- 用了一个行列布局 -->

        <tree-tools
          :node-data="company"
          :root="true"
          @add-depts="addDeptsFn"
        />
        <add-dept
          ref="addDept"
          :is-show="isShow"
          :depts-list="deptsList"
          :node-data="nodeData"
          @addDept="getDepartments"
          @closeDialog="closeDialogFn"
        />
        <el-tree
          :data="departs"
          :props="{label:'name'}"
          default-expand-all
        >
          <!-- node data是el-tree内部插槽提供出来的数据 -->
          <!-- node是偏底层一点的节点信息, 不需要 -->
          <!-- data是我们之前自己写的数据 -->
          <template #default="{ data }">
            <!-- <p>{{ data.name }} - {{ data.manager }}</p> -->
            <!-- tree子节点的宽度默认由内容撑开,  -->

            <tree-tools
              :node-data="data"
              @del-depts="getDepartments"
              @add-depts="addDeptsFn"
              @edit-dept="editDeptsFn"
            />
          </template>
        </el-tree>
      </el-card>
    </div>

  </div>

</template>

<script>
import AddDept from '@/views/departments/AddDept.vue'
import TreeTools from '@/views/departments/TreeTools.vue'
import { reqGetDepartments } from '@/api/departments'
import { transListToTree } from '@/utils'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      departs: [],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' },
      isShow: false,
      nodeData: {},
      deptsList: [],
      loading: false

    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const { data: { depts, companyName }} = await reqGetDepartments()
      // console.log(data)
      this.deptsList = depts
      this.company.name = companyName
      this.company.id = ''
      const res = transListToTree(depts, '')
      this.departs = res
      this.loading = false
    },
    closeDialogFn() {
      this.isShow = false
    },
    addDeptsFn(nodeData) {
      this.isShow = true
      this.nodeData = nodeData
      // this.$refs.addDept.getSimpleUserList()
      this.$refs.addDept.dialogTitle = '添加子部门'
      // this.$refs.addDept.getDeptDetail(nodeData.id)
    },
    editDeptsFn(nodeData) {
      this.nodeData = nodeData
      this.isShow = true

      this.$refs.addDept.dialogTitle = '编辑部门'
      this.$refs.addDept.getDepartDetail(nodeData.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开 +
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before  {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
