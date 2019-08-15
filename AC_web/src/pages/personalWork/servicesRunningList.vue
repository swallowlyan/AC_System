<template>
  <div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>运行软件列表
    </div>
    <div class="work_table">
       <table width="90%" style="border-collapse:collapse;">
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>服务名</td>
          <td>版本</td>
          <td>云桌面地址</td>
          <td>操作</td>
        </tr>
        <tr v-for="(data, index) in runningData"
        style="font-size:12px;line-height:35px;"
        :key="index">
          <td>{{data.softName}}</td>
          <td>{{data.softVersion}}</td>
          <td>{{data.cloudUrl}}</td>
          <td>
            <template >
              <el-button @click="openSoft(data.cloudUrl)" type="text" size="medium">重进软件</el-button>
              <el-button @click="releaseSoft(data.softId)" type="text" size="medium">归还软件</el-button>
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
            runningData: []
          }
      },
      mounted(){
        this.getRunningData();
      },
      methods:{
        getRunningData(){
          let param={username:sessionStorage.getItem('username')};
          this.$axios.get('/soft-detail/running-softs',{params:param}).then((res)=>{
            this.runningData=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        openSoft(cloudUrl){
          const loading = this.$loading({
            lock: true,
            text: '正在打开软件……',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(()=>{
            window.open(cloudUrl);
            loading.close();
          },5000);
          // console.log(row);
        },
        releaseSoft(softId){
          const loading = this.$loading({
            lock: true,
            text: '正在释放软件……',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$axios.get('send-request/release-desktop',{
            params:{
              username:sessionStorage.getItem('username'),
              softwareId:softId,
            }
          }).then((res)=>{
            if(res.data.success == true){
              setTimeout(()=>{
                this.getRunningData();
                loading.close();
                alert('归还成功');
              },2000);
            }else {
              alert('归还失败');
              loading.close();
            }
          }).catch((err)=>{
            alert('归还失败');
            loading.close();
            console.log(err);
          });
          // console.log(row);
        },
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
.line_style div{
 margin:10px 0;
}
tr{
  border-bottom: 1px solid #EBEEF5;
}
.work_table{
  padding: 20px;
  max-height: 450px;
  overflow: auto
}
</style>
