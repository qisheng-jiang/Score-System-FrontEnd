<template>
  <div class="app-container">
    <el-select
      v-model="area_id"
      @change="handleAreaChange"
    >
      <el-option v-for="item in areas" :key="item.name" :value="item.id" :label="item.name" />
    </el-select>
    <el-select
      v-model="group_id"
      @change="handleGroupChange"
    >
      <el-option v-for="item in groups" :key="item.name" :value="item.id" :label="item.name" />
    </el-select>
    <el-button v-if="getToken()==2" type="primary" style="margin-left: 20px;" @click="handleAddWorker">新增成员</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="工号" width="190">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="190">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生日" width="210">
        <template slot-scope="scope">
          {{ scope.row.birthday }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作" width="210">
        <template slot-scope="scope">
          {{ scope.row.work_content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template v-if="getToken()==2" slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑成员信息':'新增成员'">
      <el-form :model="role" label-width="110px" label-position="left">
        <el-form-item label="员工工号">
          <el-input v-model="role.id" placeholder="员工工号" />
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input v-model="role.name" placeholder="员工姓名" />
        </el-form-item>
        <el-form-item label="员工生日">
          <el-date-picker v-model="role.birthday" type="date" placeholder="员工生日" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="工作内容">
          <el-select
            v-model="role.work_id"
          >
            <el-option v-for="item in work_type" :key="item.name" :value="item.id" :label="item.name" />
          </el-select>
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
import { getWorker, addWorker, deleteWorker, updateWorker, getAreaList, getGroupList, getWorkList } from '@/api/worker'
import { getToken } from '@/utils/auth'

const defaultRole = {
  id: '',
  name: '',
  birthday: '',
  work_content: '',
  // work_grade: '',
  work_id: ''
}

export default {
  data() {
    return {
      area_id: '',
      areas: [
        { name: 'one', id: 1 },
        { name: 'two', id: 2 }
      ],
      group_id: '',
      groups: [
        { name: 'three', id: 1 },
        { name: 'four', id: 2 }
      ],
      // work_content: '',
      work_type: [
        { name: 'five', id: 1 },
        { name: 'six', id: 2 }
      ],
      work_id: '',
      // work_grade: [
      //   { name: 'A', id: 1 },
      //   { name: 'B', id: 2 }
      // ],
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
    this.getAreaList()
    this.getWorkList()
    // this.getGroup()
  },
  methods: {
    getToken() {
      return getToken()
    },
    async getWorker(id) {
      const res = await getWorker(id)
      this.rolesList = res.data
    },
    async getAreaList() {
      const res = await getAreaList()
      this.areas = res.data
    },
    async getGroupList(id) {
      const res = await getGroupList(id)
      this.groups = res.data
    },
    async getWorkList() {
      const res = await getWorkList()
      this.work_type = res.data
    },
    handleAreaChange() {
      // alert(this.area_id)
      this.getGroupList(this.area_id)
    },
    handleGroupChange() {
      // alert(this.area_id)
      this.getWorker(this.group_id)
    },
    handleAddWorker() {
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
          await deleteWorker(row.id)
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
        await updateWorker(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addWorker(this.role)
        this.role.id = data.id
        this.role.work_content = data.work_content
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
