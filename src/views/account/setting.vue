<template>
  <div class="page settingPage">
    <group class='settingBox'>
      <cell title="常见问题" link='/account/problems' is-link></cell>
      <cell title="意见反馈" link='/account/feedback' is-link></cell>
      <cell title="关于我们" link='' is-link></cell>
      <p class="flexBox">版本信息 <span class='flex1 alignR'>V4.2</span></p>
    </group>
    <!--<x-button class='bottomBtn gradientBtn' @click.native="logOut">退出当前帐号</x-button>-->

  </div>
</template>
<script>
  import {Group, Cell, XButton} from 'vux'

  export default {
    mounted() {
      this.setTitle('设置');
    },
    data() {
      return {}
    },
    methods: {
      logOut: function () {
        delete localStorage._user;
        _g.toastMsg('success', '清除！')
        this.$router.push('/')
      }
    },
    components: {
      Group, Cell, XButton
    },
  }

</script>
<style scoped lang='less'>
  .settingPage {
    background: #fff;
    .flexBox {
      padding: 30/40rem;
      font-size: 30/40rem;
    }
    .flex1 {
      color: #999;
    }
  }

  .bottomBtn {
    height: 100/40rem;
    line-height: 100/40rem;
    color: #fff;
    position: fixed;
    bottom: 0;
    border-radius: 0;
    width: 100%;
    text-align: center;
    font-size: 32/40rem;
  }
</style>
<style lang='less'>
  .settingBox {
    .weui-cells:before, .weui-cells:after, .weui-cell:before {
      border: none;
    }
    .weui-cell {
      padding: 30/40rem;
    }
    .vux-label {
      font-size: 30/40rem;
    }
  }
</style>
