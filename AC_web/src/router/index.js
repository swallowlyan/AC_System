import Vue from 'vue'
import Router from 'vue-router'
import main from '../pages/main.vue'
import loginPage from '../pages/LoginPage'
import registerPage from '../pages/registerPage'

import homePage from '../pages/homePage'
import terminalManege from '../pages/terminalManege'
import applicationManege from '../pages/applicationManege'
import containerManege from '../pages/containerManege'
import appList from '../pages/appList'
import alarmPush from '../pages/alarmPush'

import userManage from '../pages/system/userManage'
import tenantManage from '../pages/system/tenantManage'
import userOverview from '../pages/system/userOverview'

import fileService from '../pages/fileService'
import taskList from '../pages/taskList'

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
          name:'homePage',
          component:homePage,
          meta:{
            // ifFooter:"show",
            // ifMenu:"show",
            // ifHome:"none"
            },
        },
        {
          path:'terminalManege',
          name:'terminalManege',
          component:terminalManege
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
        },
        {
          path:'userOverview',
          name:'userOverview',
          component:userOverview
        },
        {
          path:'fileService',
          name:'fileService',
          component:fileService
        },
        {
          path:'taskList',
          name:'taskList',
          component:taskList
        }
      ]
    },
    {
      path:'/login',
      name:'loginPage',
      component:loginPage
    },
    {
      path:'/register',
      name:'registerPage',
      component:registerPage
    }
  ]
})
