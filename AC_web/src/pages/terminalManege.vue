<!--终端管理-->
<template>
  <div id="terminalManege">
    <el-row>
      <el-form :model="searchItem" ref="searchItem" label-width="auto" class="searchForm">
        <el-col :span="4">
          <el-form-item label="终端ID" prop="deviceId">
            <el-input v-model="searchItem.deviceId" placeholder="终端ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="name" label="终端名称">
            <el-input v-model="searchItem.name" placeholder="设备名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="deviceType" label="终端类型">
            <el-select v-model="searchItem.deviceType" :placeholder="typeArr.title">
              <el-option
                v-for="item in typeArr.options"
                :key="item.deviceType"
                :label="item.name"
                :value="item.deviceType"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="status" label="终端状态">
            <el-select v-model="searchItem.status" :placeholder="statusArr.title">
              <el-option
                v-for="item in statusArr.options"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button type="primary" @click="search(1)">查询</el-button>
          <el-button type="default" @click="reset('searchItem')">重置</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <el-table
            :data="tableData"
            border
            size="medium"
            class="terminalTable"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="deviceId" label="终端ID" align="center" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="detailRow(scope.row)"
                  type="text"
                  size="medium"
                >{{scope.row.deviceId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="终端名称"  width="150" align="center"></el-table-column>
            <el-table-column prop="deviceType" label="设备类型" align="center"></el-table-column>
            <el-table-column prop="version" label="终端版本" align="center"></el-table-column>
            <el-table-column prop="status" label="终端状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status===0" style="color:#67c23a">正常</span>
                <span v-if="scope.row.status===1" style="color:orange">告警</span>
                <span v-if="scope.row.status===2" style="color:red">故障</span>
                <span v-if="scope.row.status===3" style="color:gray">离线</span>
                <span v-if="scope.row.status===4" style="color:#000">未注册</span>
              </template>
            </el-table-column>
            <el-table-column prop="registerTime" label="激活时间" align="center" width="160"></el-table-column>
            <el-table-column prop="ip" label="终端ip" align="center"></el-table-column>
            <el-table-column prop="mac" label="mac地址" align="center" width="150"></el-table-column>
            <el-table-column prop="options" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
                <!-- <el-button @click="restart(scope.row)" type="text" size="medium">重启</el-button>
                <el-button @click="maintenance(scope.row)" type="text" size="medium">进入维护状态</el-button>
                <el-button @click="pairRow(scope.row)" type="text" size="medium">对时</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin:20px 0px">
            <el-col :span="4">
              <!-- <el-button type="success" size="small" icon="el-icon-refresh" @click="search(1,10)">刷新</el-button> -->
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="add('dialogForm')"
                style="float:left"
              >新增</el-button>
            <el-upload
              ref="upload"
              action="/"
              :show-file-list="false"
              :on-change="importExcel"
              :auto-upload="false"
            >
              <el-button slot="trigger" icon="el-icon-upload" size="small" type="primary" plain>批量导入</el-button>
            </el-upload>
            </el-col>
            <el-col :span="20">
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
            </el-col>
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
    width="75%">
      <!-- 终端form -->
      <el-row v-show="!ifAddContainer">
        <el-form
          :model="dialogForm"
          :rules="dialogRules"
          ref="dialogForm"
          label-width="120px"
          class="acForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端ID" prop="deviceId">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.deviceId}}</span>
                <el-input
                  v-if="!ifDialogDetail&&!ifDialogEdit"
                  v-model="dialogForm.deviceId"
                  placeholder="请输入终端ID"
                  style="width:80%;float:left"
                ></el-input>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  v-if="ifDialogDetail"
                  style="float:right;margin:5px;"
                  @click="restart(dialogForm)"
                >重启</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终端名称" prop="name">
                <span v-if="ifDialogDetail">{{dialogForm.name}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.name" placeholder="请输入终端名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row></el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备类型" prop="deviceType">
                <span v-if="ifDialogDetail">{{dialogForm.deviceType}}</span>
                <el-select
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.deviceType"
                  :placeholder="typeArr.title"
                  style="float:left"
                >
                  <el-option
                    v-for="item in typeArr.options"
                    :key="item.deviceType"
                    :label="item.name"
                    :value="item.deviceType"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ifDialogDetail">
              <el-form-item label="终端版本">
                <span style="float:left">{{dialogForm.version}}</span>
                <!-- <el-button
                  type="primary"
                  plain
                  size="mini"
                  style="float:right;margin:5px;"
                  @click="updateRow(dialogForm)"
                >升级</el-button>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="制造商">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.vendor}}</span>
                <el-input
                  v-if="!ifDialogDetail&&!ifDialogEdit"
                  v-model="dialogForm.vendor"
                  placeholder="请输入制造商"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ifDialogEdit||ifDialogDetail">
            <el-col :span="12">
              <el-form-item label="终端状态" prop="status">
                <!-- 详情状态 -->
                <span v-if="dialogForm.status===0">正常</span>
                <span v-if="dialogForm.status===1">告警</span>
                <span v-if="dialogForm.status===2">故障</span>
                <span v-if="dialogForm.status===3">离线</span>
                <span v-if="dialogForm.status===4">未注册</span>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  v-if="ifDialogDetail"
                  style="float:right;margin:5px;"
                  @click="maintenance(dialogForm)"
                >进入维护状态</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ifDialogDetail">
              <el-form-item label="终端时间">
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  style="float:left;margin:5px;"
                  @click="getTerminalTime(dialogForm)"
                >获取终端时间</el-button>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  style="float:left;margin:5px;"
                  @click="pairRow(dialogForm)"
                >对时</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端ip">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.ip}}</span>
                <el-input
                  v-if="!ifDialogDetail&&!ifDialogEdit"
                  v-model="dialogForm.ip"
                  placeholder="请输入终端ip"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="mac地址">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.mac}}</span>
                <el-input
                  v-if="!ifDialogDetail&&!ifDialogEdit"
                  v-model="dialogForm.mac"
                  placeholder="请输入mac地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备经度">
                <span v-if="ifDialogDetail">{{dialogForm.gisLon}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.gisLon" placeholder="请输入设备经度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备纬度">
                <span v-if="ifDialogDetail">{{dialogForm.gisLat}}</span>
                <el-input v-if="!ifDialogDetail" v-model="dialogForm.gisLat" placeholder="请输入设备纬度"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="height:100px">
              <el-form-item label="描述信息" class="lineHeight">
                <span v-if="ifDialogDetail">{{dialogForm.description}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.description"
                  type="textarea"
                  style="height:100px"
                  placeholder="请输入描述信息"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="!ifDialogDetail||dialogForm.containerArr.length>0"
          style="padding: 10px 0px;overflow: auto;">
            <el-row>
              <el-col :span="24" style="height:auto;width:auto">
                <el-form-item label="容器" class="container" style="height:65px;">
                  <el-row type="flex">
                    <div
                      class="el-col addConfig"
                      v-for="(item,index) in dialogForm.containerArr"
                      :key="index"
                    >
                    <img src="../assets/img/container.png" height="45" width="45" style="float:left;margin:10px">
                    <div class="title" style="float:left;margin:5%">
                      <h4>{{item.containerName}}</h4>
                      <h4>{{item.name}}</h4>
                      </div>
                      <el-button
                        v-if="!ifDialogDetail"
                        plain
                        circle
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="uninstallContainer(item)"
                      ></el-button>
                    </div>
                    <div v-if="!ifDialogDetail" class="el-col addConfig" style="height:65px;">
                      <el-button
                        round
                        size="mini"
                        icon="el-icon-plus"
                        @click="chooseFile('container')"
                        style="margin: 5% 0px;"
                      ></el-button>
                    </div>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="dialogForm.containerArr!==undefined&&dialogForm.containerArr.length>0">
              <el-col :span="24" style="height:auto;width:auto">
                <el-form-item label="应用" class="application" style="height:150px;">
                  <el-row type="flex">
                    <div
                      class="el-col addConfig"
                      style="height:150px;overflow:auto"
                      v-for="(item,index) in dialogForm.containerArr"
                      :key="index"
                    >
                      <div
                        style="float:left;width:100%;display: table-cell;"
                        v-for="(app,appIndex) in item.appList"
                        :key="appIndex"
                      >
                      <img src="../assets/img/application.png" height="20" width="20" style="margin:5px 10px;vertical-align: middle;">
                        <span style="margin-top:5px;font-size:normal;vertical-align: middle;">{{app.name}}</span>
                        <el-button
                          v-if="!ifDialogDetail"
                          plain
                          circle
                          type="danger"
                          size="mini"
                          icon="el-icon-delete"
                        ></el-button>
                      </div>
                      <div>
                        <el-button
                          style="padding:5px"
                          v-if="!ifDialogDetail"
                          round
                          size="mini"
                          icon="el-icon-plus"
                          @click="chooseFile('app',item.name)"
                        ></el-button>
                      </div>
                    </div>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-row>
      <!-- 新增服务/容器dialog -->
      <el-row v-show="ifAddContainer">
        <el-col :span="17">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{addTitle}}</span>
            </div>
            <div>
              <el-container>
                <el-aside width="150px">
                  <el-row>
                    <el-menu
                      class="el-menu-vertical-demo"
                      @open="handleOpen"
                      @close="handleClose"
                      @select="typeSelect"
                    >
                      <!-- 容器分类 -->
                      <div v-if="addTitle.indexOf('容器')!=-1">
                        <div v-for="(item , index) in addDialogTypes" :key="index">
                          <el-menu-item v-if="!item.child" :index="item.itemCode">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{item.itemName}}</span>
                          </el-menu-item>
                          <el-submenu v-if="item.child" :index="item.itemCode">
                            <template slot="title">
                              <i class="el-icon-location"></i>
                              <span>{{item.itemName}}</span>
                            </template>
                            <el-menu-item
                              v-for="(child,ind) in item.child"
                              :key="ind"
                              :index="child.itemCode"
                            >{{child.itemName}}</el-menu-item>
                          </el-submenu>
                        </div>
                      </div>
                      <!-- 应用分类 -->
                      <div v-if="addTitle.indexOf('容器')==-1">
                        <div v-for="(item , index) in addDialogTypes" :key="index">
                          <!-- addTitle -->
                          <el-menu-item v-if="!item.child" :index="item.ItemCode">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{item.ItemName}}</span>
                          </el-menu-item>
                          <el-submenu v-if="item.child" :index="item.ItemCode">
                            <template slot="title">
                              <i class="el-icon-location"></i>
                              <span>{{item.ItemName}}</span>
                            </template>
                            <el-menu-item
                              v-for="(child,ind) in item.child"
                              :key="ind"
                              :index="child.ItemCode"
                            >{{child.ItemName}}</el-menu-item>
                          </el-submenu>
                        </div>
                      </div>
                    </el-menu>
                  </el-row>
                </el-aside>
                <el-container>
                  <el-header>
                    <el-row>
                      <el-col :span="16">
                        <el-input v-model="searchFileItem" placeholder="请输入名称进行查询"></el-input>
                      </el-col>
                      <el-col :span="2" :offset="1">
                        <el-button type="primary" icon="el-icon-search" @click="searchFile()">搜索</el-button>
                      </el-col>
                    </el-row>
                  </el-header>
                  <el-main :style="{'padding':'0px'}">
                    <!-- 文件服务/容器循环 -->
                    <el-row style="max-height: 300px;overflow:auto;">
                      <el-table
                        ref="multipleTable"
                        :data="fileList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column type="selection"></el-table-column>
                        <!-- 容器column -->
                        <el-table-column v-if="addTitle!=='应用库'" prop="name" label="名称"></el-table-column>
                        <el-table-column v-if="addTitle!=='应用库'" prop="type" label="类型"></el-table-column>
                        <!-- 应用库column -->
                        <el-table-column v-if="addTitle==='应用库'" prop="appName" label="名称"></el-table-column>
                        <el-table-column v-if="addTitle==='应用库'" prop="appType" label="类型"></el-table-column>
                        <el-table-column v-if="addTitle==='应用库'" prop="version" label="版本"></el-table-column>

                        <el-table-column prop="vendor" label="开发商"></el-table-column>
                      </el-table>
                    </el-row>
                    <el-row style="text-align: center;margin-top:10px;">
                      <el-pagination
                        @size-change="fileSizeChange"
                        @current-change="fileCurrentChange"
                        :current-page="fileCurrentPage"
                        :page-sizes="[5, 10, 15]"
                        :page-size="filePageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="fileTotal"
                      ></el-pagination>
                    </el-row>
                  </el-main>
                </el-container>
              </el-container>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{addSelectTitle}}</span>
            </div>
            <div>
              <!-- 已选容器 -->
              <ul v-if="addTitle!=='应用库'">
                <li v-for="(item,index) in fileSelectedList" :key="index">
                  {{item.name}}
                  <el-button type="text" @click="removeSelected(item)">
                    <i class="el-icon-close"></i>
                  </el-button>
                </li>
              </ul>
              <!-- 已选应用 -->
              <ul v-if="addTitle==='应用库'">
                <li v-for="(item,index) in fileSelectedList" :key="index">
                  {{item.appName}}
                  <el-button type="text" @click="removeSelected(item)">
                    <i class="el-icon-close"></i>
                  </el-button>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-show="!ifAddContainer&&(!ifDialogDetail||ifDialogEdit)"
          type="primary"
          @click="submitForm('dialogForm')"
        >保 存</el-button>
        <el-button v-show="!ifDialogDetail&&!ifDialogDetail&&!ifAddContainer" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="ifAddContainer" type="primary" @click="submitFile()">安 装</el-button>
        <el-button v-show="ifAddContainer" @click="ifAddContainer = false,dialogTitle='编辑终端'">取 消</el-button>
        <el-button v-show="ifDialogDetail" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 文件预览dialog  -->
    <el-dialog title="文件预览" :visible.sync="excelShow" width="75%">
      <div class="previewView">
        <table class="previewTable">
          <thead>
            <tr>
              <td v-for="(title,titleIndex) in previewExcel.header" :key="titleIndex">{{title}}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem,trIndex) in previewExcel.body" :key="trIndex">
              <td v-for="(tdItem,tdIndex) in trItem" :key="tdIndex">{{tdItem}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadFile()">上 传</el-button>
        <el-button @click="excelShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import XLSX from "xlsx"; // npm导入库，命令：npm i xlsx@^0.14.1 -s
export default {
  name: "terminalManege",
  data() {
    //自定义正则验证
    let checkIp = (rule, value, callback) => {
      let regExp = /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/;
      if (regExp.test(value) === false) {
        callback(new Error("请输入正确的IP地址"));
      } else {
        callback();
      }
    };
    let checkMac = (rule, value, callback) => {
      let regExp = /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi;
      if (regExp.test(value) === false) {
        callback(new Error("请输入正确的MAC地址"));
      } else {
        callback();
      }
    };
    return {
      excelShow: false,
      activeTab: "allView",
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        deviceId: "",
        name: "",
        deviceType: "",
        status:""
      },
      typeArr: {
        title: "设备类型",
        options: []
      },
      statusArr: {
        title: "设备状态",
        options: [
          {value:"",name:"全部"},
          {value:0,name:"正常"},
          {value:1,name:"告警"},
          {value:2,name:"故障"},
          {value:3,name:"离线"},
          {value:4,name:"未注册"}
        ]
      },
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogEdit: false,
      ifDialogDetail: false,
      ifAddContainer: false,
      currentRow: {},
      dialogForm: {
        deviceId: "",
        name: "",
        deviceType: "",
        status: "",
        ip: "",
        mac: "",
        ActiveTime: "",
        description: "",
        containerArr: []
      },
      dialogRules: {
        deviceId: [
          { required: true, message: "请输入终端ID", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入终端名称", trigger: "blur" }],
        deviceType: [
          { required: true, message: "请选择终端类型", trigger: "blur" }
        ],
        ip: [{ validator: checkIp, trigger: "blur" }],
        mac: [{ validator: checkMac, trigger: "blur" }]
      },
      addSelectTitle: "已选容器",
      addTitle: "容器库",
      addDialogTypes: [],
      selectedType: "",
      currentSelectedContainer: "",
      appList: [],
      fileList: [
        { id: 0, fileName: "软件名1", count: 50, time: "2019年8月20日" },
        { id: 1, fileName: "软件名2", count: 50, time: "2019年8月20日" },
        { id: 2, fileName: "软件名3", count: 50, time: "2019年8月20日" },
        { id: 3, fileName: "软件名4", count: 50, time: "2019年8月20日" },
        { id: 4, fileName: "软件名5", count: 50, time: "2019年8月20日" },
        { id: 5, fileName: "软件名6", count: 50, time: "2019年8月20日" },
        { id: 6, fileName: "软件名7", count: 50, time: "2019年8月20日" }
      ],
      fileSelectedList: [],
      searchFileItem: "",
      fileCurrentPage: 1,
      filePageSize: 10,
      fileTotal: 0,
      fileParam: {
        current: 1,
        size: 5,
        sort: "id",
        dir: "asc"
      },
      //////
      previewExcel: {},
      homeStatus:""
    };
  },
  mounted() {
    this.getDeviceType();
    if(this.$route.query.status!==undefined)this.searchItem.status=this.$route.query.status;
    this.search(1);
    ///////////////////
  },
  methods: {
    //获取设备类型
    getDeviceType() {
      this.$axios
        .post(baseUrl + "/admin/terminal-type/selTerminalTypeList")
        .then(res => {
          this.typeArr.options = res.data.data;
          this.typeArr.options.push({ deviceType: "", name: "全部" });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //终端列表
    search(page) {
      let param = {
        deviceId: this.searchItem.deviceId,
        name: this.searchItem.name,
        deviceType: this.searchItem.deviceType,
      };
      if(this.searchItem.status!=="")param.status=parseInt(this.searchItem.status);
      this.$axios
        .post(
          baseUrl +
            "/admin/terminal/devices/info?pageSize=" +
            this.tableLimit +
            "&pageIndex=" +
            page,
          param
        )
        .then(res => {
          this.tableSize = res.data.data.totalRecord;
          this.tableData = res.data.data.data;
          return false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    //关闭dialog还原属性
    initProps(){
      this.ifDialogEdit = false;
      this.ifDialogDetail = false;
      this.ifAddContainer = false;
    },
    //监听"x"操作
    handleDialogClose(){
      if(this.ifAddContainer){//安装容器的返回事件
        this.ifAddContainer=false;
        this.dialogTitle="编辑终端";
        return false;
      }else {this.dialogFormVisible=false;}
    },
    //详情dialog
    detailRow(row) {
      this.ifDialogDetail = true;
      this.dialogTitle = "终端详细信息";
      this.dialogForm = Object.assign({}, row);
      this.dialogForm.containerArr = [];
      this.getContainerDetail(row);
      // this.$nextTick(() => {
      //   this.$refs["dialogForm"].resetFields();
      // });
      // this.dialogFormVisible = true;
    },
    //新增dialog
    add(formName) {
      this.dialogTitle = "新增终端";
      this.dialogForm = {};
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields();
      // });
    },
    //编辑dialog
    editRow(row) {
      this.ifDialogEdit = true;
      this.dialogTitle = "编辑终端";
      this.dialogForm = Object.assign({}, row);
      this.currentRow = Object.assign({}, row);
      this.dialogForm.containerArr = [];
      this.getContainerDetail(row);
    },
    //删除
    delRow(row) {
      this.$confirm("是否确定删除     '" + row.name + "'    该终端?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          arr.push(row);
          this.$axios
            .delete(baseUrl + "/admin/terminal/devices", {
              params: { devices: row.deviceId }
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //获取终端对应容器
    getContainerDetail(row) {
      this.$axios
        .post(
          baseUrl +
            "/admin/containers/devicedeploystatus?deviceId=" +
            row.deviceId
        )
        .then(res => {
          if (res.data.data !== null && res.data.data.length > 0) {
            this.dialogForm.containerArr = [];
            res.data.data.forEach(item => {
              let container = {
                containerName:item.containerConfig.containerName,
                name: item.containerInfo.name,
                status: item.containerDeployStatus.deployStatus
              };
              if (item.containerConfig.openServices !== "") {
                item.containerConfig.appList = item.containerConfig.openServices.split(
                  ","
                );
              }
              this.dialogForm.containerArr.push(container);
            });
            this.$forceUpdate(); //v-for页面重新渲染
          }
          if (this.ifAddContainer) this.ifAddContainer = false;
          this.dialogFormVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //重启
    restart(row) {
      this.$confirm("是否确定重启终端——'" + row.name + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(baseUrl + "/admin/terminal/restart?deviceId=" + row.deviceId)
            .then(res => {
              if (res.data.errcode === "0") {
                this.$message({
                  message: res.data.errmsg,
                  type: "success"
                });
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //进入维护状态
    maintenance(row) {
      this.$confirm("是否确定进入维护状态——'" + row.name + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              baseUrl +
                "/admin/terminal/operation?deviceId=" +
                row.deviceId +
                "&status=0"
            )
            .then(res => {
              if (res.data.errcode === "0") {
                this.$message({
                  message: res.data.errmsg,
                  type: "success"
                });
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //升级
    updateRow() {
      this.$confirm("是否确定升级——'" + row.name + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //this.currentRow
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消升级"
          });
        });
    },
    //获取终端时间
    getTerminalTime(row){

    },
    //对时
    pairRow(row) {
      this.$confirm("是否确定对时——'" + row.name + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .put(
              baseUrl +
                "/admin/terminal/devices/clocksyn/" +
                row.deviceId
            )
            .then(res => {
              if (res.data.errcode==="0") {
                this.$message({
                  message: "对时成功",
                  type: "success"
                });
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消对时"
          });
        });
    },
    //提交新增/编辑
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //新增
          if (this.dialogTitle.indexOf("新增") > -1) {
            let config = {
              headers: {
                "Content-Type": "application/json"
              }
            };
            let arr = [];
            arr.push(this.dialogForm);
            this.$axios
              .post(baseUrl + "/admin/terminal/devices", arr, config)
              .then(res => {
                if (res.data.errcode==="0") {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "成功",
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
          } else {
            //编辑
            var editData = this.$qs.stringify(this.dialogForm);
            this.$axios
              .put(
                baseUrl +
                  "/admin/terminal/devices/" +
                  this.dialogForm.deviceId +
                  "?" +
                  editData
              )
              .then(res => {
                if (res.data.success) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "成功",
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加容器/应用dialog
    chooseFile(type, containerName) {
      if (type === "app") {
        this.dialogTitle="安装应用";
        this.addSelectTitle = "已选应用";
        this.addTitle = "应用库";
        this.currentSelectedContainer = containerName;
        this.getApplications(1);
      } else {
        this.dialogTitle="安装容器";
        this.addSelectTitle = "已选容器";
        this.addTitle = "容器库";
        this.getContainer(1);
      }
      this.getAddDialogType();
      this.fileSelectedList = [];
      this.ifAddContainer = true;
    },
    //获取容器/应用分类
    getAddDialogType() {
      let url = "";
      if (this.addTitle.indexOf("容器") > -1) url = "/admin/containers/types";
      else url = "/admin/app/getAllTypes";
      this.$axios
        .post(baseUrl + url)
        .then(res => {
          if (res.data.success) {
            this.addDialogTypes = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取容器列表
    getContainer(page) {
      let condition = {};
      condition.name = this.searchFileItem;
      if (this.selectedType !== "") condition.type = this.selectedType;
      this.$axios
        .post(
          baseUrl + "/admin/containers/files",
          {
            condition: condition,
            pageSize: this.filePageSize,
            pageIndex: page,
            sort: ["desc"]
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then(res => {
          this.fileTotal = res.data.totalRecord;
          if (res.data.data.length > 0) {
            res.data.data.forEach(item => {
              Object.keys(item.containerFiles[0]).forEach(key => {
                item[key] = item.containerFiles[0][key];
              });
            });
          }
          this.fileList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取应用列表
    getApplications(page) {
      let appInfo = {};
      if (this.searchFileItem !== "") appInfo.name = this.searchFileItem;
      if (this.selectedType !== "") appInfo.type = this.selectedType;
      this.$axios
        .post(
          baseUrl +
            "/admin/app/files?" +
            "pageIndex=" +
            page +
            "&pageSize=" +
            this.filePageSize,
          appInfo
        )
        .then(res => {
          this.fileTotal = res.data.data.total;
          this.fileList = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加容器/应用 分类点击
    typeSelect(index, indexPath) {
      this.selectedType = index;
      if (this.addTitle.indexOf("容器") != -1) this.getContainer(1);
      else this.getApplications(1);
    },
    //安装容器/应用
    submitFile() {
      if (this.fileSelectedList.length > 0) {
        let url = "",
          param = {},
          paramList = [];
        if (this.addTitle === "应用库") {
          url = baseUrl + "/admin/app/deploy?isUpdate=false";
          this.fileSelectedList.forEach(item => {
            let m = {
              containerName: this.currentSelectedContainer,
              deviceId: this.currentRow.deviceId,
              name: item.appName,
              operateType: 0,
              type: item.appType,
              vendor: item.vendor,
              version: item.version
            };
            paramList.push(m);
          });
          param = paramList;
        } else if (this.addTitle === "容器库") {
          url = baseUrl + "/admin/containers/deploy";
          this.fileSelectedList.forEach(item => {
            let m = {
              containerInfo: {
                incrementPkg: item.containerFiles.incrementPkg,
                name: item.name,
                releaseTime: item.containerFiles.releaseTime,
                releaseUser: item.containerFiles.releaseUser,
                type: item.type,
                vendor: item.vendor,
                version: item.containerFiles.version
              },
              containerconfig: {
                containerName: item.name,
                cpuCores: 0,
                description: item.containerFiles.description,
                diskSizeMB: 0,
                memoryMB: 0,
                openServices: "",
                physicalInterfaces: "",
                volumeSizeMB: 0
              },
              deviceId: this.currentRow.deviceId
            };
            paramList.push(m);
          });
          param = { containerlist: paramList, update: false };
        }
        this.$axios
          .post(url, param, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            if (res.data.errcode === "0") {
              this.$message({
                message: "安装成功",
                type: "success"
              });
              this.getContainerDetail(this.currentRow);
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
      } else {
        this.$message({
          message: "请选择进行安装",
          type: "warning"
        });
      }
    },
    //卸载容器
    uninstallContainer(item) {
      if (item.status !== 1) {
        this.$message({
          message: "该容器处于不可卸载状态，请重新选择",
          type: "warning"
        });
      } else {
        this.$confirm("是否卸载容器——'" + item.name + "'?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let containers = [
              {
                containerNames: [item.name],
                deviceId: this.currentRow.deviceId
              }
            ];
            this.$axios
              .post(baseUrl + "/admin/containers/uninstall", containers)
              .then(res => {
                if (res.data.errcode === "0") {
                  this.getContainerDetail(this.currentRow);
                  this.$message({
                    message: "已提交卸载信息，等待卸载",
                    type: "success"
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
      }
    },
    //终端列表分页
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    },
    //添加容器/应用查询
    searchFile() {
      if (this.addTitle.indexOf("容器") != -1) this.getContainer(1);
      else this.getApplications(1);
    },
    /////////////////////////////////////////////////////
    //批量上传预览
    importExcel(file) {
      // let file = file.files[0] // 使用传统的input方法需要加上这一步
      const types = file.name.split(".")[1];
      const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
        item => item === types
      );
      if (!fileType) {
        this.$message({
          message: "格式错误,请重新选择表格文件",
          type: "error"
        });
        return;
      }
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson;
          this.previewExcel.header = Object.keys(tabJson[0].sheet[0]);
          this.previewExcel.body = tabJson[0].sheet;
          this.excelShow = true;
          console.log("数据", this.xlsxJson);
          // xlsxJson就是解析出来的json数据,数据格式如下
          // [
          //   {
          //     sheetName: sheet1
          //     sheet: sheetData
          //   }
          // ]
        }
      });
    },
    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          this.wb = XLSX.read(data, {
            type: "binary"
          });
          const result = [];
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            });
          });
          resolve(result);
        };
        reader.readAsBinaryString(file.raw);
        // reader.readAsBinaryString(file) // 传统input方法
      });
    },
    //批量上传
    uploadFile() {
      const loading = this.$loading({
        lock: true,
        text: "正在上传",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let paramArr = [];
      this.previewExcel.body.forEach(item => {
        paramArr.push(item);
      });
      let config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      console.info(paramArr);
      this.$axios
        .post(baseUrl + "/admin/terminal/devices", paramArr, config)
        .then(res => {
          if (res.data.errcode==="0") {
            loading.close();
            this.dialogFormVisible = false;
            this.excelShow = false;
            this.search(1);
            this.$message({
              message: "上传成功",
              type: "success"
            });
          } else {
            loading.close();
            this.$message({
              message: res.data.errmsg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    ///////////////////////////////////
    //容器/应用列表分页
    fileSizeChange(val) {
      this.filePageSize = val;
      this.fileParam = {
        current: 1,
        size: val,
        sort: "id",
        dir: "asc"
      };
      this.searchFile("");
    },
    fileCurrentChange(val) {
      this.fileParam = {
        current: val,
        size: this.filePageSize,
        sort: "id",
        dir: "asc"
      };
      this.searchFile("");
    },
    handleSelectionChange(val) {
      this.fileSelectedList = val;
    },
    removeSelected(val) {
      this.fileSelectedList.forEach((item, index) => {
        if (this.addTitle === "应用库") {
          if (item.appName === val.appName) {
            this.fileSelectedList.splice(index, 1);
            this.$refs.multipleTable.toggleRowSelection(item, false);
            return false;
          }
        } else {
          if (item.name === val.name) {
            this.fileSelectedList.splice(index, 1);
            this.$refs.multipleTable.toggleRowSelection(item, false);
            return false;
          }
        }
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //预览(暂停使用)
    selectExcel(convertedData) {
      this.previewExcel = convertedData;
      this.excelShow = true;
      console.info(convertedData);
    }
  }
};
</script>

<style scoped>
.terminalTable {
  /* max-height: 500px; */
  overflow: auto;
}
.acForm .el-col {
  border-color: rgb(151, 195, 221);
  font-size: 14px;
  padding: 0px;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  line-height: 20px;
  margin-top: -1px;
  margin-right: -1px;
}
.acForm .el-form-item {
  margin-bottom: -1px;
}
.list {
  max-height: 100px;
  overflow: auto;
}
.list div {
  width: 150px;
  margin: 0px 10px;
  float: left;
}
.list button {
  margin-left: 10px;
}
.acForm .el-col {
  text-align: center;
}
.addConfig {
  width: 200px;
  float: left;
}
.addConfig button{margin:5% 0px;}
.previewView {
  max-height: 300px;
  overflow: auto;
}
.previewTable {
  color: #48576a;
  table-layout: fixed;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.previewTable td {
  border: 1px solid #8492a6;
  padding: 5px 0;
  word-wrap: break-word;
}
.previewTable > thead {
  background-color: #eff2f7;
}

</style>

