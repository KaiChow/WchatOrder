import Vue from 'vue'
import Router from 'vue-router'
import DepartmentsList from '@/components/DepartmentsList'
import DoctorList from '@/components/DoctorList'
import RegisterList from '@/components/RegisterList'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DepartmentsList',
      component: DepartmentsList
    },
    {
      path: '/doctors',
      name: 'DoctorList',
      component: DoctorList
    },
    {
      path: '/registerlist',
      name: 'RegisterList',
      component: RegisterList
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

