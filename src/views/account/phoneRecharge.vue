<template>
	<div class="page phoneRechargePage">
      <div class="page phoneRechargeCont">
      <div class="phoneNum">
        <input type="tel" v-model='phoneNum'/>
        <img src="../../assets/img/account/recharge_icon_contacts@2x.png" />
      </div>
      <p class="phoneName">默认</p>
      <p class="LeastMoney flexBox">充话费 <span class='flex1 alignR'>钱包余额￥</span></p>
      <flexbox :gutter="0" wrap="wrap" class='phoneRechargeFlexBox'>
          <flexbox-item :span="1/3" v-for='(item,index) in rechargeData.priceList' @click.native='chooseMoney(item,index)'>
            <div class="phoneBox" :class="{'blueBg':index==rechargeChoosed}">
              <p class="money">{{item.price}}元</p>
              <p class="soldMoney">售价{{item.realPrice}}元</p>
            </div>
          </flexbox-item>
      </flexbox>
      <div class="rechargeBtnBox">
        <x-button class='btnBg blueBg' @click.native="rechargeFn()">充值</x-button>
      </div>
      </div>
      <codeAlert :showCodeAlert='codeAlert' :type='codeType' ref='codeAlert' v-on:CodeAlertStatus="codeAlertFn"></codeAlert>
  </div>
</template>
<script>
import {Group,Cell,Flexbox, FlexboxItem,XButton} from 'vux'
import codeAlert from '@/components/codeAlert'
export default {
  mounted(){
    let  self=this;
    self.setTitle('手机充值');
    self.init();
    let userObj = JSON.parse(localStorage.getItem('_user'))
    if(userObj){
      console.log(userObj)
    }
  },
  data () {
    return {
      phoneNum:'13602687596',
      rechargeData:[],
      rechargeChoosed:'',
      codeAlert:false,
      rechargeParams:{},
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
              self.rechargeParams.id=self.rechargeData[0].id
              self.rechargeParams.tel=self.phoneNum
          }
        })
    },
    chooseMoney:function(item,index){
      this.rechargeChoosed=index;
      this.rechargeParams.id=item.id
    },
    rechargeFn:function(){
      this.codeAlert=true;

    },
    codeAlertFn:function(data){
      let self = this
      if(data.show===false){
        self.codeAlert=false;
      }
      if(data.show===false && data.codeNum.length===4){
        self.rechargeParams.code=data.codeNum
        self.$http.post('h9/api/consume/mobile/recharge',self.rechargeParams)
          .then(function(res) {
            if(res.data.code==0){
                _g.toastMsg('error', '充值成功!')
                self.$router.push({path:'/account/personal'})
            }
          })
      }
    }
    
  },
   components: {
    Group,Cell,Flexbox, FlexboxItem,XButton,codeAlert
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
