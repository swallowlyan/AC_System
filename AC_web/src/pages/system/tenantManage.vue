<!--租户管理-->
<template>
  <div id="tenantManage">
    <el-form :model="searchItem" ref="searchItem" label-width="auto" class="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="租户名称" prop="tenantName">
            <el-input v-model="searchItem.tenantName" placeholder="请输入租户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租户父级ID" prop="parentId">
            <el-input v-model="searchItem.parentId" placeholder="请输入租户父级ID"></el-input>
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
            <el-table-column prop="tenantId" label="租户ID" align="center"></el-table-column>
            <el-table-column prop="tenantName" label="租户名" align="center"></el-table-column>
            <el-table-column prop="parentId" label="上级租户ID" align="center"></el-table-column>
            <el-table-column prop="status" label="租户状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status===1" style="color:#67c23a">正常</span>
                <span v-if="scope.row.status===8" style="color:gray">停用</span>
                <span v-if="scope.row.status===9" style="color:red">删除</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" align="center"></el-table-column>
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
              <el-form-item label="租户名:" prop="tenantName">
                <el-input v-model="dialogForm.tenantName" placeholder="请输入租户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级租户:" prop="parentId">
                <el-select v-if="!ifEdit" v-model="dialogForm.parentId" :placeholder="tenantArr.title">
                  <el-option
                    v-for="item in tenantArr.options"
                    :key="item.tenantId"
                    :label="item.tenantName"
                    :value="item.tenantId"
                  ></el-option>
                </el-select>
                <span v-if="ifEdit">{{dialogForm.parentId}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="描述信息" style="height:53px">
                <el-input
                  v-model="dialogForm.description"
                  type="textarea"
                  placeholder="请输入描述信息"
                ></el-input>
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
  name: "tenantManage",
  data() {
    return {
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        tenantName: "",
        parentId: ""
      },
      tenantArr: {
        title: "请选择租户",
        options: []
      },
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      dialogForm: {
        tenantName: "",
        description: "",
        parentId: ""
      },
      dialogRules: {
        tenantName: [
          { required: true, message: "请输入租户名", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择上级租户", trigger: "change" }
        ]
      },
      ifEdit:false
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
      if (this.searchItem.tenantName !== "")
        param.tenantName = this.searchItem.tenantName;
      if (this.searchItem.parentId !== "")
        param.parentId = this.searchItem.parentId;
      this.$axios
        .get(baseUrl + "/admin/tenant/list?"+ this.$qs.stringify(param))
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
      this.dialogTitle = "新增租户";
      this.ifEdit=false;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    editRow(row) {
      this.dialogTitle = "编辑租户";
      this.ifEdit=true;
      this.dialogForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    delRow(row) {
      console.info(row);
      this.$confirm("是否确定删除该租户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(baseUrl + "/admin/tenant/remove?tenantId=" + row.tenantId)
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
    //新增、修改租户
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //新增
          if (this.dialogTitle.indexOf("新增") > -1) {
            this.$axios
              .post(
                baseUrl +
                  "/admin/tenant/save?" +
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
              .put(baseUrl + "/admin/tenant/update?" + this.$qs.stringify(param))
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
