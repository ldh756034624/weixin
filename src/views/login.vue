<template>
  <div class="page loginPage">
    <!-- <div class="loginCont"> -->
      <div class="loginPaddingBox">
         <p class="loginText">登录</p>
         <group class='loginMain'>
            <x-input type="number" class='inputbox' v-bind:class="{'vux-1px-b': !focus[0],'btm1px': focus[0]}" placeholder="请输入11位手机号" required keyboard="number" v-model="phone" :max="11" @on-focus="dofocus(0,true)" @on-blur="dofocus(0,false)"></x-input>
            <x-input type="number" class='inputbox code' v-bind:class="{'vux-1px-b': !focus[1],'btm1px': focus[1]}" v-model="code" required keyboard="number" @on-focus="dofocus(1,true)" @on-blur="dofocus(1,false)" placeholder='请输入验证码'>
              <x-button slot="right" mini @click.native="getCodeFn()" v-bind:class="{'sending': sending}">{{codeTip}}</x-button>
            </x-input>
            <div class="dealBox">
              注册登录即视为同意
              <span v-on:click="show2=true" class='blueFont'>《猪猪集市用户协议》</span>
            </div>
            <router-link to='/index' >
                <p class="watch blueFont">随便看看></p>
            </router-link>
            <x-button class='loginBtn' v-bind:class="phone==''|| code==''? 'err': ''" @click.native="loginFn(0)">确定</x-button>
         </group>
       </div>
     <!-- </div> -->
     <!-- <div class="loginByWx" v-if="!blur"> -->
     <div class="loginByWx">
        <!-- <x-button class='loginWxBtn' @click.native="loginWxFn">微信登录</x-button> -->
        <div class="loginWxBtn"  @click="loginWxFn">
          <img src="../assets/img/login/wechat@2x.png">微信登录
        </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show2" height="100%" class='dealPopup'>
        <platformDeal v-model="show2" v-on:listenToDealShow='dealShowFn'></platformDeal>
      </popup>
    </div> 
  </div>
</template>

