<template>
  <div style="margin-left:-40px;">
   <el-row :gutter="25">
    <el-col :span="18">
      <el-row :gutter="25">
        <el-col :span="10">
        <el-card >
          <div style="height:350px">
            <div class="suffix_s">
              <div>|</div><span>常用服务</span>
            </div>
            <div class="suffix">
              <div style="text-align:center;width:50%;"
              v-for="(data, index) in commonService"
              :key="index">
                 <div style="color:#263d77;font-size:13px;font-weight:700;">{{data.title}}</div>
                 <div style="font-size:14px;">{{data.value}}</div>
              </div>
            </div>
          </div>
        </el-card>
        </el-col>
        <el-col :span="14">
        <el-card >
        <div style="height:350px">
          <div class="suffix_s">
            <div>|</div><span>历史服务</span>
          </div>
          <div class="suffix">
            <div style="text-align:center;width:25%;"
              v-for="(data, index) in historyService"
              :key="index">
                <div style="color:#263d77;font-size:13px;font-weight:700;">{{data.title}}</div>
                <div style="font-size:14px;">{{data.value}}</div>
            </div>
          </div>
        </div>
      </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="25" style="margin-top:25px;">
        <el-col :span="24">
          <el-card >
            <div style="height:350px">
              <div class="suffix_s">
                <div>|</div><span>已购买服务</span>
                  <!--<div class="suffix" style="position:absolute;right:10px;">
                  <el-input
                    style="width:240px;"
                    popper-class="my-autocomplete"
                    v-model="state" size="small"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容">
                  </el-input>
                    <i
                      class="el-icon-search"
                      @click="handleIconClick">
                    </i>
                  </div>-->
                </div>
              <div class="spe" style="border-bottom:1px dashed #aaa;">
                  <div style="text-align:center;width:25%;"
                        v-for="(data, index) in buyService"
                        :key="index">
                  <img :src="'data:image/jpg;base64,'+data.icon" height="80" width="80">
                  <div>{{data.softName}}</div>
                </div>
              </div>
             </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="6">
      <el-card >
        <div style="height:765px;">
          <div class="suffix_s">
            <span>我的云空间</span>
            <!--<div class="suffix" style="position:absolute;right:5px;">
              <el-input
                style="width:150px;"
                popper-class="my-autocomplete"
                v-model="state" size="small"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容">
              </el-input>
                <i
                  class="el-icon-search"
                  @click="handleIconClick">
                </i>
            </div>-->
          </div>
          <div style="height:740px;overflow: auto">
            <div style="text-align:center;width:25%;margin:20px 10px;"
                 v-for="(data, index) in fileList"
                 :key="index">
              <div>
                <i style="margin-right:8px;" class="fa fa-file-o"></i>{{data.objectName}}</div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col >
    </el-row>
  </div>
</template>
<script>
    export default {
      data(){
          return{
            username:sessionStorage.getItem('username'),
            state:'',
            commonService:[],
            historyService:[],
            buyService:[],
            fileList:[]
          }
      },
      mounted(){
        this.getCommonService();this.getHistoryService();
        this.getBuyService();this.getFileList();
      },
      methods:{
        getCommonService(){
          let param={username:sessionStorage.getItem('username'),limit:6};
          this.$axios.get('/wc-index/recent-softs',{params:param}).then((res)=>{
            if(res.data.data.length>0)this.commonService=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        getHistoryService(){
          let param={username:sessionStorage.getItem('username'),limit:8};
          this.$axios.get('/wc-index/recent-softs',{params:param}).then((res)=>{
            if(res.data.data.length>0)this.historyService=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        getBuyService(){
          let param={username:sessionStorage.getItem('username'),limit:8};
          this.$axios.get('/wc-index/available-softs',{params:param}).then((res)=>{
            if(res.data.data.length>0)this.buyService=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        getFileList(){
          let param={username:sessionStorage.getItem('username')};
          this.$axios.get('/file/list-files',{params:param}).then((res)=>{
            if(res.data.data.length>0)this.fileList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
         querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      handleIconClick(ev) {
        console.log(ev);
      },
      },
    }
</script>

<style scoped>
.suffix_s{
 display:flex;
 align-items:center;
}
.suffix{
 display:flex;
 align-items:center;
 flex-wrap:wrap;
}
.suffix div{
  margin:10px 0;
}
.suffix div div{
  padding:5px 0;
}
.suffix_s div{
  font-size:18px;
  font-weight:700;
  margin:0px 14px 0px 0px
}
.suffix_s span{
  font-weight:700;
  font-size:14px;
}
.spe{
  padding:30px 0;
  display:flex;
 align-items:center;
  max-height: 260px;
  overflow: auto;
}
</style>
