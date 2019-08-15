<template>
  <div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>运营管理
    </div>
    <div class="suffix" v-if="ifNullData">
      <h1>无使用记录</h1>
    </div>
    <div class="suffix" v-for="(data, index) in commonData"  :key="data">
      <div style="text-align:center;">
        <img :src="'data:image/jpg;base64,'+data.icon" style="height:50px;width: 50px">
        <div>{{data.softName}}</div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
      data(){
          return{
            username:sessionStorage.getItem('username'),
            commonData:[],
            ifNullData:true
          }
      },
      mounted(){
        this.getCommonData();
      },
      methods:{
        getCommonData(){
          let param={username:this.username,limit:5};
          this.$axios.get('/wc-index/recent-softs',{params:param}).then((res)=>{
            if((typeof res.data.data!=="string")&&res.data.data.length>0){
              this.commonData=res.data.data;
              this.ifNullData=false;
            }else{this.ifNullData=true;}
          }).catch((err)=>{
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
.suffix div{
  margin:10px;
  cursor:pointer;
}
.suffix div div{
  font-size:14px;
}
</style>
