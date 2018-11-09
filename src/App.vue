<template>
<div id="app">
    <Header :message="text" :showLeft="show"></Header>
    <router-view />
</div>
</template>

<script>
import Header from "@/components/Header";
import { Tabbar, TabbarItem } from "vant";
export default {
  name: "App",
  components: {
    Header
  },
  data() {
    return {
      active: 0,
      text: "科室列表",
      show: "false"
    };
  },
  watch: {
    /* 监听路由 */
    $route(to, from) {
      this.handleHeader(to.name);
    }
  },
  methods: {
    /**
     *处理header数据
     */
    handleHeader(name) {
      switch (name) {
        case "DepartmentsList":
          this.text = "科室列表";
          this.show = "false";
          break;
        case "DoctorList":
          this.text = "医生列表";
          this.show = "true";
          break;
        case "RegisterList":
          this.text = "挂号列表";
          this.show = "true";
          break;
        case "Register":
          this.text = "确认挂号";
          this.show = "true";
          break;
        case "Record":
          this.text = "病历列表";
          this.show = "false";
          break;
        case "RecordDetail":
          this.text = "病历详情";
          this.show = "true";
          break;
        case "Prescription":
          this.text = "处方列表";
          this.show = "false";
          break;
        case "PrescriptionDetail":
          this.text = "处方详情";
          this.show = "true";
          break;
        case "MyRegister":
          this.text = "我的预约";
          this.show = "false";
          break;
        case "TraditionlDoctor":
          this.text = "医生列表";
          this.show = "false";
          break;
        case "TraditionalRegisters":
          this.text = "预约挂号";
          this.show = "true";
          break;
      }
    }
  },
  mounted() {},
  created() {
    this.handleHeader(this.$route.name);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
