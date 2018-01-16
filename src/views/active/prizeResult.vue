<template>
  <div class="page prizeResultPage">
    <div class="prizeResultCont">
      <img class="groupLogo" src="../../assets/img/active/logo_huijiu@2x.png"/>
      <div v-if='prizeData.money==0' class="noPrize">
        <img src="../../assets/img/active/bg_weizhongjiang@2x.png">
        <p>很遗憾,您未中奖</p>
      </div>
      <div v-if='prizeData.money > 0'>
        <div class="prizeMoneyBox">
          <span>{{prizeData.money}}</span>
        </div>
        <div>

          <div v-if="noGetPrize">
            <x-input v-model="bindPhoneParam.phone" class='prizePhone' placeholder='请输入手机号'></x-input>
            <x-button mini class='prizeGetBtn' @click.native="getPrizeFn">立即领取</x-button>
          </div>
          <div v-else class="prizeGet">
            <p class="account">红包已放置账户:{{prizeAccount}}</p>
            <p>登录App或欢乐之家社区即可使用</p>
          </div>

        </div>
      </div>

      <div class="prizeBtnBox" :class="{'prizeBtnMrg' : prizeData.money===0}">
        <x-button mini class='miniBtn' @click.native="goIndex">进入社区</x-button>
        <x-button mini class='miniBtn' @click.native="downApp">下载APP</x-button>
      </div>
    </div>
    <div class="prizerBox">
      <p class="prizerNum">{{prizeData.userCount}}人参与,获得红包的人有:</p>
      <div class="prizerCont flexBox" v-for='item in prizeData.lotteryUsers'>
        <img :src="item.avatar"/>
        <div class="flex1">
          <p class="prizerName">
            <span class='name flex1 TextEllipsis'>{{item.name}}</span>
            <span class='date'>{{item.createDate}}</span>
          </p>
          <p>{{item.desc}}</p>
        </div>
        <div class='moneyBox'>
          <p class='prizeMoney'>{{item.money}}酒元</p>
          <p class='moneyBest' v-if='item.maxMoney'><span class='handIcon'></span>手气最佳</p>
        </div>
      </div>
    </div>
    <codeAlert :showCodeAlert='codeAlert' :type='codeType' :phoneNum="bindPhoneParam.phone" ref='codeAlert'
               v-on:CodeAlertStatus="codeAlertFn"></codeAlert>
  </div>
</template>
<script>
  import {XInput, XButton} from 'vux'
  import codeAlert from '@/components/codeAlert'

  export default {
    mounted() {
      let self = this;
      self.setTitle('抢红包');
      _g.showLoading()  // 加载
      self.init();  // 初始化
    },
    data() {
      return {
        prizeData: {},
        code: this.$route.query.code,
        noGetPrize: false,
        codeAlert: false,
        codeType: '2',
        prizeAccount: '',
        bindPhoneParam: {
          phone: null
        }
      }
    },
    methods: {
      init() {
        let self = this
        self.$http.get('h9/lottery/room?code=' + self.code)
          .then(function (res) {
            _g.hideLoading()
            if (res.data.code == 0) {
              self.prizeData = res.data.data
              if (self.prizeData.tel) {
                self.noGetPrize = false
                self.prizeAccount = self.prizeData.tel
              } else {
                self.noGetPrize = true
              }
              if (res.data.data.roomUser) {
                self.codeUrl = res.data.data.qrCode
              }
            }
          })
      },
      getPrizeFn: function () {
        if (!this.bindPhoneParam.phone) {
          _g.toastMsg('error', '请输入手机号!')
          return;
        }
        this.codeAlert = true;
      },
      codeAlertFn: function (data) {
        let self = this
        if (data.show === false) {
          self.codeAlert = false
        }
        if (data.justHide) {
          return
        }
        if (data.codeNum.length === 4) {
          self.bindPhoneParam.code = data.codeNum
          self.$http.post('h9/api/user/phone/bind', self.bindPhoneParam)
            .then(function (res) {
              if (res.data.code == 0) {
                _g.toastMsg('error', '领取成功!')
                self.$refs.codeAlert.hide(true)
                self.noGetPrize = false
                self.prizeAccount = self.bindPhoneParam.phone
                localStorage.setItem("_user", JSON.stringify(res.data.data));
              }
            })
        }
      },
      goIndex: function () {
        this.$router.push({path: '/index'})
      },
      downApp: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          this.goDownAppLink(1)
        } else {
          this.goDownAppLink(2)
        }
      },
      /**
       * 获取下载app的链接并跳转
       * @param type [IOS：2 安卓：1]
       */
      goDownAppLink(type) {
        this.$http.get('/h9/api/redirect?client=' + type).then(res => {
          if (res.data.code === 0) {
            let link = res.data.data.redirect
            if (link) {
              window.location.href = link
            } else {
              _g.toastMsg('error', '暂时没有下载链接')
            }
          }
        })
      }
    },
    components: {
      XInput, XButton, codeAlert
    },
  }

