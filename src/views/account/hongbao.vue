<template>
  <div class="page">
    <group class="fundsBox  groupNoLine">
      <p class="flexBox fundsMoneyTips">红包金额 <span class='flex1 alignR'> 可用余额{{fundsData.withdrawalCount}}元</span></p>
      <x-input v-model="fundMoney" :title='moneyMark' @on-focus='moneyFocus()' @on-blur='moneyBlur()'
               :class="{'fundMoney':isFocus}" :show-clear="false" keyboard="number" placeholder='请输入红包金额'>
      </x-input>
    </group>
    <div class="fundsBtnBox">
      <x-button class='gradientBtn' @click.native="fundsFn">下一步</x-button>
    </div>
  </div>
</template>
<script>
  import {Group, Cell, XInput, XButton} from 'vux'

  export default {
    mounted() {
      let self = this;
      self.setTitle('红包金额');
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
        fundMoney: this.$route.query.money || '',
        moneyMark: '',
        isFocus: false,
        fundsData: {}
      }
    },
    methods: {
      init() {
        let self = this
        self.$http.get('h9/api/consume/withdraw/info')
          .then(function (res) {
            if (res.data.code == 0) {
              self.fundsData = res.data.data
            }
          })
      },
      fundsFn: function () {
        if (this.fundMoney > this.fundsData.withdrawalCount) {
          _g.toastMsg('error', '您设置的红包金额大于可用余额')
          return
        }
        this.$router.push({path:'/account/promotion',query:{money:this.fundMoney}})
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
      Group, Cell, XInput, XButton
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
    .fundMoney {
      font-size: 48/40rem;
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
