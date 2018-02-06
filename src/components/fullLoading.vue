<template>
  <transition name="fade">
    <div class="loading" v-show='loadingShow'>
      <div class="cellBox">
        <img :src="lodingImg">
        <p>正在加载中</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      loadingShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        lodingImg: require('../assets/img/blank/loading.gif')
      }
    }
  }
</script>
<style scoped lang='less'>
  .loading {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f1f1f1;
    display: table;
    .cellBox {
      display: table-cell;
      vertical-align: middle;
      width: 3rem;
      text-align: center;
      margin: 0 auto;
      font-size: 24/40rem;
    }
    img {
      width: 60/40rem;
      height: 60/40rem;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
