<!--微应用管理-->
<template>
  <div id="applicationManage">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="微应用名称" prop="name">
          <el-input v-model="searchItem.name" placeholder="请输入微应用名称"></el-input>
        </el-form-item>
        <el-form-item label="微应用类型" prop="type">
          <el-select v-model="searchItem.type" :placeholder="appTypeArr.title">
            <el-option
              v-for="item in appTypeArr.options"
              :key="item.ItemCode"
              :label="item.ItemName"
              :value="item.ItemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(1)">查询</el-button>
          <el-button type="default" @click="reset('searchItem')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="22">
        <div>
          <el-table
            :data="tableData"
            border
            size="medium"
            class="applicationTable"
            @selection-change="getRowDatas"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="appId" width="120" label="微应用ID">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.appId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="appName" width="120" label="微应用名"></el-table-column>
            <el-table-column prop="appType" label="微应用类型"></el-table-column>
            <el-table-column prop="vendor" width="150" label="应用厂商"></el-table-column>
            <el-table-column prop="version" label="微应用版本"></el-table-column>
            <el-table-column prop="appReleaseTime" width="120" label="发布时间"></el-table-column>
            <el-table-column prop="containerType" width="120" label="容器类型"></el-table-column>
            <el-table-column prop="containerVersion" label="容器版本"></el-table-column>
            <el-table-column prop="options" label="操作">
              <template slot-scope="scope">
                <!-- <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</!-->
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-button type="primary" round icon="el-icon-plus" @click="add('dialogForm')">新增</el-button>
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
    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="70%">
      <el-form
        :model="dialogForm"
        :rules="dialogRules"
        ref="dialogForm"
        label-width="150px"
        class="acForm"
      >
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="微应用ID" prop="appId">
              <span v-if="ifDialogDetail">{{dialogForm.appId}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.appId" placeholder="请输入微应用ID"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="微应用名称" prop="appName">
              <span v-if="ifDialogDetail">{{dialogForm.appName}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.appName" placeholder="请输入微应用名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微应用类型" prop="appType">
              <span v-if="ifDialogDetail">{{dialogForm.appType}}</span>
              <el-select
                v-if="!ifDialogDetail"
                v-model="dialogForm.appType"
                :placeholder="appTypeArr.title"
                style="width:100%"
              >
                <el-option
                  v-for="item in appTypeArr.options"
                  :key="item.ItemCode"
                  :label="item.ItemName"
                  :value="item.ItemCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row>
           <el-col :span="12">
            <el-form-item label="应用中心微应用名称" prop="appStoreId">
              <span v-if="ifDialogDetail">{{dialogForm.appStoreId}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.appStoreId" placeholder="请输入应用中心微应用名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微应用版本">
              <span v-if="ifDialogDetail">{{dialogForm.version}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.version" placeholder="请输入应用版本"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用厂商">
              <span v-if="ifDialogDetail">{{dialogForm.vendor}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.vendor" placeholder="请输入应用厂商"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间">
              <span v-if="ifDialogDetail">{{dialogForm.appReleaseTime}}</span>
              <el-date-picker
                v-model="dialogForm.appReleaseTime"
                 v-if="!ifDialogDetail"
                type="datetime"
                placeholder="请选择发布时间"
                style="width:90%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="容器类型">
              <span v-if="ifDialogDetail">{{dialogForm.containerType}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.containerType"
                placeholder="请输入容器类型"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="容器版本">
              <span v-if="ifDialogDetail">{{dialogForm.containerVersion}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.containerVersion"
                placeholder="请输入容器版本"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件大小(MB)">
              <span v-if="ifDialogDetail">{{dialogForm.fileSizeMB}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.fileSizeMB"
                placeholder="请输入文件大小"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大数据大小(MB)">
              <span v-if="ifDialogDetail">{{dialogForm.minDataDiskMB}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.minDataDiskMB"
                placeholder="请输入最大数据大小"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="CPU核心数">
              <span v-if="ifDialogDetail">{{dialogForm.minVcpus}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.minVcpus"
                placeholder="请输入CPU核心数"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物理接口">
              <span v-if="ifDialogDetail">{{dialogForm.physicalInterfaces}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.physicalInterfaces"
                placeholder="请输入物理接口"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          
          <el-col :span="12">
            <el-form-item label="下载url">
              <span v-if="ifDialogDetail">{{dialogForm.downloadURL}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.downloadURL"
                placeholder="请输入下载url"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标url">
              <span v-if="ifDialogDetail">{{dialogForm.logo}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.logo" placeholder="请输入图标url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "applicationManage",
  data() {
    return {
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        name: "",
        type: ""
      },
      appTypeArr: {
        title: "微应用类型",
        options: []
      },
      containerTypeArr: {
        title: "请选择容器类型",
        options: [
          {
            value: "1",
            label: "容器1"
          },
          {
            value: "2",
            label: "容器2"
          },
          {
            value: "3",
            label: "容器3"
          }
        ]
      },
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogDetail: false,
      dialogForm: {
        appName: "",
        appType: "",
        appReleaseTime:"",
        vendor: "",
        version: "",
        containerType: "",
        containerVersion: "",
        downloadURL:"",
        fileSizeMB:"",
        logo:"",
        minVcpus:"",
        minDataDiskMB:"",
        physicalInterfaces:""
      },
      dialogRules: {
        appId: [
          { required: true, message: "请输入微应用ID", trigger: "change" }
        ],
        appName: [
          { required: true, message: "请输入微应用名称", trigger: "blur" }
        ],
        appType: [
          { required: true, message: "请选择微应用类型", trigger: "change" }
        ],
        appStoreId: [
          { required: true, message: "请输入应用中心微应用名称 ", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getAddDialogType();
    this.search(1);
  },
  methods: {
    //获取微应用分类
    getAddDialogType() {
      this.$axios
        .post(baseUrl + "/admin/app/getAllTypes")
        .then(res => {
          if (res.data.success) {
            this.appTypeArr.options= res.data.data;
            this.appTypeArr.options.push({ItemCode:"",ItemName:"全部"});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(page) {
      let param = {};
      Object.keys(this.searchItem).forEach(item => {
        if (this.searchItem[item] !== "") param[item] = this.searchItem[item];
      });
      this.$axios
        .post(
          baseUrl +
            "/admin/app/files?" +
            "pageIndex=" +
            page +
            "&pageSize=" +
            this.tableLimit,
          param
          // {headers: {"Content-Type": "application/json"}}
        )
        .then(res => {
          this.tableSize = res.data.data.total;
          this.tableData = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    add(formName) {
      this.dialogTitle = "新增微应用";
      this.ifDialogDetail = false;
      this.dialogForm = {};
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields();
      // });
    },
    detailRow(row) {
      this.$nextTick(() => {
        this.$refs['dialogForm'].resetFields();
      });
      this.dialogTitle = "微应用详细信息";
      this.ifDialogDetail = true;
      this.dialogForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    editRow(row) {
      this.dialogTitle = "编辑微应用";
      this.dialogForm = Object.assign({}, row);
      this.ifDialogDetail = false;
      this.dialogFormVisible = true;
    },
    delRow(row) {
      this.$confirm("是否确定删除     '" + row.appName + "'     该微应用?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.post(baseUrl+'/admin/app/delete?appId='+row.appId).then((res)=>{
            this.$message({
            type: "success",
            message: "删除成功!"
          });
            this.search(1);
          }).catch((err)=>{
            console.log(err);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(baseUrl+'/admin/app/add',
            this.dialogForm
          ).then((res)=>{
          this.dialogFormVisible = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$refs[formName].resetFields();
            this.search(1);
          }).catch((err)=>{
            console.log(err);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
.applicationTable {
  max-height: 500px;
  overflow: auto;
}
</style>
