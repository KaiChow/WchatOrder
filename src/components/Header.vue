<template>
  <div class="header-container">
    <van-nav-bar v-if="showLeft=='false'" 
                 :title="message"
    />
    <van-nav-bar v-if="showLeft=='true'"
                 :title="message"
                 left-text="返回"
                 @click-left="goBack"
    />
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Header",
  data() {
    return {};
  },
  props: {
    showLeft: {
      type: String
    },
    message: {
      type: String
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
