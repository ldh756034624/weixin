<template>
	<div class="page addBank">
      <group class="groupNoTop groupNoLine">
          <x-input title='持卡人' v-model="cardData.name" :show-clear="false" :min="2" :max="10" is-type="china-name"  placeholder='请输入姓名'></x-input>
          <x-input title='银行卡号' v-model="cardData.no" :show-clear="false" keyboard="number" type='number' placeholder='请输入卡号'></x-input>
          <cell title="银行机构" :value='cardType' @click.native='showPopup=true' is-link></cell>
          <x-address title="开户省市" @on-hide="logHide" v-model="address" :list="addressData"></x-address>

          <p class="addBankTips">信息加密处理，仅用于验证，确认代表您已同意<span class="blueFont" @click='showUserDeal=true'>《用户服务协议》</span></p>
      </group>
      <div class="fundsBtnBox">
        <x-button class='gradientBtn' @click.native="showBankCode()">添加银行卡</x-button>
      </div>
      <div v-transfer-dom>
        <popup v-model="showPopup" >
          <div class="infoPopup">
            <p v-for='item in popupData' @click='choosePopup(item)'>
              {{item.name}}
            </p>
            <p @click='showPopup=false'>取消</p>
          </div>
        </popup>
      </div>
      <div v-transfer-dom>
        <popup v-model="showUserDeal" height="100%" class='dealPopup'>
          <platformDeal v-model="showUserDeal" :dealType='dealStr' v-on:listenToDealShow='dealShowFn'></platformDeal>
        </popup>
     </div>
     <codeAlert :showCodeAlert='codeAlert' :type='codeType' ref='codeAlert'
               v-on:CodeAlertStatus="codeAlertFn"></codeAlert>
  </div>
</template>
<script>
import {Group,XInput,XButton,XAddress, ChinaAddressV4Data,Cell, Value2nameFilter as value2name,Popup,TransferDom} from 'vux'
import platformDeal from '../deal/platformDeal'
import codeAlert from '@/components/codeAlert'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let  self=this;
    self.setTitle('添加银行卡');
    self.init();
    let userObj = JSON.parse(localStorage.getItem('_user'))
    this.cardData.userId=userObj.token
  },
  data () {
    return {
      userName:'',
      cardNo:'',
      cardType:'',
      addressData: ChinaAddressV4Data,
      showPopup:false,
      showUserDeal:false,
      popupData:[],
      address:[],
      cardData:{},
      dealStr:'serviceProtocol',
      codeAlert: false,
      codeType: '6' //1,"注册,登录",2, "绑定手机"),3,"提现"),4,"滴滴卡兑换"),5 手机充值的,0,"其他")

    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/bankTypes')
        .then(function(res) {
          if(res.data.code==0){
              self.popupData=res.data.data
          }
        })
    },
    choosePopup:function(item){
      this.cardType=item.name;
      this.cardData.bankTypeId=item.id
      this.showPopup=false
    },
    showBankCode:function(){
      if (!this.cardData.bankTypeId || !this.cardData.name || !this.cardData.no || !this.cardData.provice) {
        _g.toastMsg('error', '请填写完整信息!')
        return;
      }
      this.$http.post('h9/api/bank/verify',this.cardData).then(res => {   // 校验银行信息通过再打开验证码发送
        if (res.data.code === 0) {
          console.log(this.codeAlert)
          this.codeAlert = true
          console.log(this.codeAlert)
        } else {
          _g.toastMsg('error', res.data.msg)
        }
      })
    },
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.showUserDeal=false
      }
    },
    logHide (str) {
      let self=this;
      var addr=value2name(self.address, ChinaAddressV4Data).split(' ')
      this.cardData.provice=addr[0]
      this.cardData.city=addr[1]
    },
    codeAlertFn:function(data){
      let self = this
      if(data.show===false){
        self.codeAlert=false;
      }
      if(data.show===false && data.codeNum.length===4){
        self.cardData.smsCode=data.codeNum
        _g.showLoading()
        self.$http.post('h9/api/bankCard/add',this.cardData)
        .then(function(res) {
          if(res.data.code==0){
              _g.toastMsg('error','绑定成功')
              if(self.$route.query.type){
                self.$router.replace({path:'/account/funds'})
              }else{  // 跳到 选择银行卡
                self.$router.replace({path:'/my/myCard'})
              }
          }else if(res.data.code ===  3){  // 次数过多
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
    Group,XInput,XButton,XAddress,Cell,Popup,platformDeal,codeAlert
  },
}

</script>

<style scoped lang='less'>
  .addBank{
    .addBankTips{
      font-size: 24/40rem;
      padding: 30/40rem;
    }
    .fundsBtnBox{
    padding: 70/40rem 30/40rem;
    .gradientBtn{
      color: #fff;
      font-size: 32/40rem;
      height: 100/40rem;
    }
  }
  }
  .infoPopup{
    p{
      background: #fff;
      font-size: 30/40rem;
      padding: 20/40rem 0;
      border-top: 1px solid #f2f2f2;
      text-align: center;
    }
    img{
      width: 60/40rem;
      height: 60/40rem;
      border-radius: 4rem;
      vertical-align: middle;
      margin: 0 20/40rem 0 30/40rem;
    }
  }

</style>
<style lang='less'>
  .addBank{
    .weui-cell{
      padding: 40/40rem;
    }
    .weui-label,.vux-label{
      width: 160/40rem!important;
      font-size: 30/40rem;
    }
    .weui-cell__primary{
      line-height: 0;
    }
    .weui-input,.vux-popup-picker-placeholder,.weui-cell__ft,.vux-cell-value{
      font-size: 30/40rem;
    }
    .vux-cell-box:before{
      border-top: none;
    }
  }
</style>