<script>
import Vue from 'vue';
import {  Group, XInput,XButton,Popup,TransferDom,XDialog} from 'vux'
import userDeal from './deal/userDeal'
import platformDeal from './deal/platformDeal'
import {encode} from '@/util/base64Code'
// var url = require('aUrl')
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let self=this;
    self.setTitle('登录');
    self.WxCode = self.$route.query.code;
    if(self.WxCode){
      self.loginFn(1);
    }
  },
  data () {
    return {
      phone:'',
      code:'',
      strPhone:'',
      strCode:'',
      blur: false,
      show2:false,
      codeTip:'获取验证码',
      buttonstatus:false,
      path: this.$route.query.path,
      _user:{
        id:'',
        token:''
      },
      sending: false,
      phoneExp:/0?(13|14|15|17|18)[0-9]{9}/,
      WxCode:'',
      focus: [false,false],
      timer: null,
      count: 0,
      isWxLogin:false,
      LoginDialogText:'',
    }
  },
  beforeDestroy:function(){
    this.timer && clearInterval(this.timer);
  },
  methods:{
    dealShowFn:function(data){
      let self=this;
      if(data==false){
        self.show2=false
      }
    },
    getCodeFn:function(){
      let self = this;
      if(!self.buttonstatus){
        if(self.phone === '') {
          self.$vux.toast.show({
              text: '请输入手机号',
              type: 'text',
          })
          return;
        }
        if(!self.phoneExp.test(self.phone)){
          self.$vux.toast.show({
            text: '请输入正确的手机号',
            type: 'text',
          })
          return;
        }
        //获取登录信息
        let codeurl='/sh/ja/v1/regist/code';
        self.strPhone=self.phone+''
        self.$http.post(codeurl,{phone:self.strPhone})
        .then(function(res) {
          if(res.data.statusCode==0){
            self.countTime();
          } else {
             self.$vux.toast.show({
                text:  res.data.msg,
                type: 'text',
            })
          }
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
        if(!this.buttonstatus)
          this.buttonstatus = true;
        this.codeTip =  '重新发送('+this.count + "s)";
        this.count --;
      }else{
        this.sending = false;
        this.codeTip = '重新发送';
        this.buttonstatus = false;
        clearInterval(this.timer);
      }
    },
    loginWxFn(){
      let self = this;
      console.log(Vue.http.defaults.baseURL)
      var wxRedirectUrl=Vue.http.defaults.baseURL+'/used_good/#/login'
      window.location.href='/sh/ja/v1/wechat/auth?autoLogin=true&url='+encode(wxRedirectUrl)
    },
    loginFn:function(num){
      let self = this;
      if(num!=1){
          if(self.phone === '') {
            this.$vux.toast.show({
                text: '请输入手机号',
                type: 'text',
            })
              return;
          }
         if(self.code === '') {
          this.$vux.toast.show({
              text: '请填写验证码',
              type: 'text',
          })
            return;
        }
      }

      self.strPhone=self.phone+''
      self.strCode=self.code+''
      var logindata={},curl;
      if(num==0){
          logindata={
              phone:self.strPhone,
              code:self.strCode
          }
          curl='/sh/ja/v1/phone/login'
      }else{
          curl='/sh/ja/v1/login/wechat/js/'+self.WxCode+'/'
          self.isWxLogin=true;
      }
      self.$http.post(curl,logindata)
          .then(function(res) {
            if(res.data.statusCode==0){
              localStorage.setItem("_user", JSON.stringify(res.data.data));
              // Vue.http.headers.common['token'] = (res.data.data.token) ? res.data.data.token : '';
              Vue.http.defaults.headers.token = (res.data.data.token) ? res.data.data.token : ''
              var setBoolean=res.data.data.firstLogin;
              self.$vux.toast.show({
                  text: '登录成功',
                  type: 'text',
              })
              setTimeout(() => {
                if(self.path){
                  if((self.path).indexOf('account')!=-1){
                      self.$router.replace({path:'/account/personal',query:{setNick:setBoolean}})
                  }else{
                    if(self.$route.query.goodId){//收藏跳转过来
                      self.$router.replace({path:self.path,query:{setNick:setBoolean,goodId:self.$route.query.goodId,tableId:self.$route.query.tableId}})
                    }else{
                      self.$router.replace({path:self.path,query:{setNick:setBoolean}})
                    }
                    
                  }

                }else{
                  let redirect = decodeURIComponent(self.$route.query.redirect || '/index');
                  self.$router.replace({path:redirect,query:{setNick:setBoolean,isWxLogin:self.isWxLogin}})
                }
              }, 1500)
            }else if(res.data.statusCode==4005){

            }
            else{
              _g.toastMsg('error', res.data.msg)
            }
          })
      },
      dofocus(index,bl){
        this.blur = bl
        // this.focus.$set(index,bl);
        this.$set(this.focus,index,bl);
      }
  },
   components: {
    Group,
    XInput,
    XButton,
    platformDeal,Popup,TransferDom,XDialog
  }
}

</script>
<style scoped lang='less'>
    .dialogUnBox{
      font-size: 30/40rem;
      padding: 30/40rem;
    }
    .dialogSureBtn{
      margin: 1rem;
      padding: 10/40rem 0;
      width: 85%;
      background-color: #38446A!important;
      color: #fff;
      font-size: 30/40rem;
    }
    .loginPage{
      background-color: #fff;
      position: relative;
      z-index:999;
    }
    .loginPaddingBox{
      padding: 0 40/40rem;
      height: 78%;
    }
    .loginText{
      font-size: 66/40rem;
      margin: 120/40rem 0 152/40rem;
    }
    .loginTip{
      color: #A1A1A1;
      font-size: 30/40rem;
    }
    .code{
        margin-top: 20/40rem;
      }
    .inputbox{
      padding-left: 0!important;
      &.btm1px{
        border-bottom: 1px solid #9ca2b5;
      }
    }
    .dealBox{
      color: #999;
      span{
        color: #576AA3;
      }
      margin-top: 20/40rem;;
      font-size: 24/40rem;
    }
    .loginBtn{
      background-color: #38446A!important;
      color: #fff;
      margin-top: 100/40rem;
    }
    .loginBtn.err {
      background-color: #b2b2b2!important;
    }
    .loginWxBtn{
      font-size: 28/40rem;
      color: #999;
      img{
        width: 54/40rem;
        height: 45/40rem;
        vertical-align: middle;
        margin-right: 10/40rem;
      }
      text-align:center;
    }
    .loginCont{
      height: 85%;
    }
    .loginByWx{
      /*position: absolute;
      bottom: 50/40rem;*/
      text-align: center;
      left: 0;
      right: 0;
    }
    .watch{
      font-size: 30/40rem;
      margin-top: 20/40rem;
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: right;
    }
</style>
<style lang='less'>
  .page.loginPage{
    .weui-cell{
      padding: 0;
    }
    .weui-input{
      font-size: 28/40rem;
      line-height: 1;
      padding: 20/40rem 0;
    }
    .weui-btn{
      padding: 0 40/40rem;
      &.sending{
        color: #999;
      }
    }
    .weui-btn:after{
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
  .dialogUnBox .weui-dialog{
    padding:1rem 1rem 20/40rem 1rem;
    border-radius: 10/40rem;
    width: 75%;
  }
</style>