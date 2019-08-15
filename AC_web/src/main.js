// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from '../node_modules/echarts'
import axios from 'axios'
import qs from 'qs'
import 'font-awesome/css/font-awesome.css'



/////////////////////
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;
axios.defaults.baseURL = "/api";

axios.defaults.timeout = 300000;

axios.interceptors.request.use( (config) => {
    let token = sessionStorage.getItem('userToken');
    if(token){
      config.headers.Authorization = token;
    }
    if (config.headers["Content-Type"] === "application/json"){
      return config;
    }
    // debugger;
    // config.url.indexOf('/soft-detail/create') != -1||config.url.indexOf('/soft-detail/update') != -1||(config.url.indexOf('/soft-standBook/import') != -1 ||
    if(config.url == "/stock-in-register/import" || config.url === '/soft-detail/create' || config.url === "/soft-detail/update" || config.url === "/soft-standBook/import"
      || config.url == '/stock-in-register/single-register'){
      return config
    }else{
      config.method == 'post' ? config.data = qs.stringify(config.data) : '';
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });
axios.interceptors.response.use(
  (response)=>{
  if (response.data.code === 12){
    router.replace({
      path: '/' // 到登录页重新获取token
    })

  }
  return response;
  },
  err=>{
  }
)
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
import vueSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'  //引入样式
Vue.use(vueSwiper);
//Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
//Vue.prototype.$notify = Notification;
//Vue.prototype.$message = Message;
// Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
/* eslint-disable no-new */

Vue.prototype.$goRoute = function (index) {
  this.$router.push(index)
};

window.eventBus = new Vue();

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
