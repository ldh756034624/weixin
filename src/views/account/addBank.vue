<template>
	<div class="page addBank">
      <group class="groupNoTop groupNoLine">
          <x-input title='持卡人' v-model="cardData.name" :show-clear="false" keyboard="number" placeholder='请输入真实姓名'></x-input>
          <x-input title='银行卡号' v-model="cardData.no" :show-clear="false" keyboard="number" placeholder='请输入银行卡号'></x-input>
          <cell title="银行机构" :value='cardType' @click.native='showPopup=true' is-link></cell>
          <x-address title="地址" @on-hide="logHide" v-model="address" :list="addressData" placeholder="请选择地址">
          </x-address>

          <p class="addBankTips">信息加密处理，仅用于验证，确认代表您已同意<span class="blueFont" @click='showUserDeal=true'>《用户服务协议》</span></p>
      </group>
      <div class="fundsBtnBox">
        <x-button class='gradientBtn' @click.native="addCardFn()">添加银行卡</x-button>  
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
          <platformDeal v-model="showUserDeal" v-on:listenToDealShow='dealShowFn'></platformDeal>
        </popup>
     </div>
  </div>
</template>
<script>
import {Group,XInput,XButton,XAddress, ChinaAddressV4Data,Cell, Value2nameFilter as value2name,Popup,TransferDom} from 'vux'
import platformDeal from '../deal/platformDeal'
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
    addCardFn:function(){
      let self=this;
      self.$http.post('h9/api/bankCard/add',this.cardData)
        .then(function(res) {
          if(res.data.code==0){
              _g.toastMsg('error','绑定成功')
              if(self.$route.query.type){
                var strLen=this.cardData.no.length
                var cardLast=this.cardData.no.substr(strLen-4,strLen)
                self.$router.replace({path:'/account/funds'})
              }else{
                history.go(-1)
              }
          }else{
            _g.toastMsg('error',res.data.msg)
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
    logShow (str) {
      console.log('on-show')
    }
    
  },
   components: {
    Group,XInput,XButton,XAddress,Cell,Popup,platformDeal
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