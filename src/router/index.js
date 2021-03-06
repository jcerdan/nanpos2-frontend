import Vue from 'vue'
import Router from 'vue-router'
import Ticket from '@/components/Ticket'
import Historic from '@/components/Historic'
import Tancament from '@/components/Tancament'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Ticket',
      component: Ticket
    },
    {
      path: '/historic',
      name: 'Historic',
      component: Historic
    },
    {
      path: '/tancaments',
      name: 'Tancament',
      component: Tancament
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
