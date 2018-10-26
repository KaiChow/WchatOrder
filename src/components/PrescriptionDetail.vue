<template>
<div class="wrapper-prescription-detail">
    <Header :message="text" :showLeft="show"></Header>
    <div class="prescription-detail-content">
        <van-collapse v-model="activeNames">
            <van-collapse-item title="症状" name="1">
                {{zz}}
            </van-collapse-item>
            <van-collapse-item title="诊断信息" name="2">
                {{zdxx}}
            </van-collapse-item>
            <van-collapse-item title="医生医嘱" name="3" disabled>
                {{ysyz}}
            </van-collapse-item>
        </van-collapse>
    </div>

</div>
</template>

<script>
import Header from "../components/Header";
import Miss from "../components/Miss";
import {
    Collapse,
    CollapseItem
} from 'vant';
export default {
    components: {
        Miss,
        Header
    },
    props: {},
    data() {
        return {
            text: "处方详情",
            zz: "无",
            ysyz: "",
            zdxx: "",
            show: "true",
            activeNames: ['1', '2', '3']
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
        }
    },
    created() {
        this.initDetail();
    },
    mounted() {}
}
</script>

<style scoped>

</style>
