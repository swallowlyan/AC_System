import Vue from 'vue'
import Router from 'vue-router'
import main from '../pages/main.vue'
import homePage from '../pages/homePage.vue'
import terminalManege from '../pages/terminalManege'
import applicationManege from '../pages/applicationManege'
import containerManege from '../pages/containerManege'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'main',
      component:main,
      children:[
        {
          path:'terminalManege',
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
        }
      ]
    },

  ]
})
