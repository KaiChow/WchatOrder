<template>
<div class="traditional-doctor">
    <div v-if="!miss">
        <router-link v-for="item in doctors" :key="item.MKSysUserID" :to="{ path: 'traditionalregisters', query: { zhid: zhid,ysbh:item.YSBH }}">
            <div @click="storageImg(item)" class="traditional-doctor-content">
                <van-card :thumb="`${config.userPictureUrl}${item.PicturePath}`">
                    <template slot="title">
                        <span class="van-cell-text doctor-name">{{item.YSMC}}</span>
                        <!-- <van-tag>高级主任医师</van-tag> -->
                    </template>
                    <template slot="desc">
                        <div class="traditional-doctor-info">
                            <span class="doctor-introduct">{{ item.Introduce }}...</span>
                        </div>
                    </template>
                </van-card>
            </div>
        </router-link>
    </div>
    <div v-if="miss">
        <Miss></Miss>
    </div>

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
            config: {
                localPictureUrl: "http://172.18.10.189:6688/Picture/",
                userPictureUrl: 'http://114.55.35.180:8085/zsy.zsglrj.cn/Picture/'
            },
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
        },
        storageImg(item) {
            localStorage.setItem("doctorImg", item.PicturePath);
        }
    },
    created() {
        this.getDoctor();
    },
    mounted() {}
}
</script>

<style scoped>
.doctor-introduct {
    color: #666;
    padding: 10px 0;
    display: inline-block;
    height: 64px;
    overflow: hidden;
    font-size: 12px;
}

.doctor-name {
    font-size: 14px;
    color: #000000;
    font-weight: 200;
}


.traditional-doctor-content {
    margin-bottom: 2px;
}
</style>
