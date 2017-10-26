<template>
  <div class="page home" style="height:100%">
    <scroller lock-x ref="scroller">
      <div class="content">
        <img class="bg" src="../assets/img/bg.png" @load="resetScroller">
        <div class="btn-wrap" v-if="!notwx">
          <div class="btn" v-if="!success">
            <input type="text" ref="input" v-model="phone" @focus="focusFun" placeholder="请输入手机号码" pattern="[0-9]*"
                   onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11">
          </div>
          <div class="code-wrap">
            <div class="btn second code" v-if="!success">
              <input type="text" ref="code" v-model="code" @focus="focusFun" placeholder="请输入验证码" pattern="[0-9]*"
                     onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11">
            </div>
            <div class="getcode" v-if="!success" @click="getCode" v-bind:class="{'disable':codeflag}">
              {{codeflag ? count : "验证码"}}
            </div>
          </div>
          <div class="btn third" @click="drawRedbag" v-if="!success"><span>点击领取红包</span></div>
          <div class="btn scan" @click="scan" v-if="success"><span>再次扫码赢取红包</span></div>
        </div>
        <div class="rules" v-if="!success && !notwx">
          <img src="../assets/img/rule.png" @load="resetScroller">
        </div>
        <div class="history" v-if="success && !notwx && list.length > 0">
          <flexbox :margin-left='0' class="head">
            <flexbox-item class="option">
              <div class="">中奖时间</div>
            </flexbox-item>
            <flexbox-item class="option">
              <div class="">中奖金额</div>
            </flexbox-item>
          </flexbox>
          <flexbox :margin-left='0' v-for="(item, index) in list" v-show="(index<2 && showmore) || !showmore"
                   v-bind:class="{'noborder': !showmore && (index == list.length-1)}">
            <flexbox-item class="option">
              <div class="">{{item.date}}</div>
            </flexbox-item>
            <flexbox-item class="option">
              <div class="">{{item.money}}元</div>
            </flexbox-item>
          </flexbox>
          <div class="loadmore" v-if="showmore && list.length>2" @click="showmoreFun">点击加载更多</div>
        </div>
      </div>
    </scroller>
    <alert v-model="alert.show" :title="alert.title" button-text="确　定" class="alertDl">
      <p style="text-align:center;">{{alert.msg}}</p>
    </alert>
    <x-dialog v-model="dgShow" class="hb_dialog" :scroll="false">
      <img src="../assets/img/hb.png">
      <div class="congratulation">恭喜您！获得微信<span>{{amount}}</span>元现金红包</div>
      <div class="check" @click="goCheck">查看我的奖品</div>
    </x-dialog>
  </div>
</template>

<script>
  import {Alert, XDialog, Flexbox, FlexboxItem, Scroller, InlineLoading} from 'vux'
  import wxAuth from '@/util/wxAuth'
  import wx from 'weixin-js-sdk'

  document.body.addEventListener('touchstart', function () {
  });   //ios

  export default {
    data() {
      return {
        phone: "",
        regPhone: /0?(13|14|15|17|18)[0-9]{9}/,   //手机号码校验
        alert: {
          title: "",
          msg: "",
          show: false
        },
        dgShow: false,
        amount: 0,
        success: false,
        latitude: 0,
        longitude: 0,
        list: [],
        notwx: false,
        showmore: true,
        reApply: false,
        code: "",
        count: 60,
        codeflag: false
      }
    },
    mounted() {
      this.init();
      this.$nextTick(() => {
        this.$refs.scroller.reset()
        if (this.device() == 'ios') {   //光标不移动的hack
          this.$refs.scroller._xscroll.on('scroll', (e) => {
            this.$refs.input && this.$refs.input.blur();
          });
        }
      });
    },
    methods: {
      init() {
        let self = this;
        if (this.$route.query.msg) {
          this.notwx = true;
          this.alert = {
            show: true,
            title: "",
            msg: this.$route.query.msg
          };
          return false;
        }
        this.setTitle('冰峰红包');
        wxAuth.wxSign(this).then(() => {  //微信授权,then获取经纬度
          wx.ready(function () {
            self.getLocation();
          });
        });
      },
      drawRedbag() {
        let self = this;
        if (this.code) {
          if (this.checkTel() && !this.reApply) {
            this.reApply = true;
            self.$http.post('/icepeak/reward/' + this.$route.query.token + '/' + this.phone, {
              latitude: this.latitude,
              longitude: this.longitude,
              smsCode: this.code
            })
              .then(function (res) {
                if (res.data.code == 0) {
                  self.amount = res.data.data.money;
                  self.dgShow = true;
                } else {
                  self.alert = {
                    show: true,
                    title: "",
                    msg: res.data.msg
                  };
                }
                self.reApply = false;
              })
          }
        } else {
          self.alert = {
            show: true,
            title: "",
            msg: "请输入验证码"
          };
        }
      },
      checkTel() {
        if (!this.regPhone.test(this.phone)) {
          let msg = this.phone.trim().length == 0 ? "请输入手机号码" : "请输入正确的手机号码";
          this.phone = "";
          this.alert = {
            show: true,
            title: "",
            msg: msg
          };
          return false;
        } else {
          return true;
        }
      },
      goCheck() {
        this.success = true;
        this.resetScroller({top: 0});
        this.getHistory();
        this.dgShow = false;
      },
      getCode() {
        let self = this;
        let rcmurl = "/icepeak/sms/" + this.$route.query.token + "/" + this.phone;
        if (this.checkTel() && !this.codeflag) {
          self.$http.post(rcmurl, {latitude: this.latitude, longitude: this.longitude})
            .then(function (res) {
              if (res.data.code == 0) {
                self.codeflag = true;
                self.countZero();
              } else {
                self.alert = {
                  show: true,
                  title: "",
                  msg: res.data.msg
                };
              }
            })
        }
      },

      getHistory() {
        let self = this;
        let rcmurl = "/icepeak/reward/history";
        self.$http.get(rcmurl, {params: {openId: this.$route.query.openId}})
          .then(function (res) {
            if (res.data.code == 0) {
              self.list = res.data.data;
              // self.list = [res.data.data[0]];
              self.resetScroller();
            } else {
              self.alert = {
                show: true,
                title: "",
                msg: res.data.msg
              };
            }
          })
      },
      getLocation() {
        let self = this;
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          }
        });
      },
      scan() {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
          }
        });
      },
      showmoreFun() {
        this.showmore = false;
        this.resetScroller();
      },
      resetScroller(params) {
        this.$nextTick(() => {
          this.$refs.scroller.reset(params);
        });
      },
      focusFun() {
        if (this.device() == 'android') {
          this.$refs.scroller._xscroll.scrollTop(250, 200, 'ease', () => {
            this.$refs.scroller.reset();
          });
        }
      },
      domove() {    //‘查看我的奖品’时滚动到最底部
        this.$nextTick(() => {
          let conentH = document.querySelector(".content").offsetHeight;
          let bodyH = document.body.offsetHeight;
          // alert(conentH+'-'+bodyH)
          this.$refs.scroller._xscroll.scrollTop(conentH - bodyH > 0 ? conentH - bodyH : 0, 200, 'ease', () => {
            this.$refs.scroller.reset();
          });
        });
      },
      countZero() {   //验证码倒计时
        if (this.count > 0) {
          setTimeout(() => {
            this.countZero();
          }, 1000);
          --this.count;
        } else {
          this.codeflag = false;
          this.count = 60;
        }
      }
    },
    components: {
      Alert,
      XDialog,
      Flexbox,
      FlexboxItem,
      Scroller,
      InlineLoading
    }

  }

