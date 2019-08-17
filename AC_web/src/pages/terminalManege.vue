<!--终端管理-->
<template>
  <div id="terminalManege">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <!-- 总览tab页 -->
      <el-tab-pane label="总览" name="allView">
        <!-- 总览数据 -->
        <el-row>
          <el-col :span="5" v-for="(item,index) in allDataArr" :key="index" style="margin:0px 10px">
            <el-card class="box-card allCard" shadow="hover" :body-style="{ padding:'15px'}">
              <div slot="header" class="clearfix">
                <span>{{item.title}}</span>
                <span class="pull-right" :class="item.color">{{item.timeTitle}}</span>
              </div>
              <h1>{{item.count}}</h1>
              <small>{{item.smallTitle}}</small>
              <div class="stat-percent" :class="item.color">
                {{item.percent}}
                <i :class="item.icon"></i>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 总览地图 -->
        <el-row>
          
        </el-row>
      </el-tab-pane>
      <!-- 详细列表tab -->
      <el-tab-pane label="详细列表" name="detailView">
        <el-row>
          <el-form :inline="true" :model="searchItem" ref="searchItem">
            <el-form-item label="终端ID" prop="id">
              <el-input v-model="searchItem.id" placeholder="请输入终端ID"></el-input>
            </el-form-item>
            <el-form-item prop="version" label="版本号">
              <el-select v-model="searchItem.version" :placeholder="versionArr.title">
                <el-option
                  v-for="item in versionArr.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ascription" label="归属地">
              <el-select v-model="searchItem.ascription" :placeholder="ascriptionArr.title">
                <el-option
                  v-for="item in ascriptionArr.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
                class="terminalTable"
                @selection-change="getRowDatas"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="id" width="150" label="终端ID"></el-table-column>
                <el-table-column prop="version" label="终端版本"></el-table-column>
                <el-table-column prop="ability" width="150" label="终端能力"></el-table-column>
                <el-table-column prop="container" label="容器版本"></el-table-column>
                <el-table-column prop="status" label="终端状态"></el-table-column>
                <el-table-column prop="attribution" width="150" label="归属地"></el-table-column>
                <el-table-column prop="options" label="操作" width="180">
                  <!-- <template slot-scope="scope">
                   <el-button @click="setPosition(scope.row)" type="text" size="medium">设置人员</el-button>
                    <el-button @click="editPosition(scope.row)" type="text" size="medium">编辑</el-button>
                    <el-button @click="delPosition(scope.row)" type="text" size="medium">删除</el-button> 
                  </template>-->
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
                  <el-button
                    type="warning"
                    round
                    size="small"
                    icon="el-icon-edit"
                    @click="editRow()"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    round
                    size="small"
                    icon="el-icon-delete"
                    @click="delRow()"
                  >删除</el-button>
                </el-button-group>
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
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
        <el-form-item label="终端名称" prop="name">
          <el-col :span="15">
            <el-input v-model="dialogForm.name" placeholder="请输入终端名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="终端版本" prop="version">
          <el-col :span="15">
            <el-select v-model="dialogForm.version" placeholder="请选择终端版本" style="width:100%">
              <el-option
                v-for="item in versionArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="终端能力" prop="ability">
          <el-col :span="15">
            <el-input v-model="dialogForm.ability" placeholder="请输入终端能力"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="容器版本" prop="container">
          <el-col :span="15">
            <el-input v-model="dialogForm.container" placeholder="请输入容器版本"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="终端归属地" prop="ascription">
          <el-col :span="15">
            <el-select v-model="dialogForm.ascription" placeholder="请选择终端归属地" style="width:100%">
              <el-option
                v-for="item in ascriptionArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="终端状态">
          <el-radio v-model="dialogForm.status" label="0">离线</el-radio>
          <el-radio v-model="dialogForm.status" label="1">在线</el-radio>
        </el-form-item>
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
  name: "terminalManege",
  data() {
    return {
      activeTab: "allView",
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        id: "",
        version: "",
        ascription: ""
      },
      versionArr: {
        title: "请选择版本号",
        options: [
          {
            value: "1",
            label: "1.0"
          },
          {
            value: "2",
            label: "1.1"
          },
          {
            value: "3",
            label: "1.2"
          }
        ]
      },
      ascriptionArr: {
        title: "请选择归属地",
        options: [
          {
            value: "1",
            label: "北京"
          },
          {
            value: "2",
            label: "上海"
          },
          {
            value: "3",
            label: "济南"
          }
        ]
      },
      allDataArr: [
        {
          title: "终端总数",
          timeTitle: "当前",
          smallTitle: "接入终端总数",
          count: "236,495",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color:"blue"
        },
        {
          title: "在线终端总数",
          timeTitle: "当前",
          smallTitle: "当前在线终端总数",
          count: "235,964",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color:"green"
        },
        {
          title: "活跃用户",
          timeTitle: "月",
          smallTitle: "8月活跃用户总数",
          count: "6,956",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color:"greenAll"
        },
        {
          title: "应用总数",
          timeTitle: "当前",
          smallTitle: "平台提供应用总数",
          count: "3,235",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color:"orange"
        }
      ],
      tableData: [
        {
          id: "MathCAD",
          version: "1.0",
          ability: "test1",
          container: "test1",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "2.0",
          ability: "test2",
          container: "test2",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.2",
          ability: "test3",
          container: "test3",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.4",
          ability: "test4",
          container: "test4",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.0",
          ability: "test1",
          container: "test1",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "2.0",
          ability: "test2",
          container: "test2",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.2",
          ability: "test3",
          container: "test3",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.4",
          ability: "test4",
          container: "test4",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.0",
          ability: "test1",
          container: "test1",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "2.0",
          ability: "test2",
          container: "test2",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.2",
          ability: "test3",
          container: "test3",
          status: "0",
          attribution: "北京"
        },
        {
          id: "MathCAD",
          version: "1.4",
          ability: "test4",
          container: "test4",
          status: "0",
          attribution: "北京"
        }
      ],
      dialogTitle: "新增",
      dialogFormVisible: false,
      dialogForm: {
        name: "",
        version: "",
        ability: "",
        container: "",
        status: "0",
        ascription: ""
      },
      dialogRules: {
        name: [
          { required: true, message: "请输入终端名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        version: [
          { required: true, message: "请选择终端版本", trigger: "change" }
        ],
        ability: [
          { required: true, message: "请输入终端能力", trigger: "change" }
        ],
        container: [
          { required: true, message: "请输入容器版本", trigger: "change" }
        ],
        ascription: [
          { required: true, message: "请输入终端归属地", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.tableSize = this.tableData.length;
  },
  methods: {
    search(page) {
      // this.$axios.post('',{
      //   id:this.searchItem.id,
      //   version:this.searchItem.version,
      //   ascription:this.searchItem.ascription,
      //   limit:this.tableLimit,
      //   page:page,
      //   sort:'asc'
      // }).then((res)=>{
      //   this.tableSize=res.data.length;
      //   this.tableData=res.data;
      // }).catch((err)=>{
      //   console.log(err);
      // });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    add(formName) {
      this.dialogTitle = "新增终端";
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.dialogFormVisible = true;
    },
    editRow() {
      if (this.selectedRow.length === 0 || this.selectedRow.length > 1) {
        this.$message({
          message: "请选择单条数据进行编辑",
          type: "warning"
        });
      } else {
        //获取当前数据内容
        // this.$axios.post('',{
        //   id:this.selectedRow[0].id,'
        // }).then((res)=>{
        //   this.search(page);
        // }).catch((err)=>{
        //   console.log(err);
        // });
        this.dialogTitle = "编辑终端";
        this.dialogForm = this.selectedRow[0];
        this.dialogFormVisible = true;
        // this.$axios.post('',{
        //   id:this.selectedRow[0].id,'
        // }).then((res)=>{
        //   this.search(page);
        // }).catch((err)=>{
        //   console.log(err);
        // });
      }
    },
    delRow() {
      if (this.selectedRow.length === 0) {
        this.$message({
          message: "请选择数据进行删除",
          type: "warning"
        });
      } else {
        this.$confirm("是否确定删除该终端?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let ids = [];
            this.selectedRow.forEach(item => {
              ids.push(item.id);
            });
            // this.$axios.post('',{
            //   ids:ids,'
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
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$axios.post('',{
          //   dialogForm,
          // }).then((res)=>{
          this.dialogFormVisible = false;
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.$refs[formName].resetFields();
          //   this.search(page);
          // }).catch((err)=>{
          //   console.log(err);
          // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClick() {},
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
.terminalTable {
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
.el-card__header .blue{background-color: #1c84c6;}
.el-card__header .green{background-color: #23c6c8;}
.el-card__header .greenAll{background-color: #1ab394;}
.el-card__header .orange{background-color: rgba(240, 155, 119, 1);}
.el-card__body .blue{color: #1c84c6;}
.el-card__body .green{color: #23c6c8;}
.el-card__body .greenAll{color: #1ab394;}
.el-card__body .orange{color: rgba(240, 155, 119, 1);}
</style>
