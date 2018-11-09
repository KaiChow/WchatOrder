<template>
<div class="wrapper-traditionl-register">
    <div class="header">
        <van-card desc="描述信息" title="商品标题" :thumb="imageURL" />
        <van-collapse v-model="activeNames" class="doctor-info">
            <van-collapse-item title="医生简介" name="1" class="doctor-introduct">
                栗震亚，男，1981年华西医科大学口腔医学院研究生毕业，硕士。国际牙医师学院院士，甘肃省优秀专家。主任医师，教授，兰州大学硕士研究生导师，中华医学会甘肃省分会副会长，中华口腔医学会理事，甘肃省口腔分会主任委员，全国政协委员，甘肃省政协副主席，农工党甘肃省委员会主任委员。历任甘肃省人民医院口腔科主任、副院长等。栗震亚同志曾先后到加拿大、德国、进修，了解世界先进的口腔诊疗技术，提高技术水平,开阔了眼界，开拓了思路，锐意进取，精益求精，不断开展新业务、新技术，使口腔矫形技术跟随世界水平，不断发展。
            </van-collapse-item>
        </van-collapse>
    </div>
    <div class="content">
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

            <van-row class="time-flex-col" v-for="item in originDetail" :key="item.ID">

                <van-col v-if="val.Reception==0" span="3" class="time-col time-col-relax time-col-item" v-for="val in item.mxList" :key="val.ID">
                    <!-- <div>休息</div> -->
                    <div @click="orderAlert(item.Week,val)">预约</div>
                </van-col>
                <van-col v-if="val.Reception>0" span="3" class="time-col time-col-order time-col-item" v-for="val in item.mxList" :key="val.ID">
                    <div @click="orderAlert(item.Week,val)">预约</div>
                </van-col>
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
} from 'vant';
export default {
    components: {},
    props: {},
    data() {
        return {
            zhid: this.$route.query.zhid,
            ysbh: this.$route.query.ysbh,
            imageURL: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1541738888&di=2655864645494e3d179b63e680735438&src=http://pic.58pic.com/58pic/15/39/92/15b58PICSAZ_1024.jpg",
            activeNames: ['1'],
            planDetail: {

            },
            originDetail: []
        }
    },
    watch: {},
    computed: {},
    methods: {
        
        orderAlert(week, item) {
            debugger;
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
                case '6':
                    week = "周六";
                    break;
                case "7":
                    week = "周日";
                    break;
            }

            let time = `${parseInt(item.TimeLine)}:00-${parseInt(item.TimeLine)+1}:00`;
           
            Dialog.confirm({
                title: '微信预约',
                message: `<p style="text-align:center">确认预约：${week}${time}？</p>`
            }).then(() => {
                // on confirm
            }).catch(() => {
                // on cancel
            });
        },
        getDoctorPlan() {
            let _this = this;
            _this.$http.get('/api/Register/ZYGPB', {
                params: {
                    zhid: _this.zhid,
                    ysbh: _this.ysbh
                }
            }).then(res => {
                let body = res.data;
                _this.planDetail = body.Data;
                for (let i = 0; i < _this.originDetail.length; i++) {
                    for (let j = 0; j < _this.planDetail.length; j++) {
                        if (_this.planDetail[j].Week == _this.originDetail[i].Week) {
                            _this.originDetail[i] = _this.planDetail[j];
                            _this.originDetail[i].mxList.forEach(value => {
                                value.tag = "1";
                            });
                        } else {
                            _this.originDetail[i].mxList.forEach(value => {
                                value.tag = "2";
                            });
                        }
                    }
                }
                console.log(_this.originDetail);
            }, err => {

            })
        }

    },
    created() {
        this.getDoctorPlan();
        this.originDetail = simulateModelDetail(7, 22);
    },
    mounted() {}
}

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
                weekArr[i] = `${year}-${month}-${preMonthsDays - (7 - dayOfWeeks) + 1 + i}`;
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

    good:
        for (let i = 0; i < dateArr.length; i++) {
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
        }
        for (let j = from; j < to; j++) {
            var tempObj = {
                ID: Math.random() * 50000, //模板明细ID 后台自动生成  新增传空 修改必传
                MBID: "", //模板ID 后台自动生成  新增传空 修改必传
                TimeLine: j, //时间段   7:00-8:00为 7   8:00-9:00为8  以开始时间为标识
                Reception: "0", //是否接诊 1为接诊  0为不接诊
                ReceptionNum: "0", //接诊量
                Receptioned: "0", //已接诊数量
                Action: "0" //动作  0新增   1修改  2删除
            }

            obj.mxList.push(tempObj);
        }
        arr.push(obj);
    }
    return arr;
}
</script>

<style scoped>
.content {
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

.time-col-no {
    /* background-color: rgb(221,221,221); */
}

.time-row.time-row-strong.van-row {
    font-weight: bold;
}

.time-col.time-col-title.van-col.van-col--3 {
    line-height: 0.625rem;
    width: 100%;
}

.doctor-info {
    margin: .625rem auto;
}

.doctor-introduct {
    font-size: 12px;
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
