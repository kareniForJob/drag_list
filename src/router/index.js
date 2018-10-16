import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Dragies from '@/components/dragyPage/dragyPage'

import Error404 from '@/components/errors/Error404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dragies/:id',
    name: 'dragyList',
    component: Dragies
  },
  {
    path: '/*',
    name: '404',
    component: Error404
  }
  ]
})
