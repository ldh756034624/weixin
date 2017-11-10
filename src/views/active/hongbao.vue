<template>
	<div class="page hongbaoPage">
    <div class="hongbaoCont">
      <img class="wine" src="../../assets/img/active/jiajiu@2x.png"/>
      <div class="logoImgBox">
        <img  src="../../assets/img/active/logo_gaolujia@2x.png"/>
      </div>
      <x-input  v-model="code" class='inputCode'  placeholder='请输入兑奖码'></x-input>
      <div>
        <x-button mini class='exchangeBtn' @click.native="prizeFn()">兑奖</x-button>
      </div>
      <div>
        <x-button mini class='scanBtn' @click.native="scanFn()">扫码抢红包</x-button>
      </div>
      <div class="descRecordBox">
        <span>游戏说明</span> 
        <span class='line'>|</span> 
        <span>游戏记录</span>
      </div>
      <img class="bottomLogo" src="../../assets/img/active/bitmap@2x.png"/>
    </div>
  </div>
</template>
<script>
import { XInput,XButton} from 'vux'
import wx from 'weixin-js-sdk'
export default {
  mounted(){
    let  self=this;
    self.setTitle('抢红包');
  },
  data () {
    return {
      personalData:{},
      code:'',
    }
  },
  methods:{
    init(){
      let self = this
      
    },
    prizeFn:function(){
      let self=this;
      //imei手机唯一标识没传
      self.$http.get('h9/lottery/qr?code='+self.code+'&longitude='+this.addr.latitude+'&latitude='+this.addr.longitude)
        .then(function(res) {
          if(res.data.code==0){
            self.$router.push({path:'/active/hongbaoCode',query:{'code':self.code}})
          }
        })
    },
    scanFn:function(){
      console.log("============")
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        }
      });
    }
    
  },
   components: {
    XInput,XButton
  },
}

</script>

<style scoped lang='less'>
    

</style>
<style type="text/css" lang='less'>
  .hongbaoPage{
    background: url('../../assets/img/active/bg_dafugui@2x.png') no-repeat;
    background-size: cover;
    .hongbaoCont{
      width: 486/40rem;
      height: 812/40rem;
      padding: 30/40rem;
      background: rgba(255,255,255,.35);
      border-radius: 10/40rem;
      margin: 0 auto;
      position: relative;
      top:50%;
      margin-top: -430/40rem;
      text-align: center;
      .wine{
        width: 120/40rem;
        height: 154/40rem;
      }
      .logoImgBox{
        img{
          width: 158/40rem;
          height: 52/40rem;
        }
      }
      .inputCode{
        width: 292/40rem;
        height: 50/40rem;
        border:2/40rem solid #ED5954;
        border-radius: 10/40rem;
        margin: 40/40rem auto;
      }
      .bottomLogo{
        width: 260/40rem;
        height: 48/40rem;
      }
      .exchangeBtn,.scanBtn{
        width: 354/40rem;
        height: 88/40rem;
        margin: 15/40rem 0;
        background: #EE5954;
        color: #fff;
        border-radius: 4rem;
        font-size: 36/40rem;
      }
      .descRecordBox{
        font-size: 24/40rem;
        color: #333;
        margin: 30/40rem 0;
        .line{
          margin: 0 20/40rem;
        }
      }
    }
  }
</style>
<style lang='less'>
  .hongbaoPage{
    .inputCode{
      input{
        font-size: 36/40rem;
        color: #fff!important;
        text-align: center;
      }
      input::-webkit-input-placeholder { /* WebKit browsers */ 
        color: #fff;
        font-size: 36/40rem;
      } 
      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
        color: #fff;
        font-size: 36/40rem;
      } 
      input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
        color: #fff;
        font-size: 36/40rem;
      } 
      input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
        color: #fff;
        font-size: 36/40rem;
      }
    }
  }
</style>