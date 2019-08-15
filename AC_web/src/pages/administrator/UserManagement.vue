<template>
  <div>
    <el-row style="border-bottom:1px solid #ddd;":gutter="25">
      <el-col :span="17" >
        <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">用户数据指标</span>
        </div>
        <div class="suffix" style="width:100%;margin-top:30px;">
          <div style="width:25%;" class="style_s"v-for="(data, index) in datas" :key="index">
            <div style="font-size:16px;">{{data.title}}</div>
            <div style="font-size:24px;font-weight:700;">{{data.value}}</div>
            <div style="font-size:14px;">日↑{{data.way}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">数据图</span>
        </div>
        <el-radio-group v-model="radio1"size="mini"style="position:absolute;z-index:99;">
          <el-radio-button label="总用户数"></el-radio-button>
          <el-radio-button label="在线用户数"></el-radio-button>
          <el-radio-button label="访问次数"></el-radio-button>
          <el-radio-button label="日活跃用户数"></el-radio-button>
        </el-radio-group>
        <div id="main" style="width:100%;height:240px;"></div>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">用户管理</span>
      </div>
      <div  class="special">
       <el-table :data="userList" 
        :stripe="true"
        style="width:90%;font-size:12px;margin-top:-15px;">
            <el-table-column label="姓名" width="130px">
               <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.nickname"></el-input>
                    <span v-show="!scope.row.show">{{scope.row.nickname}}</span>
                </template>
            </el-table-column>
              <el-table-column label="注册时间"width="150px">
              <template slot-scope="scope">
                <span>{{scope.row.created}}</span>
              </template>
            </el-table-column>
            </el-table-column>
              <el-table-column label="账号" width="110px">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号" width="150px">
                <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.phone"></el-input>
                    <span v-show="!scope.row.show">{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属部门" width="110px">
                <template slot-scope="scope">
                    <!--<el-input size="mini" placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.groupName"></el-input>-->
                    <span >{{scope.row.groupName}}</span>
                </template>
            </el-table-column>
             </el-table-column>
              <el-table-column label="状态" width="80px">
              <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                 <el-button v-show="!scope.row.show" @click="scope.row.show =true"  size="mini" type="primary">编辑</el-button>
                    <el-button @click="scope.row.show =false,saveUser(scope.row.phone,scope.row.nickname,scope.row.username)"  size="mini"type="primary"  v-show="scope.row.show" >保存</el-button>
                    <el-button
                    type="primary"
                      size="mini"
                      name="select"
                      v-if="scope.row.status==='NORMAL'"
                      @click="disable(scope.row.username)"
                    > 禁用</el-button>
                     <el-button size="mini" plain disabled v-if="scope.row.status==='LOCKED'">
                      已禁用
                    </el-button>
                    <el-button
                      size="mini"
                      name="select"
                      @click="passwordReset(scope.row.username)"
                    >
                      重置密码
                    </el-button>
              </template>
            </el-table-column>
        </el-table>
    </div>
    <div style="text-align:center;margin-top:-20px;" class="special">
      <el-pagination
      style="margin-left:-100px;"
      @current-change="getuserList"
      :current-page.sync="page"
      :page-size="size"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>

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
             datas: [
              { title: '总用户数',value:'3107',way:'%96.21'},
              { title: '在线用户数',value:'885',way:'%6.9'},
              { title: '访问次数',value:'821',way:'%66.3'},
              { title: '日活跃用户数',value:'544',way:'%5.5'},
            ],
            users:[],
            radio1:'总用户数',
            state: '',
          userList: [
              
          ],
          tabledatas:[],
          total: 0,
          size: 7,
          page: 1,
          }
      },

      mounted(){
        this.getuserList()
        this.draw();
        this.getUsers();
      },

      methods:{
        getUsers(){
          this.$axios.get('/session/get-all-users',{
        }).then((res)=>{
          this.users= res.data.data
          this.datas[0].value=res.data.data.usersCount;
          this.datas[1].value=res.data.data.sessionCount+512;
          }).catch((err)=>{
            console.log(err);
          });
        },
          passwordReset(username){//
          this.$axios.post('/sysuser/reset-password',{username:username}).then((res)=>{
            if(res.data.message==="成功"){
              this.$message({
                message: '密码重置成功',
                type: 'success'
              });
             this.getsoftlist();
            }else{
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }

          }).catch((err)=>{
            console.log(err);
          });
        },
       disable(username){//
          this.$axios.post('/sysuser/disable',{username:username}).then((res)=>{
            if(res.data.message==="成功"){
              this.$message({
                message: '用户已被禁用',
                type: 'success'
              });
             this.getsoftlist();
            }else{
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }

          }).catch((err)=>{
            console.log(err);
          });
        },
        getuserList(){
        this.$axios.post('/sysuser/list-all',{
          size:this.size,
          current:this.page,
        }).then((res)=>{
           let list = res.data.data.records
           list.forEach(element => {
                    element["show"] = false
                });
          this.userList=res.data.data.records;
          this.total=res.data.data.total;
         
          }).catch((err)=>{
            console.log(err);
          });
        },
        saveUser(p,n,u){
          this.$axios.post('/sysuser/update',{
          nickname:n,
          phone:p,
          username:u,
        }).then((res)=>{
          this.getuserList();
          }).catch((err)=>{
            console.log(err);
          });
        },
        draw(){
          let myChart = this.$echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        myChart.setOption({
        xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    });
        },
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }

      },
    }
</script>

<style scoped>
.suffix{
 display:flex;
 align-items:center;
}
.style_s{
  padding:15px 20px;
  margin:15px;
  border:1px solid #eee;
}
.style_s div{
  padding:5px 0;
}
tr:nth-child(odd) {
  background: #FAFAFA;
}
tr:nth-child(1) {
  background: #FFF!important;
  color:#909399;
  font-size:12px!important;
}
tr{
  border-bottom: 1px solid #EBEEF5;
}
.line_style div{
 margin:10px 0;
}
.special{
  padding:5px 0px 0px;
}
</style>
