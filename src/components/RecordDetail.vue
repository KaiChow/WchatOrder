<template>
<div class="wrapper-record-detail">
    <Header :message="text" :showLeft="show"></Header>
    <div class="record-detail-content">
        <van-notice-bar mode="closeable" :speed="60">
            在电子病历里没填写的信息，默认不显示。
        </van-notice-bar>
        <van-collapse v-model="activeNames">
            <van-collapse-item title="个人信息" name="1">
                <van-cell title="姓名" :value="recordDetail.HZXM" />
                <van-cell title="性别" :value="recordDetail.XB" />
                <van-cell title="年龄" :value="`${recordDetail.Years}岁`" />
                <van-cell v-if="recordDetail.SG" title="身高" :value="`${recordDetail.SG}CM`" />
                <van-cell v-if="recordDetail.TZ" title="体重" :value="`${recordDetail.TZ}KG`" />
            </van-collapse-item>
            <van-collapse-item title="病历信息" name="2">
                <van-cell v-if="recordDetail.TW" title="体温" :value="`${recordDetail.TW}℃`" />
                <van-cell v-if="recordDetail.XY" title="血压" :value="`${recordDetail.XY}-${recordDetail.XY2}mmhg`" />
                <van-cell v-if="recordDetail.XY" title="脉搏" :value="`${recordDetail.MB}(次/分)`" />
                <van-cell v-if="recordDetail.XY" title="传染" :value="`${recordDetail.Infection}`" />
                <van-cell v-if="recordDetail.ZZ" title="症状" :value="recordDetail.ZZ" />
                <van-cell v-if="recordDetail.XYMZYZ" title="医嘱" :value="recordDetail.XYMZYZ" />
                <van-cell v-if="recordDetail.XYMZZD" title="诊断" :value="recordDetail.XYMZZD" />
                <van-cell v-if="recordDetail.XYYWGMS" title="过敏史" :value="`${recordDetail.XYYWGMS}`" />
                <van-cell v-if="recordDetail.XYZS" title="主诉" :value="`${recordDetail.XYZS}`" />
                <van-cell v-if="recordDetail.XYXBS" title="现病史" :value="`${recordDetail.XYXBS}`" />
                <van-cell v-if="recordDetail.XYGRS" title="XYGRS" :value="`${recordDetail.XYGRS}`" />
                <van-cell v-if="recordDetail.XYJZS" title="家族史" :value="`${recordDetail.XYJZS}`" />
                <van-cell v-if="recordDetail.XYJW" title="既往史" :value="`${recordDetail.XYJW}`" />
                <van-cell v-if="recordDetail.FBRQ" title="发病日期" :value="`${recordDetail.FBRQ}`" />

            </van-collapse-item>
            <van-collapse-item title="更多详情" name="3" disabled>
                <van-cell title="转诊标志" :value="`${recordDetail.ZZBZ}`" />
                <van-cell v-if="recordDetail.ZYWWWQ" title="望闻问切" :value="`${recordDetail.ZYWWWQ}`" />
                <van-cell v-if="recordDetail.ZYBZFX" title="辩证分析" :value="`${recordDetail.ZYBZFX}`" />
                <van-cell v-if="recordDetail.XYZLYJ" title="治疗意见" :value="`${recordDetail.XYZLYJ}`" />
                <van-cell v-if="recordDetail.XYMZTJ" title="门诊体检" :value="`${recordDetail.XYMZTJ}`" />
                <van-cell v-if="recordDetail.XYFZJC" title="辅助检查" :value="`${recordDetail.XYFZJC}`" />
                <van-cell v-if="recordDetail.ZXWT" title="咨询问题" :value="`${recordDetail.ZXWT}`" />
                <van-cell v-if="recordDetail.XYMZCL" title="门诊处理" :value="`${recordDetail.XYMZCL}`" />
                <van-cell v-if="recordDetail.CZJH" title="处置计划" :value="`${recordDetail.CZJH}`" />
                <van-cell v-if="recordDetail.JKWTPG" title="健康问题评估" :value="`${recordDetail.JKWTPG}`" />
                <van-cell v-if="recordDetail.QTYXCZ" title="其他医学处置" :value="`${recordDetail.QTYXCZ}`" />
            </van-collapse-item>
        </van-collapse>
    </div>
</div>
</template>

<script>
import Header from "../components/Header";
import Miss from "../components/Miss";
import {
    Cell,
    CellGroup,
    Collapse,
    CollapseItem
} from 'vant';
export default {
    components: {
        Header,
        Miss
    },
    props: {},
    data() {
        return {
            text: "病历详情",
            show: "true",
            activeNames: ['1'],
            recordDetail: []
        }
    },
    watch: {},
    computed: {},
    methods: {
        /* 获取病历详情 */
        getMyRecordInfo() {
            this.$http.get("/api/Register/MyBLInfo", {
                params: {
                    BLBH: this.$route.query.blbh,
                    ZHID: this.$route.query.zhid,
                    HZBH: this.$route.query.hzbh
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(res => {
                let body = res.data;
                if (body.Ret == 0 && body.Data) {
                    if (body.Data.length > 0) {
                        this.miss = false;
                        this.recordDetail = body.Data[0];
                        if (this.recordDetail.XYMZYZ) {
                            if (this.recordDetail.XYMZYZ.indexOf("|") > -1) {
                                let tempArr = [];
                                let arr = [];
                                arr = this.recordDetail.XYMZYZ.split("|");
                                arr.forEach(value => {
                                    if (value) {
                                        tempArr.push(value);
                                    }
                                });
                                this.recordDetail.XYMZYZ = tempArr.join(",");
                            }
                        } else {
                            this.recordDetail.XYMZYZ = "无";
                        }

                        if (this.recordDetail.XYMZZD) {
                            if (this.recordDetail.XYMZZD.indexOf("|") > -1) {
                                let tempArr = [];
                                let arr = [];
                                arr = this.recordDetail.XYMZZD.split("|");
                                arr.forEach(value => {
                                    if (value) {
                                        tempArr.push(value);
                                    }
                                });
                                this.recordDetail.XYMZZD = tempArr.join(",");
                            }
                        } else {
                            this.recordDetail.XYMZZD = "无";
                        }
                        this.recordDetail.Infection = this.recordDetail.Infection == 1 ? "是" : "否";
                        this.recordDetail.FBRQ = this.recordDetail.FBRQ == 0 ? "无" : this.recordDetail.FBRQ;
                        this.recordDetail.ZZBZ = this.recordDetail.ZZBZ == 1 ? "非转诊" : "转诊";

                        this.recordDetail.XB = this.recordDetail.XB == 1 ? "女" : "男";
                        this.recordDetail.Years=(new Date()).getFullYear()-(+this.recordDetail.Years);

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
        this.getMyRecordInfo();
    },
    mounted() {}
}
</script>

<style scoped>

</style>
