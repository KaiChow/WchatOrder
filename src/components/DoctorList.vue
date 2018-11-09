<!--医生列表页面-->
<template>
<div class="doctor-container">
    <div class="doctor-list" v-if="!miss">
        <van-cell-group>
            <van-cell v-for="(item) in doctors" :key="item.YSXM" v-bind:title="item.YSXM" is-link arrow-direction="right" v-bind:value="item.YSLevelMC" :to="{path:'/registerlist',query:{id:item.YSBH,ksbh:item.KSBH,zhid:zhid}}" />
        </van-cell-group>
    </div>
    <div v-if="miss">
        <Miss></Miss>
    </div>
</div>
</template>

<script>
import Miss from '../components/Miss'

export default {
    name: "DoctorList",
    components: {
        Miss
    },
    data() {
        return {
            zhid: this.$route.query.zhid,
            miss: false,
            doctors: []
        }
    },
    methods: {
        getDoctor() {
            var _this = this;
            _this.$http.get('/api/Register/KSYS', {
                params: {
                    KSBH: _this.$route.query.ksbh,
                    ZHID: _this.$route.query.zhid
                }
            }).then(function (res) {
                if (res.data.Ret == 0 && res.data.Data.length > 0) {
                    _this.miss = false;
                    _this.doctors = res.data.Data;
                } else {
                    _this.miss = true;
                }
            })
        }
    },
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
