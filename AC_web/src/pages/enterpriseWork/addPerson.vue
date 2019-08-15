<template>
  <el-dialog title="添加成员" :visible.sync="addDialog_person" :before-close="closeModel">
    <el-row>
      <el-col :span="15" :offset="2"><el-input v-model="searchVal" autocomplete="off"></el-input></el-col>
      <el-col :span="1">
        <el-button @click="searchPerson()">
          <i style="margin:0 5px" class="el-icon-search" ></i>
        </el-button>
      </el-col>

    </el-row>
    <el-row>
    <div class="work_table">
      <table
        width="90%"
        style="border-collapse:collapse"
      >
        <tr style="font-weight:700;font-size:14px;line-height:35px;">
          <td>用户名</td>
          <td>账号</td>
          <td>手机号</td>
          <td>邮箱</td>
          <td>操作</td>
        </tr>
        <tr v-for="(data, index) in personList"
            style="font-size:12px;line-height:35px;"
            :key="index"
        >
          <td>{{data.username}}</td>
          <td>{{data.nickname}}</td>
          <td>{{data.phone}}</td>
          <td>{{data.email}}</td>
          <td>
            <template>
              <el-button size="mini" type="text" name="select" @click="addPerson(data.username)">
                加入企业
              </el-button>
            </template>
          </td>
        </tr>
      </table>
      <el-pagination background @size-change="sizeChange"
                     @current-change="currentChange"
                     :current-page="1"
                     :page-sizes="[5,10]"
                     :page-size="pageSize"
                     layout="total, prev, pager, next"
                     :total="total"
                     style="margin: 20px 0px;float: right">
      </el-pagination>
    </div>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "addPerson",
      data(){
          return {
            searchVal:"",
            personList:[],
            pageSize:5,
            total:0
          }
      },
      props:{
        addDialog_person:{
          type:Boolean,
        default(){return false}
        }
      },
      mounted(){
          this.searchPerson({
            current:1,
            size:5,
            sort:'id',
            dir:'asc'
          });
      },
      methods:{
        searchPerson(param){
          param.search=this.searchVal;
          this.$axios.post('/sysuser/free-users',param).then((res)=>{
            this.personList=res.data.data.records;
            this.total=res.data.data.total;
          }).catch((err)=>{
            console.log(err);
          });

        },
        addPerson(username){
          let param={
            gropuId:sessionStorage.getItem('enterpriseId'),
            positionId:-1,
            usernames:username,
            positionType:"COMMON"
          };
          this.$axios.post('/sysuser/user-group',param).then((res)=>{
            if(res.data.message==="成功"){
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.searchPerson({
                current:1,
                size:5,
                sort:'id',
                dir:'asc'
              });
              this.$emit('refresh');
            }
          }).catch((err)=>{
            console.log(err);
          });
        },
        sizeChange(val){
          this.pageSize=val;
          let param={
            current:1,
            size:val,
            sort:'id',
            dir:'asc'
          };
          this.searchPerson(param);
        },
        currentChange(val){
          let param={
            current:val,
            size:this.pageSize,
            sort:'id',
            dir:'asc'
          };
          this.searchPerson(param);
        },
        closeModel(){
          this.$emit('close');
        }
      }
    }
</script>

<style scoped>
  .work_table{
    padding: 20px;
    max-height: 450px;
    overflow: auto
  }
</style>
