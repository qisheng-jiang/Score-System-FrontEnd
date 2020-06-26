<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="area_id"
        style="width: 100px;"
        placeholder="车间"
        @change="handleAreaChange"
      >
        <el-option v-for="item in areas" :key="item.name" :value="item.id" :label="item.name" />
      </el-select>
      <el-select
        v-model="listQuery.group_id"
        style="width: 100px;"
        placeholder="小组"
      >
        <el-option v-for="item in groups" :key="item.name" :value="item.id" :label="item.name" />
      </el-select>
      <el-input v-model="listQuery.worker_name" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.worker_id" placeholder="工号" style="width: 200px;" class="filter-item" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="getToken()==2" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加记录
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        审核员
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.record_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.worker_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.worker_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条例" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.context }}</span>
        </template>
      </el-table-column>
      <el-table-column label="得分" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="提议人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group_admin_name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="车间审核人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.area_admin_name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="总审核人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.root_admin_name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="getToken()==2" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="getToken()==1" size="mini" type="success" @click="handleAreaConfirm(row, record_state[1])">
            车间审核
          </el-button>
          <el-button v-if="getToken()==0" size="mini" @click="handleRootConfirms(row,record_state[2])">
            总审核
          </el-button>
          <el-button v-if="getToken()==2" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="工号" prop="worker_id">
          <el-input v-model="temp.worker_id" />
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="添加时间" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input v-model="temp.score" />
        </el-form-item>
        <el-form-item label="规章条例">
          <el-select v-model="temp.rule_id" class="filter-item" placeholder="规章条例" style="width: 100%;">
            <el-option v-for="item in rules" :key="item.name" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle, deleteArticle, getAreaList, getGroupList, getRuleList, rootConfirmArticle, areaConfirmArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getToken } from '@/utils/auth'

// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'info',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   },
  //   typeFilter(type) {
  //     // return calendarTypeKeyValue[type]
  //   }
  // },
  data() {
    return {
      record_state: [
        '未审核',
        '车间审核通过',
        '总审核通过'
      ],
      area_id: '',
      areas: [
        { name: 'one', id: 1 },
        { name: 'two', id: 2 }
      ],
      // group_id: '',
      groups: [
        { name: 'three', id: 1 },
        { name: 'four', id: 2 }
      ],
      rule_id: '',
      rules: [
        { name: 'one rule', id: 1 },
        { name: 'tow rule', id: 2 }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        group_id: undefined,
        worker_name: undefined,
        worker_id: undefined
        // sort: '+id'
      },
      // importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        record_id: '',
        // worker_id: '',
        worker_id: '',
        // worker_name: 1,
        // context: '',
        date: new Date(),
        score: '',
        rule_id: ''
        // status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      // pvData: [],
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
    this.getAreaList()
    this.getRuleList()
  },
  methods: {
    getToken() {
      return getToken()
    },
    async getAreaList() {
      const res = await getAreaList()
      this.areas = res.data
    },
    async getGroupList(id) {
      const res = await getGroupList(id)
      this.groups = res.data
    },
    async getRuleList() {
      const res = await getRuleList()
      this.rules = res.data
    },
    handleAreaChange() {
      // alert(this.area_id)
      this.getGroupList(this.area_id)
    },
    getStatus(row) {
      if (typeof row.root_admin_name !== 'undefined' || row.root_admin_name !== null || row.root_admin_name !== '') {
        return this.record_state[2]
      } else if (typeof row.area_admin_name !== 'undefined' || row.area_admin_name !== null || row.area_admin_name !== '') {
        return this.record_state[1]
      } else {
        return this.record_state[0]
      }
    },
    // handleGroupChange() {
    //   // alert(this.area_id)
    //   // this.getWorker(this.group_id)
    //   this.getList()
    // },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
        // this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAreaConfirm(row, status) {
      this.temp = row
      areaConfirmArticle(row.record_id).then(response => {
        this.temp.area_admin_name = response.data.area_admin_name
        const index = this.list.findIndex(v => v.record_id === this.temp.record_id)
        this.list.splice(index, 1, this.temp)
      })
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleRootConfirms(row, status) {
      this.temp = row
      rootConfirmArticle(row.record_id).then(response => {
        this.temp.root_admin_name = response.data.root_admin_name
        const index = this.list.findIndex(v => v.record_id === this.temp.record_id)
        this.list.splice(index, 1, this.temp)
      })
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        record_id: '',
        worker_id: '',
        // context: '',
        date: new Date(),
        score: '',
        rule_id: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(response => {
            this.temp.record_id = response.data.record_id
            this.temp.worker_name = response.data.worker_name
            this.temp.context = response.data.context
            this.temp.group_admin_name = response.data.group_admin_name
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData.record_id, tempData).then(() => {
            const index = this.list.findIndex(v => v.record_id === this.temp.record_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteArticle(row.record_id)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '工号', '时间', '条例', '得分', '提议人', '车间审核人', '总审核人']
        const filterVal = ['worker_name', 'worker_id', 'date', 'context', 'score', 'group_admin_name', 'area_admin_name', 'root_admin_name']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
    /* ,
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }*/
  }
}
</script>
