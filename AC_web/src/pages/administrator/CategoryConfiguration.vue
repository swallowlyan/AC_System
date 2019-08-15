<template>
  <div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>服务类别配置
    </div>
    <div class="suffix">
      领域分类：
      <el-tag
        v-for="areaType in areaTypeList"
        :key="areaType.fieldName"
        closable
        @close="handleClose(areaType.id)"
        :disable-transitions="false"
       >
        {{areaType.fieldName}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        style="width:150px;"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
    </div>
     <div class="suffix">
      行业分类：
      <el-tag
        v-for="industry in industryList"
        :key="industry.industryName"
        closable
         @close="handleClose_b(industry.id)"
          :disable-transitions="false"
          >
        {{industry.industryName}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible_b"
        v-model="inputValue_b"
        ref="saveTagInput_b"
        style="width:150px;"
        size="small"
        @keyup.enter.native="handleInputConfirm_b"
        @blur="handleInputConfirm_b"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput_b">新增</el-button>
    </div>
     <div class="suffix">
      交付方式：
      <el-tag
        v-for="deliver in deliverList"
        :key="deliver.deliverType"
        :type="deliver.type">
        {{deliver.deliverType}}
      </el-tag>
    </div>
    <div class="suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>服务分类管理
    </div>
    <div class="suffix">
      <el-input
      style="width:300px;"
        popper-class="my-autocomplete"
        v-model="state"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容">
      </el-input>
        <i
         style="margin:0 5px"
          class="el-icon-search"
          @click="handleIconClick">
        </i>
    </div>
    <div>
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
        <tr v-for="(soft, index) in softList"
        style="font-size:12px;line-height:35px;"
         :key="index"
        >
          <td>{{soft.softName}}</td>
          <td> <img :src="'data:image/jpg;base64,'+soft.softIcon
          " style="height:50px;width: 50px;padding-top:12px;"></td>
          <td>{{soft.softVersion}}</td>
          <td>{{soft.softMenu}}</td>
          <td>{{soft.softCategoryName}}</td>
          <td>{{soft.softCategory2Name}}</td>
          <td>{{soft.softCategory3Name}}</td>
          <td>{{soft.description}}</td>
          <td></td>
          <td>{{soft.status}}</td>
          <td>
            <template v-if="soft.status==='NORMAL'">
              <!--<el-button
                size="mini"
                name="select"
              >
                编辑
              </el-button>-->
              <el-button
                size="mini"
                name="select"
                @click="delSoft(soft.id)"
              >
                下架
              </el-button>
            </template>
            <template v-if="soft.status==='DEL'">
              已下架
            </template>
          </td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;">
    <el-pagination
      style="margin-left:-100px;"
      @current-change="getsoftlist"
      :current-page.sync="page"
      :page-size="size"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>
<script>
    export default {
      data(){
          return{
          restaurants: [],
          state: '',
          areaTypeList:[],
          industryList:[],
          deliverList:[],
          softList:{},
          inputVisible: false,
          inputValue: '',
          inputValue_b: '',
          inputVisible_b: false,
          param:{
            fieldName:'',
            industryName:''
          },
          total: 0,
          size: 5,
          page: 1,
          }
      },
      mounted(){
        this.getAreaType();
        this.getindustry();
        this.getdeliver();
        this.getsoftlist()
      },
      methods:{
        delSoft(softId){//
          this.$axios.post('/soft-detail/del',{id:softId}).then((res)=>{
            if(res.data.message==="成功"){
              this.$message({
                message: '已成功下架该服务',
                type: 'success'
              });
             this.getsoftlist();
            }else{
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }

          }).catch((err)=>{
            console.log(err);
          });
        },
        getsoftlist(){
        this.$axios.post('/soft-detail/get-all-softs', {
          size:this.size,
          current:this.page,
          username:sessionStorage.getItem('username')
        }).then((res)=>{
          this.softList=res.data.data.records;
          this.total=res.data.data.total
          }).catch((err)=>{
            console.log(err);
          });
        },
         getAreaType(){
          this.$axios.get('/field-cate/list-all').then((res)=>{
            if(res.data.data.length>0)this.areaTypeList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
         },
          getindustry(){
          this.$axios.get('/industry-cate/list-all').then((res)=>{
            if(res.data.data.length>0)this.industryList=res.data.data;
          }).catch((err)=>{
            console.log(err);
          });
          },
          getdeliver(){
          this.$axios.get('/deliver-type/list-all').then((res)=>{
            if(res.data.data.length>0)this.deliverList=res.data.data;
              console.log(this.deliverList);
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
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleClose(id) {
         this.$axios.post('/field-cate/delete',{id:id}).then((res)=>{
            this.getAreaType();
          }).catch((err)=>{
            console.log(err);
          });

      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.param.fieldName=inputValue;
          this.$axios.post('/field-cate/create',this.param).then((res)=>{
            this.getAreaType();
          }).catch((err)=>{
            console.log(err);
          });
        }

        this.inputVisible = false;
        this.inputValue = '';
      },
        handleClose_b(id) {
         this.$axios.post('/industry-cate/delete',{id:id}).then((res)=>{
            this.getindustry();
          }).catch((err)=>{
            console.log(err);
          });

      },

      showInput_b() {
        this.inputVisible_b= true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput_b.$refs.input.focus();
        });
      },

      handleInputConfirm_b() {
        let inputValue = this.inputValue_b;
        if (inputValue) {
          this.param. industryName=inputValue;
          this.$axios.post('/industry-cate/create',this.param).then((res)=>{
            this.getindustry();
          }).catch((err)=>{
            console.log(err);
          });
        }

        this.inputVisible_b= false;
        this.inputValue_b= '';
      },
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
tr{
  border-bottom: 1px solid #EBEEF5;
}
.line_style div{
 margin:10px 0;
}
.el-tag{
  margin:0 5px;
}
</style>
