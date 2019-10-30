<!--文件服务-->
<template>
  <div id="fileService">
    <el-form :model="searchItem" ref="searchItem" label-width="auto">
      <el-row>
        <el-col :span="6">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="searchItem.taskName" placeholder="请输入任务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-button type="primary" @click="search(1)">查询</el-button>
          <el-button type="default" @click="reset('searchItem')">重置</el-button>
          <el-button type="success" icon="el-icon-refresh" @click="search(1)">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div>
          <el-table :data="tableData" border size="medium" class="fileService">
            <el-table-column type="taskID" width="300" label="任务ID">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.taskID}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="任务名称"></el-table-column>
            <el-table-column prop="taskType" label="任务类型">
              <template slot-scope="scope">
                <span v-if="scope.row.taskType===0">---</span>
                <span v-if="scope.row.taskType===1">设置终端维护状态</span>
                <span v-if="scope.row.taskType===3">删除终端</span>
                <span v-if="scope.row.taskType===4">查询终端信息</span>
                <span v-if="scope.row.taskType===11">安装微应用</span>
                <span v-if="scope.row.taskType===12">卸载微应用</span>
                <span v-if="scope.row.taskType===13">升级微应用</span>
                <span v-if="scope.row.taskType===14">启停微应用</span>
                <span v-if="scope.row.taskType===21">安装容器</span>
                <span v-if="scope.row.taskType===22">卸载容器</span>
                <span v-if="scope.row.taskType===23">升级容器</span>
                <span v-if="scope.row.taskType===24">启停容器</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskStatus" label="任务状态">
              <template slot-scope="scope">
                <span v-if="scope.row.taskStatus===0">未开始</span>
                <span v-if="scope.row.taskStatus===1">任务开始，执行中</span>
                <span v-if="scope.row.taskStatus===2">任务成功完成</span>
                <span v-if="scope.row.taskStatus===3">任务完成，部分成功</span>
                <span v-if="scope.row.taskStatus===9">任务失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间"></el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="1"
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="70%">
      <!-- 任务form -->
      <el-row>
        <el-form
          :model="dialogForm"
          ref="dialogForm"
          label-width="150px"
          class="acForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务ID">
                <span>{{dialogForm.taskID}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务名称">
                <span>{{dialogForm.taskName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务类型">
                <span v-if="dialogForm.taskType===0">---</span>
                <span v-if="dialogForm.taskType===1">设置终端维护状态</span>
                <span v-if="dialogForm.taskType===3">删除终端</span>
                <span v-if="dialogForm.taskType===4">查询终端信息</span>
                <span v-if="dialogForm.taskType===11">安装微应用</span>
                <span v-if="dialogForm.taskType===12">卸载微应用</span>
                <span v-if="dialogForm.taskType===13">升级微应用</span>
                <span v-if="dialogForm.taskType===14">启停微应用</span>
                <span v-if="dialogForm.taskType===21">安装容器</span>
                <span v-if="dialogForm.taskType===22">卸载容器</span>
                <span v-if="dialogForm.taskType===23">升级容器</span>
                <span v-if="dialogForm.taskType===24">启停容器</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态">
                <span v-if="dialogForm.taskStatus===0">未开始</span>
                <span v-if="dialogForm.taskStatus===1">开始</span>
                <span v-if="dialogForm.taskStatus===2">收到回复,终端正在执行命令</span>
                <span v-if="dialogForm.taskStatus===3">终端执行命令成功，已完成</span>
                <span v-if="dialogForm.taskStatus===7">终端执行命令失败</span>
                <span v-if="dialogForm.taskStatus===8">回复超时（失败）</span>
                <span v-if="dialogForm.taskStatus===9">收到回复（回复失败）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端ID">
                <span>{{dialogForm.terminalId}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <span>{{dialogForm.CreateTime}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务进度">
                <span>{{dialogForm.taskprogress}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务步骤">
                <span>{{dialogForm.taskStep}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
      searchItem: {
        taskName: ""
      },
      dialogTitle: "",
      dialogFormVisible: false,
      dialogForm: {
        taskID: "",
        taskName: "",
        taskType: "",
        taskStatus: "",
        uid: "",
        CreateTime: "",
        taskprogress: "",
        terminalId: "",
        taskStep: ""
      },
      selectedRow: []
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
      this.dialogForm.taskID = row.taskID;
      this.dialogForm.taskName = row.taskName;
      this.dialogForm.taskType = row.taskType;
      this.dialogForm.taskStatus = row.taskStatus;
      this.dialogForm.CreateTime = row.CreateTime;
      this.$axios
        .post(baseUrl + "/admin/task-item/selTaskItemList?taskId=" + row.taskID)
        .then(res => {
          this.dialogForm.terminalId = res.data.data[0].terminalId;
          this.dialogForm.taskprogress = res.data.data[0].taskprogress;
          this.dialogForm.taskStep = res.data.data[0].taskStep;
          this.dialogFormVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    }
  }
};
</script>

<style scoped>
.fileService {
  max-height: 500px;
  overflow: auto;
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

