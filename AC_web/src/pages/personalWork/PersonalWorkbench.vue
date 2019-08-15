<template>
    <div class="main-page" style="height:;margin-top:15px">
   <el-row class="tac" style="height:100%">
  <el-col :span="4" style="height:100%;background-color:#447edf">
    <el-menu
    style="height:850px;text-align:center"
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#447edf"
      text-color="#fff"
      active-text-color="#fff">
      <div  v-for="(button, index) in buttons"  :key="index">
      <router-link :to="button.url">
        <el-menu-item :index="button.index"
        :key="index">
        <span slot="title">
            {{button.title}}
          </span>
        </el-menu-item>
      </router-link>
      </div>
    </el-menu>
  </el-col>
  <el-col :offset="1" :span="19" class="line_style">
     <router-view/>
  </el-col>
</el-row>


    </div>
</template>

<script>
    import MyHeader from "../../components/MyHeader";
    export default {
        name: "MainPage",
      components: {MyHeader},

      data(){
          return{
            username:'',
            roleId:'',
            buttons: [
              { title: '常用服务',index:'1',url:'/personal-workbench/common-services'},
              { title: '历史服务', index:'2',url:'/personal-workbench/historical-services'},
              { title: '已购买服务',index:'3',url:'/personal-workbench/purchased-services'},
              { title: '已收藏服务', index:'4',url:'/personal-workbench/collection-services'},
              { title: '全部上架服务',index:'5',url:'/'},
              { title: '运行软件列表',index:'10',url:'/personal-workbench/servicesRunningList'},
              { title: '我的上传' ,index:'6',url:'/personal-workbench/my-upload'},
              { title: '我的数据',index:'7',url:''},
              { title: '我的订单',index:'8',url:''},
              { title: '我的收入' ,index:'9',url:''},
              { title: '我的企业',index:'10',url:'/personal-workbench/my-business'},
              { title: '账号管理',index:'11',url:''},
            ],
          }
      },

      mounted(){
          this.getUsername();
          this.getRoleId();
      },

      methods:{
        getUsername(){
          this.username = sessionStorage.getItem('username');
          // console.log(this.username);
        },

        getRoleId(){
          this.roleId = sessionStorage.getItem("roleId");
          // console.log(this.roleId);
        },
         handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
      },
    }
</script>

<style scoped>
.main-part{
  margin: 20px;
}
.line_style div{
 margin:10px 0;
}
.line_style div span{
 display:inline-block;
 width:120px;
}
.demo-input-suffix{
 display:flex;
 align-items:center;
}
</style>
