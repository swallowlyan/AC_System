<!--终端管理-->
<template>
  <div id="userOverview">
      <!-- 总览数据 -->
      <el-row>
        <el-col :span="5" v-for="(item,index) in allDataArr" :key="index" style="margin:0px 10px">
          <el-card class="box-card allCard" shadow="hover" :body-style="{ padding:'15px'}">
            <div slot="header" class="clearfix">
              <span>{{item.title}}</span>
              <span class="pull-right" :class="item.color">{{item.timeTitle}}</span>
            </div>
            <h1>{{item.count}}</h1>
            <small>{{item.smallTitle}}</small>
            <div class="stat-percent" :class="item.color">
              {{item.percent}}
              <i :class="item.icon"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 总览地图 -->
      <el-row>
        <el-col :span="20" :offset="2">
          <div id="treeChart" style="height:800px"></div>
        </el-col>
      </el-row>
  </div>
</template>
<script>
export default {
  name: "terminalManege",
  data() {
    return {
      allDataArr: [
        {
          title: "一级租户数",
          timeTitle: "当前",
          smallTitle: "下属一级租户总数",
          count: "23",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color: "blue"
        },
        {
          title: "二级租户数",
          timeTitle: "当前",
          smallTitle: "下属二级租户总数",
          count: "35",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color: "green"
        },
        {
          title: "用户数",
          timeTitle: "月",
          smallTitle: "当前网省用户总数",
          count: "3,956",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color: "greenAll"
        },
        {
          title: "新增用户数",
          timeTitle: "当前",
          smallTitle: "月度新增用户数",
          count: "20",
          percent: "98%",
          icon: "fa fa-long-arrow-up",
          color: "orange"
        }
      ],
      treeData: {
        name: "xxx网省公司",
        children: [
          {
            name: "xxx地市级公司",
            children: [{ name: "xxx县级公司1" }, { name: "xxx县级公司2" }]
          },
          {
            name: "xxx地市级公司",
            children: [{ name: "xxx县级公司1" }, { name: "xxx县级公司2" },{ name: "xxx县级公司3" },
            { name: "xxx县级公司4" }, { name: "xxx县级公司5" },{ name: "xxx县级公司6" }]
          },
          {
            name: "xxx地市级公司",
            children: [{ name: "xxx县级公司1" }, { name: "xxx县级公司2" }]
          }
        ]
      }
    };
  },
  mounted() {
    this.drawTree();
  },
  methods: {
    drawTree() {
      let myChart = this.$echarts.init(document.getElementById("treeChart"));
      let option={
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",
            data: [this.treeData],
            // left: "2%",
            // right: "2%",
            top: "8%",
            // bottom: "20%",
            symbol: "emptyCircle",
            orient: "vertical",
            expandAndCollapse: true,
            label: {
              normal: {
                position: "top",
                rotate: 0,
                verticalAlign: "middle",
                align: "center",
                fontSize: 19
              }
            },
            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  rotate: -90,
                  verticalAlign: "middle",
                  align: "left"
                }
              }
            },
            animationDurationUpdate: 750
          }
        ]
      };
      myChart.setOption(option);
      myChart.resize();
    }
  }
};
</script>

<style scoped>
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
</style>

