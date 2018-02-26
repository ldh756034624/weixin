<template>
  <div>
    <tabbar class="home_navbar" slot="bottom">
      <tabbar-item link="/active/hongbao" :selected="/active/.test($route.path)">
          <img slot="icon" src="../assets/img/index/hongbao_weixuanzhong@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/hobgbao_xuanzhong@2x.png" class="active">
          <span slot="label">开盖扫红包</span>
      </tabbar-item>
      <tabbar-item :selected="/shop/.test($route.path)" link="/shop">
          <img slot="icon" src="../assets/img/index/shangcheng_weixuanzhong@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/shangcheng_xuanzhong@2x.png" class="active">
          <span slot="label">徽酒商城</span>
      </tabbar-item>
      <!-- <tabbar-item :selected="/bbs/.test($route.path)" link="/bbs">
        <img slot="icon" src="../assets/img/index/tabbar_community_normal@2x.png" class="default">
        <img slot="icon" src="../assets/img/index/tabbar_community_selected@2x.png" class="active">
        <span slot="label">社区</span>
      </tabbar-item> -->
      <tabbar-item :selected="/travel/.test($route.path)" @click.native="hasPhone('/travel')">
          <img slot="icon" src="../assets/img/index/jiankangka_weixuanzhong@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/jiankangka_xuanzhong@2x.png" class="active">
          <span slot="label">旅游健康卡</span>
      </tabbar-item>
      <tabbar-item :selected="/account/.test($route.path)" @click.native="hasPhone('/account/personal')">
          <img slot="icon" src="../assets/img/index/wode_weixuanzhong@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/wode_xuanzhong@2x.png" class="active">
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
    img{
      width: 27px;
      height: 27px;
    }
    .weui-bar__item_on{
      .default{
        display: none;
      }
      .active{
        display: block;
      }
      span{
        color: #e60012!important;
      }
    }
  }
  /*iPhoneX的适配*/
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
           /*添加底部适配*/
        .home_navbar{padding-bottom: 34/40rem;}

    }
</style>
