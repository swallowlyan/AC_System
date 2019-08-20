<template>
  <div id="appList">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <!-- 应用商店tab页 -->
      <el-tab-pane label="应用商店" name="appList">
        <el-row class="searchTypes">
          <el-row>
            <el-col :span="22" :offset="1">
              <el-card class="box-card">
                <el-row class="type">
                  <el-col :span="3">
                    <span>领域分类：</span>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" @click="getSoft('')">全部</el-button>
                  </el-col>
                  <el-col :span="3" v-for="(item,index) in areaTypeList" :key="index">
                    <el-button
                      :class="{active:active==index}"
                      type="text"
                      @click="getSoft(item.id,index)"
                    >{{item.name}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="type">
                  <el-col :span="3">
                    <span>开发商：</span>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" @click="getSoft('')">全部</el-button>
                  </el-col>
                  <el-col :span="3" v-for="(item,index) in developersList" :key="index">
                    <el-button
                      type="text"
                      :class="{active:active_b==index}"
                      @click="getSoft_b(item.id,index)"
                    >{{item.name}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="type">
                  <el-col :span="3">
                    <span>应用级别：</span>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" @click="getSoft('')">全部</el-button>
                  </el-col>
                  <el-col :span="3" v-for="(item,index) in levelList" :key="index">
                    <el-button
                      type="text"
                      :class="{active:active_c==index}"
                      @click="getSoft_c(item.id,index)"
                    >{{item.name}}</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="searchTables">
          <el-col :span="22" :offset="1">
            <el-card class="box-card">
              <div slot="header" class="clearfix" style="height: 50px">
                <el-col :span="2" :offset="1">
                  <span>排序：</span>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="getSoft()">默认</el-button>
                </el-col>
                <el-col :span="3">
                  <el-button type="text" @click="getSoft()">
                    总销量
                    <i class="el-icon-top"></i>
                  </el-button>
                </el-col>
                <el-col :span="3">
                  <el-button type="text" @click="getSoft()">
                    上架时间
                    <i class="el-icon-top"></i>
                  </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="getSoft()">
                    评分
                    <i class="el-icon-top"></i>
                  </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="getSoft()">
                    价格
                    <i class="el-icon-top"></i>
                  </el-button>
                </el-col>
              </div>
              <div class="softContent">
                <!--softInfo-->
                <div v-for="(item,index) in appList" :key="index">
                  <el-row>
                    <el-col :span="2" class="softImg">
                      <el-button type="text" @click="toDetail(item)" style="padding:0px">
                        <img
                          v-if="item.softIcon===''||item.softIcon===null||item.softIcon===undefined"
                          src="../assets/img/soft_demo1.jpg"
                          height="80"
                          width="80"
                        />
                        <img
                          v-if="item.softIcon!==''&&item.softIcon!==null&&item.softIcon!==undefined"
                          :src="'data:image/jpg;base64,'+item.softIcon"
                          height="80"
                          width="80"
                        />
                      </el-button>
                    </el-col>
                    <el-col :span="5" :offset="1" class="softInfo">
                      <el-row v-if="item.softCategory3Id!=='1'">
                        <div v-if="username!==null" style="cursor: pointer">
                          <h3 class="appName">{{item.appName}}</h3>
                        </div>
                        <div v-if="username===null">
                          <h3 class="appName">{{item.appName}}</h3>
                        </div>
                      </el-row>
                      <el-row style="margin-top:20px">
                        <span class="company">开发商：{{item.creator}}</span>
                      </el-row>
                    </el-col>
                    <el-col :span="6" :offset="1" style="margin-top: 10px">
                      <el-row>
                        <el-col :span="6">评分：</el-col>
                        <el-col :span="16">
                          <el-rate
                            v-model="testScore"
                            disabled
                            text-color="#ff9900"
                            score-template="{value}"
                          ></el-rate>
                        </el-col>
                      </el-row>
                      <el-row style="margin-top: 15px;">
                        <span class="downCount">下载量{{item.downCount}}件</span>
                      </el-row>
                    </el-col>
                    <el-col :span="3" :offset="1" style="margin-top: 5px">
                      <el-row v-if="item.auth==='true'">
                        <el-button type="button" size="medium" disabled>已获取</el-button>
                      </el-row>
                      <el-row v-if="item.auth==='false'||item.auth===undefined">
                        <el-button type="button" size="medium" @click="downSoft(item.id)">点击获取</el-button>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-divider></el-divider>
                </div>
                <!--softInfo-->
                <!--page-->
                <el-row style="text-align: center">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15]"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                  ></el-pagination>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 本地文件库TAB -->
      <el-tab-pane label="本地文件库" name="fileList">
        <el-container>
          <el-aside width="200px">
            <el-row>
              <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>分类一</span>
                  </template>
                  <el-menu-item index="1-1">选项1</el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">分类二</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title">分类三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">分类四</span>
                </el-menu-item>
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
              <el-row style="max-height: 500px;">
                <!-- 文件服务循环 -->
                <el-col
                  :span="4"
                  :offset="1"
                  v-for="(item,index) in fileList"
                  :key="index"
                  style="padding:5px"
                >
                  <el-card class="box-card fileCard" :body-style="{padding:'10px'}">
                    <el-row>
                      <img src="../assets/img/soft_demo1.jpg" height="100%" width="100%" />
                    </el-row>
                    <el-row>
                      <h5>{{item.fileName}}</h5>
                    </el-row>
                    <el-row>
                      <el-col :span="11" :offset="13">
                        <el-button type="text">
                          <i class="el-icon-download"></i>
                        </el-button>
                        <el-button type="text">
                          <i class="el-icon-delete-solid"></i>
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <!-- 新增服务 -->
                <el-col :span="4" :offset="1" style="padding:5px">
                  <el-card class="box-card fileCard" :body-style="{padding:'30px'}">
                    <el-row style="height:80px;text-align:center;">
                      <el-upload action :limit="1">
                        <el-button type="text">
                          <i class="el-icon-circle-plus-outline" style="font-size:50px"></i>
                        </el-button>
                      </el-upload>
                    </el-row>
                    <el-row>
                      <h5>添加新服务</h5>
                    </el-row>
                  </el-card>
                </el-col>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "appList",
  data() {
    return {
      activeTab: "appList",
      menuId: "",
      username: null,
      commonSearch: "",
      testScore: 3.8,
      areaTypeList: [
        { id: 0, name: "工业1" },
        { id: 1, name: "工业2" },
        { id: 2, name: "工业3" },
        { id: 3, name: "工业4" }
      ],
      developersList: [
        { id: 0, name: "开发商a" },
        { id: 1, name: "开发商b" },
        { id: 2, name: "开发商c" },
        { id: 3, name: "开发商d" }
      ],
      levelList: [
        { id: 0, name: "一级" },
        { id: 1, name: "二级" },
        { id: 2, name: "三级" },
        { id: 3, name: "四级" }
      ],
      appList: [
        { appName: "CATIA", creator: "开发商a", downCount: 10 },
        { appName: "CATIA", creator: "开发商a", downCount: 10 },
        { appName: "CATIA", creator: "开发商a", downCount: 10 },
        { appName: "CATIA", creator: "开发商a", downCount: 10 },
        { appName: "CATIA", creator: "开发商a", downCount: 10 }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      fileCurrentPage: 1,
      filePageSize: 10,
      fileTotal: 0,
      active: -1,
      active_b: -1,
      active_c: -1,
      param: {
        current: 1,
        size: 5,
        sort: "id",
        dir: "asc"
      },
      fileParam: {
        current: 1,
        size: 5,
        sort: "id",
        dir: "asc"
      },
      searchFileItem: "",
      fileList: [
        { id: 0, fileName: "软件名1" },
        { id: 1, fileName: "软件名2" },
        { id: 2, fileName: "软件名3" },
        { id: 3, fileName: "软件名4" },
        { id: 4, fileName: "软件名5" },
        { id: 5, fileName: "软件名6" },
        { id: 6, fileName: "软件名7" }
      ]
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    //获取分类
    getAreaType() {
      this.$axios
        .get("")
        .then(res => {
          if (res.data.data.length > 0) this.areaTypeList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getIndustryType() {
      this.$axios
        .get("")
        .then(res => {
          if (res.data.data.length > 0) this.developersList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPayType() {
      this.$axios
        .get("")
        .then(res => {
          if (res.data.data.length > 0) this.levelList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查找软件
    getSoft(val, i) {
      this.active = i;
      if (sessionStorage.getItem("username") !== null)
        this.param.username = sessionStorage.getItem("username");
      this.param.appName = this.searchCommon;
      this.param.softMenu = this.menuId;
      this.param.softCategory = val;
      this.$axios
        .post("", this.param)
        .then(res => {
          this.total = res.data.data.total;
          this.currentPage = res.data.data.current;
          this.pageSize = res.data.data.size;
          this.appList = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSoft_b(val, i) {
      this.active_b = i;
      if (sessionStorage.getItem("username") !== null)
        this.param.username = sessionStorage.getItem("username");
      this.param.appName = this.searchCommon;
      this.param.softMenu = this.menuId;
      this.param.softCategory = val;
      this.$axios
        .post("", this.param)
        .then(res => {
          this.total = res.data.data.total;
          this.currentPage = res.data.data.current;
          this.pageSize = res.data.data.size;
          this.appList = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSoft_c(val, i) {
      this.active_c = i;
      if (sessionStorage.getItem("username") !== null)
        this.param.username = sessionStorage.getItem("username");
      this.param.appName = this.searchCommon;
      this.param.softMenu = this.menuId;
      this.param.softCategory = val;
      this.$axios
        .post("", this.param)
        .then(res => {
          this.total = res.data.data.total;
          this.currentPage = res.data.data.current;
          this.pageSize = res.data.data.size;
          this.appList = res.data.data.records;
        })
        .catch(err => {
          console.log(err);
        });
    },
    initPage() {
      this.total = this.appList.length;
      this.fileTotal = this.fileList.length;
      // this.menuId=sessionStorage.getItem('menuId');
      // this.username=sessionStorage.getItem('username');
      // this.getAreaType();this.getIndustryType();this.getPayType();
      // this.getSoft("");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.param = {
        current: 1,
        size: val,
        sort: "id",
        dir: "asc"
      };
      this.getSoft("");
    },
    handleCurrentChange(val) {
      this.param = {
        current: val,
        size: this.pageSize,
        sort: "id",
        dir: "asc"
      };
      this.getSoft("");
    },
    //tab点击事件
    handleClick() {},
    toDetail(obj) {
      this.$emit("getObj", obj);
    },
    //立即获取
    downSoft(softId) {
      if (sessionStorage.getItem("username") === null) {
        this.$message({
          message: "请登录用户,进行获取",
          type: "warning"
        });
      } else {
        let param = {
          username: sessionStorage.getItem("username"),
          softId: softId
        };
        this.$axios
          .get("/soft-auth/soft-order", { params: param })
          .then(res => {
            this.$message({
              message: "已成功获取该服务",
              type: "success"
            });
            this.getSoft("");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //云服务
    toSAAS(softId) {
      const loading = this.$loading({
        lock: true,
        text: "正在打开软件……",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$axios
        .post("/send-request/use-desktop", {
          username: sessionStorage.getItem("username"),
          softwareId: softId
        })
        .then(res => {
          // console.log(res);
          if (res.data.success === true) {
            setTimeout(() => {
              window.open(res.data.desktopAddr);
              loading.close();
            }, 5000);
          } else {
            loading.close();
            alert("打开软件失败，请重试或联系管理员！");
          }
          // console.log(res.data);
        })
        .catch(err => {
          loading.close();
          alert("打开软件失败，请重试或联系管理员！");
          console.log(err);
        });
    },
    ////////////////////////////文件
    //查找文件
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
.searchTypes {
  margin: 5px 0px;
}
.searchTypes .type {
  margin: 20px 0px;
}
.softImg {
  margin: 5px;
}
.softContent span {
  font-size: 13px;
}
.softInfo {
  margin-top: 10px;
}
.softContent {
  max-height: 500px;
  overflow: auto;
}
.softContent a {
  color: #000000;
}
.searchTypes button,
.el-card__header button {
  padding: 0px;
}
.el-card__header .el-col {
  margin-bottom: 5px;
}
.searchForm {
  margin-top: 30px;
}
.softContent span {
  font-size: 13px;
}
el-card__header button {
  padding: 0px;
}
.active {
  color: #666 !important;
}
.fileCard h5 {
  text-align: center;
}
.fileCard .el-button {
  padding: 0px;
  margin-top: 10px;
}
</style>
