<!--微应用管理-->
<template>
  <div id="alarmPush">
    <el-row>
      <el-form :inline="true" :model="searchItem" ref="searchItem">
        <el-form-item label="设备ESN">
          <el-input v-model="searchItem.terminalId" placeholder="请输入设备ESN" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="危险等级">
          <el-select v-model="searchItem.level" :placeholder="levelArr.title" style="width:150px">
            <el-option
              v-for="item in levelArr.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间">
          <el-date-picker
            v-model="searchItem.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
             style="width:300px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(1)">查询</el-button>
          <el-button type="default" @click="reset('searchItem')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="22">
        <div style="max-height:500px;overflow:auto;">
          <el-row
            class="alarmRow"
            :class="'level'+item.level"
            v-for="(item,index) in alarmList"
            :key="index"
          >
            <el-col :span="3">
              <el-button type="text" @click="showDetail(item)">
                <h4>{{item.name}}</h4>
              </el-button>
            </el-col>
            <el-col :span="4">
              <span>{{item.content}}</span>
            </el-col>
            <el-col :span="3">
              <span>报警等级：{{item.level}}</span>
            </el-col>
            <el-col :span="7">
              <span>设备Esn：{{item.esn}}</span>
            </el-col>
            <el-col :span="7">
              <span>告警时间：{{item.time}}</span>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin:20px 0px">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[5, 10,15]"
            :page-size="alarmLimit"
            layout="total, sizes, prev, pager, next"
            :total="alarmSize"
            style="float: right"
          ></el-pagination>
        </el-row>
      </el-col>
    </el-row>
    <!-- 详细信息弹窗 -->
    <el-dialog title="告警信息" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" ref="dialogForm" label-width="100px">
        <el-form-item label="告警名称">
          <el-col :span="15">
            <span>{{dialogForm.name}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="ESN设备">
          <el-col :span="15">
            <span>{{dialogForm.esn}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="报警时间">
          <el-col :span="15">
            <span>{{dialogForm.time}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="报警等级">
          <el-col :span="15">
            <span>{{dialogForm.level}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="报警信息">
          <el-col :span="15">
            <span>{{dialogForm.content}}</span>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "alarmPush",
  data() {
    return {
      alarmSize: 0,
      alarmLimit: 10,
      searchItem: {
        esn: "",
        level: "",
        time: ""
      },
      levelArr: {
        title: "请选择危险等级",
        options: [
          {
            value: "1",
            label: "一级"
          },
          {
            value: "2",
            label: "二级"
          },
          {
            value: "3",
            label: "三级"
          }
        ]
      },
      alarmList: [
        {
          name: "报警名称",
          level: "1",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        },
        {
          name: "报警名称",
          level: "2",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        },
        {
          name: "报警名称",
          level: "3",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        },
        {
          name: "报警名称",
          level: "4",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        },
        {
          name: "报警名称",
          level: "1",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        },
        {
          name: "报警名称",
          level: "2",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        },
        {
          name: "报警名称",
          level: "4",
          esn: "ADS123GSDF123G35WDDD",
          time: "2019年8月15日 17:30:13",
          content: "报警详细内容"
        }
      ],
      dialogForm: {
        name: "报警名称",
        esn: "ESN设备",
        time: "2019年8月15日 17:30:13",
        level: "一级",
        content: "报警详细内容"
      },
      dialogFormVisible: false
    };
  },
  mounted() {
    this.alarmSize = this.alarmList.length;
  },
  methods: {
    search(page) {
      // this.$axios.post('',{
      //   id:this.searchItem.id,
      //   version:this.searchItem.version,
      //   ascription:this.searchItem.ascription,
      //   limit:this.alarmLimit,
      //   page:page,
      //   sort:'asc'
      // }).then((res)=>{
      //   this.alarmSize=res.data.length;
      //   this.tableData=res.data;
      // }).catch((err)=>{
      //   console.log(err);
      // });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    showDetail(row) {
      //获取当前数据内容
      // this.$axios.post('',{
      //   id:this.selectedRow[0].id,'
      // }).then((res)=>{
      //   this.search(page);
      // }).catch((err)=>{
      //   console.log(err);
      // });
      this.dialogForm = row;
      this.dialogFormVisible = true;
      // this.$axios.post('',{
      //   id:this.selectedRow[0].id,'
      // }).then((res)=>{
      //   this.search(page);
      // }).catch((err)=>{
      //   console.log(err);
      // });
    },
    handleSizeChange(val) {
      this.alarmLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    }
  }
};
</script>

<style scoped>
.level1,
.level2,
.level3,
.level4 {
  font-size: 14px;
  height: 45px;
  line-height: 45px;
  border-radius: 5px;
  margin: 5px 0px;
}
.alarmRow h4 {
  margin-left: 20px;
}
.level1 {
  color: rgb(143, 70, 69);
  background-color: rgb(242, 222, 222);
  border-color: rgb(236, 206, 211);
}
.level2 {
  color: rgb(105, 84, 47);
  background-color: rgb(252, 248, 227);
  border-color: rgb(252, 242, 223);
}
.level3 {
  color: rgb(42, 87, 110);
  background-color: rgb(217, 237, 247);
  border-color: rgb(199, 234, 243);
}
.level4 {
  color: rgb(75, 128, 75);
  background-color: rgb(223, 240, 216);
  border-color: rgb(219, 236, 205);
}
.level1 h4 {
  color: rgb(143, 70, 69);
}
.level2 h4 {
  color: rgb(105, 84, 47);
}
.level3 h4 {
  color: rgb(42, 87, 110);
}
.level4 h4 {
  color: rgb(75, 128, 75);
}
</style>
