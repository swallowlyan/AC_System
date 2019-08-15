<template>
  <div class="login-page" :style="{height:heightData}">
    <el-row>
      <el-col :span="6" :offset="12" style="margin-top:50px;margin-bottom: 50px">
        <el-card class="box-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户登录" name="userLogin">
              <el-form :model="userForm" :rules="formRule" ref="userForm" label-width="100px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="验证码"  prop="result">
                  <el-input placeholder="请输入验证码" v-model="userForm.result" style="float: left;width: 55%"></el-input>
                    <span style="display: inline-block;border: 1px solid #D7D7D7;float: left;height: 35px" @click="changeCodeImg()">
                    <img :src="imgCodeUrl" style="width: 80px;height: 35px;cursor: pointer;"/>
                  </span>
                </el-form-item>
              </el-form>
              <el-row><el-col :span="13" :offset="5">
                <el-button type="primary" @click="submitForm('userForm')">登录</el-button>
              </el-col>
              </el-row>
                <el-row><el-col :span="13" :offset="5">
                  <router-link  to="/register" ><el-button>立即注册</el-button></router-link>
                </el-col>
                </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "LoginPage",
    data() {
      return {
        activeName: "userLogin",
        imgCodeUrl:"/api/genVerCode",
        userForm: {
          username: "",
          password: "",
          result: "",
        },
        heightData:0,
        formRule: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          result: [{required: true, message: '请输入验证码', trigger: 'blur'}],
        }
      }
    },
    mounted(){
      this.resize();
     window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
    created(){
      this.changeCodeImg();
    },
    methods: {
      resize() {
      const r = Math.max(document.documentElement.clientHeight, 768);
      this.heightData = r - 120 + 'px';
    },
      changeCodeImg(){
        let num=Math.ceil(Math.random()*10);
        this.imgCodeUrl = "/api/genVerCode?" + num;
      },
      submitForm() {
            this.$axios.post("login", this.userForm).then((response) => {
              if (response.data.code === 0) {
                sessionStorage.setItem('userToken',response.headers.authorization);
                //个人用户
                sessionStorage.setItem('username',this.userForm.username);
                if(response.data.data!==null){//企业用户|管理员用户
                  sessionStorage.setItem('roleId',response.data.data.roleId);
                  sessionStorage.setItem('userType',response.data.data.userType);
                  sessionStorage.setItem('enterpriseId',response.data.data.groupId);
                }
                this.$router.push('/');
               /* if (response.data.data.roleId === 1) {
                  this.$router.push('/');
                } else if (response.data.data.roleId === 2) {
                  this.$router.push('/');
                } else {
                  this.$router.push('/homePage');
                }*/

              } else {
                this.$message.error(response.data.message);
              }
            })
              .catch((err) => {
                console.log(err);
              })

      }
    }
  }
</script>

<style scoped>
  .login-page{
    width:100%;
    height:100%;
    background-size:100% 100%!important;
    background: url("../assets/login_bg.jpg") no-repeat;
  }
  .box-card{background-color: #ffffff}
  .el-row button{width: 100%;margin: 10px 0px}
</style>

