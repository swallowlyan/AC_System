<template>
<div id="ind_div">
    <el-container>
    <!-- 头 -->
      <el-header style="height: 90px">
        <div class="top-header">
          <!--<router-link :to="{path:'/homePage'}">-->
        <img src="../assets/common/logo_zhuchi.png" alt="logo" style="float: left;margin:10px;width: 150px">
          <!--</router-link>-->
      <div v-if="username===null" id="noLogin">
        <router-link to="/login">
        <el-button type="text">登录</el-button></router-link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <router-link to="/register">
          <el-button type="text">注册</el-button></router-link>
      </div>
      <span v-if="username!==null" id="welcomeTitle" class="managerArea">欢迎  {{username}}</span>

      <div class="division"></div>
      <div class="title">
        <h3 style="white-space:nowrap!important;">{{pageTitle}}</h3>
      </div>
    <div class="bg_header">
      <el-row style="margin: 0px">
        <el-col :span="1" class="managerArea"
                :style="{display:$route.meta.ifHome==='none'?'none':''}"
                style="font-size: 26px;margin-top: 5px;margin-left: -85px">
          <router-link to="/"><i class="fa fa-home"></i></router-link>
        </el-col>
        <!--:style="{display:$route.meta=='false'||ifMenu?'none':''}"-->
        <el-col :span="15" style="margin-top: 8px" :style="{display:$route.meta.ifMenu==='show'?'':'none'}">
          <el-col :span="3" class="managerArea">
            <router-link to="/"><el-button  type="text">首页</el-button></router-link>
          </el-col>
          <el-col :span="3" class="managerArea" v-for="(item,index) in menuList" :key="index">
            <el-button  type="text" @click="toPage(item.name,item.id)">{{item.name}}</el-button></el-col>
        </el-col>
        <el-col :span="1" class="managerArea"  style="float: right;" :style="{display:ifLogin?'':'none'}">
          <el-dropdown trigger="click">
      <span class="el-dropdown-link" style="margin-right: 0px;font-size: 25px;color: #ffffff">
        <i class="el-icon-s-unfold"></i>
      </span>
            <el-dropdown-menu slot="dropdown" class="dropMenu">
              <!--<el-dropdown-item icon="el-icon-circle-check-outline">资源库首页</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check-outline">我的订单</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check-outline">设置中心</el-dropdown-item>-->
              <el-dropdown-item icon="el-icon-circle-check-outline" :style="{display:userType==='COMMON'?'':'none'}">
                <router-link  to="/personal-workbench">个人工作台</router-link>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check-outline" :style="{display:userType==='SENIOR'?'':'none'}">
                <router-link  to="/enterprise-workbench/index">企业工作台</router-link>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check-outline" :style="{display:userType==='SUPER'?'':'none'}">
                <router-link  to="/administrator-backstage/index">管理员工作台</router-link>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-check-outline">
                <el-button type="text" @click="logOut">注销</el-button>
                </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
    </el-row>
      </div>
        </div>
      </el-header>
    <!-- 身体 -->
      <el-main style="padding: 0px 20px;">
          <router-view :getIfPerson="getIfPerson" v-on:toDetail="toDetailObj" ref="listPage"/>
      </el-main>
      <!--footer-->
      <el-footer height="280px" :style="{display:$route.meta.ifFooter==='show'?'':'none'}">
        <el-row class="footer">
          <el-col :span="5" :offset="3">
            <el-row style="margin: 10px">
              <el-col :span="6">
                <h1 style="font-size: 40px"><i class="el-icon-headset"></i></h1>
              </el-col>
              <el-col :span="14"><el-row class="footer_title"><span>客服热线</span></el-row>
                <el-row><h3 style="font-weight: normal">0532-123456</h3></el-row>
              </el-col>
            </el-row>
            <el-row style="margin: 10px">
              <el-col :span="6">
                <h1 style="font-size: 40px"><i class="el-icon-message"></i></h1>
              </el-col>
              <el-col :span="14"><el-row class="footer_title"><span>电子邮箱</span></el-row>
                <el-row><h3 style="font-weight: normal">qdiscas@iscas.com</h3></el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="1" style="height: 135px">
            <el-divider direction="vertical" style="height: 135px !important;"></el-divider>
          </el-col>
          <el-col :span="14">
            <el-row>
              <el-col :span="5">
                <el-row class="footer_title"><h5>服务与支持</h5></el-row>
                <el-row class="footer_content"><small>常见问题</small></el-row>
                <el-row class="footer_content"><small>用户手册</small></el-row>
                <el-row class="footer_content"><small>在线咨询</small></el-row>
                <el-row class="footer_content"><small>企业认证</small></el-row>
                <el-row class="footer_content"><small>产品建议与反馈</small></el-row>
              </el-col>
              <el-col :span="5">
                <el-row class="footer_title"><h5>账户管理</h5></el-row>
                <el-row class="footer_content"><small>充值管理</small></el-row>
                <el-row class="footer_content"><small>线下汇款</small></el-row>
                <el-row class="footer_content"><small>合同申请</small></el-row>
                <el-row class="footer_content"><small>索取发票</small></el-row>
              </el-col>
              <el-col :span="5">
                <el-row class="footer_title"><h5>关于我们</h5></el-row>
                <el-row class="footer_content"><small>公司概况</small></el-row>
                <el-row class="footer_content"><small>网站导航</small></el-row>
              </el-col>
              <el-col :span="7">
                <el-row class="footer_title"><h5>关注株齿工业互联网平台</h5></el-row>
                <el-row><img src="../assets/code.png" width="120" height="120"/></el-row>
              </el-col>
            </el-row>

          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: "Ind",
    components:{},
  data(){
      return{
        roleId:"",
        username:"登录系统",
        userType:"",
        enterpriseId:"",
        pageTitle:"",
        menuList:[],
        menuName:"",
        ifPerson:true,
        ifLogin:true
      }
    },
    mounted(){
      this.getMenu();
      this.getStatusParam();
  },
    watch:{
      $route(to,from){
        this.getStatusParam();
        if(to.path==="/homePage")this.getMenu();
      }
    },
    methods:{
     getMenu(){
       this.$axios.get('/menu/list-all').then((res)=>{
         if(res.data.data.length>0)this.menuList=res.data.data;
       }).catch((err)=>{
         console.log(err);
       });
       this.roleId=sessionStorage.getItem('roleId');
     },
      toPage(name,id){
        sessionStorage.setItem('menuId',id);
        sessionStorage.setItem('menuName',name);
       if(name==="首页")this.$router.push("/homePage");
       else if(name==="设备")window.open("http://121.42.250.244/gszy-skydev/app/potal/login.html");
       else {
         if(this.$route.path.indexOf("soft")>-1&&this.$route.path.indexOf("Detail")<0){
           this.$refs.listPage.initPage();
         }else{
           this.$router.push({path: '/soft'});
         }
       }
      },
      getIfPerson(val){
       this.ifPerson=val;
      },
      getStatusParam(){
        this.roleId=sessionStorage.getItem('roleId');
        this.username=sessionStorage.getItem('username');
        this.userType=sessionStorage.getItem('userType');
        this.enterpriseId=sessionStorage.getItem('enterpriseId');
        this.pageTitle="工业互联网平台";
        if(this.$route.path.indexOf("/enterprise")>-1)this.pageTitle="企业工作台";
          else if(this.$route.path.indexOf("/personal-workbench")>-1)this.pageTitle="个人工作台";
          else if(this.$route.path.indexOf("/administrator")>-1)this.pageTitle="管理员工作台";
          else if(this.$route.path.indexOf("/developers")>-1)this.pageTitle="开发者工作台";
        if(this.$route.path==="/login"
          ||this.$route.path==="/register"
          ||this.username===null) this.ifLogin=false;
        else this.ifLogin=true;
      },
      toDetailObj(obj){
        sessionStorage.setItem('menuName',obj.nemuName);
        sessionStorage.setItem('menuId',obj.menuId);
        let detailStr = JSON.stringify(obj);
        sessionStorage.setItem('homeDetail',detailStr);
        this.$router.push({path: '/soft/softDetail'});
      },
      logOut(){
        sessionStorage.clear();
        this.$router.push({path: '/login'});
      }
    },
  }
</script>

<style scoped>
#ind_div{
  background-size: cover;
  height: 100%;
}
.division {
  float: left;
  width: 2px;
  height: 30px;
  background: #dedbdb;
  margin: 15px;
}
.top-header{
  background: url(../assets/head_bg.png) no-repeat right top;
  /*height:55px*/
}
.bg_header {
  background-color: #447EDF;
  height: 35px;
  border-bottom: none;
}
.title {
  width: 200px;
  height: 45px;
  margin-left: 150px;
  padding-top: 15px;
  color: black;
}
#welcomeTitle {
  float: right;
  margin-right: 5%;
  margin-top: 25px;
  color: gray;
  font-weight: bold;
}
#noLogin{
  float: right;
  margin-right: 10%;
  margin-top: 25px;
}
.bg_header>div{
  margin: 6px;
  text-align: center;
}
.bg_header button{
  color:#ffffff;
  padding:0px;
}
.dropMenu a{color: #606266}
.footer{
  height: 280px;
  padding: 80px;
  background: #2E3033;
  color: #ffffff;
}
.footer_title{margin-bottom: 10px}
.footer_content{
  margin: 5px 0px;
  color:rgb(183, 183, 183)
}
  .el-divider--vertical{height: 135px !important;}
</style>
