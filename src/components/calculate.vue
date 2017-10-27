<template>
    <div class='calculatorTpl'>
      <div  class="showCalculateBox">
          <div class="calculateText" >
              价格 
              <div class='calculateSpanPrice'>
                  <x-input @on-focus="minPriceFn" placeholder="请输入最低价"  keyboard="number" v-model="minPrice">
                  <span slot="label" class='focusLine' :class="[minFocuseLine ? 'blackFont':'']">|</span>
                  </x-input>
              </div>-
              <div class='calculateSpanPrice'>
                  <x-input @on-focus="maxPriceFn" placeholder="请输入最高价"  keyboard="number" v-model="maxPrice">
                  <span slot="label" class='focusLine' :class="[maxFocuseLine ? 'blackFont':'']">|</span>
                  </x-input>
              </div>
          </div>
          <div class="calculateNumBox">
              <div class="calculateNumFlex">
                  <span class="calculateNum" @click='numclick(1)'>1</span>
                  <span class="calculateNum " @click='numclick(2)'>2</span>
                  <span class="calculateNum " @click='numclick(3)'>3</span>
                  <span class="calculateNum calculatedel" @click='del()'></span>
              </div>
              <div  class="calculateNumFlex">
                  <span class="calculateNum " @click='numclick(4)'>4</span>
                  <span class="calculateNum " @click='numclick(5)'>5</span>
                  <span class="calculateNum" @click='numclick(6)'>6</span>
                  <span class="calculateNum calculateBlueSure" @click='calculate()'></span>
              </div>
              <div  class="calculateNumFlex">
                  <span class="calculateNum" @click='numclick(7)'>7</span>
                  <span class="calculateNum" @click='numclick(8)'>8</span>
                  <span class="calculateNum " @click='numclick(9)'>9</span>
                  <span class="calculateNum calculateBlueSure" @click='calculate()'>确定</span>
              </div>
              <div  class="calculateNumFlex">
                  <span class="calculateNum " @click="numclick('.')">.</span>
                  <span class="calculateNum" @click='numclick(0)'>0</span>
                  <span class="calculateNum calculatebtn" ></span>
                  <span class="calculateNum calculateBlueSure" @click='calculate()'></span>
              </div>
          </div>
          
      </div>
 </div>
 </template>
 <script type="text/javascript">
  import { XInput,XButton, Popup} from 'vux'
export default {
  mounted() {
    let self = this;
    self.$watch('minPriceFocus',function(){
      if(self.minPriceFocus==true){
        self.minFocuseLine=true;
      }
    })
    self.$watch('minFocuseLine',function(){
      if(self.minPriceFocus==true){
        setTimeout(function(){
          self.minFocuseLine=!self.minFocuseLine;
        },500)
      }else{
        self.minFocuseLine=false;
      }
    })
    self.$watch('maxPriceFocus',function(){
      if(self.maxPriceFocus==true){
        self.maxFocuseLine=true;
      }
    })
    self.$watch('maxFocuseLine',function(){
      if(self.maxPriceFocus==true){
        setTimeout(function(){
          self.maxFocuseLine=!self.maxFocuseLine;
        },500)
      }else{
        self.maxFocuseLine=false;
      }
    })

  },
  data() {
    return {
      showCalculateBox:true,
      income:'',
      showUdefined:true,
      minPrice:'',
      maxPrice:'',
      minPriceFocus:false,
      maxPriceFocus:false,
      minFocuseLine:false,
      maxFocuseLine:false,
    }
  },
  methods: {
    numclick(num){
      let self = this;
      if(self.minPriceFocus==true){
        if(!(parseInt(self.minPrice)>10000000)){
          self.minPrice=self.minPrice+num+''
        }
      }else if(self.maxPriceFocus==true){
        if(!(parseInt(self.maxPrice)>10000000)){
          self.maxPrice=self.maxPrice+num+''
        }
      }
    },
    del(){
      let self = this;
      if(self.minPriceFocus==true){
        self.minPrice=(self.minPrice).substring(0,(self.minPrice).length-1)
      }
      if(self.maxPriceFocus==true){
        self.maxPrice=(self.maxPrice).substring(0,(self.maxPrice).length-1)
      }
    },
    minPriceFn:function  () {
      let self = this;
      self.minPriceFocus=true;
      self.maxPriceFocus=false;
      document.activeElement.blur();
    },
    maxPriceFn:function  () {
      let self = this;
      self.maxPriceFocus=true
      self.minPriceFocus=false
      document.activeElement.blur();
    },
    calculate(){
      let self = this;
      self.showCalculateBox=false;
      self.$emit("listenToChildCalcu",self.showCalculateBox)
    },
  },  
  components: {
    XInput,
    XButton,
    Popup
  },
}
 </script>


