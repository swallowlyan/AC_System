<template>
  <div id="homePage">
    <!-- 总览数据 -->
    <el-row>
      <el-col :span="5" v-for="(item,index) in allDataArr" :key="index" style="margin:0px 10px">
        <el-card class="box-card allCard" :body-style="{ padding:'10px'}">
          <div>
            <el-row>
              <el-col :span="17">
                <router-link tag="a" :to="{path:'/terminalManege',query:{status:item.param}}">
                  <h1>{{item.count}}</h1>
                </router-link>
                <h3>
                  {{item.title}}
                  <span class="pull-right" :class="item.color">{{item.timeTitle}}</span>
                </h3>
              </el-col>
              <el-col :span="5" :offset="1">
                <img :src="item.img" style="width:100%;margin-top: 10px;" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 总览地图 -->
    <el-row style="margin-top:15px;">
      <el-col :span="20" :offset="2">
        <div id="mapChart" style="height:350px"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import shandongJson from "../../static/shandongData"; //山东地图json
export default {
  name: "homePage",
  data() {
    return {
      allDataArr: [
        {
          title: "终端总数",
          timeTitle: "当前",
          smallTitle: "接入终端总数",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "blue",
          param: "",
          img: require("../assets/img/main_ico01.png")
        },
        {
          title: "在线终端总数",
          timeTitle: "当前",
          smallTitle: "当前在线终端总数",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "green",
          param: "",
          img: require("../assets/img/main_ico02.png")
        },
        {
          title: "已激活终端总数",
          timeTitle: "当前",
          smallTitle: "已激活终端",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "greenAll",
          param: "",
          img: require("../assets/img/main_ico03.png")
        },
        {
          title: "未激活终端总数",
          timeTitle: "当前",
          smallTitle: "未激活终端",
          count: "0",
          percent: "0%",
          icon: "fa fa-long-arrow-up",
          color: "orange",
          param: "",
          img: require("../assets/img/main_ico04.png")
        }
      ],
      geoCoordMap: {
        济南市: [117.121225, 36.66466],
        菏泽市: [115.480656, 35.23375],
        济宁市: [116.59, 35.38],
        德州市: [116.39, 37.45],
        聊城市: [115.97, 36.45],
        泰安市: [117.13, 36.18],
        临沂市: [118.35, 35.05],
        淄博市: [118.05, 36.78],
        枣庄市: [117.57, 34.86],
        滨州市: [118.03, 37.36],
        潍坊市: [119.1, 36.62],
        东营市: [118.49, 37.46],
        青岛市: [120.3, 36.62],
        烟台市: [120.9, 37.32],
        威海市: [122.1, 37.2],
        日照市: [119.1, 35.62],
        济宁市: [116.7, 35.42],
        莱芜市: [117.7, 36.28]
      },
      mapData: [
        { name: "济南市", value: 0 },
        { name: "菏泽市", value: 0 },
        { name: "德州市", value: 0 },
        { name: "聊城市", value: 0 },
        { name: "泰安市", value: 0 },
        { name: "临沂市", value: 0 },
        { name: "淄博市", value: 0 },
        { name: "枣庄市", value: 0 },
        { name: "滨州市", value: 0 },
        { name: "潍坊市", value: 0 },
        { name: "东营市", value: 0 },
        { name: "青岛市", value: 0 },
        { name: "烟台市", value: 0 },
        { name: "威海市", value: 0 },
        { name: "日照市", value: 0 },
        { name: "济宁市", value: 0 },
        { name: "莱芜市", value: 0 }
      ]
    };
  },
  mounted() {
    this.getAllData();
    this.getMapData();
  },
  methods: {
    //获取总览数据
    getAllData() {
      this.$axios
        .post(baseUrl + "/admin/snapshoot/queryTerminalStatistic")
        .then(res => {
          if (res.data.errcode === "0") {
            this.allDataArr[0].count = res.data.data.terminalNum_total;
            this.allDataArr[1].count = res.data.data.terminalNum_online;
            this.allDataArr[2].count = res.data.data.terminalNum_active;
            this.allDataArr[3].count = res.data.data.terminalNum_unconfirmed;
          } else {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取地图数据
    getMapData() {
      this.$axios
        .post(baseUrl + "/admin/terminal/groubByTenantId")
        .then(res => {
          if (res.data.errcode === "0") {
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                this.mapData.forEach(map => {
                  if (map.name === item.name) {
                    if (item.num === null) map.num = 0;
                    else map.num = item.num;
                    if (item.total === null) map.value = 0;
                    else map.value = item.total;
                    map.tenantId = item.tenantId;
                  }
                });
              });
            }
          } else {
            this.$message({
              message: "查询失败",
              type: "error"
            });
          }
          this.drawMap();
        })
        .catch(err => {
          console.log(err);
        });
    },
    drawMap() {
      let myChart = this.$echarts.init(document.getElementById("mapChart"));
      this.$echarts.registerMap("shandong", shandongJson);
      var max = 480,
        min = 9; // todo
      var maxSize4Pin = 100,
        minSize4Pin = 20;
      var option = {
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            if (params.data.num !== undefined) {
              return (
                params.name +
                "<br>激活终端：" +
                params.data.num +
                "<br>终端总数：" +
                params.data.value
              );
            } else {
              return params.name + "<br>激活终端：---" + "<br>终端总数：---";
            }
          }
        },
        legend: {
          orient: "vertical",
          y: "bottom",
          x: "right",
          show: false,
          textStyle: {
            color: "#fff"
          }
        },
        visualMap: {
          show: true,
          min: 0,
          max: 50,
          left: "10%",
          top: "bottom",
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: ["#0687AB", "#69C5E1"]
          }
        },
        geo: {
          show: true,
          map: "shandong",
          label: {
            normal: {
              show: true,
              color: "#ffffff",
              formatter: "{b}",
              position: "right"
            },
            emphasis: {
              show: false
            }
          },
          roam: true,
          zoom: 1.25,
          itemStyle: {
            normal: {
              areaColor: "#023677",
              borderColor: "#3fdaff"
            },
            emphasis: {
              areaColor: "#11a7b8"
            }
          }
        },
        series: [
          {
            name: "light",
            type: "scatter",
            coordinateSystem: "geo",
            data: this.convertData(this.mapData),
            symbolSize: function(val) {
              return val[2] / 30;
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#F4E925"
              }
            }
          },
          {
            type: "map",
            map: "shandong",
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#FFFFFF"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: this.mapData
          },
          {
            name: "Top 5",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: this.convertData(
              this.mapData
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0, 5)
            ),
            symbolSize: function(val) {
              return val[2] / 30;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "#F4E925",
                shadowBlur: 10,
                shadowColor: "#05C3F9"
              }
            },
            zlevel: 1
          }
        ]
      };
      myChart.setOption(option);
      myChart.resize();
    },
    convertData(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
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
.allCard a > h1 {
  font-size: 36px;
  color: #687b8f;
  margin-left: 5px;
}
.allCard h3 {
  color: #687b8f;
  font-size: 14px;
  font-weight: normal;
}
.el-card__header {
  padding: 10px 20px !important;
}
.stat-percent {
  color: #1c84c6;
  font-weight: 600;
  float: right;
}
.el-card__body .blue {
  background-color: #1c84c6;
}
.el-card__body .green {
  background-color: #23c6c8;
}
.el-card__body .greenAll {
  background-color: #1ab394;
}
.el-card__body .orange {
  background-color: rgba(240, 155, 119, 1);
}
.pull-right {
  float: none;
  color: #ffffff;
}
</style>
