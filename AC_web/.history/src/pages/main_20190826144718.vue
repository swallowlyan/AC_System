<template>
  <div id="ind_div">
    <el-container>
      <el-header class="header">
        <el-row>
          <el-col :span="1" :offset="1">
            <img src="../assets/img/logo.png" height="50" width="50" />
          </el-col>
          <el-col :span="4">
            <h1>AC物联管理系统</h1>
          </el-col>
          <el-col :span="1" style="float: right;margin-top:10px">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link dropdownArea" style="font-size:30px;">
                <i class="el-icon-s-unfold"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="dropMenu">
                <el-dropdown-item icon="el-icon-circle-check-outline">
                  <router-link to="/">
                    <i class="fa fa-key" aria-hidden="true"></i>修改密码
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-check-outline">
                  <router-link to="/">
                    <i class="fa fa-user" aria-hidden="true"></i>个人信息
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-check-outline">
                  <el-button type="text" @click="loginOut">
                    <i class="fa fa-power-off" aria-hidden="true"></i>登出
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col
            :span="1"
            class="dropdownArea"
            style="float: right;margin-top:10px;font-size:25px;"
          >
            <i class="fa fa-bell" aria-hidden="true"></i>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" style="height:100%">
          <el-row>
            <el-col :span="24">
              <el-menu
                style="height:850px;text-align:center"
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="rgb(240,240,240)"
                text-color="#000000"
                active-text-color="#0b54c1"
              >
                <div v-for="(button, index) in buttons" :key="index">
                  <router-link
                    v-if="!button.ifChild"
                    :to="button.url"
                    @click.native="changeTitle(button)"
                  >
                    <el-menu-item :index="button.index" :key="index">
                      <span slot="title">
                        <i :class="button.icon" aria-hidden="true"></i>
                        {{button.title}}
                      </span>
                    </el-menu-item>
                  </router-link>
                  <el-submenu  v-if="button.ifChild" :index="button.index" class="childMenu">
                  <template slot="title">
                    <i :class="button.icon"></i>
                    <span>{{button.title}}</span>
                  </template>
                  <div v-for="(child,childIndex) in button.child" :key="childIndex">
                  <router-link
                    v-if="button.ifChild"
                    :to="child.url"
                    @click.native="changeTitle(button,childIndex)"
                  >
                    <el-menu-item :index="button.index+child.index">
                     <i :class="child.icon" aria-hidden="true"></i>
                     {{child.title}}
                     </el-menu-item>
                      </router-link>
                  </div>
                  </el-submenu>
                </div>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px">
            <el-breadcrumb-item :to="{ path: '/' }">
              <i class="fa fa-home" aria-hidden="true" style="font-size:25px;color:rgb(75,131,178)"></i>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{currentTitle}}</el-breadcrumb-item>
             <el-breadcrumb-item v-if="ifChildTitle">{{childTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view :to="{ path:'/'}" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "Ind",
  components: {},
  data() {
    return {
      currentTitle: "终端管理",
      ifChildTitle:false,
      childTitle:"",
      buttons: [
        {
          title: "终端管理",
          index: "1",
          url: "/",
          ifChild: false,
          icon: "fa fa-television"
        },
        {
          title: "容器管理",
          index: "2",
          url: "/containerManege",
          ifChild: false,
          icon: "fa fa-university"
        },
        {
          title: "微应用管理",
          index: "3",
          url: "/applicationManege",
          ifChild: false,
          icon: "fa fa-th-large"
        },
        {
          title: "应用商店",
          index: "4",
          url: "/appList",
          ifChild: false,
          icon: "el-icon-s-goods"
        },
        {
          title: "告警推送",
          index: "5",
          url: "/alarmPush",
          ifChild: false,
          icon: "fa fa-warning"
        },
        {
          title: "系统管理",
          index: "6",
          url: "/",
          ifChild: true,
          icon: "fa fa-cog",
          child:[
            {title:"租户管理",
            index:"1",
            url:"/tenantManage",
            icon:""
            },
            {title:"用户管理",
            index:"2",
            url:"/userManage",
            icon:""
            },
            {title:"数据管理",
            index:"3",
            url:"",
            icon:""
            }
          ]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    loginOut() {
      sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
    changeTitle(e,index) {
      this.currentTitle=e.title;
      if(index===undefined){
        this.ifChildTitle=false;
      }else{
          this.ifChildTitle=true;
          this.childTitle=e.child[index].title;
      }
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
.header,
.dropMenu {
  background-color: rgb(75, 131, 178);
  color: #ffffff;
}
.dropMenu li:hover {
  background-color: rgb(102, 167, 219);
}
.header h1 {
  padding: 10px;
}
.dropdownArea {
  color: #ffffff;
  cursor: pointer;
}
.el-menu-item,.childMenu span{
  font-size: 16px;
}
.childMenu .el-menu-item{
  font-size: 14px;
}
.el-breadcrumb {
  line-height: 30px !important;
}
</style>
<style>
.acForm .el-col {
  border-color: rgb(151, 195, 221);
  font-size: 14px;
  padding: 0px;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  line-height: 20px;
}
.acForm .el-form-item {
  margin-bottom: 0px;
}
.list {
  max-height: 100px;
  overflow: auto;
}
.list div {
  width: 150px;
  margin: 0px 10px;
  float: left;
}
.list button {
  margin-left: 10px;
}
.acForm .el-form-item__label {
  background-color: rgb(239, 243, 248) !important;
  height: 100%;
  text-align: center;
}
.acForm .el-form-item {
  height: 100%;
}
.lineHeight .el-form-item__label {
  line-height: 100px;
}
</style>
