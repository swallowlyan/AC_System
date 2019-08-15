<template>
<!--banner-->
  <div>
  <el-row class="softDetail">
    <el-col :span="3" :offset="4" class="detail_img">
      <img :src="softImg" height="100" width="100">
    </el-col>
    <el-col :span="8">
      <el-row><h1 class="soft_title">{{softTitle}}</h1></el-row>
      <el-row><span class="soft_introduce">
        {{softDescription}}
      </span>
      </el-row>
      <el-row>
        <el-col :span="10" class="detail_score" >
          <el-col :span="8"><span>评分：</span></el-col>
          <el-col :span="16"><el-rate
            v-model="detailScore"
            disabled
            text-color="#ff9900"
            score-template="{value}">
          </el-rate></el-col>
        </el-col>
        <el-col :span="6" :offset="4">
          <el-button v-if="!ifCollect" type="text" @click="collectSoft(softId,1)" style="color: #ffffff"><i class="fa fa-heart-o"></i>点击收藏</el-button>
          <el-button v-if="ifCollect" type="text" @click="collectSoft(softId,0)" style="color: #ffffff"><i class="fa fa-heart"></i>取消收藏</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-button v-if="ifGet==='false'||ifGet===undefined" type="button" size="medium" class="detail_down" @click="downSoft()">立即获取</el-button>
        <el-button v-if="ifGet==='true'" type="button" size="medium" class="detail_down" disabled>已获取</el-button>
      </el-row>
  </el-col>
    <el-col :span="4" :offset="1" class="detail_info">
      <el-card class="box-card">
        <el-row><span>开发商：{{creator}}</span></el-row>
        <el-row><span>入驻时间：{{createTime}}</span></el-row>
        <el-row><span>应用数量：20</span></el-row>
        <el-row><span>联系人：{{creator}}</span></el-row>
        <el-row><span>联系电话：13233362654</span></el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="detail_banner">
    <el-col :span="2" :offset="8">
      <el-link href="#info">软件简介</el-link>
    </el-col>
    <el-col :span="2">
      <el-link href="#specialFunction">功能特色</el-link>
    </el-col>
    <el-col :span="2">
      <el-link href="#support">服务支持</el-link>
    </el-col>
    <el-col :span="2" >
      <el-link href="#price">规格定价</el-link>
    </el-col>
  </el-row>
    <el-row class="soft_info">
      <el-col :span="15" :offset="5">
        <el-row id="info">
          <el-row>
            <el-divider direction="vertical" class="direction"></el-divider>
            软件简介
          </el-row>
          <el-row>
            <el-col :span="18" :offset="2" class="introduce">
              <span>
                 &nbsp;&nbsp;&nbsp;&nbsp;Creo是美国PTC公司于2010年10月推出CAD设计软件包。Creo是整合了PTC公司的三个软件Pro/Engineer的参数化技术、CoCreate的直接建模技术和ProductView的三维可视化技术的新型CAD设计软件包，是PTC公司闪电计划所推出的第一个产品
              </span>
            </el-col><el-col :span="18" :offset="2">
            <img src="../../assets/carousel/carousel_1.jpg" width="100%">
          </el-col></el-row>
          </el-row>
        <el-row id="specialFunction">
          <el-row>
            <el-divider direction="vertical" class="direction"></el-divider>
            功能特色
          </el-row>
          <el-row>
            <el-col :span="18" :offset="2" class="introduce">
              <span class="introduce">
                 &nbsp;&nbsp;&nbsp;&nbsp;作为PTC闪电计划中的一员，Creo具备互操作性、开放、易用三大特点。
                在产品生命周期中，不同的用户对产品开发有着不同的需求。不同于其他解决方案，CREO旨在消除CAD行业中几十年迟迟未能解决的问题：
              </span><br>
              <span>· 解决机械 CAD 领域中未解决的重大问题，包括基本的易用性、互操作性和装配管理；</span><br>
              <span>· 采用全新的方法实现解决方案（建立在 PTC 的特有技术和资源上）；</span><br>
              <span>· 提供一组可伸缩、可互操作、开放且易于使用的机械设计应用程序；</span><br>
              <span>· 为设计过程中的每一名参与者适时提供合适的解决方案。 [1] </span><br>
            </el-col>
            <el-row>
            <el-col :span="18" :offset="2">
            <img src="../../assets/carousel/carousel_1.jpg" width="100%">
            </el-col>
            </el-row>
          </el-row>
        </el-row>
        <el-row id="support">
          <el-row>
            <el-divider direction="vertical" class="direction"></el-divider>
            服务支持
          </el-row>
          <el-row><el-col :span="15" :offset="3" style="margin-top: 20px"><span>客服电话：  0532-123456</span></el-col></el-row>
          <el-row><el-col :span="15" :offset="3" style="margin-bottom: 20px"><span>客服邮箱： support@iscas.com</span></el-col></el-row>
        </el-row>
        <el-row id="price">
          <el-row>
            <el-divider direction="vertical" class="direction"></el-divider>
            规格定价
          </el-row>
          <el-row>
            <el-col :span="15" :offset="3" class="introduce">
              <table>
                <tr><td>按时租赁</td><td>按月租赁</td><td>按年租赁</td></tr>
                <tr><td>50元/小时/用户</td><td>5000元/月/用户</td><td>50000元/年/用户</td></tr>
              </table>
            </el-col>
          </el-row>
        </el-row>
          <el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "softDetail",
      data(){
          return {
            detailScore:3.5,
            softId:"",
            softImg:"",
            softTitle:"",
            softDescription:"",
            creator:"",
            createTime:"",
            ifGet:"",
            ifCollect:false,
            homeDetail:null
          }
      },
      props: {
        detail:{
          type:Object,
          default(){return {}}
        }
      },
      created(){
        this.homeDetail=JSON.parse(sessionStorage.getItem('homeDetail'));
      },
      mounted(){
        this.pullInfo();this.homeToDetail();
      },
      methods:{
          pullInfo(){
            if(this.detail!=={}){
              this.softId=this.detail.id;
              this.softImg="data:image/jpg;base64,"+this.detail.softIcon;
              this.softTitle=this.detail.softName;
              this.softDescription=this.detail.description;
              this.createTime=this.detail.created;
              this.creator=this.detail.creator;
              this.ifGet=this.detail.auth;
              this.ifCollect=this.detail.collect;
            }
          },
        homeToDetail(){
          if(this.homeDetail!==null){
            this.softId=this.homeDetail.id;
            this.softImg="data:image/jpg;base64,"+this.homeDetail.softIcon;
            this.softTitle=this.homeDetail.softName;
            this.softDescription=this.homeDetail.description;
            this.createTime=this.homeDetail.created;
            this.creator=this.homeDetail.creator;
            this.ifGet=this.homeDetail.auth;
            this.ifCollect=this.homeDetail.collect;
            //加载后清空session缓存
            sessionStorage.removeItem('homeDetail');
          }
        },
        //立即获取
        downSoft(){
            if(sessionStorage.getItem("username") === null){
              this.$message({
                message: "请登录用户,进行获取",
                type: 'warning'
              });
            }else{
              let param={
                username:sessionStorage.getItem('username'),
                softId:this.detail.id
              };
              this.$axios.get('/soft-auth/soft-order',{params:param}).then((res)=>{
                this.$message({
                  message: '已成功获取该服务',
                  type: 'success'
                });
                this.ifGet="true";
              }).catch((err)=>{
                console.log(err);
              });
            }
        },
        //收藏/取消收藏
        collectSoft(softId,ifCollect){
          if(sessionStorage.getItem("username") === null){
            this.$message({
              message: "请登录用户,进行收藏",
              type: 'warning'
            });
          }else {
            let collectMessage = "";
            if (ifCollect === 0) collectMessage = "已取消收藏";
            else collectMessage = "已成功收藏";
            let param = {
              username: sessionStorage.getItem('username'),
              softId: softId,
              collect: ifCollect
            };
            this.$axios.post('/soft-user/collectSoft', param).then((res) => {
              this.$message({
                message: collectMessage,
                type: 'success'
              });
              if(ifCollect===0)this.ifCollect = false;
              else this.ifCollect = true;
            }).catch((err) => {
              console.log(err);
            });
          }
        },
      }
    }
</script>

<style scoped>
.softDetail{
  min-height: 170px;
  padding: 40px;
  color: #ffffff;
  background: url("../../assets/soft/softDetail_bg.jpg");
}
  .soft_title{margin: 10px 0px;font-weight: normal}
  .detail_img{margin-top: 30px;}
  .detail_info span{color: #ffffff;}
  .detail_info .el-row{margin: 10px 0px}
  .detail_down{background: #fff0;color: #ffffff}
  .detail_banner{
    height: 40px;
    background: #f5f5f5;
    padding: 8px;}
  .soft_info .el-divider{
    background-color: #1875F0;
    width: 5px;
    height: 30px;
  }
.introduce{
  margin-top: 20px;
  margin-bottom: 20px;
}
  #info{margin-top: 20px}
#price table,#price table tr th, #price table tr td {
  border:1px solid #dddddd;
  padding: 5px 10px;
}
#price table {
  width: 100%;
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
}
</style>
