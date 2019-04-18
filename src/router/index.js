import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import Import from '@/pages/Import'
import Export from '@/pages/Export'
import List from '@/pages/List'
import Edit from '@/pages/Edit'
import New from '@/pages/New'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/import',
      name: 'Import',
      component: Import
    },
    {
      path: '/export',
      name: 'Export',
      component: Export
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '/new',
      name: 'New',
      component: New
    },
    {
      path: '/edit/:index',
      name: 'Edit',
      component: Edit
    }
  ]
})
