<!--挂号确认页面-->
<template>
<div class="register-action">
    <div class="register-content">
        <van-cell-group>
            <van-field v-model="departmenName" v-if="type==1" readonly label="科室名称" />
            <van-field v-model="doctorName" readonly label="医生名称" />
            <van-field v-model="time" readonly label="就诊日期" />
            <van-field v-model="treatTime" readonly label="就诊时间" />
            <van-field v-model="price" readonly label="预约费用" />
            <van-field v-model="userName" required clearable maxlength="20" label="姓名" placeholder="请输入姓名" />
            <van-field v-model="birthday" required readonly placeholder="请点击选择日期" v-on:click="showAlert" label="出生日期" />
            <van-popup v-model="show" position="bottom" :overlay="false">
                <van-datetime-picker v-model="currentDate" @confirm="confirmTime" @cancel="cancelTime" type="date" :min-date="minDate" />
            </van-popup>
            <div class="register-col">
                <van-radio-group v-model="sex">
                    <span class="sex-span">性别</span>
                    <van-radio class="sex-radio" name="1">女</van-radio>
                    <van-radio class="sex-radio" name="0">男</van-radio>
                </van-radio-group>
            </div>

            <van-field v-model="cellPhone" required maxlength="11" clearable label="手机号码" placeholder="请输入手机号码" />
        </van-cell-group>
        <div class="register-footer">
            <van-button size="small" class="redister-submit" @click="submitOrder">确认预约</van-button>
        </div>
        <!-- 支付加载 -->
        <div class="register-pay-loading" v-if="payLoaing">
            <van-popup v-model="payLoaing" :close-on-click-overlay="overlay">
                <van-loading type="spinner" color="#000" />
            </van-popup>
        </div>
    </div>
</div>
</template>

<script>
import {
    Toast
} from "vant";
import {
    Dialog
} from "vant";
import {
    Loading
} from "vant";

