<template>
  <div id="ind_div">
    <el-container>
      <el-header class="header">
        <el-row>
          <el-col :span="4">
            <img
              src="../assets/img/logo_top.png"
              height="100%"
              width="100%"
              style="margin-top:10px"
            />
          </el-col>
          <el-col :span="1" style="float: right;margin-top:25px">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link dropdownArea" style="font-size:15px;">
                Admin<i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="dropMenu">
                <!-- <el-dropdown-item icon="el-icon-circle-check-outline">
                  <router-link to="/">
                    <i class="fa fa-key" aria-hidden="true"></i>修改密码
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-check-outline">
                  <router-link to="/">
                    <i class="fa fa-user" aria-hidden="true"></i>个人信息
                  </router-link>
                </el-dropdown-item> -->
                <el-dropdown-item icon="el-icon-circle-check-outline">
                  <el-button type="text" @click="loginOut" style="color:#11a7b8">
                    <i class="fa fa-power-off" aria-hidden="true"></i>登出
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col
            :span="1"
            class="dropdownArea"
            style="float: right;margin-top:20px;font-size:25px;"
          >
            <i class="el-icon-bell" aria-hidden="true"></i>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" style="height:100%">
          <el-row>
            <el-col :span="24">
              <el-menu
                style="height:650px;text-align:center"
                :default-active="currentIndex"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#16394c"
                text-color="#909399"
              >
                <div v-for="(button, index) in buttons" :key="index">
                  <router-link
                    v-if="!button.ifChild"
                    :to="button.url"
                    @click.native="changeTitle(button)"
                  >
                    <el-menu-item :index="button.index" :key="index">
                      <span slot="title" v-if="button.title==='首页'">
                        <i :class="button.icon" aria-hidden="true"></i>
                        首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页
                      </span>
                      <span slot="title" v-if="button.title!=='首页'">
                        <i :class="button.icon" aria-hidden="true"></i>
                        {{button.title}}
                      </span>
                    </el-menu-item>
                  </router-link>
                  <el-submenu v-if="button.ifChild" :index="button.index" class="childMenu">
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
        <el-main style="margin-top:10px">
          <el-breadcrumb
            v-show="false"
            separator-class="el-icon-arrow-right"
            style="margin-bottom:10px"
          >
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
      currentTitle: "首页",
      currentIndex: "1",
      ifChildTitle: false,
      childTitle: "",
      buttons: [
        {
          title: "首页",
          index: "1",
          url: "/",
          ifChild: false,
          icon: "el-icon-s-home"
        },
        {
          title: "终 端 管 理",
          index: "2",
          url: "/terminalManege",
          ifChild: false,
          icon: "el-icon-s-platform"
        },
        {
          title: "容 器 管 理",
          index: "3",
          url: "/containerManege",
          ifChild: false,
          icon: "el-icon-c-scale-to-original"
        },
        {
          title: "微应用管理",
          index: "4",
          url: "/applicationManege",
          ifChild: false,
          icon: "el-icon-news"
        },
        {
          title: "文 件 服 务",
          index: "5",
          url: "/fileService",
          ifChild: false,
          icon: "el-icon-folder"
        },
        {
          title: "任 务 模 块",
          index: "6",
          url: "/taskList",
          ifChild: false,
          icon: "el-icon-s-order"
        },
        {
          title: "应 用 商 店",
          index: "7",
          url: "/appList",
          ifChild: false,
          icon: "el-icon-s-goods"
        },
        // {
        //   title: "告警推送",
        //   index: "7",
        //   url: "/alarmPush",
        //   ifChild: false,
        //   icon: "fa fa-warning"
        // },
        {
          title: "系 统 管 理",
          index: "8",
          url: "/",
          ifChild: true,
          icon: "el-icon-s-tools",
          child: [
            { title: "租户管理", index: "1", url: "/tenantManage", icon: "" },
            { title: "用户管理", index: "2", url: "/userManage", icon: "" }
            // { title: "用户总览", index: "3", url: "/userOverview", icon: "" }
          ]
        }
      ]
    };
  },
  mounted() {
    this.ifChildTitle = false;
    let url = window.location.href;
    this.buttons.forEach(item => {
      if (item.ifChild) {
        item.child.forEach(child => {
          if (url.indexOf(child.url.substr(1)) > -1) {
            this.currentTitle = child.title;
            this.currentIndex = item.index;
          }
        });
      } else {
        if (url !== "/") {
          if (url.indexOf(item.url.substr(1)) > -1) {
            this.currentTitle = item.title;
            this.currentIndex = item.index;
          }
        } else {
          this.currentTitle = this.buttons[0].title;
          this.currentIndex = this.buttons[0].index;
        }
      }
    });
  },
  methods: {
    loginOut() {
      sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
    changeTitle(e, index) {
      this.currentTitle = e.title;
      if (index === undefined) {
        this.ifChildTitle = false;
      } else {
        this.ifChildTitle = true;
        this.childTitle = e.child[index].title;
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
.dropMenu {
  background-color: #ffffff;
}
.dropMenu a:link,.dropMenu a:visited{
color: #11a7b8;
}
.dropMenu li:hover {
  background-color: #2aa9b865;
}
.el-header {
  background-color: #ffffff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.3);
}
.header h1 {
  padding: 10px 0px;
}
.dropdownArea {
  color: #11a7b8;
  cursor: pointer;
}
.el-menu-item,
.childMenu span {
  font-size: 16px;
}
.el-menu-item.is-active {
  color: #ffffff;
  background-color: #11a7b8 !important;
  border-bottom: 0px solid #e5e5e5;
  border-radius: 15px 0 15px 0;
}
.el-menu-item {
  height: 66px;
}
.childMenu .el-menu-item {
  font-size: 14px;
}
.el-breadcrumb {
  line-height: 30px !important;
}
</style>
