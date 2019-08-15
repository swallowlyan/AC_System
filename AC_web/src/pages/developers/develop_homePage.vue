<template>
  <div id="develop_homePage">
    <!--轮播图-->
    <el-row>
      <el-col :span="24">
        <el-carousel :interval="5000"  indicator-position="none" arrow="always">
          <el-carousel-item v-for="(item,index) in dataImg" :key="index">
            <div class="grid-content">
              <el-row>
                <div>
                  <img :src="item.src">
                </div>
              </el-row>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-row class="Introduction">
      <el-row>
        <h1>产品与服务</h1>
      </el-row>
    <el-row style="text-align:center;margin:20px">
        <span>为开发者提供多种开发环境，支持海量API接入</span>
    </el-row>
    <el-row style="margin-top:50px">
      <el-col :span="4" :offset="4">
        <el-row><h2><i class="fa fa-wrench"></i></h2></el-row>
        <el-row><h3>工业APP开发环境</h3></el-row>
      </el-col>
      <el-col :span="4">
        <el-row><h2><i class="fa fa-briefcase"></i></h2></el-row>
        <el-row><h3>微服务组件开发环境</h3></el-row>
      </el-col>
      <el-col :span="4">
        <el-row><h2><i class="fa fa-skyatlas"></i></h2></el-row>
        <el-row><h3>云API服务</h3></el-row>
      </el-col>
      <el-col :span="4">
        <el-row><h2><i class="fa fa-buysellads"></i></h2></el-row>
        <el-row><h3>工业APP运行工具</h3></el-row>
      </el-col>
    </el-row>
    </el-row>
<el-row class="Solution">
      <el-row>
        <h1>解决方案</h1>
    </el-row>
    <el-row style="margin-top:50px">
      <el-col :span="6" :offset="3">
        <el-row><img src="../../assets/development/logo1.jpg" height="140" width="210"/></el-row>
        <el-row><h2>敏捷开发</h2></el-row>
      </el-col>
      <el-col :span="6">
        <el-row><img src="../../assets/development/logo2.jpg" height="140" width="210"/></el-row>
        <el-row><h2>云端部署</h2></el-row>
      </el-col>
      <el-col :span="6">
        <el-row><img src="../../assets/development/logo3.jpg" height="140" width="210"/></el-row>
        <el-row><h2>工业大数据</h2></el-row>
      </el-col>
    </el-row>
    </el-row>


    <el-row class="Introduction">
      <el-row>
        <h1>技术支持</h1>
    </el-row>
    <el-row style="margin-top:50px">
      <el-col :span="4" :offset="4">
        <el-row><h2><i class="fa fa-file-text-o"></i></h2></el-row>
        <el-row><h3>帮助文档</h3></el-row>
      </el-col>
      <el-col :span="4">
        <el-row><h2><i class="fa fa-tv"></i></h2></el-row>
        <el-row><h3>在线咨询</h3></el-row>
      </el-col>
      <el-col :span="4">
        <el-row><h2><i class="fa fa-list-alt"></i></h2></el-row>
        <el-row><h3>需求管理</h3></el-row>
      </el-col>
      <el-col :span="4">
        <el-row><h2><i class="fa fa-cloud-download"></i></h2></el-row>
        <el-row><h3>云端资料库</h3></el-row>
      </el-col>
    </el-row>
    </el-row>

  </div>
</template>

<script>
    export default {
        name: "homePage",
      data(){
          return {
            softList: [],
            appList: [],
            resourceList: [],
            softCount: 0,
            serviceCount: 0,
            appCount: 0,
            userCount: 0,
            developCount: 0,
            algorithmCount: 0,
            dataImg: [{
              src: require("../../assets/carousel/carousel_1.jpg"),
              name: ""
            },
              {
                src: require("../../assets/carousel/carousel_2.jpg"),
                name: ""
              },
              {
                src: require("../../assets/carousel/carousel_3.jpg"),
                name: ""
              }]
          }
      },
      mounted(){
      },
      methods:{
      }
    }
</script>

<style scoped>
  .Introduction{
    background: url("../../assets/development/develop_bg1.jpg") no-repeat;
    background-size: cover;
    padding: 50px 0px;
    height:400px;
    }
  .Introduction h1{
    font-size: 36px;
    text-align: center;
    font-weight: normal;
  }
  .Introduction h2{
    font-size: 50px;
    text-align: center;
    }
  .Introduction h3{
    font-weight: normal;
    text-align: center;
    margin: 10px
    }
    .Solution{
      background: url("../../assets/development/develop_bg2.jpg") no-repeat;
      background-size: cover;
      padding: 50px 0px;
      height:450px;
    }
    .Solution h1,.Solution h2{
      text-align: center;
      color: #ffffff;
      font-weight: normal
    }
    .Solution h1{font-size: 36px}
    .Solution h2{margin: 20px 0px}
    .Solution img{margin: 0px 20%}
</style>
