<template>
<div class="wrapper-my-register">
    <div class="my-register-content">
        <div class="register-item" v-for="item in myRecordList" v-if="!miss" :key="item.NUM">
            <van-cell-group>
                <van-cell v-bind:title="`科室：${item.KSMC}`" value="内容" v-bind:label="`${item.YYSJ}  ${item.PBFLAG}  ${item.rangeTime}`">
                    <template>
                        <span class="van-cell-text">医生：{{item.YSXM}}</span><br>
                        <span class="van-cell-text">挂号费：￥{{item.ZJE}}</span>
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

<script>

import Miss from "../components/Miss";
import {
    mapActions
} from 'vuex';

export default {
    components: {
        Miss
    },
    props: {},
    data() {
        return {
            time: "",
            rangeTime: "",
            miss: false,
            PageIndex: 1,
            PageSize: 8,
            myRecordList: []
        }
    },
    watch: {},
    computed: {},
    methods: {
        ...mapActions([
            'updateState'
        ]),
        getMyRecordList() {
            this.$http.get("/api/Register/MyGHList", {
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
                        this.myRecordList = body.Data.Entity;
                        this.myRecordList.forEach((value) => {
                            if (value.PBFLAG == "AM") {
                                value.PBFLAG = "上午";
                                value.rangeTime = `${value.AMStartTime?value.AMStartTime:""}-${value.AMEndTime?value.AMEndTime:""}`;
                            } else {
                                value.PBFLAG = "下午";
                                value.rangeTime = `${value.PMStartTime?value.PMStartTime:""}-${value.PMEndTime?value.PMEndTime:""}`;
                            }
                        })
                    } else {
                        this.miss = true;
                    }
                } else {
                    this.miss = true;
                }
            },err=>{
                this.miss = true;
            });
        }
    },
    created() {
        this.$store.commit('updateState');
        this.getMyRecordList();
    },
    mounted() {}
}
</script>

<style scoped>

</style>
