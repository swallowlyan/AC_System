<!--租户管理-->
<template>
  <div id="userManage">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="租户名称">
          <el-input v-model="searchItem.terminalId" placeholder="请输入租户名称"></el-input>
        </el-form-item>
        <el-form-item label="所属机构">
          <el-select v-model="searchItem.status" :placeholder="orgArr.title">
            <el-option
              v-for="item in orgArr.options"
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
            class="userTable"
            @selection-change="getRowDatas"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" width="120" label="租户名称"></el-table-column>
            <el-table-column prop="orgId" label="所属机构"></el-table-column>
            <el-table-column prop="tenantId" label="租户级别"></el-table-column>
            <el-table-column prop="options" width="250" label="操作">
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
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
        <el-form-item label="租户名称" prop="name">
          <el-col :span="15">
            <el-input v-model="dialogForm.name" placeholder="请输入租户名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属机构" prop="orgId">
          <el-col :span="15">
            <el-select v-model="dialogForm.orgId" :placeholder="orgArr.title" style="width:100%">
              <el-option
                v-for="item in orgArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="租户级别" prop="tenantId">
          <el-col :span="15">
            <el-select v-model="dialogForm.tenantId" :placeholder="tenantArr.title" style="width:100%">
              <el-option
                v-for="item in tenantArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
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
  name: "userManage",
  data() {
    return {
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        name: "",
        orgId: ""
      },
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
      tableData: [
        {
          name: "租户1",
          orgId: "类型1",
          tenantId: "厂商1"
        },
        {
          name: "租户1",
          orgId: "类型1",
          tenantId: "厂商1"
        },
        {
          name: "租户1",
          orgId: "类型1",
          tenantId: "厂商1"
        },
        {
          name: "租户1",
          orgId: "类型1",
          tenantId: "厂商1"
        },
        {
          name: "租户1",
          orgId: "类型1",
          tenantId: "厂商1"
        },
        {
          name: "租户1",
          orgId: "类型1",
          tenantId: "厂商1"
        }
      ],
      dialogTitle: "新增",
      dialogFormVisible: false,
      dialogForm: {
        name: "",
        orgId: "",
        tenantId: ""
      },
      dialogRules: {
        name: [
          { required: true, message: "请输入租户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        orgId: [
          { required: true, message: "请选择所属机构", trigger: "change" }
        ],
        tenantId: [
          { required: true, message: "请选择租户级别", trigger: "change" }
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
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    editRow(row) {
        //获取当前数据内容
        // this.$axios.post('',{
        //   id:this.selectedRow[0].id,'
        // }).then((res)=>{
        //   this.search(page);
        // }).catch((err)=>{
        //   console.log(err);
        // });
        this.dialogTitle = "编辑租户";
        this.dialogForm = row;
        this.dialogFormVisible = true;
        // this.$axios.post('',{
        //   id:this.selectedRow[0].id,'
        // }).then((res)=>{
        //   this.search(page);
        // }).catch((err)=>{
        //   console.log(err);
        // });
    },
    delRow(row) {
        this.$confirm("是否确定删除该租户?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
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
