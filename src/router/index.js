import Vue from 'vue'
import Router from 'vue-router'
import DepartmentsList from '@/components/DepartmentsList'
import DoctorList from '@/components/DoctorList'
import RegisterList from '@/components/RegisterList'
import Register from '@/components/Register'
import Record from '@/components/Record'
import RecordDetail from '@/components/RecordDetail'
import Prescription from '@/components/Prescription'
import PrescriptionDetail from '@/components/PrescriptionDetail'
import MyRegister from '@/components/MyRegister';

Vue.use(Router)



export default new Router({
  routes: [
    {
      path: '/',
      name: 'DepartmentsList',//科室列表
      component: DepartmentsList
    },
    {
      path: '/doctors',
      name: 'DoctorList',//医生列表
      component: DoctorList
    },
    {
      path: '/registerlist',
      name: 'RegisterList',//挂号列表
      component: RegisterList
    },
    {
      path: '/register',
      name: 'Register',//挂号页面
      component: Register
    },
    {
      path: '/prescription',
      name: 'Prescription',//处方列表
      component: Prescription
    },
    {
      path: '/prescriptiondetail',
      name: 'PrescriptionDetail',//处方详情
      component: PrescriptionDetail
    },
    {
      path: '/record',
      name: 'Record',//病历列表
      component: Record
    },
    {
      path: '/recorddetail',
      name: 'RecordDetail',//病历详情
      component: RecordDetail
    } ,
    {
      path: '/myregister',
      name: 'MyRegister',//病历详情
      component: MyRegister
    }
  ]
})

