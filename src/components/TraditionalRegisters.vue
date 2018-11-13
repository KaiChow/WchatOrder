<template>
<div class="wrapper-traditionl-register">
    <div class="header" v-if="!miss">
        <div class="doctor">
            <img :src="imgUrl" alt="" class="doctor-img" >
            <p class="doctor-name">{{ doctors.YSXM}}</p>
        </div>
        <van-collapse v-model="activeNames" class="doctor-info">
            <van-collapse-item title="医生简介" name="1" class="doctor-introduct">
                {{ doctors.Introduce }}
            </van-collapse-item>
        </van-collapse>
    </div>
    <div class="content" v-if="!miss">
        <van-row class="time-row  time-row-strong">
            <van-col span="3" class="time-col">选项</van-col>
            <van-col span="3" class="time-col">周一</van-col>
            <van-col span="3" class="time-col">周二</van-col>
            <van-col span="3" class="time-col">周三</van-col>
            <van-col span="3" class="time-col">周四</van-col>
            <van-col span="3" class="time-col">周五</van-col>
            <van-col span="3" class="time-col">周六</van-col>
            <van-col span="3" class="time-col">周日</van-col>
        </van-row>
        <div class="content-time-list">
            <van-row class="time-flex-col">
                <van-col span="3" class="time-col time-col-title">7:00-8:00</van-col>
                <van-col span="3" class="time-col time-col-title">8:00-9:00</van-col>
                <van-col span="3" class="time-col time-col-title">9:00-10:00</van-col>
                <van-col span="3" class="time-col time-col-title">10:00-11:00</van-col>
                <van-col span="3" class="time-col time-col-title">11:00-12:00</van-col>
                <van-col span="3" class="time-col time-col-title">12:00-13:00</van-col>
                <van-col span="3" class="time-col time-col-title">13:00-14:00</van-col>
                <van-col span="3" class="time-col time-col-title">14:00-15:00</van-col>
                <van-col span="3" class="time-col time-col-title">15:00-16:00</van-col>
                <van-col span="3" class="time-col time-col-title">16:00-17:00</van-col>
                <van-col span="3" class="time-col time-col-title">17:00-18:00</van-col>
                <van-col span="3" class="time-col time-col-title">18:00-19:00</van-col>
                <van-col span="3" class="time-col time-col-title">19:00-20:00</van-col>
                <van-col span="3" class="time-col time-col-title">20:00-21:00</van-col>
                <van-col span="3" class="time-col time-col-title">21:00-22:00</van-col>
            </van-row>

            <van-row class="time-flex-col" v-for="item in planList" :key="item.ID">
                <div v-for="val in item.mxList" :key="val.ID">
                    <div v-if="val.Reception==0">
                        <van-col span="3" class="time-col time-col-relax time-col-item">
                            <div>休息</div>
                        </van-col>
                    </div>
                    <div v-if="val.Reception==1">
                        <van-col span="3" class="time-col time-col-order time-col-item">
                            <div @click="orderAlert(item.Week,val,item.Days)">预约</div>
                        </van-col>
                    </div>
                </div>
            </van-row>
        </div>
    </div>
</div>
</template>

<script>
import {
    Row,
    Col,
    Dialog,
    Collapse,
    CollapseItem
} from "vant";

export default {
    components: {},
    props: {},
    data() {
        return {
            config: {
                localPictureUrl: "http://172.18.10.189:6688/Picture/",
                userPictureUrl: "http://114.55.35.180:8085/zsy.zsglrj.cn/Picture/"
            },
            doctorImg: localStorage.getItem("doctorImg"),
            zhid: this.$route.query.zhid,
            ysbh: this.$route.query.ysbh,
            activeNames: ["1"],
            planDetail: {},
            miss: true,
            planList: [],
            imgUrl: "",
            originDetail: [],
            doctors: {}
        };
    },
    watch: {},
    computed: {},
    methods: {
        orderAlert(week, item, days) {
            let _this = this;
            week = week + "";
            switch (week) {
                case "1":
                    week = "周一";
                    break;
                case "2":
                    week = "周二";
                    break;
                case "3":
                    week = "周三";
                    break;
                case "4":
                    week = "周四";
                    break;
                case "5":
                    week = "周五";
                    break;
                case "6":
                    week = "周六";
                    break;
                case "7":
                    week = "周日";
                    break;
            }

            let time = `${parseInt(item.TimeLine)}:00-${parseInt(item.TimeLine) +
        1}:00`;

            Dialog.confirm({
                    title: "微信预约",
                    message: `<p style="text-align:center">确认预约：${week}${time}？</p>`
                })
                .then(() => {
                    // on confirm
                    _this.$router.push({
                        path: "/register",
                        query: {
                            zhid: _this.zhid,
                            ysbh: _this.ysbh,
                            type: 2,
                            week: week,
                            days: days,
                            weekdate: item.TimeLine
                        }
                    });
                    _this.$router.go(1);
                })
                .catch(() => {
                    // on cancel
                });
        },
        getDoctorPlan() {
            let _this = this;
            _this.$http
                .get("/api/Register/ZYGPB", {
                    params: {
                        zhid: _this.zhid,
                        ysbh: _this.ysbh
                    }
                })
                .then(
                    res => {
                        let body = res.data;
                        if (body.Data.PBPlan.length > 0) {
                            _this.planList = body.Data.PBPlan;
                        } else {
                            _this.planList = _this.originDetail; //这是本地模拟的数据结构
                        }
                        _this.miss = false;
                        _this.doctors = body.Data.Doctor[0];
                    },
                    err => {
                        _this.miss = true;
                    }
                );
        }
    },
    created() {
        this.getDoctorPlan();
        this.originDetail = simulateModelDetail(7, 22);
        this.imgUrl = `${this.config.userPictureUrl}${this.doctorImg}`;
    },
    mounted() {}
};

