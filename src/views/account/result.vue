<template>
  <div class="page resultPage">
    <div class="resultImgBox">
      <img class="resultImg" src="../../assets/img/account/tixian_img_success@2x.png"/>
      <p class="typeBox">{{title}}成功</p>
      <p class="moneyBox" v-if="type!=='shopExchange' && type!=='vMoneyExchange'"><i>￥</i>{{money}}</p>
    </div>
    <div class="resultText" v-if="type==='funds'">
      <p>申请时间:{{time}}</p>
      <p>款项会在1-2个工作日内到帐</p>
    </div>
    <div class="resultText" v-if="type==='recharge' || type === 'indexRecharge'">
      <p>充值号码:{{tel}}</p>
      <p>1-10分钟到帐,请留意运营商短信通知</p>
    </div>
    <div class="resultText" v-if="type==='exchange' || type === 'indexddExchange'">
      <p>券号:{{num}}</p>
    </div>
    <div class="resultText" v-if="type==='vMoneyExchange'">
      <p style="margin-top:30px">V币将成功兑换为酒元，请到我的钱包页查看</p>
    </div>
    <div class="resultText" v-if="type==='shopExchange'">
      <p>兑换商品:{{goodsName}}</p>
      <p>我们将尽快为您发货,请留意订单信息</p>
    </div>
    <!-- <div class="shopResultText" v-if="type==='shopExchange'">
      <p>兑换价格:<label>{{money}}酒元</label></p>
      <p>兑换商品:<label>{{goodsName}}</label></p>
    </div> -->
    <div class="shopResultBtnBox" v-if="type==='shopExchange'">
      <router-link to='/shop'>
        <x-button mini class='backIndex'>回到首页</x-button>
      </router-link>
      <router-link :to="{path:'/my/myOrder',query:{fromShop:true}}">
        <x-button mini class='gradientBtn'>查看订单</x-button>
      </router-link>
    </div>
    <div class="fundsBtnBox" v-else>
      <div v-if="type==='vMoneyExchange'">
        <router-link to='/account/purse'>
          <x-button class='gradientBtn'>进入钱包</x-button>
        </router-link>
      </div>
      <div v-else>
        <x-button class='gradientBtn' v-if="(type==='exchange' || type==='indexddExchange') && coponShow" @click.native="copy">复制券号</x-button>
        <x-button class='gradientBtn' v-if="type!=='exchange' && type!=='indexddExchange'" @click.native="goBack">完成</x-button>
        <x-button class='gradientBtn' v-if="!coponShow" @click.native="goBackDD">完成</x-button>  <!--和复制券号联合使用的按钮-->
      </div>
      
    </div>
    <input type="text" ref="copyInput" class="copy-input">
  </div>
</template>
<script>
  import {Group, Cell, XInput, XButton} from 'vux'

  export default {
    mounted() {
      let self = this;
      if (self.type === 'funds') {
        self.title = '提现'
      } else if (self.type === 'recharge' || self.type === 'indexRecharge') {
        self.title = '充值'
      } else if (self.type === 'exchange' || self.type === 'indexddExchange' || self.type === 'vMoneyExchange' || self.type === 'shopExchange') {
        self.title = '兑换'
      }
      self.setTitle(self.title + '成功');
    },
    data() {
      return {
        coponShow: true,
        title: '',
        type: this.$route.query.type,
        money: this.$route.query.money,
        time: this.$route.query.time,
        tel: this.$route.query.tel,
        num: this.$route.query.num,
        goodsName:this.$route.query.goodsName,
      }
    },
    methods: {
      goBack: function () {
        if(this.type==='indexRecharge'){
          this.$router.replace({path:'/account/phoneRecharge'})
        }else if(this.type === 'exchange' || this.type === 'indexddExchange'){
          this.$router.replace({path:'/my/cupon'})
        }else{
          this.$router.replace({path:'/account/purse'})
        }
      },
      goBackDD() {
        this.$router.replace({path: '/my/cupon'})
      },
      copy: function () {
        let input = this.$refs.copyInput
        input.value = this.num
        input.select()
        document.execCommand('Copy')
        _g.toastMsg('error', '复制成功')
        input.blur()
        this.coponShow = false
      },

    },
    components: {
      Group, Cell, XInput, XButton
    },
  }

</script>

<style scoped lang='less'>
  .resultPage {
    background: #fff;
    .resultImgBox {
      padding: 100/40rem 0 0rem;
      text-align: center;
      font-size: 28/40rem;
      line-height: 46/40rem;
      color: #999;
    }
    .resultImg {
      width: 100/40rem;
      height: 100/40rem;
    }
    .typeBox {
      font-size: 28/40rem;
      color: #627984;
    }
    .moneyBox {
      font-size: 48/40rem;
      color: #627984;
      margin: 70/40rem 0 20/40rem;
      i {
        font-style: normal;
        font-size: 30/40rem;
      }
    }
    .resultText {
      font-size: 24/40rem;
      color: #999;
      line-height: 40/40rem;
      text-align: center;
    }
    .shopResultText{
      margin: 120/40rem 0;
      border-top: 1px solid #f2f2f2;
      border-bottom: 1px solid #f2f2f2;
      font-size: 30/40rem;
      p{
        padding: 30/40rem;
      }
      label{
        float: right;
      }
    }
    .copy-input {
      position: absolute;
      left: 0;
      top: 0;
      height: 1px;
      width: 1px;
      opacity: 0;
    }
    .shopResultBtnBox{
      text-align: center;
      margin: 40/40rem 0 30/40rem;
      .backIndex{
        background: #fff;
        border: 2/40rem solid #f2f2f2;
      }
      .gradientBtn{
        color: #fff;
      }
      .backIndex,.gradientBtn{
        height: 2.5rem;
        font-size: 30/40rem;
        padding: 0 70/40rem;
        margin: 0 35/40rem;
      }
    }
    
  }
</style>
