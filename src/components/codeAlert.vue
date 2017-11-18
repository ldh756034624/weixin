<template>
	<div class="codeAlert">
      <div v-transfer-dom>
      <x-dialog v-model="showCodeBlur" class="codeAlert" hide-on-blur>
        <div class="img-box">
          <p class="codeText">输入验证码</p>
          <p class="money">
            ￥{{money | price2}}
          </p>
          <p class="codePhone">接收手机尾号({{phoneLast}})短信</p>
          <x-button class='codeBtn' @click.native='init()' :class="{'reCode':canUse}" :disabled='!canUse' mini>{{codeTip}}</x-button>
          <div class="changeCodeBox">
            <input type="tel" v-model="changeCode" id='codeInput' autofocus /><!--pattern="\d{11}"-->
            <div class="changeCodeSpan">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="changeCodeDot">
              <span v-for='(item,index) in changeCode.length'>{{changeCode[index]}}</span>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import {XDialog,XButton, TransferDomDirective as TransferDom } from 'vux'
// var url = require('aUrl')
export default {
  directives: {
    TransferDom
  },
  props:{
    money: {
      type: String
    },
    showCodeAlert:{
      type:Boolean
    },
    type:{
      type:String
    },
    phoneNum:{
      type:String
    },
  },
  mounted(){
    let  self=this;
    self.$watch('changeCode',function(val){
      if(self.changeCode.length==4){
        document.getElementById('codeInput').blur()
        self.showCodeBlur=false;
      }
    })
    self.$watch('showCodeAlert',function(val){
      if(val){
       self.showCodeBlur=true;
       self.init();
      }
    })
    self.$watch('showCodeBlur',function(val){
      if(val==false){
        self.$emit("CodeAlertStatus",{show:false,codeNum:self.changeCode})
      }
    })
  },
  data () {
    return {
      showCodeBlur:false,
      changeCode:'',
      phoneLast:'',
      canUse:false,
      codeTip:'发送验证码',
      count:60,
    }
  },
  methods:{
    init(){
      let self = this
      var phone;
      if(self.phoneNum){
        phone=self.phoneNum;
      }else if(localStorage.getItem('tel')){
        phone=localStorage.getItem('tel')
      }else{
        var userObj=JSON.parse(localStorage.getItem('_user'))
        phone=userObj.tel
      }
      var strLen=phone.length;
      self.phoneLast=phone.substr(strLen-4,strLen)
      self.$http.get('h9/api/user/sms/'+phone+'/'+self.type)
        .then(function(res) {
          if(res.data.code==0){
            //_g.toastMsg('error','验证码发送成功')
            self.count=60
            self.countTime();
          }
          self.timer = setInterval(()=>{
            self.countTime();
          },1000);
        })
    },
    countTime() {
      if(this.count>0){
        this.canUse=false
        this.codeTip =  '已发送('+this.count + "s)";
        this.count --;
      }else{
        this.canUse=true
        this.codeTip = '重新发送';
        clearInterval(this.timer);
      }
    },

  },
  components: {
    XDialog,XButton
  },
}

</script>

<style scoped lang='less'>
  .codeAlert{
    .money{
      font-size: 48/40rem;
      color: #627984;
    }
    .codeText{
      padding: 30/40rem;
      font-size: 32/40rem;
      color: #333;
      border-bottom: 1px solid #f2f2f2;
    }
    .codePhone{
      padding: 0 0 15/40rem;
      font-size: 28/40rem;
    }
    .codeBtn{
      color: #999;
      border:1px solid #d9d9d9;
      background: #fff;
      font-size: 24/40rem;
    }
    .reCode{
      color: #222;
      border: 2/40rem solid #222;
    }
  }

  .changeCodeBox{
    position: relative;
    height: 4.5rem;
  }
  .changeCodeSpan,.changeCodeDot,#codeInput{
    position: absolute;
    height: 4rem;
    width: 420/40rem;
    left: 50%;
    margin-left: -210/40rem;
  }
  #codeInput{
    opacity: 0;
    z-index: 9;
  }
  .changeCodeSpan span,.changeCodeDot span{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    margin: 40/40rem 10/40rem;
    float: left;
    border-right: 0;
    font-size: 48/40rem;
    color: #333;
    border-radius: 10/40rem;
  }
  .changeCodeSpan span{
    border:2/40rem solid #999;
  }
  .changeCodeDot span{
    border:2/40rem solid #455F6B;
  }
  .changeCodeSpan span:last-child{
    border-right: 2/40rem solid #999;
  }
</style>