export default {
    name: "Register",
    data() {
        return {
            timeline: this.$route.query.timeline,
            type: this.$route.query.type,
            week: this.$route.query.week,
            weekdate: this.$route.query.weekdate,
            show: false,
            MRGHY: "", //默认挂号员编号
            MRGHYMC: "", //默认挂号员名称
            GHBH: "",
            overlay: false,
            payLoaing: false,
            AccessToken: "",
            ChargeType: "", //1,线上 2，线下
            PBID: "",
            openid: localStorage.getItem("openid"),
            showLeft: "true",
            departmenName: "", //科室名称
            treatTime: "",
            doctorName: "",
            time: "", //就诊日期
            price: 0, //价格
            userName: "",
            birthday: "",
            sex: "1", // 0 男 1 女
            userInfo: {},
            pbInfo: "",
            zhid: this.$route.query.zhid,
            ysbh: this.$route.query.ysbh,
            ksbh: this.$route.query.ksbh,
            id: this.$route.query.id,
            HZID: "",
            cellPhone: "",
            currentDate: new Date(),
            minDate: new Date("1900"),
            doctors: {}
        };
    },
    mounted() {
        this.getUserInfo();
        if (this.type == 1) {
            this.getPBXX();
        }
        if (this.type == 2) {
            this.time = `${this.$route.query.days}(${this.$route.query.week})`;
            this.treatTime = `${parseInt(this.$route.query.weekdate)}:00-${parseInt(
        this.$route.query.weekdate
      ) + 1}:00`;
            this.getDoctorPlan();
        }
        this.getPayWay();
    },

    methods: {
        /**
         * 获取排班信息，以免信息全部通过url
         */
        getPBXX() {
            let _this = this;
            _this.$http
                .get("/api/Register/PBRQ", {
                    params: {
                        KSBH: _this.ksbh,
                        YSBH: _this.ysbh,
                        ZHID: _this.zhid
                    }
                })
                .then(res => {
                    if (res.data.Ret == 0 && res.data.Data.length > 0) {
                        let pbArr = res.data.Data;
                        for (let i = 0, j = pbArr.length; i < j; i++) {
                            if (pbArr[i].ID == _this.id) {
                                _this.pbInfo = pbArr[i];
                            }
                        }

                        _this.departmenName = _this.pbInfo.KSMC;
                        _this.treatTime = _this.pbInfo.AM ? "上午" : "下午";
                        _this.doctorName = _this.pbInfo.YSXM;
                        _this.time = _this.pbInfo.Days; //就诊日期
                        _this.price = _this.pbInfo.Amount; //价格
                    }
                });
        },
        /**
         * 获取医生信息
         */
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
                        _this.doctors = body.Data.Doctor[0];
                        _this.doctorName = _this.doctors.YSXM;
                        _this.price = body.Data.PBPlan[0].Amount;
                        _this.pbInfo = {
                            Amount: body.Data.PBPlan[0].Amount,
                            GHLBBH: body.Data.PBPlan[0].GHLBBH,
                            GHLBMC: body.Data.PBPlan[0].GHLBMC
                        };
                        _this.ysbh = body.Data.PBPlan[0].YSBH;
                        _this.ksbh = body.Data.PBPlan[0].KSBH;
                    },
                    err => {}
                );
        },

        /**
         * 微信预约，流程说明：
         * 1，线上订单
         *    1，获取患者信息，根据openid和zhid
         *    2，有信息，直接调用然后调取支付接口
         *    3，无信息，直接使用患者填写的信息然后在调取支付接口
         *    4，支付成功后，再调取挂号接口
         * 2，线下订单---直接调取挂号接口
         */

        /**
         * 获取或者信息，根据openid和zhid
         */
        getUserInfo() {
            this.$http
                .get("/api/Register/HZXX", {
                    params: {
                        openid: this.openid,
                        zhid: this.zhid
                    }
                })
                .then(
                    res => {
                        var res = res.data;
                        if (res.Ret == 0 && res.Data.length > 0) {
                            this.userInfo = res.Data[0];
                            this.userName = this.userInfo.XM;
                            this.sex = this.userInfo.XB + "";

                            if (this.userInfo.CSRQ) {
                                this.birthday = this.userInfo.CSRQ.split(" ")[0];
                            }
                        } else {
                            console.log("无数据");
                        }
                    },
                    err => {
                        console.log("失败");
                    }
                );
        },
        /**
         * 提交订单
         */
        submitOrder() {
            if (!this.userName) {
                Toast("姓名不能为空!");
                return;
            }
            if (!this.birthday) {
                Toast("出生日期不能为空!");
                return;
            }
            if (!this.cellPhone) {
                Toast("手机号码不能为空!");
                return;
            } else {
                if (!this.isPhoneAvailable(this.cellPhone)) {
                    Toast("手机号码格式不正确!");
                    return;
                }
            }
            this.startToRegister();
        },

        /**
         * 开始挂号
         */
        startToRegister() {
            /**
             * 参数列表：
             *  OrgId  ZHID  GHBH_  HZBH  KSBH YSBH  ZJE  YSJE   SSJE  ZLJE   GHSJ   GHY  ZT  GHLBBH
             *  GHLBMC  MZBH HZXM YEARS MONTHS DAYS HZNL HZNLDW HZXB
             * HZDH XXDZ IsToll  Remark Temperature CashPayAmount  BankCardPayAmount
             * WeiXinPayAmount  AliPayAmount  MemberPayAmount YLZH  YBYE YBGH  YBKH
             * IsSendGHSMS   IsSendNewHZSMS  OpenID   PBID   flag
             * MXList
             */
            let flag = "";

            if (this.type == 1) {
                flag = this.pbInfo.AM ? "AM" : "PM"; //上午AM  下午PM
            } else if (this.type == 2) {
                flag = this.timeline;
            }

            let Obj = {
                Condition: {
                    GHType: this.type, //1 西医版本挂号  2中医版本挂号
                    OpenID: this.openid,
                    PBID: this.PBID || this.id,
                    Flag: flag
                },
                OrgID: "0",
                HZBH: this.userInfo.HZBH || "0",
                KSBH: this.ksbh,
                YSBH: this.ysbh,
                IsSendGHSMS: 0,
                isSendNewHZSMS: 0,
                GHBH: 0,
                HZID: this.userInfo.ID || "0",
                ZJE: this.pbInfo.Amount,
                YSJE: this.pbInfo.Amount,
                SSJE: this.pbInfo.Amount,
                ZLJE: 0,
                GHY: this.MRGHYMC,
                ZT: 1,
                GHYBH: this.MRGHY,
                GHLBBH: this.pbInfo.GHLBBH,
                SFZH: "",
                IsToll: 1,
                Remark: "",
                Temperature: "",
                DNH: "",
                YLZH: "",
                YBYE: 0,
                YBGH: false,
                CashPayAmount: 0,
                BankCardPayAmount: 0,
                WeiXinPayAmount: this.pbInfo.Amount,
                AliPayAmount: 0,
                MemberPayAmount: 0,
                HZXM: this.userName,
                YEARS: this.birthday.split("-")[0],
                MONTHS: +this.birthday.split("-")[1],
                DAYS: +this.birthday.split("-")[2],
                HZXB: this.sex,
                HZDH: this.cellPhone,
                XXDZ: "",
                Weight: "",
                ZHID: this.zhid,
                MXList: [{
                    GHLBBH: this.pbInfo.GHLBBH,
                    YBDJ: 0,
                    ISSF: 1,
                    JE: this.pbInfo.Amount,
                    LBMC: this.pbInfo.GHLBMC
                }]
            };
            this.$http
                .post("/api/Register/HZRegister", Obj)
                .then(res => {
                    if (res.data.Ret == 0) {
                        let resStr = res.data.Data;
                        this.GHBH = resStr.split("|")[0];
                        //判断支付方式  1，线上，2线下
                        // this.ChargeType = 1;
                        if (this.ChargeType == 1) {
                            //调取微信支付
                            this.getAccessToken();
                        } else if (this.ChargeType == 2) {
                            //直接去挂号
                            Dialog.alert({
                                title: "微信预约",
                                message: "预约挂号成功!"
                            }).then(() => {
                                this.sendRegisterSuccessMessage();
                            });
                        }
                    } else {
                        Dialog.alert({
                            title: "微信预约",
                            message: `微信预约挂号失败，${res.data.Msg}`
                        }).then(() => {});
                    }
                })
                .catch(error => {});
        },
        /**
         * 调取微信支付的时候要获取token
         */
        getAccessToken() {
            let _this = this;
            _this.$http
                .get("/api/WeiXin/getAccess_token", {
                    params: {
                        zhid: _this.zhid
                    }
                })
                .then(
                    res => {
                        if (res.data.Ret == 0) {
                            let body = res.data;
                            _this.AccessToken = body.Data;
                            _this.orderWinXinPay();
                        } else {
                            alert(res.data.Msg);
                        }
                    },
                    err => {}
                );
        },
        /**
         * 获取支付的方式
         */
        getPayWay() {
            let _this = this;
            _this.$http
                .get("/api/Register/ZHPBGet", {
                    params: {
                        zhid: _this.zhid
                    }
                })
                .then(
                    res => {
                        let body = res.data;
                        if (body.Ret == 0) {
                            _this.ChargeType = body.Data.ChargeType;
                            _this.PBID = body.Data.PBID;
                            _this.MRGHY = body.Data.MRGHY;
                            _this.MRGHYMC = body.Data.MRGHYMC;
                        }
                    },
                    err => {}
                );
        },

        /**
         * 微信支付
         */
        orderWinXinPay() {
            let _this = this;
            _this.$http
                .post("/api/WeiXin/MKPublicPay", {
                    openID: _this.openid,
                    PBID: _this.PBID,
                    GHBH: _this.GHBH,
                    access_token: _this.AccessToken,
                    zhid: _this.zhid,
                    GHType: _this.type
                })
                .then(
                    res => {
                        let data = res.data;
                        if (data.Ret == 0) {
                            let dataJson = JSON.parse(data.Data.WXPay);
                            let orderBH = data.Data.OrderBH;
                            WeixinJSBridge.invoke(
                                "getBrandWCPayRequest",
                                dataJson, //接口三获取的josn串填入这个地方
                                function (res) {
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        //支付成功
                                        _this.$http
                                            .get("/api/WeiXin/VerifyOrder", {
                                                params: {
                                                    zhid: _this.zhid,
                                                    OrderBH: orderBH
                                                }
                                            })
                                            .then(
                                                res => {
                                                    //1 成功 0，失败

                                                    if (res.data.Data == 1) {
                                                        Dialog.alert({
                                                            title: "微信预约",
                                                            message: `微信预约挂号成功！`
                                                        }).then(() => {
                                                            _this.sendRegisterSuccessMessage();
                                                        });
                                                    } else {
                                                        Dialog.alert({
                                                            title: "微信预约",
                                                            message: `"微信预约挂号失败！`
                                                        }).then(() => {});
                                                    }
                                                },
                                                err => {}
                                            );
                                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                        //放弃支付
                                        Dialog.alert({
                                            title: "微信预约",
                                            message: `支付失败！`
                                        }).then(() => {});
                                    } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                                        //支付失败
                                        Dialog.alert({
                                            title: "微信预约",
                                            message: `支付失败！`
                                        }).then(() => {});
                                    }
                                }
                            );
                        } else {
                            alert(data.Msg);
                        }
                    },
                    err => {}
                );
        },

        /* 发送挂号成功信息-------挂号成功后调用 ，发送信息接口*/
        sendRegisterSuccessMessage() {
            this.$http
                .get("/api/WeiXin/SendKFMessage", {
                    params: {
                        openid: this.openid,
                        access_token: this.AccessToken,
                        content: `您好，您已成功预约${this.time}${this.treatTime}${
              this.doctorName
            }，请及时就诊！`
                    }
                })
                .then(res => {
                    window.location.replace(
                        `http://zsy.zsglrj.cn/WeiXin/Index.html?ZHID=${this.zhid}`
                    );
                });
        },
        showAlert() {
            this.show = true;
        },
        confirmTime(e) {
            let Year = e.getFullYear();
            let Months = e.getMonth() + 1;
            let Days = e.getDate();
            this.birthday = `${Year}-${Months}-${Days}`;
            this.show = false;
        },
        cancelTime() {
            this.show = false;
        },
        isPhoneAvailable(number) {
            var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if (!myreg.test(number)) {
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>

<style scoped>
.register-content {
    padding: 0 10px;
}

.register-col {
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    top: 5px;
    position: relative;
}

.sex-span {
    display: inline-block;
    max-width: 90px;
    width: 100%;
    position: relative;
    top: -3px;
}

.sex-radio.van-radio {
    display: inline-block;
    padding-right: 20px;
}

.register-col-btn {
    text-align: center;
    margin: 20px 0;
}

button.redister-submit.van-button.van-button--default.van-button--small {
    height: 36px;
    width: 80%;
    background-color: #1878c4 !important;
    display: block;
    color: #ffffff;
    margin: 20px auto;
    border-radius: 20px;
}

.register-pay-loading {
    left: 0;
    top: 0;
    z-index: 99;
    position: fixed;
}
</style>
