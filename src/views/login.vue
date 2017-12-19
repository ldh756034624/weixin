<template>
  <div class="page loginPage">
     <group class='loginMain groupNoTop groupNoLine'>
        <p class="loginlabel">手机号</p>
        <x-input mask="999 9999 9999" v-model="loginParams.phone" :max="13" is-type="china-mobile" class='inputbox code vux-1px-b' :class="{'hasValue':loginParams.phone!=''}" :show-clear="false" keyboard="number" placeholder='请输入手机号码'>
        </x-input>
        <p class="loginlabel">验证码</p>
        <x-input type="number" class='inputbox vux-1px-b' :class="{'hasValue':loginParams.code!=''}" placeholder="请输入验证码" keyboard="number" v-model="loginParams.code" :max="11">
          <x-button slot="right" class='codeBtn' mini @click.native="getCodeFn()" :disabled='!canUse'>{{codeTip}}</x-button>
        </x-input>
        <div class="dealBox">
          温馨提示:未注册快乐之家账号的手机号，登录时将自动注册，且代表您已同意
          <span v-on:click="showUserDeal=true" class='blueFont'>《用户服务协议》</span>
        </div>
        <div class="fundsBtnBox">
          <x-button class='gradientBtn' v-bind:class="loginParams.phone==''|| loginParams.code==''? 'err': ''" :disabled='!loginBtnCanUse' @click.native="loginFn(0)">确定</x-button>
        </div>

     </group>
     <div v-transfer-dom>
        <popup v-model="showUserDeal" height="100%" class='dealPopup'>
          <platformDeal v-model="showUserDeal" :dealType='dealStr' v-on:listenToDealShow='dealShowFn'></platformDeal>
        </popup>
     </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {  Group, XInput,XButton,Popup,TransferDom,XDialog} from 'vux'
import platformDeal from './deal/platformDeal'
import {encode} from '@/util/base64Code'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.setTitle('登录');
    self.$watch('loginParams', function(val){
      if(val.phone.length==13){
        self.canUse=true;
      }
      if(val.phone.length==13 && val.code!=''){
        self.loginBtnCanUse=true;
      }
    }, {
      deep: true
    })
  },
  data () {
    return {
      blur: false,
      showUserDeal:false,
      dealStr:'serviceProtocol',
      codeTip:'获取验证码',
      _user:{},
      sending: false,
      focus: [false,false],
      timer: null,
      count: 0,
      LoginDialogText:'',
      canUse:false,
      loginBtnCanUse:false,
      loginParams:{
        phone:'',
        code:''
      },
      path: this.$route.query.path,
    }
  },
  beforeDestroy:function(){
    this.timer && clearInterval(this.timer);
  },
  methods:{
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.showUserDeal=false
      }
    },
    getCodeFn:function(){
      let self = this;
      if(self.canUse){
        if(self.loginParams.phone.length!=13) {
           _g.toastMsg('error', '请输入11位手机号')
          return;
        }
        self.$http.get('h9/api/user/register/'+self.trim(self.loginParams.phone))
        .then(function(res) {
          if(res.data.code===0){
            self.countTime();
          }
           _g.toastMsg('error',res.data.msg)
        })
        clearInterval(self.timer);
        self.count = 60;
        self.countTime();
        self.timer = setInterval(()=>{
          self.countTime();
        },1000);
      }
    },
    countTime() {
      if(this.count>0){
        if(!this.sending)
          this.sending = true;
        if(this.canUse)
          this.canUse = false;
        this.codeTip =  '重新发送('+this.count + "s)";
        this.count --;
      }else{
        this.sending = false;
        this.codeTip = '重新发送';
        this.canUse = true;
        clearInterval(this.timer);
      }
    },
    loginFn:function(num){
      let self = this;
      if(num!=1){
          if(self.loginParams.phone === '') {
            _g.toastMsg('error','请输入手机号');
            return;
          }
         if(self.loginParams.code === '') {
            _g.toastMsg('error','请填写验证码');
            return;
        }
      }
      var logindata={},curl;
      logindata={
          phone:self.trim(self.loginParams.phone),
          code:self.loginParams.code+''
      }
      curl='h9/api/user/phone/login'
      self.$http.post(curl,logindata)
          .then(function(res) {
            if(res.data.code==0){
              localStorage.setItem("_user", JSON.stringify(res.data.data));
              Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : ''
              var setBoolean=res.data.data.firstLogin;
              _g.toastMsg('error','登录成功');
              setTimeout(() => {
                if(self.path){
                  self.$router.replace({path:self.path})
                }else{
                  self.$router.replace({path:'/index'})
                }
              }, 1500)
            }
            else{
              _g.toastMsg('error', res.data.msg)
            }
          })
      },
      trim(str){
        return str.replace(/\s/g, "");
     }
  },
   components: {
    Group,XInput,XButton,platformDeal,Popup,TransferDom,XDialog
  }
}
</script>
<style scoped lang='less'>
    .loginPage{
      background: #fff;
      padding-top: 20/40rem;
      .loginlabel{
        padding: 45/40rem 30/40rem 15/40rem;
        font-size: 30/40rem;
      }
      .codeBtn{
        background: #fff;
        border:none;
      }
      .dealBox{
        font-size: 24/40rem;
        color: #999;
        padding: 30/40rem 30/40rem 0;
      }
      .gradientBtn{
        color: #fff;
      }
    }
</style>
<style lang='less'>
    .loginPage{
      .vux-1px-b:after{
        left: 30/40rem;
        right: 30/40rem;
      }
      .weui-input{
        font-size: 30/40rem;
        color: #999;
        height: 60/40rem;
      }
      .vux-input-icon.weui-icon-warn:before, .vux-input-icon.weui-icon-success:before{
        font-size: 0px;
      }
      .weui-btn:after{
        border:none;
      }
      .hasValue{
        .weui-input{
          font-size: 48/40rem!important;
          color: #333!important;
        }
      }
    }

</style>
