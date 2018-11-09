<template>
<div class="wrapper-prescription-detail">
    <div class="prescription-detail-content">
        <van-collapse v-model="activeNames">
            <van-collapse-item title="药品列表" name="1">
                <div v-for="(list,index) in preDetailList" :key="list.item" v-if="CFLX==1||CFLX==2">
                    <van-cell :title="`${index+1}、${list.YPMC}`" :value="`规格：${list.GG}`" />
                    <van-cell class="prescript-content" :value="`单次用量：${list.MCYL}${list.JXDWBH}，频度：1天${list.YYZCS/list.YYTS}次，总共${list.YYTS}天，用法：${list.YFMC}`" />
                </div>
                <div v-for="(list,index) in preDetailList" :key="list.item" v-else>
                    <van-cell :title="`${index+1}、${list.ZLXMMC}`" :value="`${list.FPXMMC}`" />
                    <van-cell class="prescript-content" :value="`部位：${list.BW}，数量：${list.SL}次，备注：${list.BZ}`" />
                </div>

            </van-collapse-item>
            <van-collapse-item title="症状" name="2">
                {{zz}}
            </van-collapse-item>
            <van-collapse-item title="诊断信息" name="3">
                {{zdxx}}
            </van-collapse-item>
            <van-collapse-item title="医生医嘱" name="4">
                {{ysyz}}
            </van-collapse-item>
        </van-collapse>
    </div>

</div>
</template>

<script>
import Miss from "../components/Miss";
import {
    Collapse,
    CollapseItem
} from 'vant';
export default {
    components: {
        Miss
    },
    props: {},
    data() {
        return {
            zz: "无",
            ysyz: "",
            ZHID: this.$route.query.zhid || localStorage.getItem('zhid'),
            MZBH: this.$route.query.mzbh,
            CFBH: this.$route.query.cfbh,
            CFLX: this.$route.query.cflx,
            zdxx: "",
            preDetailList: [],
            activeNames: ['1', '2', '3', '4']
        }
    },
    watch: {},
    computed: {},
    methods: {
        /* 获取处方详情 */
        initDetail() {

            let ysyz = decodeURI(this.$route.query.ysyz);
            let zz = decodeURI(this.$route.query.zz) || "无";
            this.zz = zz;
            let zdxx = decodeURI(this.$route.query.zdxx);
            if (ysyz) {
                if (ysyz.indexOf("|") > -1) {
                    let tempArr = [];
                    let arr = [];
                    arr = ysyz.split("|");
                    arr.forEach((value) => {
                        if (value) {
                            tempArr.push(value);
                        }
                    });
                    this.ysyz = tempArr.join(" ，");

                } else {
                    this.ysyz = ysyz;
                }
            } else {
                this.ysyz = "无";
            }

            if (zdxx) {
                if (zdxx.indexOf("|") > -1) {
                    let tempArr = [];
                    let arr = [];
                    arr = zdxx.split("|");
                    arr.forEach((value) => {
                        if (value) {
                            tempArr.push(value);
                        }
                    });
                    this.zdxx = tempArr.join(" ，");

                } else {
                    this.zdxx = zdxx;
                }
            } else {
                this.zdxx = "无";
            }
        },
        getPresciptionDetail() {
            let _this = this;
            _this.$http.get("/api/Register/MyCFInfo", {
                params: {
                    ZHID: _this.$route.query.zhid || localStorage.getItem('zhid'),
                    MZBH: _this.$route.query.mzbh,
                    CFBH: _this.$route.query.cfbh,
                    CFLX: _this.$route.query.cflx,
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(res => {
                _this.preDetailList = res.data.Data;
                _this.preDetailList.forEach((value) => {
                    if (!value.BZ) {
                        value.BZ = "无";
                    }
                    if (!value.BW) {
                        value.BW = "无";
                    }
                })
            })

        }
    },
    created() {
        this.initDetail();
        this.getPresciptionDetail();
    },
    mounted() {

    }
}
</script>

<style scoped>
.prescript-content {
    color: rgb(242, 130, 106) !important;
    font-size: 13px;
}
</style>