/**
 *
 * @param x  分成几份
 * @param y  原始数组
 */
function splitArr(x, y) {
    if (!x || !Number(x)) {
        return;
    }
    if (!y || !Array.isArray(y)) {
        return;
    }

    var arr = [];
    var len = y.length / x;
    for (let i = 0; i < x; i++) {
        var temp = y.slice(i * len, len * (i + 1));
        arr.push(temp);
    }
    return arr;
}

/**
 * 一个月按四个星期来算的生成数组例如['2018-11-01'......],
 * 第一个日期对应的是周一，一次类推
 * @returns {Array}
 */

function weekTimeArr(type, x) {
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var weekArr = [];
    //处理星期的数据
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var firthDayOfMonths = new Date(`${year}-${month + 1}-01`); //一个月的第一天
    var dayOfWeeks = firthDayOfMonths.getDay(); //一个月第一天对应的星期几
    //判断当月的1号是否对应的是周一
    if (dayOfWeeks == 0) {
        dayOfWeeks = 7;
    }
    var preMonthsDays = months[month - 1]; //前一个月的天数
    for (var i = 0; i < 28; i++) {
        var obj_arr = {};
        if (dayOfWeeks == 1) {
            weekArr[i] = `${year}-${month + 1}-${i - (7 - dayOfWeeks) + 1}`;
        } else {
            if (i < 7 - dayOfWeeks) {
                weekArr[i] = `${year}-${month}-${preMonthsDays -
          (7 - dayOfWeeks) +
          1 +
          i}`;
            } else {
                weekArr[i] = `${year}-${month + 1}-${i - (7 - dayOfWeeks) + 1}`;
            }
        }
        if (weekArr.length < 28) {
            weekArr.push(obj_arr);
        }
    }
    if (type == 1) {
        return weekArr;
    }
    var newArr = [];
    if (type == 2) {
        newArr = splitArr(x, weekArr);
        return newArr;
    }
}

function simulateModelDetail(from, to) {
    //默认 7-10
    var dateArr = weekTimeArr(2, 4);
    //判断当前属于哪个星期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var w = 0; //第几个星期
    var timer = `${year}-${month}-${day}`;
    good: for (let i = 0; i < dateArr.length; i++) {
        for (let j = 0; j < dateArr[i].length; j++) {
            if (dateArr[i][j] == timer) {
                w = i;
                break good;
            }
        }
    }
    var arr = [];
    var Days = "2018-01-01";

    for (var i = 1; i < 8; i++) {
        Days = dateArr[w][i - 1];
        var obj = {
            ID: Math.random() * 10000,
            Days: Days,
            Week: i + "", //星期  星期一为 1 星期二为 2   星期天为 7
            mxList: []
        };
        for (let j = from; j < to; j++) {
            var tempObj = {
                Days: Days,
                ID: Math.random() * 50000, //模板明细ID 后台自动生成  新增传空 修改必传
                MBID: "", //模板ID 后台自动生成  新增传空 修改必传
                TimeLine: j, //时间段   7:00-8:00为 7   8:00-9:00为8  以开始时间为标识
                Reception: "0", //是否接诊 1为接诊  0为不接诊
                ReceptionNum: "0", //接诊量
                Receptioned: "0", //已接诊数量
                Action: "0" //动作  0新增   1修改  2删除
            };

            obj.mxList.push(tempObj);
        }
        arr.push(obj);
    }
    return arr;
}
</script>

<style scoped>
.content {
    padding-bottom: 1.25rem;
    box-sizing: border-box;
    border-top: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
}

.time-col {
    line-height: 1.25rem;
    height: 1.25rem;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
    text-align: center;
    color: #000000;
}

.doctor {
    text-align: center;
}

img.doctor-img {
    margin-top: 5px;
    border: 1px solid #eac70a;
    display: inline-block;
    height: 3.125rem;
    width: 3.125rem;
    border-radius: 50%;
}

p.doctor-name {
    padding: 5px 0;
    font-weight: bold;
    font-size: 16px;
}

.time-col-relax {
    color: #ffffff;
    cursor: pointer;
    background-color: rgb(183, 175, 234);
}

.time-col-order {
    color: #ffffff;
    cursor: pointer;
    background-color: rgb(129, 232, 215);
}

.time-row.time-row-strong.van-row {
    font-weight: bold;
}

.time-col.time-col-title.van-col.van-col--3 {
    line-height: 0.625rem;
    width: 100%;
}

.doctor-info {
    margin: 0.625rem auto;
}

.doctor-introduct {
    font-size: 13px;
}

.content-time-list {
    display: flex;
}

.time-flex-col.van-row {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.time-col {
    flex: 1;
}

.time-col.time-col-item.van-col.van-col--3 {
    width: 100%;
}
</style>
