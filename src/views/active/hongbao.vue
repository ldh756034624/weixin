<template>
	<div class="page hongbaoPage" :style="{height: Wheight+'px'}">
    <div class="pageBox">
      <div class="RecordBox">
      <div class="RecordCon">
        <div class="btn" @click="scanFn()">扫码抢红包</div>
        <div class="descRecord"><span v-on:click="showUserDeal=true">游戏说明 ></span><router-link to='/active/prizeRecord'>
          <span>游戏记录 ></span>
        </router-link></div>
      </div>
      <div class="yun"></div>
    </div>
    <div class="RecordBox">
      <div class="RecordCon">
        <div class="btn"><x-input  v-model="code" class='inputCode'  placeholder='请输入兑奖码'></x-input></div>
        <div class="descRecord"><span  @click="prizeFn()">兑奖 ></span></div>
      </div>
      <div class="yun2"></div>
    <div class="banner"></div>
    </div>
    </div>
    <!-- <div class="hongbaoCont">
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
        <span v-on:click="showUserDeal=true">游戏说明</span>
        <span class='line'>|</span>
        <router-link to='/active/prizeRecord'>
          <span>游戏记录</span>
        </router-link>
      </div>
      <img class="bottomLogo" src="../../assets/img/active/bitmap@2x.png"/>
    </div> -->
    <div v-transfer-dom>
        <popup v-model="showUserDeal" height="100%" class='dealPopup'>
          <userDeal v-model="showUserDeal" v-on:listenToDealShow='dealShowFn'></userDeal>
        </popup>
     </div>
  </div>
</template>
<script>
import { XInput,XButton,Popup,TransferDom} from 'vux'
import userDeal from '../deal/userDeal'
import {encode} from '@/util/base64Code'
import wx from 'weixin-js-sdk'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let  self=this;
    self.setTitle('开盖扫红包');
    if (self.barcode) {
      self.code=self.barcode
      if(!self.WxCode){
        self.getHongBaoWxCode()
      }else{
        self.weChatLogin();
      }
    }
  },
  data () {
    return {
      personalData:{},
      showUserDeal:false,
      Wheight: window.screen.height,
      WxCode:this.$route.query.code, //微信回调码
      barcode:this.$route.query.barcode, //扫码接口回调兑奖码
      code:'',
    }
  },
  methods:{
    getHongBaoWxCode:function(){
      let self=this;
      var redirectUrl=document.location.href
      window.location.href=Vue.http.defaults.baseURL+'/h9/api/common/wechat/code?url='+encode(redirectUrl)
    },
    weChatLogin:function(){
      let self=this;
      self.$http.get('h9/api/wechat/login?code='+self.WxCode)
      .then(function(res) {
        if(res.data.code==0){
          _g.toastMsg('error', '微信登录成功');
          localStorage.setItem("_user", JSON.stringify(res.data.data));
          Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : '';
           _g.toastMsg('error', self.barcode);
        }
      })
    },
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.showUserDeal=false
      }
    },
    prizeFn:function(){
      let self=this;
      if(!self.code){
        _g.toastMsg('error', '请输入兑奖码');
        return;
      }
      //imei手机唯一标识没传
      _g.showLoading()
      self.$http.get('h9/lottery/qr?code='+self.code+'&longitude='+self.$store.state.longitude+'&latitude='+self.$store.state.latitude)
        .then(function(res) {
          _g.hideLoading()
          if(res.data.code==0){
            if (res.data.data.lottery) {
              self.$router.push({path:'/active/prizeResult',query:{'code':self.code}})
              return
            }
            self.$router.push({path:'/active/hongbaoCode',query:{'code':self.code, isLottery: res.data.data.lottery}})
          }else{
            _g.toastMsg('error', res.data.msg)
          }
        })
    },
    scanFn:function(){
      let self=this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          _g.showLoading()
          self.$http.get('h9/lottery/qr?code='+result+'&longitude='+self.$store.state.longitude+'&latitude='+self.$store.state.latitude)
          .then(function(res) {
            _g.hideLoading()
            if(res.data.code==0){
              if (res.data.data.lottery) {
                self.$router.push({path:'/active/prizeResult',query:{'code':result}})
                return
              }
              self.$router.push({path:'/active/hongbaoCode',query:{'code':result}})
            }else{
               _g.toastMsg('error', res.data.msg)
            }
          })
        }
      });
    }

  },
   components: {
    XInput,XButton,userDeal,Popup
  },
}

