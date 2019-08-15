<template>
    <div id="softList">
      <el-row style="margin:20px 0px" v-if="ifDevice">
        <el-col :span="5" :offset="4">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="accessDevice">
                <h3>接入设备</h3><br/>
                <h5>让您的设备快速云化，目前已接入XXX设备</h5><br/>
                <el-button type="warning" plain size="medium">接入我的设备</el-button>
              </div>
          </el-card>
        </el-col>
        <el-col :span="5" style="margin:0px 35px">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="monitoringDevice">
                <h3>设备监控运维</h3><br/>
                <h5>对您已接入设备进行在线监控，保障设备运行安全</h5><br/>
                <el-button type="success" plain size="medium">接入我的设备</el-button>
              </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="releaseDevice">
                <h3>设备能力发布</h3><br/>
                <h5>将您的设备进行云端共享</h5><br/>
                 <el-button plain size="medium">接入我的设备</el-button>
              </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="searchForm">
        <el-col :span="3" :offset="4"><h1 style="font-size: 30px;font-weight: normal">{{menuName}}</h1></el-col>
        <el-col :span="10" :offset="1">
          <el-row>
            <!--<el-col :span="5">
              <el-select v-model="searchType" placeholder="请选择分类" size="medium">
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>-->
            <el-col :span="19">
              <el-col :span="17"><el-input v-model="searchInput" placeholder="请输入内容" size="medium" ></el-input></el-col>
              <el-col :span="2"><el-button type="primary" icon="el-icon-search" size="medium" @click="searchSoft()">搜索</el-button></el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16" style="margin: 20px 0px">
                <span>热门搜索：
                  <el-button type="text">研发统计</el-button>
                  <el-button type="text">生产制造</el-button>
                  <el-button type="text">creo</el-button>
                </span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <router-view ref="list" :searchCommon="searchInput" v-on:getObj="getDetailObj" :detail="detailObj"></router-view>
    </div>
</template>
<script>
    export default {
        name: "softList",
      components:{},
      data(){
          return{
            title:"",
            searchType:"0",
            searchInput:"",
            searchOptions:[
              {label:"领域分类",value:"0"},
              {label:"行业分类",value:"1"},
              {label:"交付方式",value:"2"}
            ],
            searchVal:"",
            menuName:"",
            detailObj:{},
            ifDevice:true
          }
      },
      mounted(){
        this.menuName=sessionStorage.getItem('menuName');
      },
      methods:{
          //查找软件
          searchSoft(){
            if(this.$route.path.indexOf("Detail")>-1){
              this.$router.push({path: '/soft'});
            }else{
              this.$refs.list.getSoft();
            }
          },
        getDetailObj(obj){
            this.detailObj=obj;
            this.$router.push({path: '/soft/softDetail'});
        },
        initPage(){
          this.menuName=sessionStorage.getItem('menuName');
          this.$refs.list.initPage();
        }
      }
    }
</script>

<style scoped>
  .el-card__header .el-col{margin-bottom: 5px}
.searchForm{
  margin-top: 30px;
}
  .softContent span{font-size: 13px}
  el-card__header button{padding: 0px}
  .accessDevice{
    background: url("../../assets/device/device_bg1.png");
    background-size: cover;
  }
  .monitoringDevice{
    background: url("../../assets/device/device_bg2.png");
    background-size: cover;
  }
  .releaseDevice{
    background: url("../../assets/device/device_bg3.png");
    background-size: cover;
  }
  .accessDevice h3,.monitoringDevice h3,.releaseDevice h3{
    margin-left: 30px;
    padding-top: 20px;
    color: #ffffff;
  }
  .accessDevice h5,.monitoringDevice h5,.releaseDevice h5{
    margin-left: 20px;
    color: #ffffff;
    font-weight: normal;
    font-size: 12px;
  }
  .accessDevice button,.monitoringDevice button,.releaseDevice button{
    margin: 20px;
  }
</style>
