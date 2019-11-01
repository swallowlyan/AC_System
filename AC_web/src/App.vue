<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<my-header></my-header>-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>
<style>
 @import "../src/assets/font-awesome-4.7.0/css/font-awesome";
</style>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
  /*background-image: url("./assets/BG.jpg");*/
  background-repeat:no-repeat;
  background-size: cover;
}
.el-card{
    background: rgba(255,255,255,0.3);/*firefox、chrome*/
    background: #fff\7;/*IE*/
    filter: alpha(opacity=30);/*IE*/
    border:0px!important;
}
a:link{
  color: #ffffff;
  text-decoration:none;
}

a:visited{
  color: #ffffff;
  text-decoration:none;
}
.el-form-item__error{
  z-index: 999 !important;
}
.container{
    background: rgba(255,255,255,0);/*firefox、chrome*/
    background: #fff\7;/*IE*/
    filter: alpha(opacity=0);/*IE*/
  }
  .el-main {
    padding: 0px 20px;
  }
  td{padding: 0px !important}
.acForm .el-col {
  border-color: rgb(151, 195, 221);
  font-size: 14px;
  padding: 0px;
  border-width: 1px;
  border-style: solid;
  /* text-align: center; */
  /* line-height: 20px; */
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
.acForm .el-form-item__label {
  background-color: rgb(239, 243, 248) !important;
  height: 100%;
  text-align: center;
}
.acForm .el-form-item {
  height: 100%;
}
.lineHeight .el-form-item__label {
  line-height: 100px;
}
.acForm .el-textarea__inner {
  height: 100%;
}
.acForm span {
  /* margin-left: 30px; */
}
.acForm .el-input__inner{
  height:30px;
}
.searchForm .el-col{
  margin:0px 5px;
}
</style>
