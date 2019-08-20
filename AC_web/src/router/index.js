import Vue from 'vue'
import Router from 'vue-router'
import main from '../pages/main.vue'
import homePage from '../pages/homePage.vue'
import terminalManege from '../pages/terminalManege'
import applicationManege from '../pages/applicationManege'
import containerManege from '../pages/containerManege'
import appList from '../pages/appList'
import alarmPush from '../pages/alarmPush'

import userManage from '../pages/system/userManage'
import tenantManage from '../pages/system/tenantManage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'main',
      component:main,
      children:[
        {
          path:'',
          name:'terminalManege',
          component:terminalManege,
          meta:{
            // ifFooter:"show",
            // ifMenu:"show",
            // ifHome:"none"
            },
        },
        {
          path:'applicationManege',
          name:'applicationManege',
          component:applicationManege
        },
        {
          path:'containerManege',
          name:'containerManege',
          component:containerManege
        },
        {
          path:'appList',
          name:'appList',
          component:appList
        },
        {
          path:'alarmPush',
          name:'alarmPush',
          component:alarmPush
        },
        {
          path:'userManage',
          name:'userManage',
          component:userManage
        },
        {
          path:'tenantManage',
          name:'tenantManage',
          component:tenantManage
        }
      ]
    },

  ]
})
