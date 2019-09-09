<!--微应用管理-->
<template>
  <div id="applicationManage">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="所属终端">
          <el-input v-model="searchItem.terminalId" placeholder="请输入终端ID"></el-input>
        </el-form-item>
        <el-form-item label="所属容器">
          <el-input v-model="searchItem.container" placeholder="请输入终端ID"></el-input>
        </el-form-item>
        <el-form-item label="应用状态">
          <el-select v-model="searchItem.status" :placeholder="statusArr.title">
            <el-option
              v-for="item in statusArr.options"
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
            class="applicationTable"
            @selection-change="getRowDatas"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" width="120" label="应用名">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="应用类型"></el-table-column>
            <el-table-column prop="factory" width="150" label="应用厂商"></el-table-column>
            <el-table-column prop="version" label="应用版本"></el-table-column>
            <el-table-column prop="createTime" width="120" label="发布时间"></el-table-column>
            <el-table-column prop="containerType" width="120" label="容器类型"></el-table-column>
            <el-table-column prop="containerVersion" label="容器版本"></el-table-column>
            <el-table-column prop="options" label="操作">
              <template slot-scope="scope">
                <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-button type="primary" round><i class="el-icon-upload"></i>同步容器</el-button>
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
        <el-col :span="24">
          <el-form-item label="应用名称" prop="name">
            <span v-if="ifDialogDetail">{{dialogForm.name}}</span>
            <el-input v-if="!ifDialogDetail" v-model="dialogForm.name" placeholder="请输入应用名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用类型" prop="type">
            <span v-if="ifDialogDetail">{{dialogForm.type}}</span>
            <el-select
              v-if="!ifDialogDetail"
              v-model="dialogForm.type"
              :placeholder="appTypeArr.title"
              style="width:100%"
            >
              <el-option
                v-for="item in appTypeArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用厂商" prop="factory">
            <span v-if="ifDialogDetail">{{dialogForm.factory}}</span>
            <el-input v-if="!ifDialogDetail" v-model="dialogForm.factory" placeholder="请输入应用厂商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用版本" prop="version">
            <span v-if="ifDialogDetail">{{dialogForm.version}}</span>
            <el-input v-if="!ifDialogDetail" v-model="dialogForm.version" placeholder="请输入应用版本"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="容器类型" prop="containerType">
            <span v-if="ifDialogDetail">{{dialogForm.containerType}}</span>
            <el-select
              v-if="!ifDialogDetail"
              v-model="dialogForm.containerType"
              placeholder="请选择容器类型"
              style="width:100%"
            >
              <el-option
                v-for="item in containerTypeArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="容器版本" prop="containerVersion">
            <span v-if="ifDialogDetail">{{dialogForm.containerVersion}}</span>
            <el-input
              v-if="!ifDialogDetail"
              v-model="dialogForm.containerVersion"
              placeholder="请输入容器版本"
            ></el-input>
          </el-form-item>
        </el-col>
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
        terminalId: "",
        container: "",
        status: ""
      },
      statusArr: {
        title: "请选择应用状态",
        options: [
          {
            value: "1",
            label: "在线"
          },
          {
            value: "0",
            label: "离线"
          }
        ]
      },
      appTypeArr: {
        title: "请选择应用类型",
        options: [
          {
            value: "1",
            label: "类型1"
          },
          {
            value: "2",
            label: "类型2"
          },
          {
            value: "3",
            label: "类型3"
          }
        ]
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
      tableData: [
        {
          name: "应用1",
          type: "类型1",
          factory: "厂商1",
          version: "1.0",
          createTime: "2019-08-10",
          containerType: "容器类型1",
          containerVersion: "1.0"
        },
        {
          name: "应用1",
          type: "类型1",
          factory: "厂商1",
          version: "1.0",
          createTime: "2019-08-10",
          containerType: "容器类型1",
          containerVersion: "1.0"
        },
        {
          name: "应用1",
          type: "类型1",
          factory: "厂商1",
          version: "1.0",
          createTime: "2019-08-10",
          containerType: "容器类型1",
          containerVersion: "1.0"
        },
        {
          name: "应用1",
          type: "类型1",
          factory: "厂商1",
          version: "1.0",
          createTime: "2019-08-10",
          containerType: "容器类型1",
          containerVersion: "1.0"
        },
        {
          name: "应用1",
          type: "类型1",
          factory: "厂商1",
          version: "1.0",
          createTime: "2019-08-10",
          containerType: "容器类型1",
          containerVersion: "1.0"
        },
        {
          name: "应用1",
          type: "类型1",
          factory: "厂商1",
          version: "1.0",
          createTime: "2019-08-10",
          containerType: "容器类型1",
          containerVersion: "1.0"
        }
      ],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogDetail: false,
      dialogForm: {
        name: "",
        type: "",
        factory: "",
        version: "",
        containerType: "",
        containerVersion: ""
      },
      dialogRules: {
        name: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择应用类型", trigger: "change" }
        ],
        factory: [
          { required: true, message: "请输入应用厂商", trigger: "change" }
        ],
        version: [
          { required: true, message: "请输入应用版本", trigger: "change" }
        ],
        containerType: [
          { required: true, message: "请输选择容器类型", trigger: "change" }
        ],
        containerVersion: [
          { required: true, message: "请输入容器版本", trigger: "change" }
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
      this.dialogTitle = "新增应用";
      this.ifDialogDetail = false;
      this.dialogForm = {};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    detailRow(row) {
      this.dialogTitle = "应用详细信息";
      this.ifDialogDetail = true;
      this.dialogForm = row;
      this.dialogFormVisible = true;
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
      this.dialogTitle = "编辑应用";
      this.dialogForm = row;
      this.ifDialogDetail = false;
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
      this.$confirm("是否确定删除该应用?", "提示", {
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
.applicationTable {
  max-height: 500px;
  overflow: auto;
}
</style>
