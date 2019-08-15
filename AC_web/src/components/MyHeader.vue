<template>
    <el-card class="my-header">
      <el-row type="flex" class="header-row">
        <el-col :span="4"><a href="javascript:void (0)" @click="backToHome"><img src="../assets/u149.png"/></a></el-col>
        <el-col :span="1"><img src="../assets/u147.png"/></el-col>
        <el-col :span="12"><h1 class="head-title">工业互联网平台</h1></el-col>
        <el-col :span="2" :offset="2">
          <!--<a href="javascript:void (0)" @click="$goRoute('/main-page/person-info-manage/person-info')"><span>潍柴员工A</span></a>-->
          <!--<img src="../assets/u143.png"/>-->
          <el-dropdown trigger="click" class="drop-down">
            <div>
              <span class="user-span">{{username}}</span><img class="drop-down-pic" src="../assets/u143.png"/>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="javascript:void(0)" @click="$goRoute('/main-page/person-info-manage/person-info')" class="drop-item">个人信息</a></el-dropdown-item>
              <el-dropdown-item><a href="javascript:void(0)" @click="$goRoute('/main-page/person-info-manage/use-record')" class="drop-item" :style="isShow">使用记录</a></el-dropdown-item>
              <el-dropdown-item><a href="javascript:void(0)" @click="$goRoute('/main-page/person-info-manage/modify-password')" class="drop-item">修改密码</a></el-dropdown-item>
              <el-dropdown-item><a href="javascript:void(0)" @click="logOut" class="drop-item">注销</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
    export default {
        name: "MyHeader",

      data(){
          return{
            isShow:'display:none;',
          }
      },

      mounted(){
          if(this.roleId == 1){
            this.isShow='display:none;';
          }else {
            this.isShow='display:block;';
          }
      },

      props:['username','roleId'],

      methods:{
          logOut(){//一个假的注销
            // this.$axios.post("logout").then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
            this.$router.push('/');
          },

        backToHome(){
            // console.log(this.roleId);
          if (this.roleId == 1){
            this.$router.push('/homePage');
          } else if (this.roleId == 2) {
            this.$router.push('/main-page/senior-user/');
          } else {
            this.$router.push('/main-page/general-user/');
          }
        },
      }
    }
</script>

<style scoped>
  a{
    color: #ffffff;
  }

  .user-span{
    color: #ffffff;
    font-size: large;
  }

  .drop-item{
    color: #000000;
  }

  .drop-down{
    margin-top: 15%;
  }

  .drop-down-pic{
    width:10%;
    margin-left: 5px;
  }

  .head-title{
    color: #ffffff;
    /*margin-top: 5%;*/
  }
</style>