</script>

<style scoped lang='less'>
  .content {
    padding-bottom: 30/40rem;
    height: 100%;
    .bg {
      width: 100%;
    }
    .btn-wrap {
      padding: 0 108/40rem;
      text-align: center;
      .btn {
        height: 90/40rem;
        line-height: 90/40rem;
        background-color: #ffe22b;
        border-radius: 8/40rem;
        color: #954300;
        font-size: 0;
        overflow: hidden;
        span {
          font-size: 36/40rem;
        }
        input {
          text-align: left;
          padding-left: 30/40rem;
          height: 100%;
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          font-size: 36/40rem;
          color: #954300;
        }
        &.scan {
          color: #ee8c00;
        }
        &.second, &.third {
          margin-top: 30/40rem;
        }
        &.third, &.scan {
          &:active {
            background-color: #d67400;
            color: #fff;
          }
        }
      }
      .code-wrap {
        position: relative;
        .code {
          margin-right: 130/40rem;
        }
        .getcode {
          line-height: 90/40rem;
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ffe22b;
          border-radius: 8/40rem;
          width: 120/40rem;
          height: 100%;
          font-size: 24/40rem;
          &:active {
            background-color: #d67400;
            color: #fff;
          }
          &.disable {
            color: #999;
            background-color: #ddd;
          }
        }
      }
    }
    .rules {
      margin-top: 40/40rem;
      padding: 0 26/40rem;
      img {
        width: 100%;
      }
    }
    .history {
      padding: 0 30/40rem;
      background-color: #fff;
      margin: 44/40rem;
      .head {
        .option {
          color: #ee3200;
          font-size: 34/40rem;
          line-height: 76/40rem;
        }
      }
      .option {
        text-align: center;
        color: #646262;
        font-size: 24/40rem;
        line-height: 60/40rem;
      }
      .loadmore {
        font-size: 24/40rem;
        text-align: center;
        line-height: 76/40rem;
        color: #646262;
      }
    }
  }

  .hb_dialog {
    img {
      width: 100%;
    }
    .congratulation {
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 160/40rem;
      text-align: center;
      font-size: 26/40rem;
      color: #fff;
      span {
        color: #f5f377;
      }
    }
    .check {
      position: absolute;
      background-color: #f7f373;
      left: 38/40rem;
      right: 38/40rem;
      bottom: 34/40rem;
      color: #fa9e00;
      font-size: 28/40rem;
      line-height: 70/40rem;
      border-radius: 40/40rem;
    }
  }
</style>
<style lang="less">
  .hb_dialog {
    .weui-dialog {
      background-color: transparent;
      font-size: 0;
    }
  }

  .history {
    .vux-flex-row {
      border-bottom: 1px dashed #cdcdcd;
      &.noborder {
        border-bottom: 0;
      }
    }
  }

  .alertDl {
    .weui-dialog {
      border-radius: 20/40rem;
      .weui-dialog__btn {
        background-color: #f02041;
        color: #fff !important;
        font-size: 28/40rem;
        margin: 30/40rem 80/40rem;
        border-radius: 20/40rem;
        line-height: 70/40rem;
      }
      .weui-dialog__bd {
        color: #4c1404;
        font-size: 24/40rem;
      }
    }
  }
</style>

