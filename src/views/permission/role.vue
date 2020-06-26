<template>
  <div class="app-container">
    <el-button v-if="getToken()==0" type="primary" @click="handleAddRole">新增车间</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="车间id" width="190">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车间名称" width="190">
        <template slot-scope="scope">
          {{ scope.row.area_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理者编号" width="210">
        <template slot-scope="scope">
          {{ scope.row.user_number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理者姓名" width="210">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template v-if="getToken()==0" slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="warning" size="small" @click="handleReset(scope)">重置密码</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑车间信息':'新增车间'">
      <el-form :model="role" label-width="110px" label-position="left">
        <el-form-item label="车间名称">
          <el-input v-model="role.area_name" placeholder="车间名称" />
        </el-form-item>
        <el-form-item label="管理者编号">
          <el-input v-model="role.user_number" placeholder="管理者编号" />
        </el-form-item>
        <el-form-item label="管理者姓名">
          <el-input v-model="role.name" placeholder="管理者姓名" />
        </el-form-item>
        <el-form-item v-if="passwordVisible" label="密码">
          <el-input v-model="role.password" placeholder="密码" />
        </el-form-item>
        <!-- <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item> -->
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="resetDialogVisible" title="重置密码">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="密码">
          <el-input v-model="role.password" placeholder="密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resetDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmReset">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole, resetPassword } from '@/api/role'
import { getToken } from '@/utils/auth'

const defaultRole = {
  id: '',
  area_name: '',
  name: '',
  password: '',
  user_number: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      resetDialogVisible: false,
      passwordVisible: true,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    getToken() {
      return getToken()
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.passwordVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.passwordVisible = false
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        // const routes = this.generateRoutes(this.role.routes)
        // this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleReset(scope) {
      this.resetDialogVisible = true
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmReset() {
      const data = { id: this.role.id, password: this.role.password, type: 1 }
      await resetPassword(data)
      this.resetDialogVisible = false
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.id = data.id
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }/* ,
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }*/
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