</script>

<style scoped lang='less'>
  .prizeResultPage {
    background: url('../../assets/img/active/bg_dafugui@2x.png') no-repeat;
    background-size: cover;
    overflow-y: auto;
  }

  .prizeResultCont {
    background: rgba(255, 255, 255, .9);
    padding: 30/40rem 1rem;
    margin: 30/40rem;
    text-align: center;
    .groupLogo {
      width: 160/40rem;
      height: 126/40rem;
      margin-bottom: 30/40rem;
    }
    .prizeMoneyBox {
      background: url('../../assets/img/active/bg_jiangjin@2x.png') no-repeat;
      background-size: cover;
      text-align: left;
      padding-left: 35/40rem;
      padding-top: 30/40rem;
      width: 519/40rem;
      height: 184/40rem;
      margin: 1rem auto 30/40rem;
      font-size: 48/40rem;
      color: #fff;
      span {
        font-size: 108/40rem;
      }
    }
    .prizeGet {
      font-size: 28/40rem;
      color: #666;
      line-height: 45/40rem;
      .account {
        color: #333;
      }
    }
    .noPrize {
      img {
        width: 248/40rem;
        height: 248/40rem;
      }
      p {
        color: #333;
        font-size: 40/40rem;
      }
    }
    .prizePhone {
      width: 480/40rem;
      height: 55/40rem;
      margin: 60/40rem auto 30/40rem;
      background: #fff;
      font-size: 36/40rem;
      border: 2/40rem solid #ED5954;
      border-radius: 10/40rem;
    }
    .prizeGetBtn {
      width: 554/40rem;
      height: 100/40rem;
      background: #EE5954;
      font-size: 36/40rem;
      color: #fff;
      font-size: 36/40rem;
    }
    .prizeBtnBox {
      .miniBtn {
        border: 2/40rem solid #ED5954;
        padding: 10/40rem;
        margin: 30/40rem 60/40rem 0;
        background: rgba(0, 0, 0, 0);
        color: #ED5954;
        font-size: 28/40rem;
      }
    }
    .prizeBtnMrg {
      margin: 80/40rem 60/40rem;
    }
  }

  .prizerBox {
    background: rgba(255, 255, 255, .9);
    font-size: 28/40rem;
    padding: 30/40rem;
    margin: 30/40rem;
    .prizerCont {
      margin-top: 30/40rem;
    }
    .prizerNum {
      padding-bottom: 30/40rem;
      border-bottom: 2/40rem solid #666;

    }
    img {
      width: 92/40rem;
      height: 92/40rem;
      border-radius: 4rem;
      margin-right: 20/40rem;
    }
    .prizerName {
      color: #333;
      display: flex;
      width: 340/40rem;
      .date {
        color: #999;
        margin-left: 10/40rem;
      }
    }
    .moneyBox {
      display: inline-block;
      text-align: right;
      .prizeMoney {
        margin-bottom: 0.2rem;
        color: #ED5954;
        font-size: 32/40rem;
        line-height: 1rem;
      }
    }
    .moneyBest {
      background: #ED5954;
      color: #fff;
      font-size: 24/40rem;
      border-radius: 6/40rem;
      padding: 0 10/40rem;
    }
    .handIcon {
      display: inline-block;
      width: 22/40rem;
      height: 22/40rem;
      background: url('../../assets/img/active/icon_dianzan@2x.png') no-repeat;
      background-size: cover;
    }
  }

</style>
<style lang='less'>
  .prizePhone {
    .weui-input {
      text-align: center;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
      color: #ccc;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #ccc;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #ccc;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #ccc;
    }
  }

  .prizeBtnBox .weui-btn_mini {
    line-height: 30/40rem !important;
  }
</style>
