// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vant from "vant";
import "vant/lib/vant-css/index.css";
import axios from "../node_modules/axios";
import "./common/styles/icon.styl";

Vue.config.productionTip = false;
Vue.prototype.axios = axios;
// axios.defaults.baseURL = "http://172.18.10.189:6666";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

/* eslint-disable no-new */
Vue.use(Vant);
new Vue({
  el: "#app",
  router,
  axios,
  components: { App },
  template: "<App/>"
});
