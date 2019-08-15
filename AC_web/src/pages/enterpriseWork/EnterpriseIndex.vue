<template>
  <div>
    <el-row style="border-bottom:1px solid #ddd;":gutter="25">
      <el-col :span="17" >
        <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">企业用户指标</span>
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
        <el-radio-group v-model="radio1"size="small">
          <el-radio-button label="总用户数"></el-radio-button>
          <el-radio-button label="活跃用户数"></el-radio-button>
          <el-radio-button label="访问次数"></el-radio-button>
          <el-radio-button label="用户提交次数"></el-radio-button>
        </el-radio-group>
        <div id="main" style="width:100%;height:260px;margin-top:-30px;"></div>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">企业成员管理</span>
      </div>
      <div  class="special">
       <el-button size="mini" type="primary" @click="openDialog()">
          +添加成员
       </el-button>
      </div>
      <div  class="special">
        <table
          width="90%"
          style="border-collapse:collapse;"
        >
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td width="80">姓名</td>
          <td>注册时间</td>
          <td>应用提交次数</td>
          <td>应用通过次数</td>
          <td>应用使用次数</td>
          <td>应用通过率</td>
          <td>用户评级</td>
          <td>操作</td>
        </tr>
        <tr v-for="(data, index) in personList"
        style="font-size:12px;line-height:35px;"
      :key="index"
        >
          <td>{{data.nickname}}</td>
          <td>{{data.created}}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
          <el-rate
            v-model="data.value"
            disabled
            show-score
            text-color="#ccc">
            </el-rate>
          </td>
          <td>
            <template >
              <el-button
                size="mini"
                name="select"
              >
                续费
              </el-button>
              <el-button
                size="mini"
                name="select"
              >
                暂停
              </el-button>
            </template>
          </td>
        </tr>
      </table>
    </div>
    </el-row>
    <!--Dialog_addPerson-->
    <addPerson :addDialog_person="ifOpenDialog" @close="closeModel" @refresh="searchPerson" ref="dialogPerson"></addPerson>
  </div>
</template>

<script>
    import MyHeader from "../../components/MyHeader";
    import addPerson from "../enterpriseWork/addPerson";
    export default {
        name: "MainPage",
      components: {MyHeader,addPerson},
      data(){
          return{
            ifOpenDialog:false,
            personList:[],
            userTotal:0,
        datas: [
          { title: '总用户数',value:this.userTotal,way:'%96.21'},
          { title: '活跃用户数',value:'855',way:'%6.9'},
          { title: '访问次数',value:'821',way:'%66.3'},
          { title: '用户提交次数',value:'544',way:'%5.5'},
        ],
          radio1:'总用户数',
          }
      },

      mounted(){
        this.draw();
        this.searchPerson();
      },

      methods:{
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
      },
        searchPerson(){
          let param={groupId:sessionStorage.getItem('enterpriseId')};
          this.$axios.get('/sysuser/group-users',{params:param}).then((res)=>{
            this.userTotal=res.data.data.length;
            this.datas[0].value=res.data.data.length;
            this.personList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        openDialog(){
          this.ifOpenDialog = true;
        },
        closeModel() {//关闭弹窗-父子关联(:before-close+方法不能含参数)
          this.ifOpenDialog = false;
        },
        refreshPerson(){
          this.$refs.dialogPerson.searchPerson();
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
  padding:5px 0px;
  max-height: 250px;
  overflow: auto
}
</style>
