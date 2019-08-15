<template>
  <div class="register-page":style="{height:heightData}">
    <el-row>
    <el-col :span="8" :offset="7" style="margin-top:50px;margin-bottom: 50px">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人用户注册" name="userRegister">
          <el-row>
            <el-form :model="userForm" :rules="registerRule" ref="userForm" label-width="100px">
              <el-form-item label="账号" prop="username">
                <el-input v-model="userForm.username" placeholder="请输入您的账号"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="passwd">
                <el-input v-model="userForm.passwd" type="password" placeholder="请输入您的密码"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="userForm.email" placeholder="请输入您的电子邮箱"></el-input>
              </el-form-item>
              <el-form-item label="联系地址">
                <el-input v-model="userForm.address" placeholder="请输入您的联系地址"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="nickname">
                <el-input v-model="userForm.nickname" placeholder="请输入您的姓名"></el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="userForm.userCode" placeholder="请输入您的身份证号"></el-input>
              </el-form-item>
              <el-form-item label="手机号"prop="phone">
                <el-input v-model="userForm.phone" placeholder="请输入您的手机号"></el-input>
              </el-form-item>
              <!--<el-form-item label="验证码">
                <el-input v-model="userForm.verificationCode" placeholder="请输入验证码"></el-input>
              </el-form-item>-->
            </el-form>
            <el-row><el-col :span="13" :offset="5">
              <el-button type="primary" @click="userRegister('userForm')">立即注册</el-button>
            </el-col>
            </el-row>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="企业用户注册" name="enterpriseRegister">
          <el-row>
            <el-form :model="enterpriseForm" :rules="enterpriseRule" ref="enterpriseForm" label-width="120px">
              <el-form-item label="账号" prop="username">
                <el-input v-model="enterpriseForm.username" placeholder="请输入您的账号"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="passwd">
                <el-input v-model="enterpriseForm.passwd" type="password" placeholder="请输入您的密码"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="enterpriseForm.email" placeholder="请输入您的电子邮箱"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="enterpriseForm.name" placeholder="请输入您的姓名"></el-input>
              </el-form-item>
              <el-form-item label="企业名" prop="nickname">
                <el-input v-model="enterpriseForm.nickname" placeholder="请输入您的手机号"></el-input>
              </el-form-item>
              <el-form-item label="企业信用代码" prop="orgId">
                <el-input v-model="enterpriseForm.orgId" placeholder="请输入您的企业信用代码"></el-input>
              </el-form-item>
              <el-form-item label="联系地址">
                <el-input v-model="enterpriseForm.addr" placeholder="请输入您的联系地址"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="enterpriseForm.phone" placeholder="请输入您的手机号"></el-input>
              </el-form-item>
              <!--<el-form-item label="验证码">
                <el-input v-model="enterpriseForm.verificationCode" placeholder="请输入验证码"></el-input>
              </el-form-item>-->
            </el-form>
            <el-row><el-col :span="13" :offset="5">
              <el-button type="primary" @click="enterpriseRegister('enterpriseForm')">立即注册</el-button>
            </el-col>
            </el-row>
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
        name: "signPage",
      data(){
        let checkUsername = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入您的账号'));
          } else {
            const reg = /^[A-Za-z0-9]+$/;
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('账号由数字和英文字母组成，请重新输入'));
            }
          }
        };
        let checkPwd = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入您的密码'));
          } else {
            const reg = /^(\w){6,20}$/;
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('密码由6-20个字母、数字、下划线组成，请重新输入'));
            }
          }
        };
        let checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入您的手机号'));
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
            console.log(reg.test(value));
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的手机号'));
            }
          }
        };

          return {
            activeName: "userRegister",
            userForm:{
              username:"",
              passwd:"",
              email:"",
              address:"",
              nickname:"",
              userCode:"",
              phone:"",
              verificationCode:""
            },
            heightData:0,
            enterpriseForm:{
              username:"",
              passwd:"",
              email:"",
              name:"",
              addr:"",
              nickname:"",
              orgId:"",
              phone:"",
              verificationCode:""
            },
            registerRule: {
              username: [{required: true, message: '请输入您的账号', trigger: 'blur'},
                {validator: checkUsername,trigger: 'blur'}],
              passwd: [{required: true, message: '请输入您的密码', trigger: 'blur'},
                {validator: checkPwd,trigger: 'blur'}],
              email: [
                {required: true, message: '请输入您的邮箱', trigger: 'blur'},
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
              address: [{required: true, message: '请输入您的地址', trigger: 'blur'}],
              nickname: [{required: true, message: '请输入您的姓名', trigger: 'blur'}],
              userCode: [{required: true, message: '请输入您的身份证号码', trigger: 'blur'}],
              phone: [{required: true, message: '请输入您的手机号', trigger: 'blur'},
                {validator: checkPhone,trigger: 'blur'}],
        },
            enterpriseRule: {
              username: [{required: true, message: '请输入您的账号', trigger: 'blur'},
                {validator: checkUsername,trigger: 'blur'}],
              passwd: [{required: true, message: '请输入您的密码', trigger: 'blur'},
                {validator: checkPwd,trigger: 'blur'}],
              email: [
                {required: true, message: '请输入您的邮箱', trigger: 'blur'},
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
              ],
              address: [{required: true, message: '请输入您的地址', trigger: 'blur'}],
              nickname: [{required: true, message: '请输入您的企业名称', trigger: 'blur'}],
              orgId: [{required: true, message: '请输入您的企业信用代码', trigger: 'blur'}],
              phone: [{required: true, message: '请输入您的手机号', trigger: 'blur'},
                {validator: checkPhone,trigger: 'blur'}],
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
      methods:{
        resize() {
          const r = Math.max(document.documentElement.clientHeight, 768);
          this.heightData = r - 120 + 'px';
         },
        userRegister(formName){
          /*this.$refs[formName].validate((valid) => {
            if (valid) {*/
              //username校验
              this.$axios.get('/sysuser/check-username',
                {params:{
                    username:this.userForm.username
                  }
                }).then((res)=>{
                if(res.data.data==="CHECK_NO_EXIST"){
                  //email校验
                  this.$axios.get('/sysuser/check',
                    {params:{
                        column:"email",
                        value:this.userForm.email
                      }
                    }).then((res)=>{
                    if(res.data.data==="CHECK_NO_EXIST"){
                      //phone校验
                      this.$axios.get('/sysuser/check',
                        {params:{
                            column:"phone",
                            value:this.userForm.phone
                          }
                        }).then((res)=>{
                        if(res.data.data==="CHECK_NO_EXIST"){
                          //重复验证已通过，提交信息
                          this.$axios.post('/sysuser/create',this.userForm).then((res)=>{
                            if(res.data.message==="成功"){
                              this.$message({
                                showClose: true,
                                message: "注册成功",
                                type: 'success'
                              });
                              this.$router.push('/');
                            }else{
                              this.$message({
                                showClose: true,
                                message: "注册失败",
                                type: 'error'
                              });
                            }
                          }).catch((err)=>{
                            console.log(err);
                          });
                        }else{
                          this.$message({
                            showClose: true,
                            message: "手机号已存在，请重新输入",
                            type: 'error'
                          });
                        }
                      }).catch((err)=>{
                        console.log(err);
                      });
                    }else{
                      this.$message({
                        showClose: true,
                        message: "邮箱已存在，请重新输入",
                        type: 'error'
                      });
                    }
                  }).catch((err)=>{
                    console.log(err);
                  });
                }else{
                  this.$message({
                    showClose: true,
                    message: "账号已存在，请重新输入",
                    type: 'error'
                  });
                }
              }).catch((err)=>{
                console.log(err);
              });
           /* } else {
              console.log('error submit!!');
              return false;
            }
          });*/
        },
        enterpriseRegister(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //username校验
              this.$axios.get('/sysuser/check-username',
                {params:{
                    username:this.enterpriseForm.username
                  }
                }).then((res)=>{
                if(res.data.data==="CHECK_NO_EXIST"){
                  //email校验
                  this.$axios.get('/sysuser/check',
                    {params:{
                        column:"email",
                        value:this.enterpriseForm.email
                      }
                    }).then((res)=>{
                    if(res.data.data==="CHECK_NO_EXIST"){
                      //phone校验
                      this.$axios.get('/sysuser/check',
                        {params:{
                            column:"phone",
                            value:this.enterpriseForm.phone
                          }
                        }).then((res)=>{
                        if(res.data.data==="CHECK_NO_EXIST"){
                          //重复验证已通过，提交信息
                          this.$axios.post('/sysuser/org-reg',this.enterpriseForm).then((res)=>{
                            if(res.data.message==="成功"){
                              this.$message({
                                showClose: true,
                                message: "注册成功",
                                type: 'success'
                              });
                              this.$router.push('/');
                            }else{
                              this.$message({
                                showClose: true,
                                message: "注册失败",
                                type: 'error'
                              });
                            }
                          }).catch((err)=>{
                            console.log(err);
                          });
                        }else{
                          this.$message({
                            showClose: true,
                            message: "手机号已存在，请重新输入",
                            type: 'error'
                          });
                        }
                      }).catch((err)=>{
                        console.log(err);
                      });
                    }else{
                      this.$message({
                        showClose: true,
                        message: "邮箱已存在，请重新输入",
                        type: 'error'
                      });
                    }
                  }).catch((err)=>{
                    console.log(err);
                  });
                }else{
                  this.$message({
                    showClose: true,
                    message: "账号已存在，请重新输入",
                    type: 'error'
                  });
                }
              }).catch((err)=>{
                console.log(err);
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      }
    }
</script>

<style scoped>
  .register-page{
    width:100%;
    height:100%;
    background-size:100% 100%!important;
    background: url("../assets/login_bg.jpg") no-repeat;
  }
  .box-card{background-color: #ffffff}
  .el-row button{width: 100%;margin: 10px 0px}
  .managerArea{display: none}
</style>
<style>

</style>
