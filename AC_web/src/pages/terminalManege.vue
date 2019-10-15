<!--终端管理-->
<template>
  <div id="terminalManege">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <!-- 总览tab页 -->
      <el-tab-pane label="总览" name="allView">
        <!-- 总览数据 -->
        <el-row>
          <el-col :span="5" v-for="(item,index) in allDataArr" :key="index" style="margin:0px 10px">
            <el-card class="box-card allCard" shadow="hover" :body-style="{ padding:'15px'}">
              <div slot="header" class="clearfix">
                <span>{{item.title}}</span>
                <span class="pull-right" :class="item.color">{{item.timeTitle}}</span>
              </div>
              <h1 style="margin-left:20px">{{item.count}}</h1>
              <!-- <small>{{item.smallTitle}}</small> -->
              <!-- <div class="stat-percent" :class="item.color">
                {{item.percent}}
                <i :class="item.icon"></i>
              </div>-->
            </el-card>
          </el-col>
        </el-row>
        <!-- 总览地图 -->
        <el-row>
          <el-col :span="20" :offset="2">
            <div id="mapChart" style="height:400px"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 详细列表tab -->
      <el-tab-pane label="详细列表" name="detailView">
        <el-row>
          <el-form :inline="true" :model="searchItem" ref="searchItem">
            <el-form-item label="终端ID" prop="deviceId">
              <el-input v-model="searchItem.deviceId" placeholder="请输入终端ID"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="终端名称">
              <el-input v-model="searchItem.name" placeholder="请输入设备名称"></el-input>
            </el-form-item>
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
                class="terminalTable"
                @selection-change="getRowDatas"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="deviceId" label="终端ID">
                  <template slot-scope="scope">
                    <el-button
                      @click="detailRow(scope.row)"
                      type="text"
                      size="medium"
                    >{{scope.row.deviceId}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="deviceName" label="终端名称"></el-table-column>
                <el-table-column prop="ip" label="终端ip"></el-table-column>
                <el-table-column prop="mac" label="mac地址"></el-table-column>
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
                <!-- <el-table-column prop="vendor" label="制造商"></el-table-column> -->
                <el-table-column prop="activeTime" width="180" label="激活时间" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="options" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                    <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
                    <!-- <el-button @click="updateRow(scope.row)" type="text" size="medium">升级</el-button>
                    <el-button @click="pairRow(scope.row)" type="text" size="medium">对时</el-button>-->
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin:20px 0px">
                <el-button-group style="float:left">
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
                <el-upload action :limit="1" style="float:left">
                  <el-button type="warning" round size="small" icon="el-icon-upload2">批量导入</el-button>
                </el-upload>
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
      </el-tab-pane>
    </el-tabs>
    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="75%">
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
                <span v-if="ifDialogDetail">{{dialogForm.deviceId}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.deviceId"
                  placeholder="请输入终端ID"
                  style="width:80%;float:left"
                ></el-input>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  v-if="ifDialogEdit"
                  style="float:right;margin:5px;"
                  @click="restart(dialogForm)"
                >重启</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终端名称" prop="deviceName">
                <span v-if="ifDialogDetail">{{dialogForm.deviceName}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.deviceName"
                  placeholder="请输入终端名称"
                ></el-input>
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
            <el-col :span="12">
              <el-form-item label="制造商">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.vendor}}</span>
                <el-input v-if="!ifDialogDetail&&!ifDialogEdit" v-model="dialogForm.vendor" placeholder="请输入制造商"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ifDialogDetail">
            <el-col :span="12">
              <el-form-item label="终端版本">
                <span style="float:left">{{dialogForm.version}}</span>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  v-if="ifDialogEdit"
                  style="float:right;margin:5px;"
                  @click="updateRow(dialogForm)"
                >升级</el-button>
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
                  v-if="ifDialogEdit"
                  style="float:right;margin:5px;"
                  @click="maintenance(dialogForm)"
                >进入维护状态</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终端时间">
                <span style="float:left">{{dialogForm.ActiveTime}}</span>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  v-if="ifDialogEdit"
                  style="float:right;margin:5px;"
                  @click="pairRow(dialogForm)"
                >对时</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端ip" prop="ip">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.ip}}</span>
                <el-input v-if="!ifDialogDetail&&!ifDialogEdit" v-model="dialogForm.ip" placeholder="请输入终端ip"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="mac地址">
                <span v-if="ifDialogDetail||ifDialogEdit">{{dialogForm.mac}}</span>
                <el-input v-if="!ifDialogDetail&&!ifDialogEdit" v-model="dialogForm.mac" placeholder="请输入mac地址"></el-input>
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
            <el-col :span="24">
              <el-form-item label="描述信息">
                <span v-if="ifDialogDetail">{{dialogForm.description}}</span>
                <el-input
                  v-if="!ifDialogDetail"
                  v-model="dialogForm.description"
                  type="textarea"
                  placeholder="请输入描述信息"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="padding: 10px 0px;overflow: auto;">
            <el-row>
              <el-col :span="24" style="width:auto">
                <el-form-item label="容器" style="height:30px">
                  <el-row type="flex">
                    <div
                      class="el-col addConfig"
                      v-for="(item,index) in dialogForm.containerArr"
                      :key="index"
                    >
                      {{item.containerName}}
                      <el-button
                        v-if="!ifDialogDetail"
                        type="text"
                        plain
                        circle
                        size="mini"
                        icon="el-icon-delete"
                      ></el-button>
                    </div>
                    <div class="el-col addConfig">
                      <el-button
                        v-if="!ifDialogDetail"
                        type="primary"
                        plain
                        circle
                        size="mini"
                        icon="el-icon-plus"
                        @click="chooseFile('container')"
                      ></el-button>
                    </div>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="dialogForm.containerArr!==undefined&&dialogForm.containerArr.length>0">
              <el-col :span="24" style="height:auto;width:auto">
                <el-form-item label="应用" class="lineHeight">
                  <el-row type="flex">
                    <div
                      class="el-col addConfig"
                      style="min-height:95px"
                      v-for="(item,index) in dialogForm.containerArr"
                      :key="index"
                    >
                      <div
                        style="padding:5px"
                        v-for="(app,appIndex) in item.appList"
                        :key="appIndex"
                      >
                        {{app}}
                        <el-button
                          v-if="!ifDialogDetail"
                          type="text"
                          plain
                          circle
                          size="mini"
                          icon="el-icon-delete"
                        ></el-button>
                      </div>
                      <div>
                        <el-button
                          style="padding:5px"
                          v-if="!ifDialogDetail"
                          type="primary"
                          plain
                          circle
                          size="mini"
                          icon="el-icon-plus"
                          @click="chooseFile('app')"
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
      <!-- 新增服务/容器 -->
      <el-row v-show="ifAddContainer">
        <el-col :span="16" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{addTitle}}</span>
            </div>
            <div>
              <el-container>
                <el-aside width="150px">
                  <el-row>
                    <el-menu
                      default-active="1"
                      class="el-menu-vertical-demo"
                      @open="handleOpen"
                      @close="handleClose"
                      @select="typeSelect"
                    >
                      <div v-for="(item , index) in addDialogTypes" :key="index">
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
                    </el-menu>
                  </el-row>
                </el-aside>
                <el-container>
                  <el-header>
                    <el-row>
                      <el-col :span="16">
                        <el-input v-model="searchFileItem" placeholder="请输入内容进行查询"></el-input>
                      </el-col>
                      <el-col :span="2" :offset="1">
                        <el-button type="primary" icon="el-icon-search" @click="searchFile()">搜索</el-button>
                      </el-col>
                    </el-row>
                  </el-header>
                  <el-main>
                    <!-- 文件服务/容器循环 -->
                    <el-row style="max-height: 300px;overflow:auto;">
                      <el-table
                        ref="multipleTable"
                        :data="fileList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="排序" width="60">
                          <template>
                            <!-- <template slot-scope="scope"> -->
                            <img src="../assets/img/soft_demo1.jpg" height="60" width="100%" />
                          </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" width="100"></el-table-column>
                        <el-table-column prop="count" label="下载量" width="100"></el-table-column>
                        <el-table-column prop="time" label="上架时间" width="180"></el-table-column>
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
        <el-col :span="5" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{addSelectTitle}}</span>
            </div>
            <div>
              <ul>
                <li v-for="(item,index) in fileSelectedList" :key="index">
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
      <div slot="footer" class="dialog-footer">
        <el-button v-show="!ifAddContainer" type="primary" @click="submitForm('dialogForm')">确 定</el-button>
        <el-button v-show="!ifAddContainer" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="ifAddContainer" type="primary" @click="submitFile()">安 装</el-button>
        <el-button v-show="ifAddContainer" @click="ifAddContainer = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "../../node_modules/echarts/map/js/china.js";
