// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vant from "vant";
import "vant/lib/vant-css/index.css";
import axios from "../node_modules/axios";
import "./common/styles/icon.styl";
import store from './store.js';

/**
 * 注意------！！！！！！！！---------------
 * 在发到线上之时，axios 的跨域设置要注释，在config文件-->index.js里的proxyTable内部的代码要注释；
 * axios.defaults.baseURL：要设置为线上端口地址
 */

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
// axios.defaults.baseURL = "http://172.18.10.189:6666";
// axios.defaults.baseURL = "http://120.26.165.247:8086";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

/* eslint-disable no-new */
Vue.use(Vant);
new Vue({
  el: "#app",
  router,
  axios,
  store,
  components: { App },
  template: "<App/>"
});
