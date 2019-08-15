<template>
  <div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>已购买服务
    </div>
    <div class="work_table">
      <table width="90%" style="border-collapse:collapse">
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>服务名</td>
          <td>软件图标</td>
          <td>版本号</td>
          <td>状态</td>
          <td>交付方式</td>
          <td>购买时间</td>
          <td>到期时间</td>
          <td>评分</td>
          <td>操作</td>
        </tr>

        <tr v-for="(data, index) in buyService"
            style="font-size:12px;line-height:35px;"
            :key="index"
        >
          <td>{{data.softName}}</td>
          <td>
            <template>
              <img v-if="data.icon===''||data.icon===null||data.icon===undefined"
                   src="../../assets/common/logo_zhuchi.png" height="30" width="30">
              <img v-if="data.icon!==''&&data.icon!==null&&data.icon!==undefined"
                   :src="'data:image/jpg;base64,'+data.icon" height="30" width="30">
            </template>
          </td>
          <td>{{data.version}}</td>
          <td v-if="data.status==='NORMAL'">正常</td>
          <td v-if="data.status==='DEL'">已下架</td>
          <td>{{data.jiaofu}}</td>
          <td>{{data.bought}}</td>
          <td>{{data.end}}</td>
          <td>
            <template>
              <el-rate
                v-model="data.score"
                disabled
                text-color="#ff9900"
                score-template="{value}">
              </el-rate>
            </template>
          </td>
          <td>
            <template>
              <el-button type="text" size="mini" :disabled="data.status==='DEL'">续费</el-button>
              <el-button type="text" size="mini" :disabled="data.status==='DEL'">暂停</el-button>
              <el-button type="text" size="mini" :disabled="data.status==='DEL'">退款</el-button>
              <el-button v-if="data.jiaofu==='下载'" type="text" size="mini"
                         @click="downSoft(data.fileUrl)" :disabled="data.status==='DEL'">重新下载</el-button>
              <el-button v-if="data.jiaofu==='SAAS'" type="text" size="mini"
                         @click="openWin(data.softId)" :disabled="data.status==='DEL'">进入软件</el-button>
            </template>
          </td>
        </tr>

      </table>
    </div>
  </div>
</template>
<script>
    export default {
      data(){
          return{
            buyService:[]
          }
      },
      mounted(){
        this.getBuyService();
      },
      methods:{
        getBuyService(){
          let param={username:sessionStorage.getItem('username'),limit:10000};
          this.$axios.get('/wc-index/available-softs',{params:param}).then((res)=>{
            if(res.data.data.length>0)this.buyService=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        downSoft(url){
          window.open(url);
        },
        openWin(softId){//云服务
          const loading = this.$loading({
            lock: true,
            text: '正在打开软件……',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$axios.post('/send-request/use-desktop',{
            username:sessionStorage.getItem('username'),
            softwareId:softId,
          }).then((res)=>{
            // console.log(res);
            if(res.data.success === true){
              setTimeout(()=>{
                window.open(res.data.desktopAddr);
                loading.close();
              },5000);
            }else {
              loading.close();
              alert('打开软件失败，请重试或联系管理员！');
            }
            // console.log(res.data);
          }).catch((err)=>{
            loading.close();
            alert('打开软件失败，请重试或联系管理员！');
            console.log(err);
          });
        }
      },
    }
</script>

<style scoped>
.suffix{
 display:flex;
 align-items:center;
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
.work_table{
  padding: 20px;
  max-height: 450px;
  overflow: auto
}
</style>
