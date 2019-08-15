<template>
  <div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>我的上传
    </div>
    <div>
    <router-link :to="{path:'/personal-workbench/upload-service'}">
      <el-button type="primary">上传服务</el-button>
    </router-link></div>
    <div class="suffix">
      <el-input
      style="width:300px;"
        popper-class="my-autocomplete"
        v-model="searchVal" size="small"
        :fetch-suggestions="searchUploadData"
        placeholder="请输入内容">
      </el-input>
        <i
         style="margin:0 5px"
          class="el-icon-search"
          @click="searchUploadData">
        </i>
    </div>
    <div class="work_table">
       <table
        width="90%"
        style="border-collapse:collapse"
      >
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>服务名</td>
          <td>软件图标</td>
          <td>版本号</td>
          <td>服务分类</td>
          <td>行业分类</td>
          <td>领域分类</td>
          <td>交付方式</td>
          <td>服务简介</td>
          <td>规格报价</td>
          <td>当前状态</td>
          <td>操作</td>
        </tr>
        <tr v-for="(data, index) in uploadData"
        style="font-size:12px;line-height:35px;"
      :key="index"
        >
          <td>{{data.softName}}</td>
          <td>
            <template>
              <img :src="'data:image/jpg;base64,'+data.softIcon" style="height:30px;width: 30px">
            </template>
          </td>
          <td>{{data.softVersion}}</td>
          <td>{{data.softMenuName}}</td>
          <td>{{data.softCategoryName}}</td>
          <td>{{data.softCategory2Name}}</td>
          <td>{{data.softCategory3Name}}</td>
          <td>{{data.description}}</td>
          <td></td>
          <td v-if="data.status==='NORMAL'">正常</td>
          <td v-if="data.status==='DEL'">已下架</td>
          <td>
            <template v-if="data.status==='NORMAL'">
              <el-button
                size="mini"
                name="select"
                @click="delSoft(data.id)"
              >
                下架
              </el-button>
            </template>
            <template v-if="data.status==='DEL'">
              已下架
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
            username:"",
            searchVal: '',
            uploadData:[]
          }
      },
      mounted(){
        this.searchUploadData();
      },
      methods:{
        searchUploadData(){
          let param={username:sessionStorage.getItem('username')};
          this.$axios.post('/soft-detail/my-upload',param).then((res)=>{
            if((typeof res.data.data!=="string")&&res.data.data.length>0)this.uploadData=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        delSoft(softId){//
          this.$axios.post('/soft-detail/del',{id:softId}).then((res)=>{
            if(res.data.message==="成功"){
              this.$message({
                message: '已成功下架该服务',
                type: 'success'
              });
              this.searchUploadData();
            }else{
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }

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
.work_table{
  padding: 20px;
  max-height: 450px;
  overflow: auto
}
</style>
