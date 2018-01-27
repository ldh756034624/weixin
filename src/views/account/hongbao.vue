<template>
  <div class="page">
    <group class="fundsBox  groupNoLine">
      <p class="flexBox fundsMoneyTips">红包金额 <span class='flex1 alignR'> 可用余额{{fundsData.balance}}</span></p>
      <x-input v-model="fundMoney" type="number" title='￥' class="fundMoney" :show-clear="false" placeholder='请输入红包金额'>
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

    },
    data() {
      return {
        fundMoney: Number(this.$route.query.money) || null,
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
        if (!this.fundMoney || this.fundMoney < 1) {
          _g.toastMsg('error', '设置的金额不能小于1或空')
          return
        }
        if (this.fundMoney > Number(this.fundsData.balance)) {
          _g.toastMsg('error', '您设置的红包金额大于可用余额')
          return
        }
        this.$router.push({path:'/account/promotion',query:{money:this.fundMoney}})
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
