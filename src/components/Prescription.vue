<template>
<div class="wrapper-prescription">
    <Header :message="text" :showLeft="show"></Header>
    <div class="prescription-content" v-if="!miss">
        <div class="register-item" v-for="item in prescriptList" v-if="!miss" :key="item.NUM">
            <van-cell-group>
                <van-cell v-bind:title="`姓名：${item.HZXM}`" value="内容" v-bind:label="`${item.CJRQ}`" :to="{path:'/prescriptiondetail',query:{'zhid':zhid,'zz':item.ZZ,'zdxx':item.ZDXX,'ysyz':item.YSYZ}}">
                    <template>
                        <span class="van-cell-text">医生：{{item.YSXM}}</span><br>
                        <span class="van-cell-text">金额：￥{{item.ZJE}}</span>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
    <div v-if="miss">
        <Miss></Miss>
    </div>
</div>
</template>

/* 处方列表页面 */

<script>
import Header from "../components/Header";
import Miss from "../components/Miss";
import {
    mapActions
} from 'vuex'

export default {
    components: {
        Miss,
        Header
    },
    props: {},
    data() {
        return {
            text: "处方列表",
            show: "false",
            miss: false,
            zhid: this.$store.state.zhid,
            openid: this.$store.state.openid,
            PageIndex: 1,
            PageSize: 50,
            prescriptList: []
        }
    },
    watch: {},
    computed: {},
    methods: {
        ...mapActions([
            'updateState'
        ]),
        /* 获取处方列表 */
        getPrescriptionList() {
            this.$http.get("/api/Register/MyCFList", {
                params: {
                    openID: this.$store.state.openid,
                    ZHID: this.$store.state.zhid,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(res => {
                let body = res.data;
                if (body.Ret == 0 && body.Data) {
                    if (body.Data.Entity) {
                        this.miss = false;
                        this.prescriptList = body.Data.Entity;
                    } else {
                        this.miss = true;
                    }
                } else {
                    this.miss = true;
                }
            });
        }
    },
    created() {
        this.$store.commit('updateState');
        console.log(this.$store.state);
        this.getPrescriptionList();
    },
    mounted() {}
}
</script>

<style scoped>

</style>
