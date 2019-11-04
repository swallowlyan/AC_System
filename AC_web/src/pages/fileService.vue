<!--文件服务-->
<template>
  <div id="fileService">
    <el-container>
          <el-aside width="200px">
            <el-row>
              <el-menu
                default-active="-1"
                class="el-menu-vertical-demo"
                @select="fileTypeSelect"
              >
              <el-menu-item index="-1">
                <i class="el-icon-menu"></i>
                <span slot="title">全部</span>
              </el-menu-item>
              <div v-for="(item , index) in typeArr" :key="index">
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
                  <el-input v-model="fileId" placeholder="请输入关键字搜索"></el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                  <el-button type="primary" icon="el-icon-search" @click="searchFile(1)">搜索</el-button>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <el-row style="max-height: 500px;">
                <!-- 文件服务循环 -->
                <el-col
                  :span="4"
                  :offset="1"
                  v-for="(item,index) in tableData"
                  :key="index"
                  style="padding:5px"
                >
                  <el-card class="box-card fileCard" :body-style="{padding:'10px'}">
                    <el-row style="height:110px;width:110px;">
                      <img v-if="item.fileType===0" :src="item.fileUrl" height="100%" width="100%" />
                      <img v-if="item.fileType===1" src="../assets/img/application.png" height="100%" width="100%" />
                      <img v-if="item.fileType===2" src="../assets/img/container.png" height="100%" width="100%" />
                    </el-row>
                    <el-row>
                      <h5>{{item.fileName}}</h5>
                    </el-row>
                    <!-- <el-row>
                      <el-col :span="11" :offset="13">
                        <el-button type="text">
                          <i class="el-icon-download"></i>
                        </el-button>
                        <el-button type="text">
                          <i class="el-icon-delete-solid"></i>
                        </el-button>
                      </el-col>
                    </el-row> -->
                  </el-card>
                </el-col>
              </el-row>
              <el-row style="text-align: center;margin-top:10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="1"
                  :page-sizes="[5, 10, 15]"
                  :page-size="tableLimit"
                  layout="total, prev, pager, next, jumper"
                  :total="tableSize"
                ></el-pagination>
              </el-row>
            </el-main>
          </el-container>
        </el-container>
  </div>
</template>

<script>
export default {
  name: "fileService",
  data() {
    return {
      typeArr:[],
      tableData:[],
      tableSize: 0,
      tableLimit: 10,
      fileId: "",
      selectedFileType:""
    };
  },
  mounted() {
    this.searchFile(1);
    this.getFileType();
  },
  methods: {
    //获取文件类型
    getFileType() {
      this.$axios
        .get(baseUrl + "/admin/file/types")
        .then(res => {
          this.typeArr =  res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchFile(page) {
      this.tableData=[],this.tableSize=0;
      let param = "";
      if (this.fileId !== "")
        param += "&fileId=" + this.fileId;
      else if (this.selectedFileType !== "-1"&&this.selectedFileType !== "")
        param += "&fileType=" + this.selectedFileType;
      this.$axios
        .get(
          baseUrl +
            "/admin/file/list?pageSize=" +
            this.tableLimit +
            "&pageIndex=" +
            page +
            param
        )
        .then(res => {
          this.tableSize = res.data.data.total;
          this.tableData = res.data.data.records;
          return false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.tableLimit = val;
      this.searchFile(1);
    },
    handleCurrentChange(val) {
      this.searchFile(val);
    },
    //选中文件分类
    fileTypeSelect(index, indexPath){
      this.selectedFileType = index;
      this.searchFile(1);
    },
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
