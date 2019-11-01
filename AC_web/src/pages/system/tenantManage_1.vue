<!--租户管理-暂停使用-->
<template>
  <div id="userManage">
    <el-container>
      <el-aside width="200px">
        <el-row>
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="orgSelect"
          >
            <div v-for="(item , index) in areaData" :key="index">
              <el-menu-item v-if="!item.child" :index="item.index">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
              <el-submenu v-if="item.child" :index="item.index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item
                  v-for="(child,ind) in item.child"
                  :key="ind"
                  :index="child.index"
                >{{child.name}}</el-menu-item>
              </el-submenu>
            </div>
          </el-menu>
        </el-row>
      </el-aside>
      <el-main>
        <el-row style="margin-bottom:20px">
          <el-col :span="4" :offset="2">
            <el-button v-show="!ifAreaChild" type="primary" round @click="add('dialogForm')">新建子租户</el-button>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button type="success" round @click="editRow('dialogForm')">变更租户名</el-button>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button type="danger" round @click="delRow()">删除当前租户</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <div>
              <el-table
                :data="tableData"
                border
                size="medium"
                class="userTable"
                @selection-change="getRowDatas"
              >
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="tenantName" width="120" label="租户名"></el-table-column>
                <el-table-column prop="parentId" label="上级租户"></el-table-column>
                <el-table-column prop="status" label="租户状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status===1" style="color:#67c23a">正常</span>
                    <span v-if="scope.row.status===8" style="color:gray">停用</span>
                    <span v-if="scope.row.status===9" style="color:red">删除</span>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="简要说明"></el-table-column>
                <el-table-column prop="options" width="250" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="removeRow(scope.row)" type="text" size="medium">移出本租户</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin:20px 0px">
                <el-button-group>
                  <!-- <el-button
                    type="success"
                    round
                    size="small"
                    icon="el-icon-refresh"
                    @click="search(1)"
                  >刷新</el-button> -->
                  <el-button
                    type="primary"
                    round
                    size="small"
                    icon="el-icon-plus"
                    @click="addUserDialog()"
                  >添加用户</el-button>
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
      </el-main>
    </el-container>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
        <el-form-item label="租户名称" prop="name">
          <el-col :span="15">
            <el-input v-model="dialogForm.tenantName" placeholder="请输入租户名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="租户状态" prop="status">
          <el-col :span="15">
            <el-radio v-model="dialogForm.status" label="1">正常</el-radio>
            <el-radio v-model="dialogForm.status" label="8">停用</el-radio>
            <el-radio v-model="dialogForm.status" label="9">删除</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="租户描述">
          <el-col :span="15">
            <el-input v-model="dialogForm.description" placeholder="请输入租户描述"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUser" width="65%">
      <el-row>
        <el-col :span="16" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>用户池</span>
            </div>
            <div>
              <el-container>
                <el-header>
                  <el-row>
                    <el-col :span="16">
                      <el-input v-model="searchUserItem" placeholder="请输入内容进行查询"></el-input>
                    </el-col>
                    <el-col :span="2" :offset="1">
                      <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
                    </el-col>
                  </el-row>
                </el-header>
                <el-main>
                  <!-- 用户列表 -->
                  <el-row style="max-height: 300px;overflow:auto;">
                    <el-table
                      ref="multipleTable"
                      :data="userData"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="dialogSelectionChange"
                    >
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column prop="uid" width="120" label="用户ID" v-if="false"></el-table-column>
                      <el-table-column prop="username" width="120" label="用户名"></el-table-column>
                      <el-table-column prop="usertype" label="用户类型">
                        <template slot-scope="scope">
                          <span v-if="scope.row.usertype===1">管理员</span>
                          <span v-if="scope.row.usertype===0">普通</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="tenantid" label="上级租户"></el-table-column>
                      <el-table-column prop="status" label="用户状态">
                        <template slot-scope="scope">
                          <span v-if="scope.row.status===1" style="color:#67c23a">正常</span>
                          <span v-if="scope.row.status===8" style="color:gray">停用</span>
                          <span v-if="scope.row.status===9" style="color:red">删除</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                  <el-row style="text-align: center;margin-top:10px;">
                    <el-pagination
                      @size-change="userSizeChange"
                      @current-change="userCurrentChange"
                      :current-page="userCurrentPage"
                      :page-sizes="[5, 10, 15]"
                      :page-size="userPageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="userTotal"
                    ></el-pagination>
                  </el-row>
                </el-main>
              </el-container>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选用户</span>
            </div>
            <div>
              <ul>
                <li v-for="(item,index) in userSelectedList" :key="index">
                  {{item.username}}
                  <el-button type="text">
                    <i class="el-icon-close"></i>
                  </el-button>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddUser()">保 存</el-button>
        <el-button @click="dialogAddUser = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userManage",
  data() {
    return {
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      orgArr: {
        title: "请选择所属机构",
        options: [
          {
            value: "1",
            label: "机构一"
          },
          {
            value: "2",
            label: "机构二"
          }
        ]
      },
      tenantArr: {
        title: "请选择租户级别",
        options: [
          {
            value: "1",
            label: "一级"
          },
          {
            value: "2",
            label: "二级"
          }
        ]
      },
      tableData: [],
      areaData: [],
      ifAreaChild: false,
      selectedOrg: "",
      dialogTitle: "新增",
      dialogFormVisible: false,
      dialogForm: {
        tenantName: "",
        status: ""
      },
      dialogRules: {
        tenantName: [
          { required: true, message: "请输入租户名称", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择租户状态", trigger: "blur" }]
      },
      userData: [],
      userSelectedList: [
        { id: 0, username: "用户1", time: "2019年8月20日" },
        { id: 1, username: "用户2", time: "2019年8月20日" },
        { id: 2, username: "用户3", time: "2019年8月20日" }
      ],
      dialogAddUser: false,
      searchUserItem: "",
      userLimit: 10,
      userCurrentPage: 1,
      userPageSize: 10,
      userTotal: 0
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
    search(page) {
      this.$axios
        .get(baseUrl + "/admin/tenant/list", {
          pageSize: this.userLimit,
          pageIndex: page
        })
        .then(res => {
          this.tableSize = res.data.data.total;
          this.tableData = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    add(formName) {
      if (this.selectedOrg === "") {
        this.$message({
          message: "请先选择上级租户",
          type: "warning"
        });
      } else {
        this.dialogTitle = "新增租户";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
      }
    },
    editRow() {
      if (this.selectedOrg === "") {
        this.$message({
          message: "请先选择上级租户",
          type: "warning"
        });
      } else {
        if (this.selectedRow.length === 1) {
          this.dialogTitle = "编辑租户";
          this.dialogForm = Object.assign({}, this.selectedRow[0]);
          this.dialogFormVisible = true;
        } else {
          this.$message({
            message: "请选择单条数据进行操作",
            type: "warning"
          });
        }
      }
    },
    delRow() {
      if (this.selectedRow.length === 1) {
        this.$confirm("是否确定删除该租户?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .delete(
                baseUrl +
                  "/admin/tenant/remove?tenantId=" +
                  this.selectedRow[0].tenantId
              )
              .then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.search(1);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          message: "请选择单条数据进行操作",
          type: "warning"
        });
      }
    },
    //新增、修改租户
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //新增
          if (this.dialogTitle.indexOf("新增") > -1) {
            let param = {};
            param.parentId = this.selectedOrg;
            Object.keys(this.dialogForm).forEach(item => {
              param[item] = this.dialogForm[item];
            });
            this.$axios
              .post(baseUrl + "/admin/tenant/save?" + this.$qs.stringify(param))
              .then(res => {
                this.dialogFormVisible = false;
                this.$message({
                  message: "成功添加",
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.search(1);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            //修改
            let param = {};
            param.parentId = this.selectedOrg;
            Object.keys(this.dialogForm).forEach(item => {
              if (
                item === "tenantId" ||
                item === "tenantName" ||
                item === "status" ||
                item === "description"
              )
                param[item] = this.dialogForm[item];
            });
            this.$axios
              .put(
                baseUrl + "/admin/tenant/update?" + this.$qs.stringify(param)
              )
              .then(res => {
                this.dialogFormVisible = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.search(1);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    orgSelect(index, indexPath) {
      this.selectedOrg = index;
      if (indexPath.length > 1) this.ifAreaChild = true;
      else this.ifAreaChild = false;
    },
    removeRow() {},
    addUserDialog() {
      if (this.selectedRow.length === 1) {
        this.searchUser(1);
        this.dialogAddUser = true;
      } else {
        this.$message({
          message: "请选择单条数据进行操作",
          type: "warning"
        });
      }
    },
    searchUser(page) {
      let param = {};
      param.pageSize = this.tableLimit;
      param.pageIndex = page;
      if (this.searchUserItem !== "") param.userName = this.searchUserItem;
      this.$axios
        .get(baseUrl + "/admin/user/list?" + this.$qs.stringify(param))
        .then(res => {
          this.userTotal = res.data.data.total;
          this.userData = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitAddUser() {},
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    },
    userSizeChange(val) {
      this.userPageSize = val;
      this.searchUser(1);
    },
    userCurrentChange(val) {
      this.searchUser(value);
    },
    dialogSelectionChange() {},
    handleOpen(key, keyPath) {
      console.log(key);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
.userTable {
  max-height: 500px;
  overflow: auto;
}
</style>
