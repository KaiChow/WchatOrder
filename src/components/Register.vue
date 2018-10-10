<!--挂号确认页面-->
<template>
<div class="register-action">
    <div class="header-container">
        <van-nav-bar title="预约信息确认" left-text="返回" left-arrow @click-left="goBack" />
    </div>
    <div class="register-content">
        <van-cell-group>
            <van-field v-model="departmenName" readonly label="科室名称" />
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
                    <van-radio class="sex-radio" name="2">男</van-radio>
                </van-radio-group>
            </div>

            <van-field v-model="cellPhone" required maxlength="11" clearable label="手机号码" placeholder="请输入手机号码" />
        </van-cell-group>
        <div class="register-footer">
            <van-button size="small" class="redister-submit" @click="submitOrder">确认预约</van-button>
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

export default {
    name: "Register",
    data() {
        return {
            show: false,
            departmenName: "门诊呼吸内科", //科室名称
            treatTime: "上午",
            doctorName: "欧阳锋",
            time: "2018-08-12", //就诊日期
            price: 45, //价格
            userName: "",
            birthday: "",
            sex: "1",
            userInfo: {},
            cellPhone: "",
            currentDate: new Date(),
            minDate: new Date("1900")
        };
    },
    created() {
        this.getUserInfo();
    },

    methods: {
        /**
         * 流程说明：
         * 1，线上订单
         *    1，获取患者信息，根据openid和zhid
         *    2，有信息，直接调用然后调取支付接口
         *    3，无信息，直接使用患者填写的信息然后在调取支付接口
         *    4，支付成功后，在调取挂号接口
         * 2，线下订单---直接调取挂号接口
         */
        /**
         * 获取或者信息，根据openid和zhid
         */
        getUserInfo() {
            let _this = this;
            _this.axios
                .get("/api/Register/HZXX", {
                    params: {
                        openid: "dnwqudiwjnixdcewdwe",
                        zhid: 2018091300000002
                    }
                })
                .then(
                    (res) => {
                        var res = res.data;
                        if (res.Ret == 0 && res.Data) {
                            _this.userInfo = res.Data;
                            console.log(res);
                        } else {
                            console.log('无数据');
                        }

                    },
                    (err) => {
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
                if (!this.isPoneAvailable(this.cellPhone)) {
                    Toast("手机号码格式不正确!");
                    return;
                }
            }
            /**
             *  OrgId  ZHID  GHBH_  HZBH  KSBH YSBH  ZJE  YSJE   SSJE  ZLJE   GHSJ   GHY  ZT  GHLBBH 
             *  GHLBMC  MZBH HZXM YEARS MONTHS DAYS HZNL HZNLDW HZXB
             * HZDH XXDZ IsToll  Remark Temperature CashPayAmount  BankCardPayAmount
             * WeiXinPayAmount  AliPayAmount  MemberPayAmount YLZH  YBYE YBGH  YBKH
             * IsSendGHSMS   IsSendNewHZSMS  OpenID   PBID   flag
             */

            let Obj = {
                OrgID: "486",
                OpenID: "123123213",
                HZBH: 2018091800000004,
                KSBH: 2018091700000001,
                YSBH: 2018091300000002,
                PBID: "",
                flag: "", //上午AM  下午PM
                IsSendGHSMS: 0,
                isSendNewHZSMS: 0,
                GHBH: 0,
                HZID: 2018091800000004,
                ZJE: 21,
                YSJE: 21,
                SSJE: 21,
                ZLJE: 0,
                GHSJ:"",
                GHY: "Kevin",
                ZT:1,
                GHYBH: 2018091300000002,
                GHLBBH: "2018092500000001",
                SFZH: "",
                IsToll: 1,
                Remark: "",
                Temperature: "",
                DNH: "",
                YLZH: "",
                YBYE: 0,
                YBGH: false,
                CashPayAmount: 21,
                BankCardPayAmount: 0,
                WeiXinPayAmount: 0,
                AliPayAmount: 0,
                MemberPayAmount: 0,
                HZXM: "赵五",
                YEARS: 25,
                MONTHS: null,
                DAYS: 0,
                HZXB: "0",
                HZDH: "",
                XXDZ: "",
                Weight: "45",
                ZHID: 2018091300000002 
            }

            this.axios.post('/api/Register/HZRegister', Obj)
                .then((res) => {
                    Dialog.alert({
                        title: "微信预约",
                        message: "预约挂号成功!"
                    }).then(() => {});
                })
                .catch((error) => {

                })

        },
        goBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
        },
        showAlert() {
            this.show = true;
        },
        confirmTime(e) {
            let Year = e.getFullYear();
            let Months = e.getMonth() + 1;
            let Days = e.getDate();
            this.birthday = Year + "-" + Months + "-" + Days;
            console.log(this.birthday);
            this.show = false;
        },
        cancelTime() {
            this.show = false;
        },
        isPoneAvailable(number) {
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
</style>
