<template>
  <div class="page">
    <div class="advice">
        <group class='adviceBox radius'>
            <x-input type="number" :show-clear="false" placeholder="请填写手机号" v-model="phone" @on-change="changeDesc"></x-input>
            <x-input  v-model="code" keyboard="number" placeholder="请填写验证码"  @on-change="changeDesc">
            <x-button slot="right" mini @click.native="getCodeFn()">{{codeTip}}</x-button>
          </x-input>
        </group>
        <group class='advicebtnBox'>
            <x-button class='adviceBtn ' @click.native='submitAdvice' :disabled='useStatus' :class="[useStatus ? 'grayBtn' : 'BlueBtn']"> 提交</x-button>
        </group>  
    </div>
  </div>
</template>

<script>
import {Group,XTextarea,XInput,XButton} from 'vux'
// var url = require('aUrl')
export default {
  mounted(){
    let self=this;
    self.setTitle('绑定手机号');
  },
  data () {
    return {
      phone:'',
      code:'',
      useStatus:true,
      codeTip:'获取验证码',
       phoneExp:/0?(13|14|15|17|18)[0-9]{9}/,
    }
  },
  methods:{
      changeDesc(){
         if(this.phone && this.code){
            this.useStatus=false
         }else{
            this.useStatus=true
         }
      },
       submitAdvice(){
          let self=this;
          self.$http.post('/sh/ja/v1/phone/bind',{phone:self.phone,code:self.code})
          .then(function(res) {
            if(res.data.statusCode==0){
              self.$vux.toast.show({
                  text:  '绑定成功',
                  type: 'text',
              })
              self.$router.go(-1)
               
            }else{
               self.$vux.toast.show({
                  text:  res.data.msg,
                  type: 'text',
              })
            }
          })
       },
       getCodeFn:function(){
      let self = this;
      if(!self.buttonstatus){
        if(self.phone === '') {
          this.$vux.toast.show({
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
        this.codeTip = '获取验证码';
        this.buttonstatus = false;
        clearInterval(this.timer);
      }
    },

  },
   components: {
    Group,
    XTextarea,
    XInput,
    XButton
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .advice{
      margin: 0 20/40rem;
    }
    .adviceBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin-top: 20/40rem;
      border:1px solid #F0F0F0;
    }
    .advicebtnBox{
      margin-top: 60/40rem;
      text-align: center;
    }
    .adviceBtn{
      
    }
    .grayBtn{
      background-color: #DDDDDD!important;
      color: #fff!important;
    }
</style>
<style lang='less'>
  .moreSet .vux-1px-b:after{
    border-bottom: 1px solid #e2e2e2;
  }
  .advice .weui-cells{
    margin-top: 0;
    border-radius: 15/40rem!important;
    font-size: 30/40rem!important;
  }
  .advice .weui-cells:before{
    border-top:none!important;
  }
  .advicebtnBox .weui-btn:after{
    border:none!important;
  }
</style>
