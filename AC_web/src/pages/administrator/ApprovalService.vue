<template>
  <div>
   <el-row :gutter="40">
    <el-col :span="7" style="border-right:1px dashed #eee;padding-right:10px;height:700px">
      <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">待审服务</span>
      </div>
      <el-card style="height:300px;margin-left:-20px;">
        <div class="sty">员工 张三 于2018年8月10日上传HyperWorks软件</div>
        <div class="sty">领域分类：研发设计</div>
        <div class="sty">行业分类：汽车制造</div>
        <div class="sty">交付方式：下载</div>
        <div class="sty_a"><a href="" style="color:rgb(68, 126, 223)">点击下载安装文件</a></div>
        <div style="text-align:center;">
          <el-button><span style="color:green;padding-right:10px;font-weight:700;">√</span>同意</el-button>
          <el-button><span style="color:red;padding-right:10px;font-weight:700;">×</span>拒绝</el-button>
        </div>
      </el-card>
      <el-card style="height:300px;margin-left:-20px;">
        <div class="sty">员工 李四 于2018年8月10日上传HyperWorks软件</div>
        <div class="sty">领域分类：研发设计</div>
        <div class="sty">行业分类：汽车制造</div>
        <div class="sty">交付方式：下载</div>
        <div class="sty_a"><a href="" style="color:rgb(68, 126, 223)">点击下载安装文件</a></div>
        <div style="text-align:center;">
          <el-button><span style="color:green;padding-right:10px;font-weight:700;">√</span>同意</el-button>
          <el-button><span style="color:red;padding-right:10px;font-weight:700;">×</span>拒绝</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col style="margin-top:10px;":span="17">
      <div class="suffix">
          <div style="font-size:20px;font-weight:700;margin:0px 14px 0px -23px">|</div>
          <span style="font-weight:700;font-size:12px;">审批服务</span>
      </div>
      <div  class="special">
        <table
          width="90%"
          style="border-collapse:collapse;"
        >
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>上传人</td>
          <td>软件名</td>
          <td>上传时间</td>
          <td>软件链接</td>
          <td>您的审批</td>
          <td>审批时间</td>
        </tr>
        <tr v-for="(data, index) in datas"
        style="font-size:12px;line-height:35px;"
      :key="index"
        >
          <td>{{data.user}}</td>
          <td>{{data.title}}</td>
          <td>{{data.data}}</td>
          <td><a href="" style="color:rgb(68, 126, 223)">点击下载</a></td>
          <td></td>
          <td>{{data.data}}</td>
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

    </el-col>
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

      },

      methods:{
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
        }

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
.sty{
  font-size:14px;
  padding:4px 0;
}
.sty_a{
  font-size:16px;
  padding:10px 0;
}
</style>
