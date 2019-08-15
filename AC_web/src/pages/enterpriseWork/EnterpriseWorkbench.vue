<template>
    <div class="main-page" style="height:;margin-top:15px">
   <el-row class="tac"style="height:100%">
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
            username:sessionStorage.getItem('username'),
            roleId:'',
            buttons: [
              { title: '企业成员管理',index:'1',url:'/enterprise-workbench/index'},
              { title: '企业已购服务', index:'2',url:'/enterprise-workbench/purchased-services'},
              { title: '企业上传服务',index:'3',url:'/enterprise-workbench/my-upload'},
              { title: '企业上传审批', index:'4',url:'/enterprise-workbench/service-approval'},
              { title: '运行软件列表',index:'10',url:'/enterprise-workbench/servicesRunningList'},
              { title: '全部上架服务',index:'5',url:''},
              { title: '企业数据空间' ,index:'6',url:''},
              { title: '企业订单',index:'7',url:''},
              { title: '企业收入',index:'8',url:''}
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
