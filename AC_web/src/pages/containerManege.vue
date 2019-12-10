<!--容器管理-->
<template>
  <div id="containerManage">
    <el-form :model="searchItem" ref="searchItem" label-width="auto" class="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="容器名称" prop="name">
            <el-input v-model="searchItem.name" size="small" placeholder="请输入容器名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="容器类型" prop="type">
            <el-input v-model="searchItem.type" size="small" placeholder="请输入容器类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-button type="primary" @click="search(1)" size="small" style="background-color: #11a7b8;">查询</el-button>
          <el-button type="default" @click="reset('searchItem')" size="small">重置</el-button>
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
            class="containerTable"
            @selection-change="getRowDatas"
            :header-cell-style="tableHeaderColor"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->
            <el-table-column prop="name" align="center" width="130" label="容器名称">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="容器类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.type==='0'">华为</span>
                <span v-if="scope.row.type==='1'">智芯</span>
              </template>
            </el-table-column>
            <el-table-column prop="vendor" label="开发商" align="center"></el-table-column>
            <el-table-column prop="version" label="容器版本" align="center"></el-table-column>
            <el-table-column prop="isIncrementPkg" label="是否升级包" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.isIncrementPkg">否</span>
                <span v-if="scope.row.isIncrementPkg">是</span>
              </template>
            </el-table-column>
            <el-table-column prop="releaseTime" width="130" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="description" width="150" label="说明" align="center"></el-table-column>
            <el-table-column prop="options" label="操作" align="center" width="250">
              <template slot-scope="scope">
                <el-button @click="editRow(scope.row)" type="text" size="medium" >编辑</el-button>
                <el-button @click="toInstallDialog(scope.row,false)" type="text" size="medium">安装</el-button>
                <el-button @click="toInstallDialog(scope.row,true)" type="text" size="medium">查询设备</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
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
              >刷新</el-button>-->
              <el-button
                type="success"
                round
                size="small"
                icon="el-icon-plus"
                @click="add('dialogForm')"
              >新增</el-button>
            </el-button-group>
            <!-- <el-button type="primary" round size="small">
              <i class="el-icon-upload"></i>同步容器
            </el-button>-->
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :before-close="handleDialogClose"
      @close="initProps"
      width="85%"
    >
      <!-- 容器form -->
      <el-row v-show="!ifInstallDialog&&!urlSelectVisible">
        <el-form
          :model="dialogForm"
          :rules="dialogRules"
          ref="dialogForm"
          label-width="150px"
          class="acForm"
        >
          <el-row v-if="!ifDialogDetail">
            <el-col :span="12">
              <el-form-item label="容器ID" prop="containerId">
                <span v-if="ifDialogEdit">{{dialogForm.containerId}}</span>
                <el-input
                  v-if="!ifDialogEdit"
                  v-model="dialogForm.containerId"
                  placeholder="请输入容器ID"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="容器名称" prop="name">
                <el-input v-model="dialogForm.name" placeholder="请输入容器名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ifDialogDetail">
            <el-col :span="24">
              <el-form-item label="容器名称" prop="name">
                <span>{{dialogForm.name}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="容器类型" prop="type">
                <span v-if="ifDialogDetail&&dialogForm.type==='0'">华为</span>
                <span v-if="ifDialogDetail&&dialogForm.type==='1'">智芯</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.type" placeholder="请输入容器类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否升级包" prop="isIncrementPkg">
                <span v-if="ifDialogDetail&&dialogForm.isIncrementPkg">是</span>
                <span v-if="ifDialogDetail&&(!dialogForm.isIncrementPkg)">否</span>
                <el-radio v-if="!ifDialogDetail" v-model="dialogForm.isIncrementPkg" label="false">否</el-radio>
                <el-radio v-if="!ifDialogDetail" v-model="dialogForm.isIncrementPkg" label="true">是</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开发商">
                <span v-if="ifDialogDetail">{{dialogForm.vendor}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.vendor" placeholder="请输入开发商"></el-input>
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
              <el-form-item label="容器url">
                <span v-if="ifDialogDetail">{{dialogForm.url}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.url"
                  @focus="urlFocus($event,2)"
                  placeholder="请输入容器url"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标url">
                <span v-if="ifDialogDetail">{{dialogForm.logo}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.logo"
                  @focus="urlFocus($event,0)"
                  placeholder="请输入图标url"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
            <el-col :span="12">
              <el-form-item label="最小内存(MB)">
                <span v-if="ifDialogDetail">{{dialogForm.minRamMB}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.minRamMB"
                  placeholder="请输入最小内存"
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
              <el-form-item label="文件大小(MB)">
                <span v-if="ifDialogDetail">{{dialogForm.fileSizeMB}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.fileSizeMB"
                  placeholder="请输入文件大小"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发布时间">
                <span v-if="ifDialogDetail">{{dialogForm.releaseTime}}</span>
                <el-date-picker
                  v-model="dialogForm.releaseTime"
                  v-if="!ifDialogDetail"
                  type="datetime"
                  placeholder="请选择发布时间"
                  style="width:90%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
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
      </el-row>
      <!-- 安装设备List -->
      <el-row v-show="ifInstallDialog&&!urlSelectVisible">
        <el-col :span="15">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-divider direction="vertical"></el-divider>
              <span>设备库</span>
            </div>
            <div>
              <el-row style="max-height: 300px;overflow:auto;">
                <el-table
                  ref="deviceTable"
                  :data="deviceList"
                  tooltip-effect="dark"
                  border
                  style="width: 100%"
                  @select="rowChange"
                  @select-all="selecteAll"
                  :header-cell-style="tableHeaderColor"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="deviceId" label="终端ID" width="200"></el-table-column>
                  <el-table-column prop="name" label="终端名称" width="220"></el-table-column>
                  <el-table-column prop="status" label="终端状态">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status===1" style="color:#67c23a">正常</span>
                      <span v-if="scope.row.status===0" style="color:orange">未激活</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="ifGetInstalled"
                    prop="containerName"
                    label="容器实例名"
                    width="135"
                  ></el-table-column>
                </el-table>
              </el-row>
              <el-row style="text-align: center;margin-top:10px;">
                <el-pagination
                  @size-change="deviceSizeChange"
                  @current-change="deviceCurrentChange"
                  :current-page="deviceCurrentPage"
                  :page-sizes="[5, 10, 15]"
                  :page-size="devicePageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="deviceTotal"
                ></el-pagination>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-divider direction="vertical"></el-divider>
              <span>已选设备</span>
            </div>
            <div v-if="!ifGetInstalled">
              <label>容器实例名：</label>
              <el-input
                v-model="dialogForm.containerName"
                size="small"
                style="width: 70%;"
                placeholder="请输入容器实例名"
              ></el-input>
            </div>
            <div style="max-height:283px;overflow: auto;">
              <ul>
                <li v-for="(item,index) in multipleSelectionAll" :key="index">
                  <span v-if="!ifGetInstalled"><i class="el-icon-d-arrow-right"></i>{{item.deviceId}}——
                  {{item.name}}</span>
                  <span v-if="ifGetInstalled"><i class="el-icon-d-arrow-right"></i>{{item.name}}——
                  {{item.containerName}}</span>
                  <el-button type="text" @click="removeSelected(item)">
                    <i class="el-icon-close"></i>
                  </el-button>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 容器url选择 -->
      <el-row v-show="urlSelectVisible">
        <el-row style="max-height: 300px;overflow:auto;">
          <el-table :data="urlList" tooltip-effect="dark" style="width: 100%" class="urlTable"
          :header-cell-style="tableHeaderColor">
            <el-table-column prop="fileName" label="名称" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="selectUrlOption(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.fileName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="fileType" label="类型" v-if="false"></el-table-column>
            <el-table-column prop="fileUrl" label="URL" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.fileType===0" :src="scope.row.fileUrl" height="30" width="30" />
                <span v-if="scope.row.fileType!==0">{{scope.row.fileUrl}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="text-align: center;margin-top:10px;">
          <el-pagination
            @size-change="urlSizeChange"
            @current-change="urlCurrentChange"
            :current-page="urlCurrentPage"
            :page-sizes="[5, 10, 15]"
            :page-size="urlPageSize"
            layout="total, prev, pager, next, jumper"
            :total="urlTotal"
          ></el-pagination>
        </el-row>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <!-- 新增/编辑footer -->
        <el-button
          v-show="!ifInstallDialog&&!ifDialogDetail&&!urlSelectVisible"
          type="primary"
          @click="submitForm('dialogForm')"
        >保 存</el-button>
        <el-button
          v-show="!ifInstallDialog&&!ifDialogDetail&&!urlSelectVisible"
          @click="dialogFormVisible = false"
        >取 消</el-button>
        <!-- url-footer -->
        <el-button v-show="urlSelectVisible" @click="backForm()">返 回</el-button>
        <!-- 安装footer -->
        <el-button
          v-show="ifInstallDialog&&!ifGetInstalled"
          type="primary"
          @click="installContainer()"
        >安 装</el-button>
        <el-button v-show="ifInstallDialog&&!ifGetInstalled" @click="dialogFormVisible = false">取 消</el-button>
        <!-- 详情footer -->
        <el-button v-show="ifDialogDetail" @click="dialogFormVisible = false">关 闭</el-button>
        <!-- 卸载footer -->
        <el-button v-show="ifGetInstalled" type="danger" plain @click="unInstallContainer()">卸载</el-button>
        <el-button v-show="ifGetInstalled" @click="dialogFormVisible = false">取 消</el-button>
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
      currentPage: 1,
      selectedRow: [],
      searchItem: {
        name: "",
        type: ""
      },
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogDetail: false,
      dialogForm: {
        containerId: "",
        name: "",
        type: "",
        vendor: "",
        isIncrementPkg: "",
        version: "",
        url: "",
        fileSizeMB: "",
        logo: "",
        minVcpus: "",
        minDataDiskMB: "",
        minRamMB: "",
        description: "",
        releaseTime: "",
        containerName: ""
      },
      dialogRules: {
        containerId: [
          { required: true, message: "请输入容器ID", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入容器名称", trigger: "blur" }],
        type: [{ required: true, message: "请输入容器类型", trigger: "blur" }],
        releaseTime: [
          { required: true, message: "请选择发布时间", trigger: "blur" }
        ],
        isIncrementPkg: [
          { required: true, message: "请选择是否升级", trigger: "change" }
        ]
      },
      ifDialogEdit: false,
      ifInstallDialog: false,
      ifGetInstalled: false,
      currentContainer: {},
      deviceList: [],
      deviceCurrentPage: 1,
      devicePageSize: 10,
      deviceTotal: 0,
      deviceParam: {
        current: 1,
        size: 5,
        sort: "id",
        dir: "asc"
      },
      urlSelectVisible: false,
      currentUrlType: "",
      urlList: [
        { name: "test", url: 123123, logo: "testlogo" },
        { name: "test1", url: 233333, logo: "testlogo1" }
      ],
      urlCurrentPage: 1,
      urlPageSize: 10,
      urlTotal: 0,
      /////////////////////////////////////////////////////////////
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "deviceId"
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
    //查询容器
    search(page) {
      let condition = {};
      condition.name = this.searchItem.name;
      condition.type = this.searchItem.type;
      this.$axios
        .post(
          baseUrl +
            "/admin/containers/files?pageIndex=" +
            page +
            "&pageSize=" +
            this.tableLimit,
          condition
        )
        .then(res => {
          this.currentPage = page;
          this.tableSize = res.data.totalRecord;
          if (res.data.data !== null && res.data.data.length > 0) {
            res.data.data.forEach(item => {
              Object.keys(item.containerFiles[0]).forEach(key => {
                item[key] = item.containerFiles[0][key];
              });
            });
            this.tableData = res.data.data;
          } else {
            this.tableData = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //重置
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    //关闭dialog还原属性
    initProps() {
      this.ifInstallDialog = false;
      this.ifDialogDetail = false;
      this.ifDialogEdit = false;
      this.ifInstallDialog = false;
      this.ifGetInstalled = false;
      this.urlSelectVisible = false;
      (this.multipleSelection = []), (this.multipleSelectionAll = []);
    },
    //监听"x"操作
    handleDialogClose() {
      if (this.urlSelectVisible) {
        //url选择的返回事件
        if (this.ifDialogEdit) this.dialogTitle = "编辑容器";
        else this.dialogTitle = "新增容器";
        this.urlSelectVisible = false;
        return false;
      } else {
        this.dialogFormVisible = false;
      }
    },
    backForm() {
      if (this.ifDialogEdit) this.dialogTitle = "编辑容器";
      else this.dialogTitle = "新增容器";
      this.urlSelectVisible = false;
    },
    //新增dialog
    add(formName) {
      this.dialogTitle = "新增容器";
      this.dialogForm = {};
      this.dialogFormVisible = true;
    },
    //详情dialog
    detailRow(row) {
      this.dialogTitle = "容器详细信息";
      this.ifDialogDetail = true;
      this.dialogForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    //编辑dialog
    editRow(row) {
      this.dialogTitle = "编辑容器";
      this.ifDialogEdit = true;
      this.dialogForm = Object.assign({}, row);
      this.dialogForm.logo = "";
      this.dialogFormVisible = true;
    },
    //删除容器
    delRow(row) {
      this.$confirm("是否确定删除容器——'" + row.name + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.$axios
            .delete(
              baseUrl +
                "/admin/containers/delete?containerId=" +
                row.containerId
            )
            .then(res => {
              if (res.data.errcode === "0") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.search(1);
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败," + res.data.errmsg
                });
              }
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
    //提交新增/编辑
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            containerId: this.dialogForm.containerId,
            containerName: this.dialogForm.name,
            containerType: Number(this.dialogForm.type),
            isIncrementPkg: true,
            releaseTime: this.dialogForm.releaseTime,
            version: this.dialogForm.version,
            developer: this.dialogForm.vendor,
            url: this.dialogForm.url,
            description: this.dialogForm.description,
            logo: this.dialogForm.logo,
            fileSizeMB: Number(this.dialogForm.fileSizeMB),
            minVcpus: Number(this.dialogForm.minVcpus),
            minDataDiskMB: Number(this.dialogForm.minDataDiskMB),
            minRamMB: Number(this.dialogForm.minRamMB),
            minRootDiskMB: 0
          };
          if (this.dialogForm.isIncrementPkg === "false")
            param.isIncrementPkg = false;
          let config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
          if (this.dialogTitle.indexOf("新增") > -1) {
            this.$axios
              .post(baseUrl + "/admin/containers/add", param, config)
              .then(res => {
                if (res.data.errcode === "0") {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  this.search(1);
                } else {
                  this.$message({
                    message: res.data.errmsg,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
          //编辑
          else {
            this.$axios
              .put(baseUrl + "/admin/containers/edit", param, config)
              .then(res => {
                if (res.data.errcode === "0") {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  this.search(1);
                } else {
                  this.$message({
                    message: res.data.errmsg,
                    type: "error"
                  });
                }
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
    //容器列表分页操作
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    },
    //安装dialog
    toInstallDialog(row, ifGetInstalled) {
      if (ifGetInstalled) this.dialogTitle = "已安装设备";
      else this.dialogTitle = "安装容器";
      this.ifGetInstalled = ifGetInstalled;
      this.dialogForm.containerName = row.name;
      this.currentContainer = Object.assign({}, row);
      this.deviceList = [];
      this.multipleSelectionAll = [];
      this.ifInstallDialog = true;
      this.getDeviceDialog(1);
      this.dialogFormVisible = true;
    },
    //安装
    installContainer() {
      if (this.dialogForm.containerName === "") {
        this.$message({
          type: "warning",
          message: "请填写容器实例名,进行安装"
        });
      } else {
        let optionNameArr = "",
          paramList = [];
        if (this.multipleSelectionAll.length > 0) {
          this.multipleSelectionAll.forEach(item => {
            optionNameArr += item.name + ",";
            let m = {
              containerInfo: {
                incrementPkg: this.currentContainer.incrementPkg,
                name: this.currentContainer.name,
                releaseTime: this.currentContainer.releaseTime,
                releaseUser: this.currentContainer.releaseUser,
                type: this.currentContainer.type,
                vendor: this.currentContainer.vendor,
                version: this.currentContainer.version
              },
              containerconfig: {
                containerName: this.dialogForm.containerName,
                cpuCores: 0,
                description: this.currentContainer.description,
                diskSizeMB: 0,
                memoryMB: 0,
                openServices: "",
                physicalInterfaces: "",
                volumeSizeMB: 0
              },
              deviceId: item.deviceId
            };
            paramList.push(m);
          });
          this.$confirm(
            "是否确定在设备——'" +
              optionNameArr +
              "'中安装容器'" +
              this.currentContainer.name +
              "'?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$axios
                .post(
                  baseUrl + "/admin/containers/deploy",
                  { containerlist: paramList, update: false },
                  { headers: { "Content-Type": "application/json" } }
                )
                .then(res => {
                  if (res.data.errcode === "0") {
                    this.$message({
                      type: "success",
                      message: "已完成安装"
                    });
                    this.multipleSelectionAll = [];
                    this.dialogFormVisible = false;
                  } else {
                    this.$message({
                      type: "error",
                      message: "安装失败," + res.data.errmsg
                    });
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消安装"
              });
            });
        } else {
          this.$message({
            message: "请选择设备进行安装",
            type: "warning"
          });
        }
      }
    },
    //卸载
    unInstallContainer() {
      let optionNameArr = "",
        paramList = [];
      if (this.multipleSelectionAll.length > 0) {
        this.multipleSelectionAll.forEach(item => {
          optionNameArr += item.name + ",";
          let param = {
            containerNames: [item.containerName],
            deviceId: item.deviceId
          };
          paramList.push(param);
        });
        this.$confirm(
          "是否确定卸载设备——'" +
            optionNameArr +
            "'中的容器'" +
            this.currentContainer.name +
            "'?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$axios
              .post(baseUrl + "/admin/containers/uninstall", paramList, {
                headers: { "Content-Type": "application/json" }
              })
              .then(res => {
                if (res.data.errcode === "0") {
                  this.$message({
                    type: "success",
                    message: "已完成卸载"
                  });
                  this.multipleSelectionAll = [];
                  this.getDeviceDialog(1);
                  // this.dialogFormVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: "卸载失败," + res.data.errmsg
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消卸载"
            });
          });
      } else {
        this.$message({
          message: "请选择设备进行卸载",
          type: "warning"
        });
      }
    },
    ////////////////////////////////////////
    //获取设备
    getDeviceDialog(page) {
      if (!this.ifGetInstalled) {
        //查询可安装终端
        this.$axios
          .post(
            baseUrl +
              "/admin/terminal/devices/info?pageSize=" +
              this.devicePageSize +
              "&pageIndex=" +
              page,
            { status: 1 }
          )
          .then(res => {
            setTimeout(() => {
              this.setSelectRow();
            }, 200);
            this.deviceTotal = res.data.data.totalRecord;
            this.deviceList = res.data.data.data;
            this.ifInstallDialog = true;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //查询已安装设备
        this.$axios
          .post(
            baseUrl +
              "/admin/containers/containerdeployinfo" +
              "?containerDeployStatus=1&deviceSort=" +
              "" +
              "&pageSize=" +
              this.devicePageSize +
              "&pageIndex=" +
              page +
              "&name=" +
              this.currentContainer.name,
            {}
          )
          .then(res => {
            setTimeout(() => {
              this.setSelectRow();
            }, 200);
            if (
              res.data.data.devices !== null &&
              res.data.data.devices.length > 0
            ) {
              this.deviceList = [];
              res.data.data.devices.forEach(item => {
                if (item.containerDeployStatus.deployStatus === 1) {
                  item.deviceQueryResult.containerName =
                    item.containerConfig.containerName;
                  this.deviceList.push(item.deviceQueryResult);
                }
              });
            }
            this.deviceTotal = res.data.data.totalRecord;
            this.ifInstallDialog = true;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 设置选中的方法
    setSelectRow() {
      this.multipleSelection = [];
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.deviceTable.clearSelection();
      for (var i = 0; i < this.deviceList.length; i++) {
        if (selectAllIds.indexOf(this.deviceList[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="deviceTable"
          this.$refs.deviceTable.toggleRowSelection(this.deviceList[i], true);
          this.multipleSelection.push(this.deviceList[i]);
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = Object.assign([], this.multipleSelection);
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.deviceList.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
      console.info(this.multipleSelectionAll);
    },
    //当页选择设备操作
    rowChange(rows, row) {
      this.multipleSelection = Object.assign([], rows);
      let selected = rows.length && rows.indexOf(row) !== -1;
      if (this.multipleSelectionAll.length === 0)
        this.multipleSelectionAll = Object.assign([], rows);
      else {
        if (selected) {
          //新增选中
          this.multipleSelectionAll.push(row);
        } else {
          //取消选中
          this.multipleSelectionAll.forEach((item, index) => {
            if (item.deviceId === row.deviceId) {
              this.multipleSelectionAll.splice(index, 1);
              return false;
            }
          });
        }
      }
    },
    handleSelectionChange(val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val;
    },
    //全选
    selecteAll(rows) {
      let that = this;
      if (rows.length > 0) {
        //当前页全选
        if (that.multipleSelectionAll.length === 0)
          that.multipleSelectionAll = Object.assign([], rows);
        else {
          rows.forEach((row, rowIndex) => {
            if (that.multipleSelectionAll.indexOf(row) < 0)
              that.multipleSelectionAll.push(row);
          });
        }
        that.multipleSelection = Object.assign([], rows);
      } else {
        //当前页全部取消
        that.multipleSelection.forEach((item, index) => {
          that.multipleSelectionAll.forEach((m, i) => {
            if (item[this.idKey] === m[this.idKey])
              that.multipleSelectionAll.splice(i, 1);
          });
        });
        that.multipleSelection = [];
      }
    },
    //移除已选设备
    removeSelected(val) {
      let delParam = {};
      this.multipleSelectionAll.forEach((item, index) => {
        if (item.deviceId === val.deviceId) {
          this.multipleSelectionAll.splice(index, 1);
          delParam = Object.assign({}, item);
        }
      });
      this.multipleSelection.forEach((item, index) => {
        if (delParam.deviceId === item.deviceId) {
          this.$refs.deviceTable.toggleRowSelection(item, false);
          this.multipleSelection.splice(index, 1);
        }
      });
    },
    //设备列表操作
    deviceSizeChange(val) {
      this.changePageCoreRecordData();
      this.devicePageSize = val;
      this.getDeviceDialog(1);
    },
    deviceCurrentChange(val) {
      this.changePageCoreRecordData();
      this.getDeviceDialog(val);
    },
    // 得到选中的所有数据
    getAllSelectionData() {
      // 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
      this.changePageCoreRecordData();
      console.log(this.multipleSelectionAll);
    },
    ////////////////////////////////////////////////
    //容器url-dialog
    urlFocus(event, type) {
      console.info(event);
      if (type === 2) {
        this.dialogTitle = "容器url";
      } else {
        this.dialogTitle = "图标url";
      }
      this.currentUrlType = type;
      this.getUrls(1);
    },
    //获取Url
    getUrls(page) {
      this.$axios
        .get(
          baseUrl +
            "/admin/file/list?pageSize=" +
            this.urlPageSize +
            "&pageIndex=" +
            page +
            "&fileType=" +
            this.currentUrlType
        )
        .then(res => {
          this.urlTotal = res.data.data.total;
          this.urlList = res.data.data.records;
          this.urlSelectVisible = true;
          return false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //容器url选中
    selectUrlOption(row) {
      if (this.currentUrlType === 2) this.dialogForm.url = row.fileUrl;
      else this.dialogForm.logo = row.fileUrl;
      if (this.ifDialogEdit) this.dialogTitle = "编辑容器";
      else this.dialogTitle = "新增容器";
      this.urlSelectVisible = false;
    },
    //容器url列表分页
    urlSizeChange(val) {
      this.urlPageSize = val;
      this.getUrls(1);
    },
    urlCurrentChange(val) {
      this.getUrls(val);
    },
    //////////////////////////////////////////////////////
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "color: #353B40;font-weight: bold;background: #f5fafa;padding: 5px 0;";
      }
    }
  }
};
</script>

<style scoped>
.containerTable {
  max-height: 500px;
  overflow: auto;
}
.containerTable .el-button--text,.deviceTable .el-button--text,.urlTable .el-button--text{
  color: #11a7b8;
}
.el-card__body span{
  font-size: 12px;
}
</style>
