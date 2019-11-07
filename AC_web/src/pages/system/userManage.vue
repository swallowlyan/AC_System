<!--用户管理-->
<template>
  <div id="userManage">
    <el-form :model="searchItem" ref="searchItem" label-width="auto" class="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="searchItem.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租户ID" prop="tenantId">
            <el-input v-model="searchItem.tenantId" placeholder="请输入租户ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-button type="primary" @click="search(1)">查询</el-button>
          <el-button type="default" @click="reset('searchItem')">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div>
          <el-table
            :data="tableData"
            border
            size="medium"
            class="userTable"
            @selection-change="getRowDatas"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="uid" width="120" label="用户ID" v-if="false"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column prop="usertype" label="用户类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.usertype===1">管理员</span>
                <span v-if="scope.row.usertype===0">普通</span>
              </template>
            </el-table-column>
            <el-table-column prop="tenantid" label="上级租户" align="center"></el-table-column>
            <el-table-column prop="status" label="用户状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status===1" style="color:#67c23a">正常</span>
                <span v-if="scope.row.status===8" style="color:gray">停用</span>
                <span v-if="scope.row.status===9" style="color:red">删除</span>
              </template>
            </el-table-column>
            <el-table-column prop="options" width="150" label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button @click="disableUser(scope.row)" type="text" size="medium">禁用</el-button> -->
                <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
                <!-- <el-button @click="resetPwd(scope.row)" type="text" size="medium">重置密码</el-button> -->
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
                @click="search(1,10)"
              >刷新</el-button> -->
              <el-button
                type="primary"
                round
                size="small"
                icon="el-icon-plus"
                @click="add('dialogForm')"
              >新增</el-button>
              <!-- <el-button type="warning" round size="small" icon="el-icon-edit" @click="editRow()">编辑</el-button>
              <el-button type="danger" round size="small" icon="el-icon-delete" @click="delRow()">删除</el-button>-->
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
    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-row>
        <el-form
          :model="dialogForm"
          :rules="dialogRules"
          ref="dialogForm"
          label-width="100px"
          class="acForm"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户名:" prop="username">
                <el-input v-if="!ifUpdate" v-model="dialogForm.username" placeholder="请输入用户名"></el-input>
                <span v-if="ifUpdate">{{dialogForm.username}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="!ifUpdate">
            <el-col :span="24">
              <el-form-item label="密码:" prop="passwd">
                <el-input v-model="dialogForm.passwd" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="!ifUpdate">
              <el-form-item label="租户:" prop="tenantid">
                <el-select v-model="dialogForm.tenantid" :placeholder="tenantArr.title">
                  <el-option
                    v-for="item in tenantArr.options"
                    :key="item.tenantId"
                    :label="item.tenantName"
                    :value="item.tenantId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="ifUpdate">
              <el-form-item label="租户ID:">
                <span>{{dialogForm.tenantid}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户类型" prop="usertype">
                <el-radio v-model="dialogForm.usertype" label="0">普通</el-radio>
                <el-radio v-model="dialogForm.usertype" label="1">管理员</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')">保 存</el-button>
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
      searchItem: {
        userName: "",
        tenantId: ""
      },
      tenantArr: {
        title: "请选择租户",
        options: []
      },
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      dialogForm: {
        username: "",
        passwd: "",
        tenantid: "",
        usertype: ""
      },
      dialogRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        passwd: [{ required: true, message: "请输入密码", trigger: "change" }],
        tenantid: [
          { required: true, message: "请选择租户", trigger: "change" }
        ],
        usertype: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ]
      },
      ifUpdate: false
    };
  },
  mounted() {
    this.getTenantList();
    this.search(1);
  },
  methods: {
    //获取租户
    getTenantList() {
      this.$axios
        .get(baseUrl + "/admin/tenant/list", {
          pageSize: 10000,
          pageIndex: 1
        })
        .then(res => {
          this.tenantArr.options = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(page) {
      let param = {};
      param.pageSize = this.tableLimit;
      param.pageIndex = page;
      if (this.searchItem.userName !== "")
        param.userName = this.searchItem.userName;
      if (this.searchItem.tenantId !== "")
        param.tenantId = this.searchItem.tenantId;
      this.$axios
        .get(baseUrl + "/admin/user/list?" + this.$qs.stringify(param))
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
      this.dialogTitle = "新增用户";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    editRow(row) {
      this.dialogTitle = "编辑用户";
      this.dialogForm = Object.assign({}, row);
      this.ifUpdate = true;
      this.dialogFormVisible = true;
    },
    delRow(row) {
      console.info(row);
      this.$confirm("是否确定删除用户'"+row.username+"'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(baseUrl + "/admin/user/remove?userId=" + row.uid)
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
    },
    //新增、修改用户
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //新增
          if (this.dialogTitle.indexOf("新增") > -1) {
            this.$axios
              .post(
                baseUrl +
                  "/admin/user/save?" +
                  this.$qs.stringify(this.dialogForm)
              )
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
            Object.keys(this.dialogForm).forEach(item => {
              if (item !== "createTime" && item !== "deleteTime")
                param[item] = this.dialogForm[item];
            });
            this.$axios
              .put(baseUrl + "/admin/user/update?" + this.$qs.stringify(param))
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
    //重置密码
    resetPwd(row) {},
    //禁用
    disableUser(row) {},
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
.userTable {
  max-height: 500px;
  overflow: auto;
}
</style>
