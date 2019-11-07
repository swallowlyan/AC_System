<!--微应用管理-->
<template>
  <div id="applicationManage">
    <el-form :model="searchItem" ref="searchItem" label-width="auto" class="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="微应用名称" prop="name">
            <el-input v-model="searchItem.name" placeholder="请输入微应用名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="微应用类型" prop="type">
            <el-select v-model="searchItem.type" :placeholder="appTypeArr.title">
              <el-option
                v-for="item in appTypeArr.options"
                :key="item.ItemCode"
                :label="item.ItemName"
                :value="item.ItemCode"
              ></el-option>
            </el-select>
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
            class="applicationTable"
            @selection-change="getRowDatas"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="appId" width="120" label="微应用ID" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.appId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="appName" width="120" label="微应用名" align="center"></el-table-column>
            <el-table-column prop="appType" label="微应用类型" align="center"></el-table-column>
            <el-table-column prop="vendor" width="120" label="应用厂商" align="center"></el-table-column>
            <el-table-column prop="version" label="微应用版本" align="center"></el-table-column>
            <el-table-column prop="appReleaseTime" width="130" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="containerType" label="容器类型" align="center"></el-table-column>
            <el-table-column prop="containerVersion" label="容器版本" align="center"></el-table-column>
            <el-table-column prop="options" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <!-- <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</!-->
                <el-button @click="toInstallDialog(scope.row,false)" type="text" size="medium">安装</el-button>
                <el-button @click="toInstallDialog(scope.row,true)" type="text" size="medium">查询设备</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-button
              type="primary"
              round
              icon="el-icon-plus"
              size="small"
              @click="add('dialogForm')"
            >新增</el-button>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :before-close="handleDialogClose"
      @close="initProps"
      width="85%"
    >
      <!-- 微应用form -->
      <el-row v-show="!ifInstallDialog&&!urlSelectVisible">
        <el-form
          :model="dialogForm"
          :rules="dialogRules"
          ref="dialogForm"
          label-width="150px"
          class="acForm"
        >
          <el-row>
            <!-- <el-col :span="12">
            <el-form-item label="微应用ID" prop="appId">
              <span v-if="ifDialogDetail">{{dialogForm.appId}}</span>
              <el-input v-if="!ifDialogDetail" v-model="dialogForm.appId" placeholder="请输入微应用ID"></el-input>
            </el-form-item>
            </el-col>-->
            <el-col :span="12">
              <el-form-item label="微应用名称" prop="appName">
                <span v-if="ifDialogDetail">{{dialogForm.appName}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.appName"
                  placeholder="请输入微应用名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微应用类型" prop="appType">
                <span v-if="ifDialogDetail">{{dialogForm.appType}}</span>
                <el-select
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.appType"
                  :placeholder="appTypeArr.title"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in appTypeArr.options"
                    :key="item.ItemCode"
                    :label="item.ItemName"
                    :value="item.ItemCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用中心微应用名称" prop="appStoreId">
                <span v-if="ifDialogDetail">{{dialogForm.appStoreId}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.appStoreId"
                  placeholder="请输入应用中心微应用名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微应用版本">
                <span v-if="ifDialogDetail">{{dialogForm.version}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.version" placeholder="请输入应用版本"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用厂商">
                <span v-if="ifDialogDetail">{{dialogForm.vendor}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.vendor" placeholder="请输入应用厂商"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间">
                <span v-if="ifDialogDetail">{{dialogForm.appReleaseTime}}</span>
                <el-date-picker
                  v-model="dialogForm.appReleaseTime"
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
                <span v-if="ifDialogDetail">{{dialogForm.containerVersion}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.containerVersion"
                  placeholder="请输入容器版本"
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
              <el-form-item label="应用url">
                <span v-if="ifDialogDetail">{{dialogForm.downloadURL}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  @focus="urlFocus($event,1)"
                  v-model="dialogForm.downloadURL"
                  placeholder="请输入应用url"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
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
        </el-form>
      </el-row>
      <!-- 安装dialog -->
      <el-row v-show="ifInstallDialog&&!urlSelectVisible">
        <el-col :span="15">
          <el-row style="max-height: 300px;overflow:auto;">
            <el-table
              ref="deviceTable"
              :data="deviceList"
              tooltip-effect="dark"
              style="width: 100%"
              @select="rowChange"
              @select-all="selecteAll"
              row-key="deviceId"
              border
              lazy
              :load="load"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="deviceId" label="终端ID" width="250"></el-table-column>
              <el-table-column prop="name" label="名称" width="100"></el-table-column>
              <el-table-column v-if="ifGetInstalled" prop="containerName" label="容器名称"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="status" label="状态">
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
        <el-col :span="8" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选容器</span>
            </div>
            <div style="max-height:300px;overflow: auto;">
              <ul>
                <li v-for="(item,index) in multipleSelectionAll" :key="index">
                  {{item.name}}
                  <el-button type="text" @click="removeSelected(item)">
                    <i class="el-icon-close"></i>
                  </el-button>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 应用Url选择 -->
      <el-row v-show="urlSelectVisible">
        <el-row style="max-height: 300px;overflow:auto;">
          <el-table :data="urlList" tooltip-effect="dark" style="width: 100%">
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
        <!-- url footer -->
        <el-button
          v-show="urlSelectVisible"
          @click="dialogTitle = '新增微应用',urlSelectVisible = false"
        >返 回</el-button>
        <!-- 安装footer -->
        <el-button
          v-show="ifInstallDialog&&!ifGetInstalled"
          type="primary"
          @click="installApp()"
        >安 装</el-button>
        <el-button v-show="ifInstallDialog&&!ifGetInstalled" @click="dialogFormVisible = false">取 消</el-button>
        <!-- 详情footer -->
        <el-button v-show="ifDialogDetail" @click="dialogFormVisible = false">关 闭</el-button>
        <!-- 卸载footer -->
        <el-button v-show="ifGetInstalled" type="danger" plain @click="unInstallApplication()">卸载</el-button>
        <el-button v-show="ifGetInstalled" @click="dialogFormVisible = false">取 消</el-button>
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
        name: "",
        type: ""
      },
      appTypeArr: {
        title: "微应用类型",
        options: []
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
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogDetail: false,
      dialogForm: {
        appName: "",
        appType: "",
        appReleaseTime: "",
        vendor: "",
        version: "",
        containerType: "",
        containerVersion: "",
        downloadURL: "",
        fileSizeMB: "",
        logo: ""
      },
      dialogRules: {
        appId: [
          { required: true, message: "请输入微应用ID", trigger: "change" }
        ],
        appName: [
          { required: true, message: "请输入微应用名称", trigger: "blur" }
        ],
        appType: [
          { required: true, message: "请选择微应用类型", trigger: "change" }
        ],
        appStoreId: [
          {
            required: true,
            message: "请输入应用中心微应用名称 ",
            trigger: "change"
          }
        ]
      },
      ifInstallDialog: false,
      ifGetInstalled: false,
      deviceList: [],
      deviceCurrentPage: 1,
      devicePageSize: 10,
      deviceTotal: 0,
      containerArr: [],
      urlSelectVisible: false,
      currentUrlType: "",
      urlList: [
        { name: "test", url: 123123, logo: "testlogo" },
        { name: "test1", url: 233333, logo: "testlogo1" }
      ],
      urlCurrentPage: 1,
      urlPageSize: 10,
      urlTotal: 0,
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "deviceId"
    };
  },
  mounted() {
    this.getAddDialogType();
    this.search(1);
  },
  methods: {
    //获取微应用分类
    getAddDialogType() {
      this.$axios
        .post(baseUrl + "/admin/app/getAllTypes")
        .then(res => {
          if (res.data.success) {
            this.appTypeArr.options = res.data.data;
            this.appTypeArr.options.push({ ItemCode: "", ItemName: "全部" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //微应用列表
    search(page) {
      let param = {};
      Object.keys(this.searchItem).forEach(item => {
        if (this.searchItem[item] !== "") param[item] = this.searchItem[item];
      });
      this.$axios
        .post(
          baseUrl +
            "/admin/app/files?" +
            "pageIndex=" +
            page +
            "&pageSize=" +
            this.tableLimit,
          param
          // {headers: {"Content-Type": "application/json"}}
        )
        .then(res => {
          this.tableSize = res.data.data.total;
          this.tableData = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //搜索重置
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    //关闭dialog还原属性
    initProps() {
      this.ifInstallDialog=false;
      this.ifGetInstalled=false;
      this.ifDialogDetail=false;
    },
    //监听"x"操作
    handleDialogClose() {
      if (this.urlSelectVisible) {
        //url选择的返回事件
        this.dialogTitle = "新增微应用";
        this.urlSelectVisible = false;
        return false;
      } else {
        this.dialogFormVisible = false;
      }
    },
    //新增dialog
    add(formName) {
      this.dialogTitle = "新增微应用";
      this.ifDialogDetail = false;
      this.ifInstallDialog = false;
      this.dialogForm = {};
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields();
      // });
    },
    //详情dialog
    detailRow(row) {
      this.$nextTick(() => {
        this.$refs["dialogForm"].resetFields();
      });
      this.dialogTitle = "微应用详细信息";
      this.ifDialogDetail = true;
      this.ifInstallDialog = false;
      this.dialogForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    //编辑dialog
    editRow(row) {
      this.dialogTitle = "编辑微应用";
      this.dialogForm = Object.assign({}, row);
      this.ifDialogDetail = false;
      this.ifInstallDialog = false;
      this.dialogFormVisible = true;
    },
    //删除dialog
    delRow(row) {
      this.$confirm(
        "是否确定删除     '" + row.appName + "'     该微应用?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$axios
            .post(baseUrl + "/admin/app/delete?appId=" + row.appId)
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
    //新增/编辑提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(baseUrl + "/admin/app/add", this.dialogForm)
            .then(res => {
              this.dialogFormVisible = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.search(1);
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
    //微应用列表分页
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
      this.currentApp = Object.assign({}, row);
      this.deviceList = [];
      this.multipleSelectionAll = [];
      this.ifDialogDetail = false;
      this.ifInstallDialog = true;
      this.getDeviceDialog(1);
      this.dialogFormVisible = true;
    },
    //选择设备
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
            this.deviceList = [];
            if (res.data.data.data.length > 0) {
              res.data.data.data.forEach(item => {
                item.hasChildren = true;
                item.type = item.deviceType;
                this.deviceList.push(item);
              });
              this.deviceTotal = res.data.data.totalRecord;
              this.ifInstallDialog = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //设备-加载容器
    load(tree, treeNode, resolve) {
      let childList = [];
      this.$axios
        .post(
          baseUrl +
            "/admin/containers/devicedeploystatus?deviceId=" +
            tree.deviceId
        )
        .then(res => {
          if (res.data.errcode === "0") {
            if (res.data.data !== null && res.data.data.length > 0) {
              this.dialogForm.containerArr = [];
              res.data.data.forEach((item, index) => {
                let child = {
                  deviceId: tree.deviceId + "——容器" + (index + 1),
                  name: item.containerInfo.name,
                  type: item.containerInfo.type,
                  parentId: tree.deviceId
                };
                childList.push(child);
              });
              if (this.containerArr.length === 0)
                this.containerArr = Object.assign([], childList);
              else this.containerArr.concat(childList);
              resolve(childList);
            }
          } else {
            this.$message({
              message: "无安装信息，请重新选择",
              type: "error"
            });
            resolve(childList);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //安装
    installApp() {
      let optionNameArr = "",
        paramList = [];
      paramList = [];
      if (this.multipleSelectionAll.length > 0) {
        this.multipleSelectionAll.forEach(item => {
          optionNameArr += item.name + ",";
        });
        this.$confirm(
          "是否确定在容器——'" +
            optionNameArr +
            "'中安装应用'" +
            this.currentApp.appName +
            "'?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.multipleSelectionAll.forEach(item => {
              let m = {
                containerName: item.name,
                deviceId: item.parentId,
                name: this.currentApp.appName,
                operateType: 0,
                type: this.currentApp.appType,
                vendor: this.currentApp.vendor,
                version: this.currentApp.version
              };
              paramList.push(m);
            });
            this.$axios
              .post(baseUrl + "/admin/app/deploy?isUpdate=false", paramList, {
                headers: {
                  "Content-Type": "application/json"
                }
              })
              .then(res => {
                if (res.data.errcode === "0") {
                  this.$message({
                    message: "命令发送成功",
                    type: "success"
                  });
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    message: "安装失败  " + res.data.errmsg,
                    type: "error"
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
    unInstallApplication() {
      let optionNameArr = "",
        paramList = [];
        if (this.selectedDevices.length > 0) {
        this.selectedDevices.forEach(item => {
          optionNameArr += item.name + ",";
          let param = {
            appNames:[this.currentApp.name],
            containerNames: item.containerNames,
            deviceId: item.deviceId
          };
          paramList.push(param);
        });
        this.$confirm(
          "是否确定卸载设备——'" +
            optionNameArr +
            "'中的应用'" +
            this.currentApp.name +
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
              .post(baseUrl + "/admin/app/uninstall", paramList, {
                headers: { "Content-Type": "application/json" }
              })
              .then(res => {
                if (res.data.errcode === "0") {
                  this.$message({
                    type: "success",
                    message: "已完成卸载"
                  });
                  this.getDeviceDialog(1);
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
            {}
          )
          .then(res => {
            setTimeout(() => {
              this.setSelectRow();
            }, 200);
            this.deviceList = [];
            if (res.data.data.data.length > 0) {
              res.data.data.data.forEach(item => {
                item.hasChildren = true;
                item.type = item.deviceType;
                item.children = [];
                this.deviceList.push(item);
              });
              this.deviceTotal = res.data.data.totalRecord;
              this.ifInstallDialog = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //查询已安装设备
        this.$axios
          .post(
            baseUrl +
              "" +
              "" +
              "&pageSize=" +
              this.devicePageSize +
              "&pageIndex=" +
              page +
              "&name=" +
              this.currentApp.name,
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
                if (item.containerDeployStatus.deployStatus === 1)
                  this.deviceList.push(item.deviceQueryResult);
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
      if (this.containerArr.length > 0) {
        for (var i = 0; i < this.containerArr.length; i++) {
          if (selectAllIds.indexOf(this.containerArr[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="deviceTable"
            this.$refs.deviceTable.toggleRowSelection(
              this.containerArr[i],
              true
            );
            this.multipleSelection.push(this.containerArr[i]);
          }
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
      if (this.containerArr.length > 0) {
        this.containerArr.forEach(row => {
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
      }
      console.info(this.multipleSelectionAll);
    },
    //当页选择设备操作
    rowChange(rows, row) {
      if (Object.keys(row).length < 5) {
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
      } else {
        rows.forEach((item, index) => {
          if (row.deviceId === item.deviceId) {
            this.$refs.deviceTable.toggleRowSelection(item, false);
            rows.splice(index, 1);
          }
        });
        this.$message({
          type: "warning",
          message: "请选择容器进行操作"
        });
      }
    },
    handleSelectionChange(val) {
      // table组件选中事件,记得加上@selection-change="handleSelectionChange"
      this.multipleSelection = val;
    },
    //全选
    selecteAll(rows) {
      this.$message({
        type: "warning",
        message: "请选择设备下的容器进行操作"
      });
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
    //应用Url-dialog
    urlFocus(event, type) {
      console.info(event);
      if (type === 1) this.dialogTitle = "应用url";
      else this.dialogTitle = "图标url";
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
    //应用Url选中
    selectUrlOption(row) {
      if (this.currentUrlType === 1) this.dialogForm.downloadURL = row.fileUrl;
      else this.dialogForm.logo = row.fileUrl;
      this.dialogTitle = "新增微应用";
      this.urlSelectVisible = false;
    },
    //应用Url列表分页
    urlSizeChange(val) {
      this.urlPageSize = val;
      this.getUrls(1);
    },
    urlCurrentChange(val) {
      this.getUrls(val);
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
