<template>
  <div class="miss-container">
    <img :src="imgUrl" alt="空" width="200">
  </div>
</template>

<script type="text/ecmascript-6">
  import empty from '../common/images/empty.png';

  export default {
    name: "Miss",
    data() {
      return {
        imgUrl:empty
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .miss-container
    margin-top: -100px
    margin-left: -100px
    height: 200px
    position: absolute
    top: 50%
    left: 50%
    width: 200px
    .icon-emptyicon-emply
      font-size 100px

</style>
