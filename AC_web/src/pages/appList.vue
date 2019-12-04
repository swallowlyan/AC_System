<template>
  <div id="appList">
    <el-row class="searchTables" style="padding:20px 0px">
      <el-col :span="22" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height: 30px;background-color:#ffffff">
            
            <el-col :span="8" :offset="16">
              <span style="font-weight: bold;font-size: 14px;">排序：</span>
              <el-button-group>
              <el-button size="small" @click="getSoft()">默认</el-button>
              <el-button size="small" @click="getSoft()">
                下载量
                <i class="el-icon-top"></i>
              </el-button>
              <el-button size="small" @click="getSoft()">
                上架时间
                <i class="el-icon-top"></i>
              </el-button>
              <el-button size="small" @click="getSoft()">
                评分
                <i class="el-icon-top"></i>
              </el-button>
              </el-button-group>
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
      fileType: [],
      fileList: [],
      selectedFileType: ""
    };
  },
  mounted() {
    this.initPage();
    this.searchFile(1);
    this.getFileType();
  },
  methods: {
    //获取分类
    getAreaType() {
      this.$axios
        .get(baseUrl + "")
        .then(res => {
          if (res.data.errcode==="0") this.areaTypeList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getIndustryType() {
      this.$axios
        .get(baseUrl + "")
        .then(res => {
          if (res.data.data.length > 0) this.developersList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPayType() {
      this.$axios
        .get(baseUrl + "")
        .then(res => {
          if (res.data.data.length > 0) this.levelList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFileType() {
      this.$axios
        .get(baseUrl + "/admin/file/types")
        .then(res => {
          if (res.data.errcode==="0") this.fileType = res.data.data;
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
        .post(baseUrl + "", this.param)
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
        .post(baseUrl + "", this.param)
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
        .post(baseUrl + "", this.param)
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
          .get(baseUrl + "/soft-auth/soft-order", { params: param })
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
    ////////////////////////////文件
    //查找文件
    searchFile(page) {
      let param = {
        pageIndex: page,
        pageSize: this.filePageSize
      };
      if (this.searchFileItem !== "") param.fileId = this.searchFileItem;
      if (this.selectedFileType !== "") param.fileType = this.selectedFileType;
      this.$axios
        .get(baseUrl + "/admin/file/list?" + this.$qs.stringify(param))
        .then(res => {
          this.fileTotal = res.data.data.total;
          this.fileList = res.data.data.records;
        })
        .catch(err => {});
    },
    fileSizeChange(val) {
      this.filePageSize = val;
      this.searchFile(1);
    },
    fileCurrentChange(val) {
      this.searchFile(val);
    },
    //选中文件分类
    fileTypeSelect(index, indexPath) {
      this.selectedFileType = index;
      this.searchFile(1);
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
.searchTypes button{
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
