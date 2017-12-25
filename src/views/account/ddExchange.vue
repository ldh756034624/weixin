<template>
	<div class="page ddExchangePage">
      <!-- <img src="" /> -->
      <p class="flexBox LeastMoneyBox"> <span class='flex1 alignR'>酒元余额￥{{balance}}</span></p>
      <div class="flexBox cuponBox" v-for='item in ddCuponData'>
        <div class="flex1 flexBox">
          <img :src="item.imgUrl"/>
          <div class="flex1">
            <p class="name">{{item.name}}</p>
            <p class="money">{{item.price}}酒元</p>
          </div>
        </div>
        <div class="exchangeBox">
          <p class="num">剩余{{item.stock}}张</p>
          <x-button mini class='blueBg' @click.native="exchangeFn(item)">立即兑换</x-button>
        </div>
      </div>
      <codeAlert ref="codeAlert" :money="couponMoney" :showCodeAlert='codeAlert' :type='codeType' :phoneNum='tel' v-on:CodeAlertStatus="codeAlertFn"></codeAlert>
  </div>
</template>
<script>
import {Group,Cell,Flexbox, FlexboxItem,XButton,XDialog,XInput, TransferDomDirective as TransferDom } from 'vux'
import codeAlert from '@/components/codeAlert'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let  self=this;
    self.setTitle('滴滴券兑换');
    self.init();
  },
  data () {
    return {
      couponMoney: 0,
      codeAlert:false,
      balance:'',
      tel:this.$route.query.tel,
      ddCuponData:[],
      ddCuponParams:{},
      codeType:'4' //1,"注册,登录",2, "绑定手机"),3,"提现"),4,"滴滴卡兑换"),5 手机充值的,0,"其他")
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/consume/didiCards')
        .then(function(res) {
          if(res.data.code==0){
              self.ddCuponData=res.data.data
          }
        })
      self.$http.get('h9/api/account/info')
        .then(function(res) {
          if(res.data.code==0){
              self.balance=res.data.data.balance
          }
        })

    },
    exchangeFn:function(item){
      if (parseInt(item.price) > parseInt(this.balance)) {
        _g.toastMsg('error', '余额不足!')
        return
      }
      this.couponMoney = item.price
      this.ddCuponParams.id=item.goodId
      let data = {
        id: item.goodId
      }
      this.$http.put('h9/api/consume/coupons/convert/verify', data).then(res => { // 数量和其他校验，通过再发短信
        if (res.data.code === 0) {
          this.codeAlert=true;
        } else {
          _g.toastMsg('error', res.msg)
        }
      })
    },
    codeAlertFn:function(data){
      let self = this
      if(data.show === false){
        self.codeAlert = false
      }
      if (data.justHide) {
        return
      }
      if(data.codeNum.length===4){
        self.ddCuponParams.code=data.codeNum
        _g.showLoading()
        self.$http.put('h9/api/consume/didiCard/convert',self.ddCuponParams)
          .then(function(res) {
            if(res.data.code==0){
              _g.hideLoading()
              self.$refs.codeAlert.hide()
              if(self.$route.query.type){
                  self.$router.replace({path:'/account/result',query:{type:self.$route.query.type,money:res.data.data.money,num:res.data.data.didiCardNumber}})
                 }else{
                  self.$router.replace({path:'/account/result',query:{type:'exchange',money:res.data.data.money,num:res.data.data.didiCardNumber}})
                 }
            }else if(res.data.code ===  3){  // 如果提现次数过多
              _g.hideLoading()
              self.$refs.codeAlert.hide()
            } else {  // 验证码不正确
              _g.hideLoading()
              self.$refs.codeAlert.clearCode()
            }
          })
      }
    }
  },
   components: {
    Group,Cell,Flexbox, FlexboxItem,XButton,XInput,XDialog,codeAlert
  },
}

</script>

<style scoped lang='less'>
  .ddExchangePage{
    background: #fff;
    /*padding: 30/40rem 30/40rem 0 30/40rem;*/
    overflow-y:auto;
    .LeastMoneyBox{
      padding: 30/40rem;
      font-size: 28/40rem;
      span{
        font-size: 24/40rem;
        color: #999;
      }
    }
    img{
      width: 100/40rem;
      height: 100/40rem;
      margin-right: 20/40rem;
    }
    .cuponBox{
      margin: 0 30/40rem 30/40rem;
      border-radius: 10/40rem;
      border:1px solid #f2f2f2;
      .flexBox{
        padding:40/40rem 30/40rem 45/40rem;
      }
    }
    .name{
      font-size: 32/40rem;
      margin-bottom: 6/40rem;
    }
    .money{
      font-size: 28/40rem;
    }
    .num{
      font-size: 24/40rem;
      margin-bottom: 6/40rem;
      color: #999;
      text-align: center;
    }
    .exchangeBox{
      display: inline-block;
      padding:  40/40rem 1rem 45/40rem;
      border-left: 1px dashed #f2f2f2;
    }
  }



</style>
