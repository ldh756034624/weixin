<template>
  <div id="app">
  	<view-box ref:view-box>
	    <router-view></router-view>
    </view-box>
  </div>
</template>

<script>
import {ViewBox} from 'vux'
export default {
  name: 'app',
  components: {
    ViewBox
  },
  mounted(){

  },
  data(){
    return {

    }
  },
  methods: {

  }
}

</script>
<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import './assets/css/common.less';
</style>
<style lang="less">
  .weui-tab__panel{
    padding-bottom: 0 !important;
  }
  .weui-dialog__btn_primary{
    color: #954300 !important;
  }
</style>
