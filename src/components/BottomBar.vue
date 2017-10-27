<template>
  <div>
    <tabbar class="home_navbar" slot="bottom">
      <tabbar-item :selected="$route.path == '/' || /index/.test($route.path)" link="/index">
          <img slot="icon" src="../assets/img/index/shouye@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/shou@2x.png" class="active">
          <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="/message/.test($route.path)" link="/message">
          <img slot="icon" src="../assets/img/index/xi@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/xinxi@2x.png" class="active">
          <span slot="label">消息</span>
      </tabbar-item>
      <tabbar-item :selected="/personal/.test($route.path)" link="/account/personal">
          <img slot="icon" src="../assets/img/index/me@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/i@2x.png" class="active">
          <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import {Tabbar, TabbarItem} from 'vux'
// var url = require('aUrl')
export default {
  components: {
     Tabbar,
     TabbarItem
  },
  data(){
    return {
    }
  },
  props: {
    index: {
      type: Number,
      default: 'cancel'
    }
  },
  methods: {
  }
}

</script>
<style scoped lang='less'>
  .home_navbar{
    background-color: #fff;
    position: fixed!important;
    .default{
      display: block;
    }
    .active{
      display: none;
    }
    .weui-bar__item_on{
      .default{
        display: none;
      }
      .active{
        display: block;
      }
      span{
        color: #38446A!important;
      }
    }
  }
</style>