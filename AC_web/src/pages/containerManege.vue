<!--容器管理-->
<template>
  <div id="containerManage">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="容器名称">
          <el-input v-model="searchItem.name" placeholder="请输入容器名称"></el-input>
        </el-form-item>
        <el-form-item label="容器类型">
          <el-input v-model="searchItem.type" placeholder="请输入容器类型"></el-input>
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
            class="containerTable"
            @selection-change="getRowDatas"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="containerName" width="150" label="容器名称">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="containerType" label="容器类型"></el-table-column>
            <el-table-column prop="releaseTime" width="100" label="发布时间"></el-table-column>
            <el-table-column prop="developer" label="厂商"></el-table-column>
            <el-table-column prop="version" label="容器版本"></el-table-column>
            <el-table-column prop="bseVersion" label="基础包版本"></el-table-column>
            <el-table-column prop="isIncrementPkg" label="是否升级包">
               <template slot-scope="scope">
                    <span v-if="scope.row.isIncrementPkg===0">否</span>
                    <span v-if="scope.row.isIncrementPkg===0">是</span>
               </template>
            </el-table-column>
            <el-table-column prop="description" width="150" label="说明"></el-table-column>
            <el-table-column prop="options" label="操作">
              <template slot-scope="scope">
                <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-button-group>
              <el-button
                type="success"
                round
                size="small"
                icon="el-icon-refresh"
                @click="search(1,10)"
              >刷新</el-button>
              <el-button
                type="primary"
                round
                size="small"
                icon="el-icon-plus"
                @click="add('dialogForm')"
              >新增</el-button>
            </el-button-group>
            <el-button type="primary" round size="small">
              <i class="el-icon-upload"></i>同步容器
            </el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="dialogForm"
        :rules="dialogRules"
        ref="dialogForm"
        label-width="100px"
        class="acForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="容器ID" prop="containerId">
              <span v-if="ifDialogDetail">{{dialogForm.containerId}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.containerId"
                placeholder="请输入容器ID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="容器名称" prop="containerName">
              <span v-if="ifDialogDetail">{{dialogForm.containerName}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.containerName"
                placeholder="请输入容器名称"
              ></el-input>
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
              <span v-if="ifDialogDetail">{{dialogForm.version}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.version" placeholder="请输入容器版本"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基础包版本">
              <span v-if="ifDialogDetail">{{dialogForm.bseVersion}}</span>
              <el-input
                v-if="!ifDialogDetail"
                v-model="dialogForm.bseVersion"
                placeholder="请输入基础包版本"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="容器url">
              <span v-if="ifDialogDetail">{{dialogForm.url}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.url" placeholder="请输入容器url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否升级包" prop="isIncrementPkg">
              <span v-if="ifDialogDetail">{{dialogForm.isIncrementPkg}}</span>
              <el-radio v-if="!ifDialogDetail" v-model="dialogForm.isIncrementPkg" label="0">否</el-radio>
              <el-radio v-if="!ifDialogDetail" v-model="dialogForm.isIncrementPkg" label="1">是</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height:100px">
            <el-form-item label="简要说明" class="lineHeight">
              <span v-if="ifDialogDetail">{{dialogForm.description}}</span>
              <el-input
                v-if="!ifDialogDetail"
                type="textarea"
                style="height:100px"
                v-model="dialogForm.description"
              ></el-input>
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
  name: "containerManage",
  data() {
    return {
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        name: "",
        type: ""
      },
      terminalArr: {
        title: "请选择终端",
        options: [
          {
            value: "1",
            label: "终端1"
          },
          {
            value: "2",
            label: "终端2"
          },
          {
            value: "3",
            label: "终端3"
          }
        ]
      },
      statusArr: {
        title: "请选择容器状态",
        options: [
          {
            value: "0",
            label: "离线"
          },
          {
            value: "1",
            label: "在线"
          }
        ]
      },
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogDetail: false,
      dialogForm: {
        containerId: "",
        containerName: "",
        containerType: "",
        isIncrementPkg: "",
        bseVersion: "",
        version: "",
        url: "",
        logo: "",
        description: ""
      },
      dialogRules: {
        containerId: [
          { required: true, message: "请输入容器ID", trigger: "blur" }
        ],
        containerName: [
          { required: true, message: "请输入容器名称", trigger: "blur" }
        ],
        isIncrementPkg: [
          { required: true, message: "请选择是否升级", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
    search(page) {
      let condition={};
      condition.name=this.searchItem.name;
      condition.type=this.searchItem.type;
      this.$axios.post(
        baseUrl+'/admin/containers/files',
        {condition:condition,
        pageSize:this.tableLimit,
        pageIndex:page,
        sort:["desc"]
      },
      {headers: {"Content-Type": "application/json"}}
      ).then((res)=>{
        this.tableSize=res.data.totalRecord;
        this.tableData=res.data.data;
      }).catch((err)=>{
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
      this.dialogTitle = "新增容器";
      this.ifDialogDetail = false;
      this.dialogForm = {};
      this.dialogFormVisible = true;
    },
    detailRow(row) {
      this.dialogTitle = "容器详细信息";
      this.ifDialogDetail = true;
      this.dialogForm = row;
      this.dialogFormVisible = true;
    },
    editRow(row) {
      // if (this.selectedRow.length === 0 || this.selectedRow.length > 1) {
      //   this.$message({
      //     message: "请选择单条数据进行编辑",
      //     type: "warning"
      //   });
      // } else {
      //获取当前数据内容
      // this.$axios.post('',{
      //   id:this.selectedRow[0].id,'
      // }).then((res)=>{
      //   this.search(page);
      // }).catch((err)=>{
      //   console.log(err);
      // });
      this.dialogTitle = "编辑终端";
      this.ifDialogDetail = false;
      this.dialogForm = row;
      this.dialogFormVisible = true;
      // }
    },
    delRow(row) {
      // if (this.selectedRow.length === 0) {
      //   this.$message({
      //     message: "请选择数据进行删除",
      //     type: "warning"
      //   });
      // } else {
      this.$confirm("是否确定删除该容器?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          // this.$axios.post('',{
          //   id:row.id,'
          // }).then((res)=>{
          //   this.search(page);
          // }).catch((err)=>{
          //   console.log(err);
          // });

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
          this.$axios
            .post(baseUrl+"/admin/containers/add", this.dialogForm, config)
            .then(res => {
              if (res.data.success) {
                this.dialogFormVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.search(1);
              }else{
                this.$message({
                  message: "添加失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
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
.containerTable {
  max-height: 500px;
  overflow: auto;
}
</style>
