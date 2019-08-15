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
              { title: '开发者控制台',index:'1',url:'/developers-workbench/Console'},
              { title: '工业APP开发环境', index:'2',url:'/developers-workbench/Console'},
              { title: '微服务组件开发环境',index:'3',url:'/developers-workbench/Console'},
              { title: '平台API检索', index:'4',url:'/developers-workbench/Console'},
              { title: '工业APP运行工具',index:'5',url:'/developers-workbench/Console'},
              { title: '工业APP上传',index:'6',url:'/developers-workbench/upload-service'},
              { title: '微服务组件上传' ,index:'7',url:'/developers-workbench/upload-service'},
              { title: '我的上传',index:'8',url:'/developers-workbench/Upload'},
              { title: '我的收入',index:'8',url:'/developers-workbench/Console'}
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
