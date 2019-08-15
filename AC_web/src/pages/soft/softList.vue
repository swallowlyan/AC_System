<template>
    <div>

      <el-row class="searchTypes">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-card class="box-card">
              <el-row class="type">
                <el-col :span="3"><span>领域分类：</span></el-col>
                <el-col :span="2"><el-button type="text" @click="getSoft('')">全部</el-button></el-col>
                <el-col :span="3" v-for="(item,index) in areaTypeList" :key="index">
                  <el-button  :class="{active:active==index}" type="text" @click="getSoft(item.id,index)">{{item.fieldName}}</el-button>
                </el-col>
              </el-row>
              <el-row class="type">
                <el-col :span="3"><span>行业分类：</span></el-col>
                <el-col :span="2"><el-button type="text" @click="getSoft('')">全部</el-button></el-col>
                <el-col :span="3" v-for="(item,index) in industryTypeList" :key="index">
                  <el-button type="text" :class="{active:active_b==index}" @click="getSoft_b(item.id,index)">{{item.industryName}}</el-button>
                </el-col>
              </el-row>
              <el-row class="type">
                <el-col :span="3"><span>交付方式：</span></el-col>
                <el-col :span="2"><el-button type="text" @click="getSoft('')">全部</el-button></el-col>
                <el-col :span="3" v-for="(item,index) in payTypeList" :key="index">
                  <el-button type="text" :class="{active:active_c==index}" @click="getSoft_c(item.id,index)">{{item.deliverType}}</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>

      </el-row>
      <el-row class="searchTables">
        <el-col :span="16" :offset="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="height: 50px">
              <el-col :span="2" :offset="1"><span>排序：</span></el-col>
              <el-col :span="2"><el-button type="text" @click="getSoft()">默认</el-button></el-col>
              <el-col :span="3"><el-button type="text" @click="getSoft()">总销量<i class="el-icon-top"></i></el-button></el-col>
              <el-col :span="3"><el-button type="text" @click="getSoft()">上架时间<i class="el-icon-top"></i></el-button></el-col>
              <el-col :span="2"><el-button type="text" @click="getSoft()">评分<i class="el-icon-top"></i></el-button></el-col>
              <el-col :span="2"><el-button type="text" @click="getSoft()">价格<i class="el-icon-top"></i></el-button></el-col>
            </div>
            <div class="softContent">
              <!--softInfo-->
              <div v-for="(item,index) in softList" :key="index">
              <el-row >
                <el-col :span="2" class="softImg">
                    <el-button type="text" @click="toDetail(item)">
                      <img v-if="item.softIcon===''||item.softIcon===null||item.softIcon===undefined"
                        src="../../assets/common/logo_zhuchi.png" height="80" width="80">
                      <img v-if="item.softIcon!==''&&item.softIcon!==null&&item.softIcon!==undefined"
                           :src="'data:image/jpg;base64,'+item.softIcon" height="80" width="80">
                    </el-button>
                </el-col>
                <el-col :span="5" :offset="1" class="softInfo">
                  <el-row v-if="item.softCategory3Id==='1'">
                    <a v-if="username!== null" :href="item.fileUrl">
                      <h3 class="softName">{{item.softName}}</h3>
                    </a>
                    <a v-if="username === null">
                      <h3 class="softName">{{item.softName}}</h3>
                    </a>
                  </el-row>
                  <el-row v-if="item.softCategory3Id!=='1'">
                    <div v-if="username!==null"
                               style="cursor: pointer" @click="toSAAS(item.id)">
                    <h3 class="softName">{{item.softName}}</h3>
                  </div>
                    <div v-if="username===null">
                      <h3 class="softName">{{item.softName}}</h3>
                    </div>
                  </el-row>
                  <el-row><span class="company">{{item.creator}}</span></el-row>
                  <el-row><span class="info">{{item.description}}</span></el-row>
                </el-col>
                <el-col :span="5" :offset="1" style="margin-top: 10px">
                  <el-row>
                    <el-col :span="6">评分：</el-col>
                    <el-col :span="16"><el-rate
                      v-model="testScore"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate></el-col>
                  </el-row>
                  <el-row style="margin-top: 15px;"><span class="saleCount">月销量10件</span></el-row>
                </el-col>
                <el-col :span="3"><h3 class="money" style="margin: 10px 0px">￥0</h3></el-col>
                <el-col :span="3" v-if="!item.collect">
                  <el-button type="text" @click="collectSoft(item.id,1)"><i class="fa fa-heart-o"></i>点击收藏</el-button>
                </el-col>
                <el-col :span="3" v-if="item.collect">
                  <el-button type="text" @click="collectSoft(item.id,0)"><i class="fa fa-heart"></i>取消收藏</el-button>
                </el-col>
                <el-col :span="3" style="margin-top: 5px">
                  <el-row v-if="item.auth==='true'">
                    <el-button type="button" size="medium" disabled>已获取</el-button>
                  </el-row>
                  <el-row v-if="item.auth==='false'||item.auth===undefined">
                    <el-button type="button" size="medium" @click="downSoft(item.id)">点击获取</el-button>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <span class="pay">交付方式：{{item.softCategory3Name}}</span>
                  </el-row>
                </el-col>
              </el-row>
              <el-divider></el-divider>
              </div>
              <!--softInfo-->
              <!--page-->
              <el-row style="text-align: center">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15]"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "softCommon",
      data(){
        return{
          menuId:"",
          username:null,
          commonSearch:"",
          testScore:3.8,
          areaTypeList:[],
          industryTypeList:[],
          payTypeList:[],
          softList:[],
          currentPage:0,
          pageSize:0,
          total:0,
          active:-1,
          active_b:-1,
          active_c:-1,
          param:{
            current:1,
            size:5,
            sort:'id',
            dir:'asc'
          }
        }
      },
      props: {
          searchCommon:{
            type:String,
            default(){return ""}
          }
      },
      mounted(){
        this.initPage();
      },
      methods:{
          //获取分类
        getAreaType(){
          this.$axios.get('/field-cate/list-all').then((res)=>{
            if(res.data.data.length>0)this.areaTypeList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        getIndustryType(){
          this.$axios.get('/industry-cate/list-all').then((res)=>{
            if(res.data.data.length>0)this.industryTypeList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        getPayType(){
          this.$axios.get('/deliver-type/list-all').then((res)=>{
            if(res.data.data.length>0)this.payTypeList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
        },
        //查找软件
        getSoft(val,i){
          this.active=i;
          if(sessionStorage.getItem('username')!==null)this.param.username=sessionStorage.getItem('username');
          this.param.softName=this.searchCommon;
          this.param.softMenu=this.menuId;
          this.param.softCategory=val;
          this.$axios.post('/soft-detail/search-softs',this.param).then((res)=>{
            this.total=res.data.data.total;
            this.currentPage=res.data.data.current;
            this.pageSize=res.data.data.size;
            this.softList=res.data.data.records;
          }).catch((err)=>{
            console.log(err);
          });
        },
          getSoft_b(val,i){
          this.active_b=i;
          if(sessionStorage.getItem('username')!==null)this.param.username=sessionStorage.getItem('username');
          this.param.softName=this.searchCommon;
          this.param.softMenu=this.menuId;
          this.param.softCategory=val;
          this.$axios.post('/soft-detail/search-softs',this.param).then((res)=>{
            this.total=res.data.data.total;
            this.currentPage=res.data.data.current;
            this.pageSize=res.data.data.size;
            this.softList=res.data.data.records;
          }).catch((err)=>{
            console.log(err);
          });
        },
          getSoft_c(val,i){
          this.active_c=i;
          if(sessionStorage.getItem('username')!==null)this.param.username=sessionStorage.getItem('username');
          this.param.softName=this.searchCommon;
          this.param.softMenu=this.menuId;
          this.param.softCategory=val;
          this.$axios.post('/soft-detail/search-softs',this.param).then((res)=>{
            this.total=res.data.data.total;
            this.currentPage=res.data.data.current;
            this.pageSize=res.data.data.size;
            this.softList=res.data.data.records;
          }).catch((err)=>{
            console.log(err);
          });
        },
        initPage(){
          this.menuId=sessionStorage.getItem('menuId');
          this.username=sessionStorage.getItem('username');
          this.getAreaType();this.getIndustryType();this.getPayType();
          this.getSoft("");
        },
        handleSizeChange(val) {
          this.pageSize=val;
          this.param={
            current:1,
            size:val,
            sort:'id',
            dir:'asc'
          };
          this.getSoft("");
        },
        handleCurrentChange(val) {
          this.param={
            current:val,
            size:this.pageSize,
            sort:'id',
            dir:'asc'
          };
          this.getSoft("");
        },
        toDetail(obj){
          this.$emit('getObj', obj);
        },
        //收藏/取消收藏
        collectSoft(softId,ifCollect){
          if(sessionStorage.getItem("username") === null){
            this.$message({
              message: "请登录用户,进行收藏",
              type: 'warning'
            });
          }else{
            let collectMessage="";
            if(ifCollect===0)collectMessage="已取消收藏";
            else collectMessage="已成功收藏";
            let param={
              username:sessionStorage.getItem('username'),
              softId:softId,
              collect:ifCollect
            };
            this.$axios.post('/soft-user/collectSoft',param).then((res)=>{
              this.$message({
                message: collectMessage,
                type: 'success'
              });
              this.getSoft("");
            }).catch((err)=>{
              console.log(err);
            });
          }

        },
        //立即获取
        downSoft(softId){
          if(sessionStorage.getItem("username") === null){
            this.$message({
              message: "请登录用户,进行获取",
              type: 'warning'
            });
          }else{
            let param={
              username:sessionStorage.getItem('username'),
              softId:softId
            };
            this.$axios.get('/soft-auth/soft-order',{params:param}).then((res)=>{
              this.$message({
                message: '已成功获取该服务',
                type: 'success'
              });
              this.getSoft("");
            }).catch((err)=>{
              console.log(err);
            });
          }
        },
        //云服务
        toSAAS(softId){
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
      }
    }
</script>

<style scoped>
  .searchTypes{margin: 5px 0px}
  .searchTypes .type{margin: 20px 0px}
  .softImg{margin: 5px}
  .softContent span{font-size: 13px}
  .softInfo{margin-top: 10px}
  .softContent{max-height: 800px;overflow: auto}
  .softContent a{color: #000000}
  .searchTypes button,.el-card__header button{padding: 0px}
  .el-card__header .el-col{margin-bottom: 5px}
  .searchForm{
    margin-top: 30px;
  }
  .softContent span{font-size: 13px}
  el-card__header button{padding: 0px}
  .active{
    color:#666!important;
  }
</style>
