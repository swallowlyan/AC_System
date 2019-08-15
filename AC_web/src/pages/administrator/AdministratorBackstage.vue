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
      <div  v-for="(button, index) in buttons" :key="index">
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
              { title: '用户注册审批',index:'1',url:'/administrator-backstage/index'},
              { title: '服务发布审批', index:'2',url:'/administrator-backstage/approval-service'},
              { title: '运行软件列表',index:'10',url:'/administrator-backstage/servicesRunningList'},
              { title: '服务类别配置',index:'3',url:'/administrator-backstage/category-configuration'},
              { title: '综合统计分析', index:'4',url:'/administrator-backstage/comprehensive-statistics'},
              { title: '平台用户管理',index:'5',url:'/administrator-backstage/user-management'},
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
