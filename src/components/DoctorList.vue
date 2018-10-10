<!--医生列表页面-->
<template>
  <div class="doctor-container">
    <Header :message="text" :showLeft="show"></Header>

    <div class="doctor-list" v-if="!miss">
      <van-cell-group>
        <van-cell v-for="(item) in doctors" :key="item.YSXM" v-bind:title="item.YSXM" is-link
                  arrow-direction="right"
                  v-bind:value="item.YSLevelMC" :to="{path:'registerlist',query:{id:item.YSBH,ksbh:item.KSBH}}"/>
      </van-cell-group>
    </div>
    <div v-if="miss">
      <Miss></Miss>
    </div>
  </div>
</template>

<script>
  import Miss from '../components/Miss'
  import Header from '../components/Header';
  export default {
    name: "DoctorList",
    components: {Miss,Header},
    data() {
      return {
        miss: false,
        text:"医生列表",
        show:"true",
        doctors: []
      }
    },
    methods: {
      getDoctor() {
        var _this = this;
        _this.axios.get('/api/Register/KSYS', {
          params: {
            KSBH: this.$route.query.ksbh,
            ZHID: 2018071800000019
          }
        }).then(function (res) {
          if (res.data.Ret == 0 && res.data.Data.length > 0) {
            _this.miss = false;
            _this.doctors = res.data.Data;
          } else {
            _this.miss = true;
          }
        })
      },
      goBack() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    },
    // mounted: function () {
    //   this.getDoctor();
    // },
    created() {
      this.getDoctor();
    }
  }
</script>

<style scoped>
  span.doctor-position {
    float: right;
  }
</style>
