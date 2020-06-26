<template>
  <div class="app-container">
    <el-select
      v-model="area_id"
      @change="handleChange"
    >
      <el-option v-for="item in areas" :key="item.name" :value="item.id" :label="item.name" />
    </el-select>
    <el-button v-if="getToken()==1" type="primary" style="margin-left: 20px;" @click="handleAddGroup">新增小组</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="小组id" width="190">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="小组组号" width="190">
        <template slot-scope="scope">
          {{ scope.row.group_name }}
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
      <el-table-column align="center" label="操作">
        <template v-if="getToken()==1" slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="warning" size="small" @click="handleReset(scope)">重置密码</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑小组信息':'新增小组'">
      <el-form :model="role" label-width="110px" label-position="left">
        <el-form-item label="小组组号">
          <el-input v-model="role.group_name" placeholder="小组组号" />
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
        <el-button type="danger" @click="resetDialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmReset">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import path from 'path'
import { deepClone } from '@/utils'
import { getGroup, addGroup, deleteGroup, updateGroup, resetPassword, getAreaList } from '@/api/group'
import { getToken } from '@/utils/auth'

const defaultRole = {
  id: '',
  group_name: '',
  name: '',
  password: '',
  user_number: ''
}

export default {
  data() {
    return {
      area_id: '',
      areas: [],
      role: Object.assign({}, defaultRole),
      // routes: [],
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
    // routesData() {
    //   return this.routes
    // }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getAreaList()
    // this.getGroup()
  },
  methods: {
    getToken() {
      return getToken()
    },
    async getGroup(id) {
      const res = await getGroup(id)
      this.rolesList = res.data
    },
    async getAreaList() {
      var res = await getAreaList()
      console.log(res)
      this.areas = res.data
    },
    handleChange() {
      // alert(this.area_id)
      this.getGroup(this.area_id)
    },
    handleAddGroup() {
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
        this.checkStrictly = false
      })
    },
    handleReset(scope) {
      this.resetDialogVisible = true
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteGroup(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete success!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmReset() {
      const data = { id: this.role.id, password: this.role.password, type: 2 }
      await resetPassword(data)
      this.resetDialogVisible = false
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateGroup(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addGroup(this.role)
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
    }
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
