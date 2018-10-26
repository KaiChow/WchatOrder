import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    zhid: "",
    openid: "",
    hzid: "",
    hzbh: ""
};

const mutations = {
    /* 初始化数据 */
    updateState(state) {
        let zhid = localStorage.getItem('zhid');
        let openid = localStorage.getItem('openid');
        let hzid = localStorage.getItem('hzid');
        let hzbh = localStorage.getItem('hzbh');
        if (zhid) {
            state.zhid = zhid;
        }
        if (openid) {
            state.openid = openid;
        }
        if (hzid) {
            state.hzid = hzid;
        }
        if (hzbh) {
            state.hzbh = hzbh;
        }
    }
};

const actions = {
    updateState: ({ commit }) => commit("updateState"),
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    mutations,
    actions
});
