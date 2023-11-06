import Vue from 'vue'
import VueRouter from 'vue-router'
import Statistici from '../components/Statistici.vue'
import Form from '../components/Form.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        redirect: '/'
    },
    {
      path: '/statistici',
      name: 'statistici',
      component: Statistici
    },
    {
        path: '/',
        name: 'form',
        component: Form
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