<style type="text/css" scoped lang='less'>
.calculateNumFlex .calculateBlueSure{background-color: #38446A;color: #fff;border:1px solid #38446A;}
.focusLine{
  margin-right: 5/40rem;
  color: #fff;
}
.blackFont{
  color: #999
}
.calculateSpanPrice{
  display: inline-block;
  width: 220/40rem;
  height: 60/40rem;
  line-height: 60/40rem;
  border:1px solid #eee;
  text-align: left;
  padding: 0 15/40rem;
  margin: 0 10/40rem;
  font-size: 32/40rem;
  vertical-align: middle;
  
}
.calculateSpanPrice i{
  font-style: normal;
  margin-right: 10/40rem;
  color: #999;
}
.calculateSpanPrice:empty::before {  
    content: attr(placeholder);  
}
 .calculatorTpl{
  display: block;
  height: 600/40rem;
  background-color: rgba(0,0,0,0);
 }
 .showCalculateShacde{
  /*position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
  /*background:rgba(0,0,0,.5); */
 }
 .calculateText{
  height: 100/40rem;
  line-height: 100/40rem;
  font-size: 36/40rem;
  text-align: center;
  border-bottom: 1px solid #eee;
 }
 .showCalculateBox{
  background-color: #fff;
  color: #222;
  width: 100%;
 }
 .calculateFlex{
  display: flex;
  height: 35px;
  line-height: 35px;
  margin: 10px 0;
  padding-right: 30px;
 }
 .calculateFlex label{
  display: inline-block;
  width: 28%;
  margin-right: 5%;
  color: #999;
  text-align: right;
 }
 .inputMoney{
  border:1px solid #999;
  margin-right: 10px;
  padding-left: 10px;
 }
 .grayFt{
  color: #999;
 }
 .flex1Box{
  flex:1;
 }
 .calculateNumFlex{
  display: flex;
 }
 .calculateNumFlex .calculateNum:first-child{
  border-left: none
 }
 .calculateNum{
  flex:1;
  text-align: center;
  height: 55px;
  line-height: 55px;
  background-color: #fff;
  font-size: 25px;
  border-top:1px solid #eee;
  border-left:1px solid #eee;
 }
 .calculatorWhiteLogo{
    display: inline-block;
    width: 45px;
    height: 42px;
    /*background:url('../assets/newImg/calculatorWhiteLogo.png') no-repeat center;*/
    background-size: 48%; 
    float: left;
  }
  .calculateIcon{
    display: inline-block;
    width: 10px;
    height: 14px;
    margin: 0 10px 0 35px;
     /*background:url('../assets/newImg/calculatorBlackLogo.png') no-repeat center;*/
    background-size: 100%; 
  }
  .calculateclose{
     display:inline-block;
    width: 14px;
    height: 14px;
     /*background:url('../assets/newImg/calculatorDelete.png') no-repeat center;*/
    background-size: 100%; 
    float: right;
    margin: 10px;
  }
  .calculateclear{
    display:inline-block;
    width: 15px;
    height: 15px;
     /*background:url('../assets/newImg/calculatorClear.png') no-repeat center;*/
    background-size: 100%; 
    float: right;
    margin:8px; 
  }
  .calculatedel{
    background:url('../assets/img/search/keyboardDel.png') no-repeat center;
    background-size: 45%; 
    }
    .calculatebtn{
      background:url('../assets/img/search/keyboard.png') no-repeat center;
      background-size:50%;   
      color: #fff;
      font-size: 20px;
    }
  .showCalculateBox{
    position: fixed;
    bottom: 0px;
  }
  @media screen and (max-width: 350px){
    .calculateNum{
      font-size: 22px;
    }
    .calculatebtn{
      font-size: 20px;
    }
  }
</style>
<style type="text/css" lang='less'>
  .calculateFlex .inputMoney .weui_cell{
    padding: 4px 12px!important
 }
 .calculateSpanPrice .weui-cell{
  padding: 0;
 }
</style>

