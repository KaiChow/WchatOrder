<!--科室列表页面-->
<template>
<div class="department">
    <Header :message="text" :showLeft="show"></Header>
    <form action="/">
        <van-search v-model="search" placeholder="请输入搜索关键词" show-action v-on:input="onSearch" />
    </form>
    <div class="department-list" v-if="!miss">
        <van-cell-group>
            <van-cell v-for="item in departments" v-bind:title="item.KSMC" is-link :to="{path:'/doctors',query:{'ksbh':item.KSBH,'zhid':zhid}}" :key="item.KSBH" />
        </van-cell-group>
    </div>
    <div v-if="miss">
        <Miss></Miss>
    </div>
</div>
</template>

<script>
import Header from "../components/Header";
import Miss from "../components/Miss";
import {
    Toast
} from "vant";
import {
    Dialog
} from "vant";
export default {
    name: "Departments",
    components: {
        Miss,
        Header
    },
    data() {
        return {
            openid: "", //这是测试openid  opvIa1O0eMLUSk3Xe5gRb9TNpGBM
            code: "",
            zhid: "",
            IsFirst: true,
            text: "科室列表",
            show: "false",
            miss: false,
            search: "",
            departments: [],
            searchDepartments: [],
            tempDepartments: []
        };
    },
    methods: {
        /**
         * 获取科室名称列表
         */

        getDepartment() {
            var _this = this;
            _this.$http
                .get("/api/Register/ZHKS", {
                    params: {
                        ZHID: _this.zhid
                    },
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })
                .then(function (res) {
                    if (res.data.Ret == 0 && res.data.Data.length > 0) {
                        _this.miss = false;
                        _this.departments = res.data.Data;
                        _this.tempDepartments = res.data.Data;
                    } else {
                        _this.miss = true;
                    }
                });
        },

        /**
         *获取微信code接口
         */
        getWchatUrl() {
            var _this = this;
            _this.$http
                .get("/api/WeiXin/getCode", {
                    params: {
                        obj: _this.zhid
                    },
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })
                .then(res => {
                    localStorage.setItem("IsGetUrl", 1);
                    window.location.href = res.data.Data;
                });
        },
        /**
         *
         */
        getOpenId(code, zhid) {
            var _this = this;
            _this.$http
                .get("/api/WeiXin/getOpenId", {
                    params: {
                        ZHID: zhid,
                        code: code
                    },
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })
                .then(res => {
                    this.getDepartment();
                    let body = res.data;
                    let request = JSON.parse(body.Data);
                    if (body.Ret == 0) {
                        let errcode = request.errcode;
                        if (errcode) {
                            localStorage.clear();
                            Dialog.alert({
                                title: "微信授权",
                                message: "微信授权失败，重新刷新!"
                            }).then(() => {
                                window.location.replace(
                                    `http://zsy.zsglrj.cn/WeiXin/Index.html?ZHID=${this.ZHID}`
                                );
                            });
                        } else {
                            let openid = request.openid;
                            let access_token = request.access_token;
                            localStorage.setItem("openid", openid);
                        }
                    }
                });
        },

        /**
         * 搜索输入框名称改变
         */
        onSearch() {
            this.searchDepartments = [];
            this.departments = this.tempDepartments;
            if (!this.search) {
                this.departments = this.tempDepartments;
                this.miss = false;
                return;
            }
            for (let i = 0, j = this.departments.length; i < j; i++) {
                if (this.departments[i].KSMC.indexOf(this.search) != -1) {
                    this.searchDepartments.push(this.departments[i]);
                }
            }
            this.departments = this.searchDepartments;
            if (this.departments.length == 0) {
                this.miss = true;
            } else {
                this.miss = false;
            }
        },
        initSearch() {
            let urlStr = window.location.search;
            let code = urlStr
                .split("?")[1]
                .split("&")[1]
                .split("=")[1];

            if (code) {
                let firstFlag = urlStr.split("?")[1].split("&")[2];
                if (!firstFlag) {
                    window.location.replace(
                        `http://zsy.zsglrj.cn/WeiXin/Index.html?ZHID=${
              this.zhid
            }&code=${code}&first=1`
                    );
                } else {
                    this.getOpenId(code, this.zhid);
                }
            }
        }
    },
    created: function () {
        /* 
        测试代码：openid为测试的openid
         */
        // let openid = localStorage.getItem("openid") || this.openid;
        // localStorage.setItem('openid', openid);
        // if (this.openid) {
        //     this.zhid = "2018091300000002";
        // } else {
        //    //
        // }

        let urlStr = window.location.search;
        let zhid = "";
        if (urlStr.indexOf("&") > -1) {
            zhid = urlStr
                .split("?")[1]
                .split("&")[0]
                .split("=")[1];
        } else {
            zhid = urlStr.split("?")[1].split("=")[1];
        }
        this.zhid = zhid;
        let openid = localStorage.getItem("openid") || this.openid;
        if (!openid) {
            if (urlStr.indexOf("&") > -1) {
                let firstFlag = urlStr.split("?")[1].split("&")[2];
                if (localStorage.getItem("IsGetUrl") == 1 || firstFlag) {
                    this.initSearch();
                } else {
                    this.getWchatUrl();
                }
            } else {
                this.getWchatUrl();
            }
        } else {
            this.getDepartment();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
h1,
h2 {
    font-weight: normal;
}

.mint-search {
    height: 1.4667rem;
}
</style>
