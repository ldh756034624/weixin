<template>
  <div>
    <tabbar class="home_navbar" slot="bottom">
      <tabbar-item link="/active/hongbao">
          <img slot="icon" src="../assets/img/index/kaigaisaohongbao@2x.png" class="default"><!--
          <img slot="icon" src="../assets/img/index/tabbar_mainpage_selected@2x.png" class="active"> -->
          <span slot="label">开盖扫红包</span>
      </tabbar-item>
      <tabbar-item :selected="/shop/.test($route.path)" link="/shop">
          <img slot="icon" src="../assets/img/index/tabbar_mall_normal@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/tabbar_mall_selected@2x.png" class="active">
          <span slot="label">徽酒商城</span>
      </tabbar-item>
      <tabbar-item :selected="/account/.test($route.path)" @click.native="hasPhone('/account/personal')">
          <img slot="icon" src="../assets/img/index/tabbar_my_normal@2x.png" class="default">
          <img slot="icon" src="../assets/img/index/tabbar_my_selected@2x.png" class="active">
          <span slot="label">旅游健康卡</span>
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
      width: 50/40rem;
      height: 50/40rem;
    }
    .weui-bar__item_on{
      .default{
        display: none;
      }
      .active{
        display: block;
      }
      span{
        color: #627984 !important;
      }
    }
  }
</style>