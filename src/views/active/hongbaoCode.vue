<template>
	<div class="page hongbaoPage">
    <div v-if='!lottery'>
      <div class="exchangeCont">
        <div class="flexBox">
          <img class="groupLogo" src="../../assets/img/active/logo_huijiu@2x.png"/>
          <p class="flex1 alignR redFt">
            <router-link to='/index'>
              <span>进入社区</span>
            </router-link>
          </p>
        </div>


        <div class="hongBaoImgBox" >
          <qrcode :value="codeUrl" type="img"></qrcode>
          <p>叫上好友扫一扫,有钱大家一起分!</p>
        </div>
        <!-- <div v-if="!prizeData.roomUser">

          <img class="wine" src="../../assets/img/active/jiajiu@2x.png"/>
          <div class="logoImgBox">
            <img  src="../../assets/img/active/logo_gaolujia@2x.png"/>
          </div>
        </div> -->

        <div class="actorBox">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/4" v-for='item in prizeData.lotteryUsers' @click.native='' :key="item.id">
              <div class="actorHeadImgBox">
                <img :src="item.avatar">
                <span class="me" v-if="item.me">我</span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <p class="activeNum">当前参与人数：{{prizeData.userCount}}人</p>
        <div v-if="prizeData.roomUser" class="prizeBtnBox">
          <p>开奖倒计时: <span>{{countDownTime}}</span></p>
          <x-button mini class='prizeBtn'  @click.native="StarPrizeFn">开始抽奖</x-button>
        </div>
        <p v-else class="prizeTip">等待开奖</p>
      </div>
      <div class="strategyText" v-html='DealData'>
      </div>
    </div>
    <div class="animationBox" v-show='showAnimate'>
      <div class="animation">

      </div>
    </div>
  </div>
</template>
<script>
import {XButton,Flexbox, FlexboxItem,Qrcode} from 'vux'
export default {
  mounted(){
    let self=this;
    self.setTitle('抢红包');

    self.getDeal('lotterySimple').then(function(data){
      self.DealData=data.data.content
    })
    self.getdata();
    self.$watch('differentDate',function(val){

        clearTimeout(self.time_count)
        self.intervalLike(val);
    })
  },
  data () {
    return {
      prizeData:{},
      DealData:'',
      isFirst:false,
      lottery:true, //是否开奖
      roomUser:false, //是否房主
      showAnimate:false,
      code:this.$route.query.code, //本地兑奖码
      timer:null,
      downtimer:null,
      time_count:null,
      codeUrl:'https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1433747234',
      time1:'2017-11-09 20:10',
      countDownTime:'',
      timestr:60000,
      refreshTime:10000,
      differentDate:0,
    }
  },
  methods:{
    init(){
      let self = this;
      var myDate = new Date();
      console.log("倒计时："+"===="+myDate.getMinutes()+"======"+myDate.getSeconds() )
      self.timer = setTimeout(function(){
        self.getdata();
      },self.refreshTime)
      if(self.prizeData.lottery || self.prizeData.differentDate===0){
       clearTimeout(self.timer)
      }
    },
    getdata:function(){
      let self = this;
      self.$http.get('h9/lottery/room?code='+self.code)
        .then(function(res) {
          self.refreshTime=self.refreshTime*1
          if(res.data.code==0){
            self.prizeData=res.data.data;
            self.lottery=self.prizeData.lottery;
            self.differentDate=self.prizeData.differentDate;
            if(res.data.data.roomUser){
              self.codeUrl=res.data.data.qrCode
            }
            self.refreshTime=self.prizeData.refreshTime*1000
            if(res.data.data.lottery || res.data.data.differentDate===0){
              self.showAnimate=true
              setTimeout(function(){
                //待更改
                self.$router.replace({path:'/active/prizeResult',query:{'code':self.code}})
              },3000)
            }else{
              self.timestr=res.data.data.differentDate
            }
            self.init();
          }
        })
    },
    StarPrizeFn:function(){
      let self=this;
      self.$http.get('h9/lottery/start?code='+self.code)
        .then(function(res) {
          if(res.data.code==0){
            clearInterval(self.timer); //清除
            self.showAnimate=true;
            setTimeout(function(){
              //待更改
              self.$router.replace({path:'/active/prizeResult',query:{'code':self.code}})
            },3000)
          }else{
            _g.toastMsg("error",res.data.msg)
          }
        })
    },

    intervalLike:function(timestr){
      let self=this;
      var min,sec;

      self.time_count = setTimeout(function(){
          var date = new Date(timestr); //转换成时间对象，这就简单了
          min = date.getMinutes();  //获取分
          sec = date.getSeconds();  //获取秒
          min=self.checkTime(min)
          sec=self.checkTime(sec)
          self.countDownTime =  min + ":" + sec;

          if(timestr>1000){
            timestr=timestr-1000;
            if(min=='00'){
              if(sec=='00'){
                self.init();
              }else{
                self.countDownTime = min + ":" + sec;
              }
            }
          }else{
            self.countDownTime = '即将开奖';
          }
            // 循环调用自身，达到和setInterval一样的效果
            self.intervalLike(timestr)

        },1000);
      if(self.prizeData.lottery || self.prizeData.differentDate===0){
       clearTimeout(self.time_count)
      }
      if(sec<0){
        clearTimeout(self.time_count)
      }

    },
    checkTime:function (i){ //将0-9的数字前面加上0，例1变为01
     if(i<10)
     {
      i = "0" + i;
     }
     return i;
    }

  },
   components: {
    XButton,Flexbox, FlexboxItem,Qrcode
  },
}

