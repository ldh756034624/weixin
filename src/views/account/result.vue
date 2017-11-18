<template>
  <div class="page resultPage">
    <div class="resultImgBox">
      <img class="resultImg" src="../../assets/img/account/tixian_img_success@2x.png"/>
      <p class="typeBox">{{title}}成功</p>
      <p class="moneyBox"><i>￥</i>{{money}}</p>
    </div>
    <div class="resultText" v-if="type==='funds'">
      <p>申请时间:{{time}}</p>
      <p>款项会在1-2个工作日内到帐</p>
    </div>
    <div class="resultText" v-if="type==='recharge'">
      <p>充值号码:{{tel}}</p>
      <p>1-10分钟到帐,请留意运营商短信通知</p>
    </div>
    <div class="resultText" v-if="type==='exchange'">
      <p>券号:{{num}}</p>
    </div>
    <div class="fundsBtnBox">
      <x-button class='gradientBtn' v-if="type==='exchange' && coponShow" @click.native="copy">复制券号</x-button>
      <x-button class='gradientBtn' v-if="!coponShow" @click.native="goBackDD">完成</x-button>  <!--和复制券号联合使用的按钮-->
      <x-button class='gradientBtn' v-else @click.native="goBack">完成</x-button>
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
        this.title = '提现'
      } else if (self.type === 'recharge' || self.type === 'indexRecharge') {
        this.title = '充值'
      } else if (self.type === 'exchange' || self.type === 'indexddExchange') {
        this.title = '兑换'
      }
      self.setTitle(title + '成功');
    },
    data() {
      return {
        coponShow: true,
        title: null,
        type: this.$route.query.type,
        money: this.$route.query.money,
        time: this.$route.query.time,
        tel: this.$route.query.tel,
        num: this.$route.query.num,
      }
    },
    methods: {
      goBack: function () {
        if(this.type==='indexRecharge'){
          this.$router.replace({path:'/account/phoneRecharge'})
        }else if(this.type==='indexddExchange'){
          this.$router.replace({path:'/account/ddExchange'})
        }else{
          this.$router.replace({path:'/account/purse'})
        }
      },
      goBackDD() {
        this.$router.replace({path: '/account/ddExchange'})
      },
      copy: function () {
        let input = this.$refs.copyInput
        input.value = this.num
        input.select()
        document.execCommand('Copy')
        _g.toastMsg('error', '复制成功')
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
    .copy-input {
      position: absolute;
      left: 0;
      top: 0;
      height: 1px;
      width: 1px;
      opacity: 0;
    }
  }
</style>
