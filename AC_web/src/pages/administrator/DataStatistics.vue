<template>
  <div>
    <el-row style="border-bottom:1px solid #ddd;":gutter="25">
      <el-col :span="17" >
        <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">数据指标</span>
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
        <div id="main" style="width:100%;height:260px;"></div>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">企业数据明细</span>
      </div>
      <div  class="special" style="height:400px;width:90%;">
      <el-scrollbar style="height:100%;">
        <table
          width="100%"
          style="border-collapse:collapse;"
        >
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>企业名称</td>
          <td>上月新增数据（单位：tb）</td>
          <td>结构化数据（单位：tb）</td>
          <td>非结构化数据（单位：tb）</td>
          <td>操作</td>
        </tr>
        <tr v-for="(data, index) in enterpriseList"
        style="font-size:12px;line-height:35px;"
        :key="index"
        >
          <td>{{data.name}}</td>
          <td></td>
          <td></td>
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
            </template>
          </td>
        </tr>
      </table>
      </el-scrollbar>
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
              { title: '系统接入数据总量',value:'1.23pd',way:'%96.21'},
              { title: '上月新增数据',value:'23gd',way:'%6.9'},
              { title: '结构化数据',value:'821',way:'%66.3'},
              { title: '非结构化数据',value:'544',way:'%5.5'},
            ],
            radio1:'总用户数',
             state: '',
          enterpriseList: [
          ],
          }
      },

      mounted(){
        this.getenterpriseList();
        this.draw();
      },

      methods:{
        getenterpriseList(){
        this.$axios.get('/wc-group/groups').then((res)=>{
          this.enterpriseList=res.data.data;
          this.total=res.data.data.total;
            console.log( this.enterpriseList);
          }).catch((err)=>{
            console.log(err);
          });
        },
        draw(){
          let myChart = this.$echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        myChart.setOption({
       tooltip: {
        trigger: 'item',
        formatter: "{a} {b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['系统接入数据总量','上月新增数据','结构化数据','非结构化数据']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'系统接入数据总量'},
                {value:310, name:'上月新增数据'},
                {value:234, name:'结构化数据'},
                {value:135, name:'非结构化数据'},
            ]
        }
    ]
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
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
