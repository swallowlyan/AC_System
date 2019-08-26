<!--容器管理-->
<template>
  <div id="containerManage">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="容器名称">
          <el-input v-model="searchItem.name" placeholder="请输入容器名称"></el-input>
        </el-form-item>
        <el-form-item label="适用终端">
          <el-select v-model="searchItem.terminalId" :placeholder="terminalArr.title">
            <el-option
              v-for="item in terminalArr.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容器状态">
          <el-select v-model="searchItem.status" :placeholder="statusArr.status">
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
            class="containerTable"
            @selection-change="getRowDatas"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="name" width="150" label="容器名称">
                  <template slot-scope="scope">
                    <el-button
                      @click="detailRow(scope.row)"
                      type="text"
                      size="medium"
                    >{{scope.row.name}}</el-button>
                  </template>
            </el-table-column>
            <el-table-column prop="version" label="版本"></el-table-column>
            <el-table-column prop="createTime" width="100" label="发布时间"></el-table-column>
            <el-table-column prop="factory" label="厂商"></el-table-column>
            <el-table-column prop="terminal" label="适用终端"></el-table-column>
            <el-table-column prop="status" label="容器状态"></el-table-column>
            <el-table-column prop="instructions" width="150" label="功能说明"></el-table-column>
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
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px" class="acForm">
        <el-col :span="24">
          <el-form-item label="容器名称" prop="name">
            <span v-if="ifDialogDetail">{{dialogForm.name}}</span>
            <el-input v-if="!ifDialogDetail" v-model="dialogForm.name" placeholder="请输入容器名称"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="容器版本" prop="version">
          <span v-if="ifDialogDetail">{{dialogForm.version}}</span>
            <el-input v-if="!ifDialogDetail" v-model="dialogForm.version" placeholder="请输入容器版本"></el-input>
        </el-form-item>
        </el-col>
        
        <el-col :span="24">
        <el-form-item label="厂商" prop="factory">
          <span v-if="ifDialogDetail">{{dialogForm.factory}}</span>
            <el-input v-if="!ifDialogDetail" v-model="dialogForm.factory" placeholder="请输入厂商"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="容器状态">
          <span v-if="ifDialogDetail">{{dialogForm.status}}</span>
          <el-radio v-if="!ifDialogDetail" v-model="dialogForm.status" label="0">离线</el-radio>
          <el-radio v-if="!ifDialogDetail" v-model="dialogForm.status" label="1">在线</el-radio>
        </el-form-item>
        </el-col>
        <el-col :span="24" style="height:100px">
        <el-form-item label="功能说明" class="lineHeight">
          <span v-if="ifDialogDetail">{{dialogForm.instructions}}</span>
          <el-input v-if="!ifDialogDetail" type="textarea" style="height:100px" v-model="dialogForm.instructions"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="适用终端" prop="terminal">
          <span v-if="ifDialogDetail">{{dialogForm.terminal}}</span>
            <el-select
             v-if="!ifDialogDetail"
              v-model="dialogForm.terminal"
              :placeholder="terminalArr.title"
              style="width:100%"
            >
              <el-option
                v-for="item in terminalArr.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
  name: "containerManage",
  data() {
    return {
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        name: "",
        terminalId: "",
        status: ""
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
      tableData: [
        {
          name: "MathCAD",
          version: "1.0",
          createTime: "2019-08-01",
          factory: "厂商1",
          terminal: "终端1",
          status: "在线",
          instructions: "测试用例"
        },
        {
          name: "MathCAD",
          version: "1.0",
          createTime: "2019-08-01",
          factory: "厂商1",
          terminal: "终端1",
          status: "在线",
          instructions: "测试用例"
        },
        {
          name: "MathCAD",
          version: "1.0",
          createTime: "2019-08-01",
          factory: "厂商1",
          terminal: "终端1",
          status: "在线",
          instructions: "测试用例"
        },
        {
          name: "MathCAD",
          version: "1.0",
          createTime: "2019-08-01",
          factory: "厂商1",
          terminal: "终端1",
          status: "在线",
          instructions: "测试用例"
        },
        {
          name: "MathCAD",
          version: "1.0",
          createTime: "2019-08-01",
          factory: "厂商1",
          terminal: "终端1",
          status: "在线",
          instructions: "测试用例"
        }
      ],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogDetail:false,
      dialogForm: {
        name: "",
        version: "",
        factory: "",
        terminal: "",
        status: "0",
        instructions: ""
      },
      dialogRules: {
        name: [
          { required: true, message: "请输入容器名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        version: [
          { required: true, message: "请选择容器版本", trigger: "change" }
        ],
        terminal: [
          { required: true, message: "请选择适用终端", trigger: "change" }
        ],
        factory: [{ required: true, message: "请输入厂商", trigger: "change" }]
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
      this.dialogTitle = "新增容器";
      this.ifDialogDetail=false;
      this.dialogForm = {};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    detailRow(row){
        this.dialogTitle = "容器详细信息";
        this.ifDialogDetail=true;
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
        this.ifDialogDetail=false;
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
.containerTable {
  max-height: 500px;
  overflow: auto;
}
</style>
