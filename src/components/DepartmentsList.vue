<!--科室列表页面-->
<template>
<div class="department">
    <form action="/">
        <van-search v-model="search" placeholder="请输入搜索关键词" show-action v-on:input="onSearch" />
    </form>
    <p>{{$store.state.count}}</p>
    <div class="department-list" v-if="!miss">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-cell-group>
                <van-cell v-for="item in departments" v-bind:title="item.KSMC" is-link :to="{path:'/doctors',query:{'ksbh':item.KSBH,'zhid':zhid}}" :key="item.KSBH" />
            </van-cell-group>
        </van-pull-refresh>

    </div>
    <div v-if="miss">
        <Miss></Miss>
    </div>
</div>
</template>

<script>
import Miss from "../components/Miss";
import {
    Toast,
    Dialog,
    PullRefresh
} from "vant";

import {
    mapActions
} from "vuex";
export default {
    name: "Departments",
    components: {
        Miss
    },
    data() {
        return {
            isLoading: false,
            openid: "", //这是测试openid  opvIa1O0eMLUSk3Xe5gRb9TNpGBM
            code: "",
            page: 1,
            zhid: "",
            version: 2,
            first: 0,
            miss: false,
            search: "",
            departments: [],
            searchDepartments: [],
            tempDepartments: []
        };
    },

    methods: {
        ...mapActions(["updateState"]),
        /* 下拉刷新的方法 */
        onRefresh() {
            setTimeout(() => {
                _this.$toast("刷新成功");
                _this.isLoading = false;
            }, 500);
        },
        /**
         * 获取科室名称列表
         */

        getDepartment() {
            let _this = this;
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
            let _this = this;
            _this.$http
                .get("/api/WeiXin/getCode", {
                    params: {
                        obj: _this.zhid,
                        page: _this.page
                    },
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })
                .then(res => {
                    localStorage.setItem("IsGetUrl", 1);
                    console.log("====================================");
                    console.log(res.data.Data);
                    console.log("====================================");
                    window.location.href = res.data.Data;
                });
        },
        /**
         *
         */
        getOpenId(code, zhid) {
            let _this = this;
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
                                    `http://zsy.zsglrj.cn/WeiXin/Index.html?ZHID=${
                    _this.ZHID
                  }&page=${_this.page}`
                                );
                            });
                        } else {
                            let openid = request.openid;
                            let access_token = request.access_token;
                            localStorage.setItem("openid", openid);
                            _this.$store.commit("updateState");
                            /* page 1 预约挂号  2，我的预约  3，我的病历  4，我的处方 */
                            _this.page = parseInt(_this.page);
                            switch (_this.page) {
                                case 1:
                                    _this.getDepartment();
                                    break;
                                case 2:
                                    _this.$router.replace({
                                        path: "/myregister"
                                    });
                                    break;
                                case 3:
                                    _this.$router.replace({
                                        path: "/record"
                                    });
                                    break;
                                case 4:
                                    _this.$router.replace({
                                        path: "/prescription"
                                    });
                                    break;
                                case 5:
                                    _this.$router.replace({
                                        path: "/traditionldoctor"
                                    });
                                    break;
                                case 6:
                                    _this.$router.replace({
                                        path: "/traditionalregisters"
                                    });
                                    break;
                            }
                        }
                    }
                });
        },

        /**
         * 搜索输入框名称改变
         */
        onSearch() {
            let _this = this;
            _this.searchDepartments = [];
            _this.departments = _this.tempDepartments;
            if (!_this.search) {
                _this.departments = _this.tempDepartments;
                _this.miss = false;
                return;
            }
            for (let i = 0, j = _this.departments.length; i < j; i++) {
                if (_this.departments[i].KSMC.indexOf(_this.search) != -1) {
                    _this.searchDepartments.push(_this.departments[i]);
                }
            }
            _this.departments = _this.searchDepartments;
            if (_this.departments.length == 0) {
                _this.miss = true;
            } else {
                _this.miss = false;
            }
        },
        initSearch() {
            let _this = this;
            if (_this.code) {
                if (!_this.first) {
                    _this.first = 1;
                    window.location.replace(
                        `http://zsy.zsglrj.cn/WeiXin/Index.html?ZHID=${_this.zhid}&code=${
              _this.code
            }&first=${_this.first}&page=${_this.page}`
                    );
                } else {
                    _this.getOpenId(_this.code, _this.zhid);
                }
            }
        }
    },

    created: function () {
        /* 判断版本 */
        let version = localStorage.getItem('version') || 1;
        if (this.version != version) {
            localStorage.clear();
            localStorage.setItem('version', this.version);
            window.location.reload(true);
        }
        /* page 1 预约挂号  2，我的预约  3，我的病历  4，我的处方 */

        // _this.$route.replace();
        /* 这是本地测试代码 */
        let _this = this;
        let IS_TEST = false;
        if (IS_TEST) {
            _this.page = 5;
            _this.zhid = "2017090100000007" || "2018091300000002";
            // _this.zhid = "2018091300000002" || "2018091300000002";
            localStorage.setItem("zhid", _this.zhid);
            localStorage.setItem("openid", "opvIa1O0eMLUSk3Xe5gRb9TNpGBM");
            switch (_this.page) {
                case 1:
                    _this.getDepartment();
                    break;
                case 2:
                    _this.$router.replace({
                        path: "/myregister"
                    });
                    break;
                case 3:
                    _this.$router.replace({
                        path: "/record"
                    });
                    break;
                case 4:
                    _this.$router.replace({
                        path: "/prescription"
                    });
                    break;
                case 5:
                    _this.$router.replace({
                        path: "/traditionldoctor"
                    });
                    break;
                case 6:
                    _this.$router.replace({
                        path: "/traditionalregisters"
                    });
                    break;
            }
        } else {
            let urlStr = window.location.search;
            if (!urlStr) {
                _this.$toast("程序配置失败,请联系售后人员处理!");
            } else {
                let params = urlStr;
                if (params.indexOf("&") == -1) {
                    return false;
                }
                let str = params.split("?")[1];
                let obj = {};
                let arr = str.split("&");
                arr.forEach(value => {
                    if (value.indexOf("%") > -1) {
                        let a = JSON.parse(decodeURI(value.split("=")[1]));
                        for (const key in a) {
                            obj[key] = a[key];
                        }
                    } else {
                        let tempArr = value.split("=");
                        let key = tempArr[0];
                        let val = tempArr[1];
                        obj[key] = val;
                    }
                });

                params = obj;
                if (params) {
                    _this.zhid = params.ZHID;
                    _this.page = parseInt(params.page);
                    _this.code = params.code;
                    _this.first = params.first || 0;
                    localStorage.setItem("zhid", _this.zhid);
                    let openid = localStorage.getItem("openid") || _this.openid;
                    _this.$store.commit("updateState");
                    if (!openid) {
                        if (localStorage.getItem("IsGetUrl") == 1 || params.first == 1) {
                            _this.initSearch();
                        } else {
                            _this.getWchatUrl();
                        }
                    } else {
                        console.log("====================================");
                        console.log(params);
                        console.log("====================================");

                        switch (_this.page) {
                            case 1:
                                _this.getDepartment();
                                break;
                            case 2:
                                _this.$router.replace({
                                    path: "/myregister"
                                });
                                break;
                            case 3:
                                _this.$router.replace({
                                    path: "/record"
                                });
                                break;
                            case 4:
                                _this.$router.replace({
                                    path: "/prescription"
                                });
                                break;
                            case 5:
                                _this.$router.replace({
                                    path: "/traditionldoctor"
                                });
                                break;
                            case 6:
                                _this.$router.replace({
                                    path: "/traditionalregisters"
                                });
                                break;
                        }
                    }
                }
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to _this component only -->

<style scoped>
h1,
h2 {
    font-weight: normal;
}

.mint-search {
    height: 1.4667rem;
}
</style>
