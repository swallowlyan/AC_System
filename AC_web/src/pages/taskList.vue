<!--文件服务-->
<template>
  <div id="fileService">
    <el-form :model="searchItem" ref="searchItem" label-width="auto" class="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="任务名称">
            <el-input v-model="searchItem.taskName" size="small" placeholder="请输入任务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchItem.startTime"
              type="date"
              value-format="yyyy-MM-dd"
               size="small"
              placeholder="请选择创建时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button type="primary" @click="search(1)" size="small" style="background-color: #11a7b8;">查询</el-button>
          <el-button type="default" @click="reset('searchItem')" size="small">重置</el-button>
          <!-- <el-button type="success" icon="el-icon-refresh" @click="search(1)">刷新</el-button> -->
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div>
          <el-table :data="tableData" border size="medium" class="fileService"
          :header-cell-style="tableHeaderColor">
            <!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->
            <el-table-column prop="CreateTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="taskTypeName" label="任务类型" align="center"></el-table-column>
            <el-table-column type="taskID" width="300" label="任务ID" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.taskID}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="taskStatusName" label="任务状态" align="center"></el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10,15]"
              :page-size="tableLimit"
              layout="total, sizes, prev, pager, next"
              :total="tableSize"
              style="float: right"
            ></el-pagination>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%">
      <!-- 任务详情List -->
      <el-row>
        <el-col :span="24">
          <div>
            <el-table :data="detailData" border size="medium" class="detailTable"
            :header-cell-style="tableHeaderColor">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="terminalId" label="设备ID" align="center"></el-table-column>
              <el-table-column prop="taskStatusName" label="任务状态" align="center"></el-table-column>
              <el-table-column prop="taskprogress" label="任务进度" align="center"></el-table-column>
              <el-table-column prop="taskStep" label="任务步骤" align="center"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "fileService",
  data() {
    return {
      tableData: [],
      tableSize: 0,
      tableLimit: 10,
      currentPage:1,
      searchItem: {
        taskName: "",
        startTime: ""
      },
      dialogTitle: "",
      dialogFormVisible: false,
      detailData: [],
      detailSize: 0,
      detailLimit: 10
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
    search(page) {
      let param = "";
      if (this.searchItem.taskName !== "")
        param = "&taskName=" + this.searchItem.taskName;
      if (this.searchItem.startTime !== "")
        param = "&startTime=" + this.searchItem.startTime;
      this.$axios
        .post(
          baseUrl +
            "/admin/task/selTask?pageSize=" +
            this.tableLimit +
            "&pageIndex=" +
            page +
            param
        )
        .then(res => {
          this.currentPage=page;
          this.tableSize = res.data.data.total;
          this.tableData = res.data.data.records;
          return false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    //详情dialog
    detailRow(row) {
      this.dialogTitle = "任务详细信息";
      this.$axios
        .post(baseUrl + "/admin/task-item/selTaskItemList?taskId=" + row.taskID)
        .then(res => {
          this.detailData = res.data.data;
          this.dialogFormVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "color: #353B40;font-weight: bold;background: #f5fafa;padding: 5px 0;";
      }
    }
  }
};
</script>

<style scoped>
.detailTable {
  max-height: 500px;
  overflow: auto;
}
.fileService .el-button--text{
  color: #11a7b8;
}
.pull-right {
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  text-shadow: none;
}
.allCard {
  border: 1px solid #eee !important;
}
.allCard h1 {
  font-size: 36px;
  margin-bottom: 5px;
}
.el-card__header {
  padding: 10px 20px !important;
}
.stat-percent {
  color: #1c84c6;
  font-weight: 600;
  float: right;
}
.el-card__header .blue {
  background-color: #1c84c6;
}
.el-card__header .green {
  background-color: #23c6c8;
}
.el-card__header .greenAll {
  background-color: #1ab394;
}
.el-card__header .orange {
  background-color: rgba(240, 155, 119, 1);
}
.el-card__body .blue {
  color: #1c84c6;
}
.el-card__body .green {
  color: #23c6c8;
}
.el-card__body .greenAll {
  color: #1ab394;
}
.el-card__body .orange {
  color: rgba(240, 155, 119, 1);
}
.acForm .el-col {
  border-color: rgb(151, 195, 221);
  font-size: 14px;
  padding: 0px;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  line-height: 20px;
}
.acForm .el-form-item {
  margin-bottom: 0px;
}
.list {
  max-height: 100px;
  overflow: auto;
}
.list div {
  width: 150px;
  margin: 0px 10px;
  float: left;
}
.list button {
  margin-left: 10px;
}
.acForm .el-col {
  text-align: center;
}
.addConfig {
  width: 160px;
  float: left;
}
.previewTable {
  color: #48576a;
  table-layout: fixed;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.previewTable td {
  border: 1px solid #8492a6;
  padding: 5px 0;
  word-wrap: break-word;
}
.previewTable > thead {
  background-color: #eff2f7;
}
</style>

