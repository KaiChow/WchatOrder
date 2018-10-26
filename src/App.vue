<template>
<div id="app">
    <router-view />
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
