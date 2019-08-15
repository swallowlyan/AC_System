import Vue from 'vue'
import Router from 'vue-router'
import registerPage from '../pages/registerPage'
import LoginPage from '../pages/LoginPage'
import homePage from '../pages/homePage.vue'
import Ind from '../pages/ind'

import PersonalIndex from '../pages/personalWork/PersonalIndex'
import PersonalWorkbench from '../pages/personalWork/PersonalWorkbench'
import UploadService from '../pages/personalWork/UploadService'
import SaasService from '../pages/personalWork/SaasService'
import PurchasedServices from '../pages/personalWork/PurchasedServices'
import HistoricalServices from '../pages/personalWork/HistoricalServices'
import CollectionServices from '../pages/personalWork/CollectionServices'
import CommonServices from '../pages/personalWork/CommonServices'
import MyUpload from '../pages/personalWork/MyUpload'
import enterUpload from '../pages/enterpriseWork/MyUpload'
import MyBusiness from '../pages/personalWork/MyBusiness'
import servicesRunningList from '../pages/personalWork/servicesRunningList'

import softList from '../pages/soft/softList.vue'
import softCommon from '../pages/soft/softCommon.vue'
import softDetail from '../pages/soft/softDetail.vue'

import EnterpriseWorkbench from '../pages/enterpriseWork/EnterpriseWorkbench'
import EnterpriseIndex from '../pages/enterpriseWork/EnterpriseIndex'
import ServiceApproval from '../pages/enterpriseWork/ServiceApproval'
import enterprisePurchasedServices from '../pages/enterpriseWork/PurchasedServices'

import AdministratorBackstage from '../pages/administrator/AdministratorBackstage'
import RegisterApproval from '../pages/administrator/RegisterApproval'
import ApprovalService from '../pages/administrator/ApprovalService'
import UserManagement from '../pages/administrator/UserManagement'
import DataStatistics from '../pages/administrator/DataStatistics'
import ComprehensiveStatistics from '../pages/administrator/ComprehensiveStatistics'
import CategoryConfiguration from '../pages/administrator/CategoryConfiguration'

import developersHomePage from '../pages/developers/develop_homePage'
import developersWorkbench from '../pages/developers/developersWorkbench'
import developersUpload from '../pages/developers/developersUpload'
import developersConsole from '../pages/developers/console'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'Ind',
      component:Ind,
      children:[
        {
          path:'login',
          name:'LoginPage',
          component:LoginPage,
          children:[]
        },
        {
          path:'/register',
          name:'registerPage',
          component:registerPage,
          children:[]
        },
        {
          path:'',
          name:'homePage',
          component:homePage,
          meta:{
            ifFooter:"show",
            ifMenu:"show",
            ifHome:"none"
            },
        },
        {
          path:'developersHomePage',
          name:'developersHomePage',
          component:developersHomePage,
          meta:{ifFooter:"show",ifMenu:"show",ifHome:"none"}
        },
        //个人工作台
        {
          path:'personal-workbench',
          name:'PersonalWorkbench',
          component:PersonalWorkbench,
          children:[
            {
              path:'',
              name:'PersonalIndex',
              component:PersonalIndex,
            },
            {
              path:'my-upload',
              name:'MyUpload',
              component:MyUpload,
            },
            {
              path:'my-business',
              name:'MyBusiness',
              component:MyBusiness,
            },
            {
              path:'upload-service',
              name:'UploadService',
              component:UploadService
            },
            {
              path:'saas-service',
              name:'SaasService',
              component:SaasService
            },
            {
              path:'purchased-services',
              name:'PurchasedServices',
              component:PurchasedServices
            },
            {
              path:'historical-services',
              name:'HistoricalServices',
              component:HistoricalServices
            },
            {
              path:'collection-services',
              name:'CollectionServices',
              component:CollectionServices
            },
            {
              path:'common-services',
              name:'CommonServices',
              component:CommonServices
            },
            {
              path:'servicesRunningList',
              name:'servicesRunningList',
              component:servicesRunningList
            }
          ]
        },
        //企业工作台
        {
          path:'enterprise-workbench',
          name:'EnterpriseWorkbench',
          component:EnterpriseWorkbench,
          children:[
            {
              path:'index',
              name:'EnterpriseIndex',
              component:EnterpriseIndex
            },
            {
              path:'service-approval',
              name:'ServiceApproval',
              component:ServiceApproval
            },
            {
              path:'my-upload',
              name:'MyUpload',
              component:enterUpload
            },
            {
              path:'upload-service',
              name:'UploadService',
              component:UploadService
            },
            {
              path:'purchased-services',
              name:'PurchasedServices',
              component:enterprisePurchasedServices
            },
            {
              path:'servicesRunningList',
              name:'servicesRunningList',
              component:servicesRunningList
            }

          ]
        },
        //管理员工作台
        {
          path:'administrator-backstage',
          name:'AdministratorBackstage',
          component:AdministratorBackstage,
          children:[
            {
              path:'index',
              name:'RegisterApproval',
              component:RegisterApproval
            },
            {
              path:'approval-service',
              name:'ApprovalService',
              component:ApprovalService
            },
            {
              path:'data-statistics',
              name:'DataStatistics',
              component:DataStatistics
            },
            {
              path:'comprehensive-statistics',
              name:'ComprehensiveStatistics',
              component:ComprehensiveStatistics
            },
            {
              path:'user-management',
              name:'UserManagement',
              component:UserManagement
            },
            {
              path:'category-configuration',
              name:'CategoryConfiguration',
              component:CategoryConfiguration
            },
            {
              path:'servicesRunningList',
              name:'servicesRunningList',
              component:servicesRunningList
            }
          ]
        },
        //软件列表
        {
          path:'soft',
          name:'soft',
          component:softCommon,
          meta:{ifFooter:"show"},
          children:[
            {
              path:'',
              name:'softList',
              component:softList,
              meta:{ifFooter:"show",ifMenu:"show",ifHome:"none"}
            },
            {
              path:'softDetail',
              name:'softDetail',
              component:softDetail,
              meta:{ifFooter:"show",ifMenu:"show",ifHome:"none"}
            }
          ]
        },
        //开发者平台
        {
          path:'developers-workbench',
          name:'DevelopersWorkbench',
          component:developersWorkbench,
          children:[
            {
              path:'Upload',
              name:'developersUpload',
              component:developersUpload
            },
            {
              path:'Console',
              name:'developersConsole',
              component:developersConsole
            },
            {
              path:'upload-service',
              name:'UploadService',
              component:UploadService
            },
          ]
          }
      ]
    },

  ]
})
