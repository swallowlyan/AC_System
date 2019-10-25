<!--文件服务-->
<template>
  <div id="fileService">
          <el-form :model="searchItem" ref="searchItem" label-width="auto">
            <el-row>
              <el-col :span="6">
            <el-form-item label="文件ID" prop="fileId">
              <el-input v-model="searchItem.fileId" placeholder="请输入文件ID"></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="6">
            <el-form-item prop="fileType" label="文件类型">
              <el-select v-model="searchItem.fileType" :placeholder="typeArr.title">
                <el-option
                  v-for="item in typeArr.options"
                  :key="item.itemCode"
                  :label="item.itemName"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
            </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
              <el-button type="primary" @click="search(1)">查询</el-button>
              <el-button type="default" @click="reset('searchItem')">重置</el-button>
              <el-button type="success" icon="el-icon-refresh" @click="search(1)">刷新</el-button>
              </el-col>
            </el-row>
          </el-form>
        <el-row>
          <el-col :span="22">
            <div>
              <el-table
                :data="tableData"
                border
                size="medium"
                height="40px"
                class="fileService"
                @selection-change="getRowDatas"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="fileName" label="名称"></el-table-column>
                <el-table-column prop="fileType" label="类型"></el-table-column>
                <el-table-column prop="fileUrl" label="url"></el-table-column>
                <el-table-column prop="version" label="版本"></el-table-column>
                <el-table-column prop="tenantId" label="租户ID"></el-table-column>
                <!-- <el-table-column prop="options" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button @click="editRow(scope.row)" type="text" size="medium">编辑</el-button>
                    <el-button @click="delRow(scope.row)" type="text" size="medium">删除</el-button>
                  </template>
                </el-table-column>-->
              </el-table>
              <el-row style="margin:20px 0px">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="1"
                  :page-sizes="[5, 10,15]"
                  :page-size="tableLimit"
                  layout="total, sizes, prev, pager, next"
                  :total="tableSize"
                  style="float: right"
                ></el-pagination>
              </el-row>
            </div>
          </el-col>
        </el-row>
  </div>
</template>
<script>
export default {
  name: "fileService",
  data() {
    return {
      tableData:[],
      tableSize: 0,
      tableLimit: 10,
      searchItem: {
        fileId: "",
        fileType: ""
      },
      typeArr: {
        title: "请选择类型",
        options: []
      },
      selectedRow:[]
    };
  },
  mounted() {
    this.getFileType();
    this.search(1);
  },
  methods: {
    //获取文件类型
    getFileType() {
      this.$axios
        .get(baseUrl + "/admin/file/types")
        .then(res => {
          this.typeArr.options =  res.data.data;
          this.typeArr.options.push({itemCode: "", itemName: "全部" });
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(page) {
      let param = "";
      if (this.searchItem.fileId !== "")
        param += "&fileId=" + this.searchItem.fileId;
      else if (this.searchItem.fileType !== "")
        param += "&fileType=" + this.searchItem.fileType;
      this.$axios
        .get(
          baseUrl +
            "/admin/file/list?pageSize=" +
            this.tableLimit +
            "&pageIndex=" +
            page +
            param
        )
        .then(res => {
          this.tableSize = res.data.data.total;
          this.tableData = res.data.data.records;
          return false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    getRowDatas(row) {
      this.selectedRow = row;
      console.info(row);
    },
    //tab点击事件
    handleClick() {},
    handleSizeChange(val) {
      this.tableLimit = val;
      this.search(1);
    },
    handleCurrentChange(val) {
      this.search(val);
    },
    dateFormat(row, column, cellValue, index) {
      // const daterc = row[column.property];
      // if (daterc != null) {
      //   const dateMat = new Date(
      //     parseInt(daterc.replace("/Date(", "").replace(")/", ""), 10)
      //   );
      //   const year = dateMat.getFullYear();
      //   const month = dateMat.getMonth() + 1;
      //   const day = dateMat.getDate();
      //   const hh = dateMat.getHours();
      //   const mm = dateMat.getMinutes();
      //   const ss = dateMat.getSeconds();
      //   const timeFormat =
      //     year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss;
      //   return cellValue;
      // }
      return cellValue;
    },
  }
};
</script>

<style scoped>
.fileService {
  max-height: 500px;
  overflow: auto;
}
.pull-right {
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  text-shadow: none;
}
.allCard {
  border: 1px solid #eee !important;
}
.allCard h1 {
  font-size: 36px;
  margin-bottom: 5px;
}
.el-card__header {
  padding: 10px 20px !important;
}
.stat-percent {
  color: #1c84c6;
  font-weight: 600;
  float: right;
}
.el-card__header .blue {
  background-color: #1c84c6;
}
.el-card__header .green {
  background-color: #23c6c8;
}
.el-card__header .greenAll {
  background-color: #1ab394;
}
.el-card__header .orange {
  background-color: rgba(240, 155, 119, 1);
}
.el-card__body .blue {
  color: #1c84c6;
}
.el-card__body .green {
  color: #23c6c8;
}
.el-card__body .greenAll {
  color: #1ab394;
}
.el-card__body .orange {
  color: rgba(240, 155, 119, 1);
}
.acForm .el-col {
  border-color: rgb(151, 195, 221);
  font-size: 14px;
  padding: 0px;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  line-height: 20px;
}
.acForm .el-form-item {
  margin-bottom: 0px;
}
.list {
  max-height: 100px;
  overflow: auto;
}
.list div {
  width: 150px;
  margin: 0px 10px;
  float: left;
}
.list button {
  margin-left: 10px;
}
.acForm .el-col {
  text-align: center;
}
.addConfig {
  width: 160px;
  float: left;
}
.previewTable {
  color: #48576a;
  table-layout: fixed;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.previewTable td {
  border: 1px solid #8492a6;
  padding: 5px 0;
  word-wrap: break-word;
}
.previewTable > thead {
  background-color: #eff2f7;
}
</style>