const geoCoordMap = {};
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
      activeTab: "allView",
      tableSize: 0,
      tableLimit: 10,
      selectedRow: [],
      searchItem: {
        deviceId: "",
        name: "",
        deviceType: ""
      },
      typeArr: {
        title: "请选择设备类型",
        options: []
      },
      allDataArr: [
        {
          title: "终端总数",
          timeTitle: "当前",
          smallTitle: "接入终端总数",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "blue"
        },
        {
          title: "在线终端总数",
          timeTitle: "当前",
          smallTitle: "当前在线终端总数",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "green"
        },
        {
          title: "已激活终端总数",
          timeTitle: "当前",
          smallTitle: "已激活终端",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "greenAll"
        },
        {
          title: "未激活终端总数",
          timeTitle: "当前",
          smallTitle: "未激活终端",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "orange"
        }
      ],
      mapData: [
        { name: "河北", value: 102 },
        { name: "山西", value: 81 },
        { name: "内蒙古", value: 47 },
        { name: "辽宁", value: 67 },
        { name: "黑龙江", value: 123 },
        { name: "江苏", value: 92 },
        { name: "浙江", value: 114 },
        { name: "安徽", value: 109 },
        { name: "福建", value: 116 },
        { name: "江西", value: 91 },
        { name: "山东", value: 119 },
        { name: "河南", value: 137 },
        { name: "湖北", value: 116 },
        { name: "湖南", value: 114 },
        { name: "四川", value: 125 },
        { name: "贵州", value: 62 },
        { name: "云南", value: 83 },
        { name: "西藏", value: 9 },
        { name: "陕西", value: 80 },
        { name: "甘肃", value: 56 },
        { name: "青海", value: 10 },
        { name: "宁夏", value: 18 },
        { name: "新疆", value: 180 },
        { name: "广东", value: 123 },
        { name: "广西", value: 59 },
        { name: "海南", value: 14 }
      ],
      tableData: [],
      dialogTitle: "新增",
      dialogFormVisible: false,
      ifDialogEdit: false,
      ifDialogDetail: false,
      ifAddContainer: false,
      currentRow:{},
      dialogForm: {
        deviceId: "",
        deviceName: "",
        deviceType: "",
        status: "",
        ip: "",
        mac: "",
        ActiveTime: "",
        description: "",
        containerArr: [
          // { name: "test1", appList: [{name: "test1" },{name: "test1" }] },
          // { name: "test2", appList: [{name: "test1" }] },
          // { name: "test3", appList: [{name: "test1" },{name: "test1" },{name: "test1" }] },
          // { name: "test4", appList: [{name: "test1" }] },
          // { name: "test5", appList: [{name: "test1" },{name: "test1" }] },
          // { name: "test6", appList: [{name: "test1" },{name: "test1" },{name: "test1" }] },
          // { name: "test7", appList: [{name: "test1" }] },
          // { name: "test8", appList: [{name: "test1" }] }
        ]
      },
      dialogRules: {
        deviceId: [
          { required: true, message: "请输入终端ID", trigger: "blur" }
        ],
        deviceName: [
          { required: true, message: "请输入终端名称", trigger: "blur" }
        ],
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
      }
    };
  },
  mounted() {
    this.getDeviceType();
    this.search(1);
    this.getMapData();
    this.drawMap();
  },
  methods: {
    //获取设备类型
    getDeviceType() {
      this.$axios
        .post(baseUrl + "/admin/terminal-type/selTerminalTypeList")
        .then(res => {
          this.typeArr.options = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(page) {
      let param = {
        deviceId: this.searchItem.deviceId,
        name: this.searchItem.name,
        deviceType: this.searchItem.deviceType
      };
      // let param = "pageSize=" + this.tableLimit + "&pageIndex=" + page;
      // Object.keys(this.searchItem).forEach(item => {
      //   if (this.searchItem[item] !== "")
      //     param += "&" + item + "=" + this.searchItem[item];
      // });
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
          this.tableData = res.data.data.data.records;
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
    //获取地图数据
    getMapData() {
      this.$axios
        .post(baseUrl + "/admin/snapshoot/queryTerminalStatistic")
        .then(res => {
          if (res.data.success) {
            this.allDataArr[0].count = res.data.data.terminalNum_total;
            this.allDataArr[1].count = res.data.data.terminalNum_online;
            this.allDataArr[2].count = res.data.data.terminalNum_active;
            this.allDataArr[3].count = res.data.data.terminalNum_unconfirmed;
          } else {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    drawMap() {
      let myChart = this.$echarts.init(document.getElementById("mapChart"));
      myChart.showLoading();
      let mapFeatures = this.$echarts.getMap("china").geoJson.features;
      myChart.hideLoading();
      mapFeatures.forEach(function(v) {
        // 地区名称
        let name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
      });
      let option = {
        tooltip: {
          padding: 0,
          enterable: true,
          transitionDuration: 1,
          textStyle: {
            color: "#000",
            decoration: "none"
          },
          // alwaysShowContent:true,
          formatter: function(params) {
            var tipHtml = "";
            if (params.value !== undefined && !Number.isNaN(params.value)) {
              if (typeof params.value === "object")
                params.value = params.value[2];
              tipHtml =
                '<div style="width:200px;height:80px;background:rgba(22,80,158,0.8);border:1px solid rgba(7,166,255,0.7)">' +
                '<div style="width:90%;height:30px;line-height:30px;border-bottom:2px solid rgba(7,166,255,0.7);padding-left:15px">' +
                '<i style="display:inline-block;width:8px;height:8px;background:#16d6ff;border-radius:40px;"></i>' +
                '<span style="margin-left:10px;color:#fff;font-size:14px;">' +
                params.name +
                "</span>" +
                "</div>" +
                '<div style="padding:15px 5px">' +
                '<p style="color:#fff;font-size:12px;">' +
                '<i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px"></i>' +
                "总数：" +
                '<span style="color:#11ee7d;margin:0 6px;">' +
                params.value +
                "</span>" +
                "个" +
                "</p>" +
                "</div>" +
                "</div>";
            } else {
              tipHtml =
                '<div style="width:200px;height:80px;background:rgba(22,80,158,0.8);border:1px solid rgba(7,166,255,0.7)">' +
                '<div style="width:90%;height:30px;line-height:30px;border-bottom:2px solid rgba(7,166,255,0.7);padding-left:15px">' +
                '<i style="display:inline-block;width:8px;height:8px;background:#16d6ff;border-radius:40px;"></i>' +
                '<span style="margin-left:10px;color:#fff;font-size:14px;">' +
                params.name +
                "</span>" +
                "</div>" +
                '<div style="padding:15px 5px">' +
                '<p style="color:#fff;font-size:12px;">' +
                '<i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px"></i>' +
                "总数：" +
                '<span style="color:#11ee7d;margin:0 6px;">---</span>' +
                "个" +
                "</p>" +
                "</div>" +
                "</div>";
            }
            return tipHtml;
          }
        },
        visualMap: {
          show: true,
          min: 0,
          max: 200,
          left: "10%",
          top: "bottom",
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: ["#04387b", "#467bc0"] // 蓝绿
          }
        },
        geo: {
          show: true,
          map: "china",
          zoom: 1.2,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          // roam: true,
          itemStyle: {
            normal: {
              areaColor: "#023677",
              borderColor: "#1180c7"
            },
            emphasis: {
              areaColor: "#4499d0"
            }
          }
        },
        series: [
          {
            name: "散点",
            type: "scatter",
            coordinateSystem: "geo",
            data: this.convertData(this.mapData),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#fff"
              }
            }
          },
          {
            type: "map",
            map: "china",
            geoIndex: 0,
            aspectScale: 0.85, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: this.mapData
          },
          {
            name: "点",
            type: "scatter",
            coordinateSystem: "geo",
            zlevel: 6
          },
          {
            name: "Top 5",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: this.convertData(
              this.mapData
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0, 5)
            ),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "left",
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "yellow",
                shadowBlur: 10,
                shadowColor: "yellow"
              }
            },
            zlevel: 1
          }
        ]
      };
      myChart.setOption(option);
      myChart.resize();
    },
    convertData(data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        if (geoCoordMap[data[i].name] !== undefined) {
          let geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
      }
      return res;
    },
    //查看
    detailRow(row) {
      this.ifAddContainer = false;
      this.ifDialogEdit = false;
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
    //新增
    add(formName) {
      this.ifAddContainer = false;
      this.ifDialogEdit = false;
      this.ifDialogDetail = false;
      this.dialogTitle = "新增终端";
      this.dialogForm = {};
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs[formName].resetFields();
      // });
    },
    //编辑
    editRow(row) {
      this.ifAddContainer = false;
      this.ifDialogEdit = true;
      this.ifDialogDetail = false;
      this.dialogTitle = "编辑终端";
      this.dialogForm = Object.assign({}, row);
      this.currentRow=Object.assign({}, row);
      this.dialogForm.containerArr = [];
      this.getContainerDetail(row);
    },
    //删除
    delRow(row) {
      this.$confirm(
        "是否确定删除     '" + row.deviceName + "'    该终端?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let arr = [];
          arr.push(row);
          this.$axios
            .delete(baseUrl + "/admin/terminal/devices", {
              data: [row.deviceId]
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
                  message: "删除失败",
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
            "/admin/containers/devicedeployinfo?deviceId=" +
            row.deviceId
        )
        .then(res => {
          if (res.data.data !== null && res.data.data.length > 0) {
            res.data.data.forEach(item => {
              if (
                item.containerConfig.openServices.substring(
                  1,
                  item.containerConfig.openServices.length - 1
                ) !== ""
              ) {
                item.containerConfig.appList = item.containerConfig.openServices
                  .substring(1, item.containerConfig.openServices.length - 1)
                  .split(",");
              }
              this.dialogForm.containerArr.push(item.containerConfig);
            });
          }
          console.info(this.dialogForm);
          this.dialogFormVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //重启
    restart(row) {},
    //进入维护状态
    maintenance(row) {},
    //升级
    updateRow() {
      this.$confirm("是否确定升级——'" + row.deviceName + "'?", "提示", {
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
    //对时
    pairRow() {
      this.$confirm("是否确定对时——'" + this.currentRow.deviceName + "'?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .put(baseUrl + "/admin/terminal/devices/clocksyn/" + this.currentRow.deviceId)
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: "对时成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "对时失败",
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
    //批量导入
    importRows() {},

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
            let param = Object.assign({}, this.dialogForm);
            param.name = param.deviceName;
            let arr = [];
            arr.push(param);
            this.$axios
              .post(baseUrl + "/admin/terminal/devices", arr, config)
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
                    message: "失败",
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
                    message: "失败",
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
    //获取容器列表
    getContainer(page) {
      let condition = {};
      condition.name = this.searchFileItem;
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
    //获取应用分类
    getAddDialogType() {
      let url = "";
      if (this.addTitle.indexOf("容器") > -1) url = "";
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
    //获取应用列表
    getApplications(page) {
      this.$axios
        .post(
          baseUrl +
            "/admin/app/files?" +
            "pageIndex=" +
            page +
            "&pageSize=" +
            this.filePageSize,
          { appInfo: this.searchFileItem },
          { headers: { "Content-Type": "application/json" } }
        )
        .then(res => {
          this.fileTotal = res.data.data.total;
          this.fileList = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    chooseFile(type) {
      if (type === "app") {
        this.addSelectTitle = "已选应用";
        this.addTitle = "应用库";
        this.getApplications(1);
      } else {
        this.addSelectTitle = "已选容器";
        this.addTitle = "容器库";
        this.getContainer(1);
      }
      // this.getAddDialogType();
      this.fileSelectedList = [];
      this.ifAddContainer = true;
    },
    typeSelect(index, indexPath) {
      this.selectedType = index;
      this.searchFile("");
    },
    //安装容器/应用
    submitFile() {
      let url = "",
        param = {};
      if (this.addTitle === "应用库") {
        url = baseUrl + "/admin/app/deploy?isUpdate=false";
        param = { apps: this.fileSelectedList, isUpdate: false };
      } else if (this.addTitle === "容器库") {
        url = baseUrl + "/admin/containers/deploy";
        param = { containerlist: this.fileSelectedList, update: true };
      }
      //this.fileSelectedList;
      this.$axios
        .post(url, param, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          if (res.data.success) {
            this.$message({
              message: "安装成功",
              type: "success"
            });
            this.getContainerDetail(this.currentRow);
            this.ifAddContainer = false;
            this.dialogForm.containerArr = this.searchFile;
          } else {
            this.$message({
              message: "安装失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //tab点击事件
    handleClick() {},
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    },
    searchFile() {},
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
        if (item.name === val.name) {
          this.fileSelectedList.splice(index, 1);
          this.$refs.multipleTable.toggleRowSelection(item, false);
          return false;
        }
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    dateFormat(row, column, cellValue, index) {
      // const daterc = row[column.property];
      // if (daterc != null) {
      //   const dateMat = new Date(
      //     parseInt(daterc.replace("/Date(", "").replace(")/", ""), 10)
      //   );
      //   const year = dateMat.getFullYear();
      //   const month = dateMat.getMonth() + 1;
      //   const day = dateMat.getDate();
      //   const hh = dateMat.getHours();
      //   const mm = dateMat.getMinutes();
      //   const ss = dateMat.getSeconds();
      //   const timeFormat =
      //     year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss;
      //   return cellValue;
      // }
      return cellValue;
    }
  }
};
</script>

<style scoped>
.terminalTable {
  max-height: 500px;
  overflow: auto;
}
.pull-right {
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  text-shadow: none;
}
.allCard {
  border: 1px solid #eee !important;
}
.allCard h1 {
  font-size: 36px;
  margin-bottom: 5px;
}
.el-card__header {
  padding: 10px 20px !important;
}
.stat-percent {
  color: #1c84c6;
  font-weight: 600;
  float: right;
}
.el-card__header .blue {
  background-color: #1c84c6;
}
.el-card__header .green {
  background-color: #23c6c8;
}
.el-card__header .greenAll {
  background-color: #1ab394;
}
.el-card__header .orange {
  background-color: rgba(240, 155, 119, 1);
}
.el-card__body .blue {
  color: #1c84c6;
}
.el-card__body .green {
  color: #23c6c8;
}
.el-card__body .greenAll {
  color: #1ab394;
}
.el-card__body .orange {
  color: rgba(240, 155, 119, 1);
}
.acForm .el-col {
  border-color: rgb(151, 195, 221);
  font-size: 14px;
  padding: 0px;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  line-height: 20px;
}
.acForm .el-form-item {
  margin-bottom: 0px;
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
  width: 160px;
  float: left;
}
</style>

