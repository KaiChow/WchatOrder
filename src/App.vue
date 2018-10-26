<template>
<div id="app">
    <router-view />
    <van-tabbar v-model="active" class="tabbar-container">
        <van-tabbar-item icon="sign">
          <router-link to="/">预约</router-link>
        </van-tabbar-item>
        <van-tabbar-item icon="pending-orders">
            <router-link to="/prescription">处方</router-link>
        </van-tabbar-item>
        <van-tabbar-item icon="records">
            <router-link to="/record">病历</router-link>
        </van-tabbar-item>
         <van-tabbar-item icon="contact">
            <router-link to="/myregister">我的</router-link>
        </van-tabbar-item>
    </van-tabbar>
</div>
</template>

<script>
import {
    Tabbar,
    TabbarItem
} from 'vant';
export default {
    name: 'App',
    data() {
        return {
            active: 0
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
