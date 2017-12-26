<template>
	<div class="page phoneRechargePage">
      <div class="page phoneRechargeCont">
      <div class="phoneNum">
        <!-- <x-input type="tel" :value='reChargePhoneNum'></x-input> -->
        <input type="tel" id="telInput" v-model='reChargePhoneNum'/>
        <img src="../../assets/img/account/recharge_icon_contacts@2x.png" />
      </div>
      <p class="phoneName">默认</p>
      <p class="LeastMoney flexBox">充话费 <span class='flex1 alignR'>酒元余额￥{{rechargeData.balance}}</span></p>
      <flexbox :gutter="0" wrap="wrap" class='phoneRechargeFlexBox'>
          <flexbox-item :span="1/3" v-for='(item,index) in rechargeData.priceList' @click.native='chooseMoney(item,index)'>
            <div class="phoneBox" :class="{'blueBg':index==rechargeChoosed}">
              <p class="money">{{item.price}}元</p>
              <p class="soldMoney">售价{{item.realPrice}}酒元</p>
            </div>
          </flexbox-item>
      </flexbox>
      <div class="rechargeBtnBox">
        <x-button class='btnBg blueBg' @click.native="rechargeFn()" :disabled='!canUse'>充值</x-button>
      </div>
      </div>
      <codeAlert :money="rechargeMoney" :showCodeAlert='codeAlert' :type='codeType' :phoneNum='reChargePhoneNum' ref='codeAlert' v-on:CodeAlertStatus="codeAlertFn"></codeAlert>
  </div>
</template>
<script>
import {Group,Cell,Flexbox, FlexboxItem,XButton,XInput} from 'vux'
import codeAlert from '@/components/codeAlert'
export default {
  mounted(){
    let  self=this;
    self.setTitle('手机充值');
    self.init();
  },
  data () {
    return {
      timer: null,
      reChargePhoneNum:'',
      rechargeData:{},
      balance:'',
      rechargeChoosed:-1,
      codeAlert:false,
      rechargeParams:{},
      rechargeMoney:0,
      canUse:false,
      codeType:'5' //1,"注册,登录",2, "绑定手机"),3,"提现"),4,"滴滴卡兑换"),5 手机充值的,0,"其他")
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/consume/mobile/denomination')
        .then(function(res) {
          if(res.data.code==0){
              self.rechargeData=res.data.data
             self.reChargePhoneNum=self.rechargeData.tel
             if(parseInt(self.rechargeData.balance) > parseInt(self.rechargeMoney)){
              self.canUse=true;
             }
          }
        })
    },
    chooseMoney:function(item,index){
      this.rechargeParams.id=item.id
      this.rechargeMoney=item.realPrice
      if(parseFloat(this.rechargeData.balance) >= parseFloat(this.rechargeMoney)){
        this.canUse=true;
        this.rechargeChoosed=index;
      }else{
        this.canUse=false;
        _g.toastMsg('error', '余额不足!')
      }
    },
    rechargeFn:function(){
      this.rechargeParams.tel=this.reChargePhoneNum
      if(!this.rechargeParams.tel){
        _g.toastMsg('error', '请输入手机号!')
        return;
      }
      if(!this.rechargeParams.id){
        _g.toastMsg('error', '请选择充值金额!')
        return;
      }
//      this.codeAlert=true;
      let data = {
        id: this.rechargeParams.id,
        tel: this.reChargePhoneNum
      }
      this.$http.post('h9/api/consume/mobile/verify/recharge/', data).then(res => { // 数量和其他校验，通过再发短信
        if (res.data.code === 0) {
          this.$refs.codeAlert.show()
        } else {
          _g.toastMsg('error', res.msg)
        }
      })

    },
    hideLoading() {
      _g.hideLoading()
    },
    showLoading() {
      _g.showLoading()
    },
    codeAlertFn(data) {
      let self = this
      if(data.show===false){
        self.codeAlert=false;
      }
      if (data.justHide) {
        return
      }
      if(data.codeNum.length===4){
        this.showLoading()
        self.rechargeParams.code=data.codeNum
        self.$http.post('h9/api/consume/mobile/recharge',self.rechargeParams)
          .then(res => {
            if(res.data.code==0){
                this.hideLoading()
                _g.toastMsg('error', '充值成功!')
                if(self.$route.query.type){
                  self.$router.replace({path:'/account/result',query:{type:self.$route.query.type,money:res.data.data.money,tel:self.rechargeParams.tel}})
                }else{
                  self.$router.replace({path:'/account/result',query:{type:'recharge',money:res.data.data.money,tel:self.rechargeParams.tel}})
                }
            } else if(res.data.code ===  3){  // 如果提现次数过多
              this.hideLoading()
              self.$refs.codeAlert.hide(true)
            } else {  // 验证码不正确
              this.hideLoading()
              self.$refs.codeAlert.clearCode()
            }
          })
      }
    }

  },
   components: {
    Group,Cell,Flexbox, FlexboxItem,XButton,XInput,codeAlert
  },
}

</script>

<style scoped lang='less'>
  .phoneRechargePage{
    background: #fff;
    .phoneRechargeCont{
      margin: 30/40rem 0 0 30/40rem;
      overflow-y: auto;
    }
    .phoneNum{
      padding-right: 30/40rem;
      input{
        font-size: 48/40rem;
        color: #333;
        border: none;
        width: 9rem;
      }

      #telInput:focus{
        border:0!important;
        border:none!important;
        outline:none;
      }
      img{
        width: 60/40rem;
        height: 60/40rem;
        float: right;
        margin-top: 10/40rem;
      }
    }
    .phoneName{
      font-size: 24/40rem;
      color: #999;
      margin-bottom: 20/40rem;
    }
    .LeastMoney{
      padding: 30/40rem 0;
      margin-right: 30/40rem;
      border-top: 1px solid #f2f2f2;
      font-size: 28/40rem;
      span{
        font-size: 24/40rem;
        color: #999;
      }
    }
    .phoneBox{
      margin: 0 30/40rem 40/40rem 0;
      padding: 20/40rem 0;
      line-height: 50/40rem;
      border:1px solid #999;
      text-align: center;
      border-radius: 10/40rem;
      .money{
        font-size: 36/40rem;
      }
      .soldMoney{
        font-size: 24/40rem;
        color: #999;
      }
      .moneyBoxActive{
        background: #455F6B;
        color: #fff;
      }
    }
    .blueBg .soldMoney{
      color: #fff;
    }
    .rechargeBtnBox{
      padding:50/40rem 30/40rem 0 0;
      margin-bottom: 70/40rem;
    }
  }

</style>
