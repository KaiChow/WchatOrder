<template>
<div class="traditional-doctor">
    <router-link v-for="item in doctors" :key="item.MKSysUserID" :to="{ path: 'traditionalregisters', query: { zhid: zhid,ysbh:item.YSBH }}">
        <van-card :thumb="`${config.userPictureUrl}${item.PicturePath}`">
            <template slot="title">
                <span class="van-cell-text">{{item.YSMC}}</span>
                <!-- <van-tag>高级主任医师</van-tag> -->
            </template>
            <template slot="desc">
                <div class="traditional-doctor-info">
                    <span class="doctor-introduct">{{ item.Introduce }}...</span>
                </div>
            </template>
        </van-card>
    </router-link>

</div>
</template>

<script>
import {
    Card
} from 'vant';
import Miss from '../components/Miss'
export default {
    components: {
        Miss
    },
    props: {},
    data() {
        return {
            config:{
                localPictureUrl:"http://172.18.10.189:6688/Picture/",
                userPictureUrl:'http://114.55.35.180:8085/zsy.zsglrj.cn/Picture/'
            },
            imageURL: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541738888&di=2655864645494e3d179b63e680735438&src=http://pic.58pic.com/58pic/15/39/92/15b58PICSAZ_1024.jpg",
            doctors: [],
            miss: false,
            zhid: localStorage.getItem('zhid')
        }
    },
    watch: {},
    computed: {},
    methods: {
        getDoctor() {
            var _this = this;
            _this.$http.get('/api/Register/Doctor', {
                params: {
                    ZHID: _this.zhid
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
        console.log(window.location);
    },
    mounted() {}
}
</script>

<style scoped>
.doctor-introduct {
    display: inline-block;
    text-indent: 26px;
    height: 64px;
    overflow: hidden;
    font-size: 12px;
}
</style>
