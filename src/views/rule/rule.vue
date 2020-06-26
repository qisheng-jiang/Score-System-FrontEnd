<template>
  <div class="app-container">
    <el-button type="primary" style="margin-left: 20px;" @click="handleAddRule">新增条例</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="条例编号" width="190">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="条例内容" width="490">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑条例信息':'新增条例'">
      <el-form :model="role" label-width="110px" label-position="left">
        <el-form-item label="条例内容">
          <el-input v-model="role.content" placeholder="条例内容" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import path from 'path'
import { deepClone } from '@/utils'
import { getRule, addRule, deleteRule, updateRule } from '@/api/rule'

const defaultRole = {
  id: '',
  content: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
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
    this.getRule()
  },
  methods: {
    async getRule(id) {
      const res = await getRule(id)
      this.rolesList = res.data
    },
    handleAddRule() {
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
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRule(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete success!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateRule(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRule(this.role)
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
