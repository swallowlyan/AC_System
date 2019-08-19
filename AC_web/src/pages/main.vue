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
                  <router-link :to="button.url" @click.native="changeTitle(button)">
                    <el-menu-item :index="button.index" :key="index">
                      <span slot="title">
                        <i :class="button.icon" aria-hidden="true"></i>
                        {{button.title}}
                      </span>
                    </el-menu-item>
                  </router-link>
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
          </el-breadcrumb>
          <router-view :to="{ path:'/'}"/>
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
      buttons: [
        {
          title: "终端管理",
          index: "1",
          url: "/",
          icon: "fa fa-television"
        },
        {
          title: "容器管理",
          index: "2",
          url: "/containerManege",
          icon: "fa fa-university"
        },
        {
          title: "微应用管理",
          index: "3",
          url: "/applicationManege",
          icon: "fa fa-th-large"
        },
        { title: "应用商店", index: "4", url: "/appList", icon: "el-icon-s-goods" },
        { title: "告警推送", index: "5", url: "/alarmPush", icon: "fa fa-warning" },
        { title: "系统管理", index: "6", url: "/", icon: "fa fa-cog" }
      ]
    };
  },
  mounted() {},
  methods: {
    loginOut() {
      sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
    changeTitle(e) {
      this.currentTitle = e.title;
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
.el-menu-item {
  font-size: 16px;
}
.el-breadcrumb {
  line-height: 30px !important;
}
</style>