</script>

<style scoped lang='less'>


</style>
<style type="text/css" lang='less'>
  .hongbaoPage{
    background: url('../../assets/img/active/bg@2x.jpg') repeat-y;
    background-size: 100%;
    .pageBox {
      padding-top: 350/40rem;
      width: 100%;
      height: 100%;
    }
    .RecordBox {
      width: 627/40rem;
      margin: 0 auto;
      height: 327/40rem;
      background: url('../../assets/img/active/juanzhou@2x.png') no-repeat top center;
      background-size: cover;
      position: relative;
    }
    .RecordCon {
      width: 360/40rem;
      margin: 0 auto;
      padding-top: 78/40rem;
    }
    .btn {
      background: url('../../assets/img/active/kuangkuang@2x.png') no-repeat top center;
      background-size: cover;
      width: 360/40rem;
      height: 83/40rem;
      line-height: 83/40rem;
      text-align: center;
      font-size: 38/40rem;
      color: #595757;
    }
    .descRecord {
      color: #595757;
      font-size: 24/40rem;
      display: flex;
      padding: 0 35/40rem;
      margin-top: 42/40rem;
      justify-content: space-between;
    }
    .inputCode {
      font-size: 38/40rem;
      color: #595757;
      line-height: 100%;
    }
    .banner {
      background: url('../../assets/img/active/pingzi@2x.png') no-repeat top center;
      background-size: cover;
      width: 275/40rem;
      height: 331/40rem;
      position: absolute;
      top: 180/40rem;
      right: 102/40rem;
    }
    .yun {
      background: url('../../assets/img/active/yun@2x.png') no-repeat top center;
      background-size: cover;
      width: 138/40rem;
      height: 64/40rem;
      position: absolute;
      top: 162/40rem;
      left: -20/40rem;
    }
    .yun2 {
      background: url('../../assets/img/active/yun2@2x.png') no-repeat top center;
      background-size: cover;
      width: 174/40rem;
      height: 97/40rem;
      position: absolute;
      top: 139/40rem;
      right: -56/40rem;
    }
    // .hongbaoCont{
    //   width: 486/40rem;
    //   height: 812/40rem;
    //   padding: 30/40rem;
    //   background: rgba(255,255,255,.35);
    //   border-radius: 10/40rem;
    //   margin: 0 auto;
    //   position: relative;
    //   top:50%;
    //   margin-top: -430/40rem;
    //   text-align: center;
    //   .wine{
    //     width: 120/40rem;
    //     height: 154/40rem;
    //   }
    //   .logoImgBox{
    //     img{
    //       width: 158/40rem;
    //       height: 52/40rem;
    //     }
    //   }
    //   .inputCode{
    //     width: 292/40rem;
    //     height: 50/40rem;
    //     border:2/40rem solid #ED5954;
    //     border-radius: 10/40rem;
    //     margin: 40/40rem auto;
    //   }
    //   .bottomLogo{
    //     width: 260/40rem;
    //     height: 48/40rem;
    //   }
    //   .exchangeBtn,.scanBtn{
    //     width: 354/40rem;
    //     height: 88/40rem;
    //     margin: 15/40rem 0;
    //     background: #EE5954;
    //     color: #fff;
    //     border-radius: 4rem;
    //     font-size: 36/40rem;
    //   }
    //   .descRecordBox{
    //     font-size: 24/40rem;
    //     color: #333;
    //     margin: 30/40rem 0;
    //     .line{
    //       margin: 0 20/40rem;
    //     }
    //   }
    // }
  }
  .hongbaoPage{
    .inputCode{
      input{
        font-size: 36/40rem;
        color: #222!important;
        text-align: center;
      }
      input::-webkit-input-placeholder { /* WebKit browsers */
        color: #222;
        font-size: 36/40rem;
      }
      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #222;
        font-size: 36/40rem;
      }
      input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #222;
        font-size: 36/40rem;
      }
      input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #222;
        font-size: 36/40rem;
      }

    }
    .weui-cell:before{
      border-top: none!important;
    }
  }
</style>

