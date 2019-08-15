<template>
  <div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>已收藏服务
    </div>
    <div style="margin-left:-100px;">
      <div style="margin:0 auto;width:80%;max-height: 450px;overflow: auto">
        <div class="suffix" style="justify-content:space-between;border-bottom:1px dashed #aaa;padding:0 10px;"
         v-for="(data, index) in collectService"
        :key="index"
        >
          <div>
            <img :src="'data:image/jpg;base64,'+data.softIcon" style="height:50px;width: 50px">
          </div>
          <div>
            <div style="font-size:14px;font-weight:700;">{{data.softName}}</div>
            <div style="font-size:12px;">{{data.modifier}}</div>
            <div style="font-size:12px;">{{data.description}}</div>
          </div>
          <div>
            <div style="font-size:12px;" class="suffix">
            <span>评分:&emsp;</span>
            <el-rate
              v-model="data.score"
              disabled
              show-score
              text-color="#ccc">
            </el-rate>
            </div>
            <div style="font-size:12px;">月销量:{{data.value}}笔</div>
          </div>
          <div>
            <el-button v-if="data.isBought" size="mini" disabled>
              已购买
            </el-button>
            <el-button v-if="!data.isBought" size="mini" @click="getSoft(data.id)">
              立即获取
            </el-button>
            <div v-if="data.softCategory3==='1'" style="font-size:12px;">交付方式:下载</div>
            <div v-if="data.softCategory3==='2'" style="font-size:12px;">交付方式:SAAS</div>
          </div>
          <div>
            <el-button size="mini" @click="cancelCollect(data.id)">
               取消收藏
            </el-button>
          <div style="font-size:12px;">&emsp;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
      data(){
          return{
          state: '',
            collectService:[]
          }
      },
      mounted(){
        this.getCollectService();
      },
      methods: {
        getCollectService() {
          let param = {username: sessionStorage.getItem('username'), limit: 10000};
          this.$axios.post('/soft-user/softCollectedList', param).then((res) => {
            if (res.data.data.length > 0) this.collectService = res.data.data;
          }).catch((err) => {
            console.log(err);
          });
        },
        //立即获取
        getSoft(id) {
          let param={
            username:sessionStorage.getItem('username'),
            softId:id
          };
          this.$axios.get('/soft-auth/soft-order',{params:param}).then((res)=>{
            this.$message({
              message: '已成功获取该服务',
              type: 'success'
            });
            this.getCollectService();
          }).catch((err)=>{
            console.log(err);
          });

        },
        //取消收藏
        cancelCollect(id) {
          let param={
            username:sessionStorage.getItem('username'),
            softId:id,
            collect:0
          };
          this.$axios.post('/soft-user/collectSoft',param).then((res)=>{
            this.$message({
              message: "已取消收藏",
              type: 'success'
            });
            this.getCollectService();
          }).catch((err)=>{
            console.log(err);
          });
        }
      }
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
</style>
