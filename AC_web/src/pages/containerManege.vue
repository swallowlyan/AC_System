<!--容器管理-->
<template>
  <div id="containerManage">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="容器名称" prop="name">
          <el-input v-model="searchItem.name" placeholder="请输入容器名称"></el-input>
        </el-form-item>
        <el-form-item label="容器类型" prop="type">
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
            <el-table-column prop="type" label="容器类型"></el-table-column>
            <el-table-column prop="vendor" label="开发商"></el-table-column>
            <el-table-column prop="version" label="容器版本"></el-table-column>
            <el-table-column prop="baseVersion" label="基础包版本"></el-table-column>
            <el-table-column prop="isIncrementPkg" label="是否升级包">
              <template slot-scope="scope">
                <span v-if="!scope.row.isIncrementPkg">否</span>
                <span v-if="scope.row.isIncrementPkg">是</span>
              </template>
            </el-table-column>
            <el-table-column prop="releaseTime" width="150" label="发布时间" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="description" width="150" label="说明"></el-table-column>
            <el-table-column prop="options" label="操作" width="180">
              <template slot-scope="scope">
                <!-- <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>-->
                <el-button @click="toInstallDialog(scope.row,false)" type="text" size="medium">安装</el-button>
                <el-button
                  @click="toInstallDialog(scope.row,true)"
                  type="text"
                  size="medium"
                >查询已安装设备</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="75%">
      <el-row v-show="!ifInstallDialog">
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
                <el-input v-model="dialogForm.containerId" placeholder="请输入容器ID"></el-input>
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
                <span v-if="ifDialogDetail">{{dialogForm.type}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.type" placeholder="请输入容器类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间" prop="releaseTime">
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
            <el-col :span="12">
              <el-form-item label="是否升级包" prop="isIncrementPkg">
                <span v-if="ifDialogDetail&&dialogForm.isIncrementPkg">是</span>
                <span v-if="ifDialogDetail&&(!dialogForm.isIncrementPkg)">否</span>
                <el-radio v-if="!ifDialogDetail" v-model="dialogForm.isIncrementPkg" label="false">否</el-radio>
                <el-radio v-if="!ifDialogDetail" v-model="dialogForm.isIncrementPkg" label="true">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开发商">
                <span v-if="ifDialogDetail">{{dialogForm.vendor}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.vendor" placeholder="请输入开发商"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="容器版本">
                <span v-if="ifDialogDetail">{{dialogForm.version}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.version" placeholder="请输入容器版本"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="基础版本">
                <span v-if="ifDialogDetail">{{dialogForm.baseVersion}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.baseVersion"
                  placeholder="请输入基础版本"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!ifDialogDetail">
            <el-col :span="12">
              <el-form-item label="容器url">
                <span v-if="ifDialogDetail">{{dialogForm.url}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.url" placeholder="请输入容器url"></el-input>
              </el-form-item>
            </el-col>
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
              <el-form-item label="最小内存(MB)">
                <span v-if="ifDialogDetail">{{dialogForm.minRamMB}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.minRamMB"
                  placeholder="请输入最小内存"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="占用Root盘大小(MB)">
                <span v-if="ifDialogDetail">{{dialogForm.minRootDiskMB}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.minRootDiskMB"
                  placeholder="请输入占用Root盘大小"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!ifDialogDetail">
            <el-col :span="24">
              <el-form-item label="图标url">
                <span v-if="ifDialogDetail">{{dialogForm.logo}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.logo" placeholder="请输入图标url"></el-input>
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
      <el-row v-show="ifInstallDialog">
        <el-col :span="18">
          <el-row style="max-height: 300px;overflow:auto;">
            <el-table
              ref="multipleTable"
              :data="deviceList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="deviceId" label="终端ID" width="200"></el-table-column>
              <el-table-column prop="name" label="终端名称"></el-table-column>
              <el-table-column prop="deviceType" label="设备类型"></el-table-column>
              <el-table-column prop="status" label="终端状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status===0" style="color:#67c23a">正常</span>
                  <span v-if="scope.row.status===1" style="color:orange">告警</span>
                  <span v-if="scope.row.status===2" style="color:red">故障</span>
                  <span v-if="scope.row.status===3" style="color:gray">离线</span>
                  <span v-if="scope.row.status===4" style="color:#000">未注册</span>
                </template>
              </el-table-column>
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
        </el-col>
        <el-col :span="5" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选设备</span>
            </div>
            <div>
              <ul>
                <li v-for="(item,index) in selectedDevices" :key="index">
                  {{item.deviceId}}——
                  {{item.name}}
                  <el-button type="text" @click="removeSelected(item)">
                    <i class="el-icon-close"></i>
                  </el-button>
                </li>
              </ul>
              <el-button
                v-show="ifGetInstalled"
                type="danger"
                plain
                icon="el-icon-delete"
                size="small"
                @click="unInstallContainer()"
              >卸载</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="!ifInstallDialog" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="!ifInstallDialog" type="primary" @click="submitForm('dialogForm')">确 定</el-button>
        <el-button
          v-show="ifInstallDialog&&!ifGetInstalled"
          type="primary"
          @click="installContainer()"
        >安 装</el-button>
        <el-button v-show="ifInstallDialog&&!ifGetInstalled" @click="dialogFormVisible = false">取 消</el-button>
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
        minRootDiskMB: "",
        description: "",
        releaseTime: "",
        baseVersion: ""
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
      ifInstallDialog: false,
      ifGetInstalled: false,
      currentContainer: {},
      deviceList: [],
      selectedDevices: [],
      deviceCurrentPage: 1,
      devicePageSize: 10,
      deviceTotal: 0,
      deviceParam: {
        current: 1,
        size: 5,
        sort: "id",
        dir: "asc"
      }
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
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
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    add(formName) {
      this.ifInstallDialog = false;
      this.dialogTitle = "新增容器";
      this.ifDialogDetail = false;
      this.dialogForm = {};
      this.dialogFormVisible = true;
    },
    detailRow(row) {
      this.ifInstallDialog = false;
      this.dialogTitle = "容器详细信息";
      this.ifDialogDetail = true;
      this.dialogForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    editRow(row) {
      this.ifInstallDialog = false;
      this.dialogTitle = "编辑终端";
      this.ifDialogDetail = false;
      this.dialogForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    delRow(row) {
      // if (this.selectedRow.length === 0) {
      //   this.$message({
      //     message: "请选择数据进行删除",
      //     type: "warning"
      //   });
      // } else {
      this.$confirm("是否确定删除     '" + row.name + "'     该容器?", "提示", {
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
          if (this.dialogTitle.indexOf("新增") > -1) {
            let addParam = {
              containerId: this.dialogForm.containerId,
              containerName: this.dialogForm.name,
              containerType: Number(this.dialogForm.type),
              isIncrementPkg: true,
              releaseTime: this.dialogForm.releaseTime,
              version: this.dialogForm.version,
              bseVersion: this.dialogForm.baseVersion,
              developer: this.dialogForm.vendor,
              url: this.dialogForm.url,
              description: this.dialogForm.description,
              logo: this.dialogForm.logo,
              fileSizeMB: Number(this.dialogForm.fileSizeMB),
              minVcpus: Number(this.dialogForm.minVcpus),
              minDataDiskMB: Number(this.dialogForm.minDataDiskMB),
              minRamMB: Number(this.dialogForm.minRamMB),
              minRootDiskMB: Number(this.dialogForm.minRootDiskMB)
            };
            if (this.dialogForm.isIncrementPkg === "false")
              addParam.isIncrementPkg = false;
            let config = {
              headers: {
                "Content-Type": "application/json"
              }
            };
            this.$axios
              .post(baseUrl + "/admin/containers/add", addParam, config)
              .then(res => {
                if (res.data.success) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  this.$refs[formName].resetFields();
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
          }
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
    },
    toInstallDialog(row, ifGetInstalled) {
      if (ifGetInstalled) this.dialogTitle = "已安装设备";
      else this.dialogTitle = "安装容器";
      this.ifGetInstalled = ifGetInstalled;
      this.currentContainer = Object.assign({}, row);
      this.deviceList=[];
      this.selectedDevices = [];
      this.ifInstallDialog = true;
      this.getDeviceDialog(1);
      this.dialogFormVisible = true;
    },
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
            {}
          )
          .then(res => {
            this.deviceTotal = res.data.data.totalRecord;
            this.deviceList = res.data.data.data;
            this.ifInstallDialog = true;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //查询已安装终端
        this.$axios
          .post(baseUrl + "" + this.devicePageSize + "&pageIndex=" + page, {})
          .then(res => {
            this.deviceTotal = res.data.data.totalRecord;
            this.deviceList = res.data.data.data;
            this.ifInstallDialog = true;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //安装
    installContainer() {
      let optionNameArr = "",
        paramList = [];
      if (this.selectedDevices.length > 0) {
        this.selectedDevices.forEach(item => {
          optionNameArr += item.name + ",";
          let param = {};
          param.containerInfo = {
            incrementPkg: this.currentContainer.incrementPkg,
            name: this.currentContainer.name,
            releaseTime: this.currentContainer.releaseTime,
            releaseUser: this.currentContainer.releaseUser,
            type: this.currentContainer.type,
            vendor: this.currentContainer.vendor,
            version: this.currentContainer.version
          };
          param.containerconfig = {
            containerName: this.currentContainer.name,
            description: this.currentContainer.description
          };
          param.deviceId = item.deviceId;
          paramList.push(param);
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
                { containerlist:paramList, update: true },
                { headers: { "Content-Type": "application/json" } }
              )
              .then(res => {
                if (res.data.success) {
                  this.$message({
                    type: "success",
                    message: "已完成安装"
                  });
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: "安装失败"
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
    },
    //卸载
    unInstallContainer() {
      let optionNameArr = "",paramList=[];
      if (this.selectedDevices.length > 0) {
        this.selectedDevices.forEach(item => {
          optionNameArr += item.name + ",";
          let param={
            containerNames: [this.currentContainer.name],
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
              .post(
                baseUrl + "/admin/containers/uninstall",
                { containers :paramList},
                { headers: { "Content-Type": "application/json" } }
              )
              .then(res => {
                if (res.data.success) {
                  this.$message({
                    type: "success",
                    message: "已完成卸载"
                  });
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: "卸载失败"
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
    handleSelectionChange(val) {
      this.selectedDevices = val;
    },
    removeSelected(val) {
      this.selectedDevices.forEach((item, index) => {
        if (item.name === val.name) {
          this.selectedDevices.splice(index, 1);
          this.$refs.multipleTable.toggleRowSelection(item, false);
          return false;
        }
      });
    },
    deviceSizeChange(val) {
      this.devicePageSize = val;
      this.getDeviceDialog(1);
    },
    deviceCurrentChange(val) {
      this.getDeviceDialog(val);
    },
    dateFormat(row, column, cellValue, index) {
      const daterc = row[column.property];
      if (daterc != null) {
        const dateMat = new Date(
          parseInt(daterc.replace("/Date(", "").replace(")/", ""), 10)
        );
        const year = dateMat.getFullYear();
        const month = dateMat.getMonth() + 1;
        const day = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        const timeFormat =
          year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss;
        return timeFormat;
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
</style>
