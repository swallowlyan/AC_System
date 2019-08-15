<template>
  <div>
    <el-row :gutter="25">
      <el-col :span="17" >
        <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">服务使用指标</span>
        </div>
        <div class="suffix" style="width:100%;margin-top:30px;">
          <div style="width:25%;" class="style_s"v-for="(data, index) in datas" :key="index">
            <div style="font-size:16px;">{{data.title}}</div>
            <div style="font-size:24px;font-weight:700;">{{data.value}}</div>
            <div style="font-size:14px;">日↑{{data.way}}</div>
          </div>
        </div>
      </el-col>

    </el-row>
    <el-row style="margin-top:10px;">
      <div  class="special">
        <table
          width="90%"
          style="border-collapse:collapse;"
        >
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>组件名</td>
          <td>功能概述</td>
          <td>上传人</td>
          <td>上传时间</td>
          <td>调用次数</td>
          <td>操作</td>
        </tr>
        <tr v-for="(data, index) in datas_b"
        style="font-size:12px;line-height:35px;"
      :key="index"
        >
          <td>{{data.title}}</td>
          <td></td>
          <td>{{data.user}}</td>
          <td>{{data.data}}</td>
          <td></td>
          <td>
            <template >
              <el-button
                size="mini"
                name="select"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                name="select"
              >
                删除
              </el-button>
              <el-button
                size="mini"
                name="select"
              >
                管理订阅
              </el-button>
            </template>
          </td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;" class="special">
    <el-pagination
      style="margin-left:-110px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
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
              { title: '总用户数',value:'525',way:'%96.21'},
              { title: '活跃用户数',value:'855',way:'%6.9'},
              { title: '访问次数',value:'821',way:'%66.3'},
              { title: '用户提交次数',value:'544',way:'%5.5'},
            ],
            radio1:'总用户数',
             state: '',
          datas_b: [
               { title: 'Creo',data:'2019-06-15',way:'SAAS',user:'张三'},
              { title: 'Creo',data:'2019-06-15',way:'SAAS',user:'李红'},
              { title: 'Creo',data:'2019-06-15',way:'SAAS',user:'张三'},
              { title: 'Creo',data:'2019-06-15',way:'SAAS',user:'王丽'},
              { title: 'Creo',data:'2019-06-15',way:'SAAS',user:'张三'},
              { title: 'Creo',data:'2019-06-15',way:'SAAS',user:'洛洛'},
          ],
          currentPage1: 5,
          currentPage2: 5,
          currentPage3: 5,
          currentPage4: 4
          }
      },

      mounted(){
        this.draw();
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
}
</style>
