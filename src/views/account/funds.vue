<template>
  <div class="page">
    <group class="fundsBox groupNoTop groupNoLine">
      <cell title="添加银行卡" @click.native="goCard()" is-link>
            <span slot='title' v-if='hasCard' class='flexBox'>
              <img class="fundsCardIcon" :src="bankImg">
              <div class="flex1">
                <p class="fundsCardName">{{name}}</p>
                <!-- <p class="fundsCardNo">尾号{{cardLast}}</p> -->
                <p class="fundsCardNo">{{no}}</p>
              </div>
            </span>
        <!--<span v-else>-->
              <!--添加银行卡-->
            <!--</span>-->
      </cell>
    </group>
    <group class="fundsBox  groupNoLine">
      <p class="flexBox fundsMoneyTips">提现金额 <span class='flex1 alignR'> 每日提现额度{{fundsData.withdrawalCount}}元</span></p>
      <x-input v-model="fundMoney" :title='moneyMark' @on-focus='moneyFocus()' :disabled='true' @on-blur='moneyBlur()'
               :class="{'fundMoney':isFocus}" :show-clear="false" keyboard="number" placeholder='请输入提现金额'>
      </x-input>
      <p class="leastMoney">酒元余额￥{{fundsData.balance | price2}}
        <!-- <span @click="fundMoney=fundsData.balance" class='blueFont'>全部提现</span> -->
      </p>
    </group>
    <div class="fundsBtnBox">
      <x-button class='gradientBtn' @click.native="fundsFn">提现</x-button>
    </div>
    <codeAlert :showCodeAlert='codeAlert' :type='codeType' ref='codeAlert' :money="fundMoney"
               v-on:CodeAlertStatus="codeAlertFn"></codeAlert>
  </div>
</template>
<script>
  import {Group, Cell, XInput, XButton} from 'vux'
  import codeAlert from '@/components/codeAlert'

  export default {
    mounted() {
      let self = this;
      self.setTitle('提现');
      self.init();
      self.$watch('fundMoney', function (val) {
        if (val || val === 0) {
          this.moneyMark = '￥'
          this.isFocus = true
        } else {
          this.moneyMark = ''
        }
      })

    },
    data() {
      return {
        fundMoney: '',
        hasCard: false,
        moneyMark: '',
        isFocus: false,
        fundsData: {},
        bankImg: '',
        name: '',
        no: '',
        bankId: '',
        cardLast: '',
        codeAlert: false,
        codeType: '3' //1,"注册,登录",2, "绑定手机"),3,"提现"),4,"滴滴卡兑换"),5 手机充值的,0,"其他")
      }
    },
    methods: {
      init() {
        let self = this
        self.$http.get('h9/api/consume/withdraw/info')
          .then(function (res) {
            if (res.data.code == 0) {
              self.fundsData = res.data.data
              self.fundMoney = self.fundsData.withdrawMoney
              if (self.$route.query.cardIcon) {
                self.name = self.$route.query.cardName
                self.no = self.$route.query.no
                self.bankImg = self.$route.query.cardIcon
                self.bankId = self.$route.query.bankId
                self.hasCard = true
              } else {
                if (self.fundsData.bankList.length > 0) {
                  self.hasCard = true
                  self.name = self.fundsData.bankList[0].name
                  self.no = self.fundsData.bankList[0].no
                  self.bankImg = self.fundsData.bankList[0].bankImg
                  self.bankId = self.fundsData.bankList[0].id
                } else {
                  self.hasCard = false
                }
              }
            }
          })
      },
      goCard: function () {
        let self = this;
        if (this.hasCard) {
          self.$router.replace({path: '/account/chooseBank'})
        } else {
          self.$router.replace({path: '/account/addBank', query: {type: 'funds'}})
        }
      },
      fundsFn: function () {
        if (!this.bankId) {
          _g.toastMsg('error', '请选择银行卡!')
          return;
        }
        if(this.fundMoney == 0) {
          _g.toastMsg('error', '您今日可提现金额已用完')
          return
        }
        this.codeAlert = true
      },
      codeAlertFn: function (data) {
        let self = this
        if (data.show === false) {
          self.codeAlert = false;
        }
        if (data.show === false && data.codeNum.length === 4) {
          _g.showLoading()
          self.$http.post('h9/api/consume/withdraw/' + self.bankId + '/' + data.codeNum)
            .then(function (res) {
              if (res.data.code == 0) {
                _g.hideLoading()
                _g.toastMsg('error', '提现成功!')
                self.$refs.codeAlert.hide()
                self.$router.replace({
                  path: '/account/result',
                  query: {type: 'funds', money: res.data.data.money, time: res.data.data.time}
                })
              } else if(res.data.code ===  3){  // 如果提现次数过多
                _g.hideLoading()
                self.$refs.codeAlert.hide()
              } else {  // 验证码不正确
                _g.hideLoading()
                self.$refs.codeAlert.clearCode()
              }
            })
        }
      },
      moneyFocus: function () {
        this.moneyMark = '￥'
        this.isFocus = true
      },
      moneyBlur: function () {
        if (!this.fundMoney) {
          this.moneyMark = ''
        }
        this.isFocus = false
      }

    },
    components: {
      Group, Cell, XInput, XButton, codeAlert
    },
  }

</script>

<style scoped lang='less'>
  .fundsBox {
    .fundsMoneyTips {
      padding: 1rem 30/40rem;
    }
    .flexBox {
      font-size: 30/40rem;
    }
    .flex1 {
      font-size: 24/40rem;
      color: #999;
    }
    .leastMoney {
      font-size: 24/40rem;
      margin: 0 30/40rem;
      padding: 30/40rem 0;
      border-top: 1px solid #f2f2f2;
    }
    .fundMoney {
      font-size: 48/40rem;
    }
    .fundsCardIcon {
      width: 100/40rem;
      height: 100/40rem;
      margin-right: 20/40rem;
      border-radius: 4rem;
    }
    .fundsCardName {
      font-size: 32/40rem;
      line-height: 60/40rem;
    }
    .fundsCardNo {
      font-size: 24/40rem;
    }
  }

</style>
<style type="text/css" lang='less'>
  .fundsBox {
    .weui-cell_access {
      padding: 60/40rem 30/40rem;
      font-size: 32/40rem;
    }
    .vux-x-input {
      padding: 30/40rem 30/40rem;
      font-size: 32/40rem;
      height: 40/40rem;
    }
    .weui-label {
      width: 50/40rem !important;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
      font-size: 28/40rem
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      font-size: 28/40rem
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      font-size: 28/40rem
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      font-size: 28/40rem
    }
  }

</style>