</script>
<style scoped type="text/css" lang='less'>
  .actorBox{
    border:1px solid #ED5954;
    border-radius: 10/40rem;
    padding-left: 25/40rem;
    height: 328/40rem;
    overflow-y: auto;
    background: rgba(255,255,255,1);
  }
  .actorHeadImgBox{
    position: relative;
    width: 120/40rem;
    height: 120/40rem;
    border-radius: 50%;
    text-align: center;
    margin: 30/40rem 0 0;
    img{
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
    .me{
      height: 36/40rem;
      width: 36/40rem;
      line-height: 36/40rem;
      text-align: center;
      font-size: 24/40rem;
      color: #fff;
      font-weight: bold;
      background: #FE5850;
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 50%;
    }
  }
  .hongbaoPage{
    background: url('../../assets/img/active/bg_dafugui@2x.png') no-repeat;
    background-color: #ECE0CF;
    background-size: cover;
    overflow-y: auto;
    .strategyText{
      background: rgba(255,255,255,.9);
      margin: 1rem 30/40rem;
      padding: 30/40rem;
      font-size: 24/40rem;
      line-height: 40/40rem;
      color: #666!important;
    }
    .activeNum{
      padding: 20/40rem 0;
      color: #999;
      text-align: right;
      font-size: 24/40rem;
    }
    .exchangeCont{
      margin: 30/40rem;
      padding: 30/40rem;
      background: rgba(255,255,255,.9);
      text-align: center;
      .groupLogo{
        width: 160/40rem;
        height: 126/40rem;
        position: relative;
        left: 50%;
        margin-left: -2rem;
        margin-bottom: 30/40rem;
      }
      .hongBaoImgBox{
        p{
          margin: 10/40rem 0 30/40rem;
          font-size: 28/40rem;
          color: #333;
        }
      }
      .redFt{
        color:#ED5954;
        font-size: 28/40rem;
      }
      .prizeTip{
        color:#ED5954;
        font-size: 40/40rem;
        margin: 2rem 0 0.75rem;
      }
      .wine{
        width: 120/40rem;
        height: 154/40rem;
      }
      .logoImgBox{
        img{
          width: 158/40rem;
          height: 52/40rem;
          margin-bottom: 80/40rem;
        }
      }
      .prizeBtnBox{
        p{
          color: #ED5954;
          font-size: 28/40rem;
          margin: 30/40rem 0 20/40rem;
        }
        .prizeBtn{
          width: 470/40rem;
          height: 100/40rem;
          background: #EE5954;
          color: #fff;
          border:0 solid transparent;
          border-radius: 4rem;
          font-size: 40/40rem;
          &:after{
            border: none;
          }
        }
      }
    }
    .animationBox{
      position: fixed;
      width: 100%;
      height: 100%;
      top:0;
      z-index: 9;
      background: rgba(0,0,0,.6);
    }
    .animation{
      width: 300/40rem;
      height: 300/40rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -150/40rem;
      margin-left: -150/40rem;
      animation: hbAnimate 3s linear 0s infinite;
      -moz-animation: hbAnimate 3s linear 0s infinite; /* Firefox */
      -webkit-animation: hbAnimate 3s linear 0s infinite;  /* Safari 和 Chrome */
      -o-animation: hbAnimate 3s linear 0s infinite; /* Opera */
    }

  }
  @keyframes hbAnimate
{
  0% {background: url('../../assets/img/active/animation/1@2x.png') no-repeat center; background-size: cover }
  10% {background: url('../../assets/img/active/animation/2@2x.png') no-repeat center; background-size: cover }
  19% {background: url('../../assets/img/active/animation/3@2x.png') no-repeat center; background-size: cover }
  29% {background: url('../../assets/img/active/animation/4@2x.png') no-repeat center; background-size: cover }
  40% {background: url('../../assets/img/active/animation/5@2x.png') no-repeat center; background-size: cover }
  50% {background: url('../../assets/img/active/animation/6@2x.png') no-repeat center; background-size: cover }
  60% {background: url('../../assets/img/active/animation/7@2x.png') no-repeat center; background-size: cover }
  70% {background: url('../../assets/img/active/animation/8@2x.png') no-repeat center; background-size: cover }
  80% {background: url('../../assets/img/active/animation/9@2x.png') no-repeat center; background-size: cover }
  90% {background: url('../../assets/img/active/animation/10@2x.png') no-repeat center; background-size: cover }
  100% {background: url('../../assets/img/active/animation/11@2x.png') no-repeat center; background-size: cover }
}

@-moz-keyframes hbAnimate /* Firefox */
{
  0% {background: url('../../assets/img/active/animation/1@2x.png') no-repeat center; background-size: cover }
  10% {background: url('../../assets/img/active/animation/2@2x.png') no-repeat center; background-size: cover }
  19% {background: url('../../assets/img/active/animation/3@2x.png') no-repeat center; background-size: cover }
  29% {background: url('../../assets/img/active/animation/4@2x.png') no-repeat center; background-size: cover }
  40% {background: url('../../assets/img/active/animation/5@2x.png') no-repeat center; background-size: cover }
  50% {background: url('../../assets/img/active/animation/6@2x.png') no-repeat center; background-size: cover }
  60% {background: url('../../assets/img/active/animation/7@2x.png') no-repeat center; background-size: cover }
  70% {background: url('../../assets/img/active/animation/8@2x.png') no-repeat center; background-size: cover }
  80% {background: url('../../assets/img/active/animation/9@2x.png') no-repeat center; background-size: cover }
  90% {background: url('../../assets/img/active/animation/10@2x.png') no-repeat center; background-size: cover }
  100% {background: url('../../assets/img/active/animation/11@2x.png') no-repeat center; background-size: cover }
}

@-webkit-keyframes hbAnimate /* Safari 和 Chrome */
{
  0% {background: url('../../assets/img/active/animation/1@2x.png') no-repeat center; background-size: cover }
  10% {background: url('../../assets/img/active/animation/2@2x.png') no-repeat center; background-size: cover }
  19% {background: url('../../assets/img/active/animation/3@2x.png') no-repeat center; background-size: cover }
  29% {background: url('../../assets/img/active/animation/4@2x.png') no-repeat center; background-size: cover }
  40% {background: url('../../assets/img/active/animation/5@2x.png') no-repeat center; background-size: cover }
  50% {background: url('../../assets/img/active/animation/6@2x.png') no-repeat center; background-size: cover }
  60% {background: url('../../assets/img/active/animation/7@2x.png') no-repeat center; background-size: cover }
  70% {background: url('../../assets/img/active/animation/8@2x.png') no-repeat center; background-size: cover }
  80% {background: url('../../assets/img/active/animation/9@2x.png') no-repeat center; background-size: cover }
  90% {background: url('../../assets/img/active/animation/10@2x.png') no-repeat center; background-size: cover }
  100% {background: url('../../assets/img/active/animation/11@2x.png') no-repeat center; background-size: cover }
}

@-o-keyframes hbAnimate /* Opera */
{
  0% {background: url('../../assets/img/active/animation/1@2x.png') no-repeat center; background-size: cover }
  10% {background: url('../../assets/img/active/animation/2@2x.png') no-repeat center; background-size: cover }
  19% {background: url('../../assets/img/active/animation/3@2x.png') no-repeat center; background-size: cover }
  29% {background: url('../../assets/img/active/animation/4@2x.png') no-repeat center; background-size: cover }
  40% {background: url('../../assets/img/active/animation/5@2x.png') no-repeat center; background-size: cover }
  50% {background: url('../../assets/img/active/animation/6@2x.png') no-repeat center; background-size: cover }
  60% {background: url('../../assets/img/active/animation/7@2x.png') no-repeat center; background-size: cover }
  70% {background: url('../../assets/img/active/animation/8@2x.png') no-repeat center; background-size: cover }
  80% {background: url('../../assets/img/active/animation/9@2x.png') no-repeat center; background-size: cover }
  90% {background: url('../../assets/img/active/animation/10@2x.png') no-repeat center; background-size: cover }
  100% {background: url('../../assets/img/active/animation/11@2x.png') no-repeat center; background-size: cover }
}
</style>
<style lang='less'>
  .hongbaoPage{
    .hongBaoImgBox img{
      width: 248/40rem!important;
      height: 248/40rem!important;
    }
  }
</style>
