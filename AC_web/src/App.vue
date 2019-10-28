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
/*.el-table__body-wrapper,.el-table__header-wrapper{*/
  /*background-color: #5A7D87;*/
  /*text-align: center;*/
  /*color: white;*/
/*}*/
</style>
