<template>
	<div class="codeAlert">
      <div v-transfer-dom>
      <x-dialog v-model="showCodeBlur" class="codeAlert">
        <div class="img-box">
          <i class="closeDialog" @click="hide">x</i>
          <p class="codeText">输入验证码</p>
          <p class="money" v-if='money'>
            ￥{{money | price2}}
          </p>
          <p class="codePhone">接收手机尾号({{phoneLast}})短信
            <x-button class='codeBtn' @click.native='init()' :class="{'reCode':canUse}" :disabled='!canUse' mini>{{codeTip}}</x-button>
          </p>
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
        self.$emit("CodeAlertStatus",{codeNum:self.changeCode})
      }
    })
    self.$watch('showCodeAlert',function(val){
      if(val){
       self.showCodeBlur=true;
       //self.init();
      } else {
        _g.hideLoading()
      }
    })
    if(self.phoneNum){
      self.phone=self.phoneNum;
    }else if(localStorage.getItem('tel')){
      self.phone=localStorage.getItem('tel')
    }else{
      var userObj=JSON.parse(localStorage.getItem('_user'))
      self.phone=userObj.tel
    }
    var strLen=self.phone.length;
    self.phoneLast=self.phone.substr(strLen-4,strLen)
  },
  data () {
    return {
      showCodeBlur:false,
      changeCode:'',
      phoneLast:'',
      canUse:true,
      codeTip:'立即发送',
      count:60,
      phone:'',
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/user/sms/'+self.phone+'/'+self.type)
        .then(function(res) {
          if(res.data.code==0){
            self.count=60
            self.countTime();
          } else {  // 如果发送过于频繁，就不弹窗，直接消失
            _g.hideLoading()
            self.hide()
            return
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
    hide(justHide) {
      this.showCodeBlur = false
      this.canUse=true;
      this.codeTip='立即发送';
      this.count=60;
      clearInterval(this.timer);
      _g.hideLoading()
      if (justHide) { // justHide 单纯的隐藏，不触发外面的回调事件
        this.$emit("CodeAlertStatus",{show:false,codeNum:this.changeCode, justHide: true})
      } else {
        this.$emit("CodeAlertStatus",{show:false,codeNum:this.changeCode})
      }
    },
    show() {
      this.showCodeBlur = true
//      this.init()
    },
    clearCode() {
      this.changeCode = ''
    }
  },
  watch: {
    showCodeBlur(newVal) {
      if (!newVal) {
        this.changeCode = ''
      }
    },
    // 输入手机号码时
    phoneNum(newVal) {
      this.phone = newVal
      let strLen=this.phone.length;
      this.phoneLast=this.phone.substr(strLen-4,strLen)
    }
  },
  components: {
    XDialog,XButton
  },
}

</script>

<style scoped lang='less'>
  .codeAlert{
    position: relative;
    .closeDialog{
      position: absolute;
      right: 0;
      top: -5/40rem;
      color: #333;
      font-size: 1rem;
      padding: .5rem 1rem;
    }
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
      margin-top: 25/40rem;
      padding: 0 0 15/40rem;
      font-size: 28/40rem;
    }
    .codeBtn{
      margin-left: 10/40rem;
      width: 160/40rem;
      padding: 0;
      height:50/40rem;
      line-height: 50/40rem;
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
    width: 100%;
    left:0;
    margin-left: 0;
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
