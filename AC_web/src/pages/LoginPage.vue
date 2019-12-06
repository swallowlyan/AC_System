<template>
<div class="login-page" :style="{height:heightData}">
  <div class="login-wrap">
    <div class="login-logo">
      <img src="../assets/img/login/login-logo.png" alt />
    </div>
    <div class="login-box">
      <h2>
        用户登录
        <small>UserLogin</small>
      </h2>
      <form>
        <label>
          <input type="text" v-model="userForm.username" placeholder="用户名" />
        </label>
        <label>
          <input type="password" v-model="userForm.password" placeholder="密码" />
        </label>
        <p>
          <!-- <a href="#">忘记密码</!-->
        </p>
        <label>
          <label><input type="button" value="登  录" @click="submitForm('userForm')"></label>
        </label>
      </form>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      activeName: "userLogin",
      // imgCodeUrl:"/api/genVerCode",
      userForm: {
        username: "",
        password: ""
        // result: "",
      },
      heightData: 0,
      formRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
        // result: [{required: true, message: '请输入验证码', trigger: 'blur'}],
      }
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  created() {
    // this.changeCodeImg();
  },
  methods: {
    resize() {
      const r = Math.max(document.documentElement.clientHeight, 768);
      this.heightData = r - 50 + "px";
    },
    changeCodeImg() {
      let num = Math.ceil(Math.random() * 10);
      this.imgCodeUrl = "/api/genVerCode?" + num;
    },
    submitForm() {
      this.$router.push("/");
      // this.$axios.post("login", this.userForm).then((response) => {
      //   if (response.data.code === 0) {
      //     sessionStorage.setItem('userToken',response.headers.authorization);
      //     //个人用户
      //     sessionStorage.setItem('username',this.userForm.username);
      //     if(response.data.data!==null){//企业用户|管理员用户
      //       sessionStorage.setItem('roleId',response.data.data.roleId);
      //       sessionStorage.setItem('userType',response.data.data.userType);
      //       sessionStorage.setItem('enterpriseId',response.data.data.groupId);
      //     }
      //     this.$router.push('/');
      //   } else {
      //     this.$message.error(response.data.message);
      //   }
      // })
      //   .catch((err) => {
      //     console.log(err);
      //   })
    }
  }
};
</script>

<style scoped>
.login-page{
    width:100%;
    height:100%;
    background-size:100% 100%!important;
    background: url(../assets/img/login/loginbg.jpg) no-repeat center top;
    font-family: "Work Sans", Arial, sans-serif, "Microsoft YaHei", "微软雅黑";
}
h2,
form,
label,
p {
  margin: 0;
  padding: 0;
}
.login-wrap {
  width: 480px;
  margin: 0 auto;
  padding-top: 6%;
}
.login-wrap .login-logo {
  text-align: center;
  margin-bottom: 40px;
  width: 100%;
}
.login-wrap .login-logo img {
  max-width: 92%;
}
.login-wrap .login-box {
  background: #222543;
  border-radius: 10px;
  padding: 35px 60px;
  width: 360px;
  color: #ffffff;
}
.login-wrap .login-box h2 {
  font-size: 30px;
  font-weight: 100;
  height: 68px;
}
.login-wrap .login-box h2 small {
  font-size: 16px;
  padding-left: 10px;
}
.login-wrap .login-box p {
  font-size: 16px;
  text-align: right;
  line-height: 2em;
  margin-bottom: 8px;
}
.login-wrap .login-box p a {
  color: #ffffff;
  text-decoration: none;
}
.login-wrap .login-box p a:hover {
  color: #11a7b8;
}
.login-wrap .login-box input {
  width: 100%;
  line-height: 48px;
  height: 48px;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
}
.login-wrap .login-box input[type="text"] {
  background: #ffffff url(../assets/img/login/login-icon-user.png) no-repeat 10px 10px;
  text-indent: 2.6em;
  margin-bottom: 26px;
}
.login-wrap .login-box input[type="password"] {
  background: #ffffff url(../assets/img/login/login-icon-pass.png) no-repeat 10px 10px;
  text-indent: 2.6em;
}
.login-wrap .login-box input[type="button"] {
  background: #11a7b8;
  text-align: center;
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
}
.login-wrap .login-box input[type="submit"]:hover {
  background: #14c4d8;
}
@media screen and (max-width: 768px) {
  body {
    background-size: auto 100%;
  }
  .login-wrap {
    width: 90%;
    padding-top: 26%;
  }
  .login-wrap .login-logo img {
    max-width: 78%;
  }
  .login-wrap .login-box {
    background: none;
    padding: 0;
    width: 88%;
    margin: 0 auto;
  }
  .login-wrap .login-box h2 {
    display: none;
  }
}
</style>

