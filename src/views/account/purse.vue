<template>
  <div class="page">
    <group class="purseBox">
      <p>我的余额</p>
      <div class="purseCont flexBox">
        <img src=""/>
        <div class="purseMoney flex1 redFont">
          {{purseData.balance}}
        </div>
        <x-button mini class='purseFundBtn' @click.native="handleRecharge">充值</x-button>
      </div>
      <cell title="酒元明细" link='/account/purseParticulars' is-link>
        <img slot="icon" width="30" style="display:block;margin-right:5px;"
             src="../../assets/img/index/icon_order@2x.png">
      </cell>
    </group>
    <p class="blockTips">增值服务</p>
    <flexbox :gutter="0" class='purseWaiterBox'>
      <flexbox-item>
        <router-link :to="{path:'/account/phoneRecharge',query:{balance:purseData.balance}}">
          <div class="purseItemBox">
            <img src="../../assets/img/account/wallet_icon_recharge@2x.png"/>
            <p>手机充值</p>
          </div>
        </router-link>
      </flexbox-item>
      <flexbox-item class='ItemBorder'>
        <router-link :to="{path:'/account/ddExchange',query:{balance:purseData.balance,tel:purseData.tel}}">
          <div class="purseItemBox">
            <img src="../../assets/img/account/wallet_icon_didi@2x.png"/>
            <p>滴滴券兑换</p>
          </div>
        </router-link>
      </flexbox-item>
      <!--<flexbox-item>-->
      <!--<router-link :to="{path:'/shop'}">-->
      <!--<div class="purseItemBox">-->
      <!--<img src="../../assets/img/account/tabbar_mall_normal.png"/>-->
      <!--<p>酒元商城</p>-->
      <!--</div>-->
      <!--</router-link>-->
      <!--</flexbox-item>-->
    </flexbox>
  </div>
</template>
<script>
  import {Group, Cell, Flexbox, FlexboxItem, XButton} from 'vux'
  // var url = require('aUrl')
  export default {
    mounted() {
      let self = this;
      self.setTitle('我的钱包');
      self.init();
    },
    data() {
      return {
        purseData: {},
        balance: this.$route.query.balance
      }
    },
    methods: {
      init() {
        let self = this
        self.$http.get('h9/api/account/info')
          .then(function (res) {
            if (res.data.code == 0) {
              self.purseData = res.data.data
            }
          })
      },
      // 不提现了
//    goFunds:function(){
//      let self=this;
//      self.$router.push({path:'/account/funds'})
//    }
      // 去充值
      handleRecharge() {
        this.$router.push({path: '/recharge/index'})
      }
    },
    components: {
      Group, Cell, Flexbox, FlexboxItem, XButton
    },
  }

</script>

<style scoped lang='less'>
  .purseBox {
    margin-top: -42/40rem;
    font-size: 28/40rem;
    padding: 40/40rem 30/40rem 0;
    background: #fff;
  }

  .purseMoney {
    font-size: 96/40rem;
  }

  .purseCont {
    height: 96/40rem;
    line-height: 96/40rem;
    padding: 70/40rem 0;
  }

  .purseFundBtn {
    height: 60/40rem;
    margin-top: 20/40rem;
    color: #666;
    padding: 0 0.6rem !important;
    border: 1px solid #666;
    background: #fff;
  }

  .purseWaiterBox {
    background: #fff;
    padding: 42/40rem 0;
  }

  .purseItemBox {
    text-align: center;
    line-height: 0;
    img {
      width: 70/40rem;
      height: 70/40rem;
    }
    p {
      font-size: 28/40rem;
      line-height: 0;
      margin-top: 20/40rem;
    }
  }

  .ItemBorder {
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
  }
</style>
<style lang='less'>
  .purseBox .weui-cells p {
    font-size: 28/40rem;
  }

  .purseBox .weui-cells:before {
    border-top: none;
  }

  .purseMoney {
    font-size: 96/40rem;
  }

  .purseBox .weui-cell:before {
    left: 0 !important;
    right: 0 !important;
  }

  .purseBox .weui-cell {
    padding: 30/40rem 0 !important;
  }

  .purseBox .vux-label {
    font-size: 30/40rem;
  }
</style>
