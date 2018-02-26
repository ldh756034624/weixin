<template>
  <div class="page">
    <div class="moneyBox">
      <div class="moneyCon">
        <p class="moneyTips">扫一扫收款</p>
        <div class="moneyTxt"><span>¥</span>{{moneyData.money}}</div>
        <img :src="moneyData.codeUrl">
        <div class="btnBox"><div class="setBtn btn" @click="onSet">设置金额</div><div class="btn" @click="onParticulars">收款账单</div></div>
      </div>
    </div>
    <div class="moneyBox" v-if="transferRecord.length>0">
      <div class="list">
        <div class="listItem" v-for="item in transferRecord">
          <img :src="item.img">
          <div class="listCon">
            <div class="ConL">
              <div>{{item.nickName}}</div>
              <p>{{item.time}}</p>
            </div>
            <div class="ConR">¥{{item.money}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-show='loadingShow'>
      <div class="cellBox">
        <img :src="lodingImg">
        <p>正在加载中</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    mounted() {
      let self = this;
      self.setTitle('推广红包');
      self.init();
    },
    data() {
      return {
        money: this.$route.query.money,
        moneyData: {},
        loadingShow: true,
        isDestroyed: false,
        transferRecord: [],
        lodingImg: require('../../assets/img/blank/loading.gif')
      }
    },
    methods: {
      init() {
        const self = this
        self.loadingShow = true
        self.$http.get('h9/api/user/redEnvelope/code', {params: {money: self.money}})
          .then(function (res) {
            if (res.data.code == 0) {
              self.moneyData = res.data.data
              self.redEnvelope()
            } else if (res.data.code == 1) {
              setTimeout(() => {
                self.onSet()
              }, 1500)
            }
            self.loadingShow = false
          })
      },
      redEnvelope () {
        const self = this
        self.$http.get('h9/api/user/redEnvelope/code/'+ self.moneyData.tempId)
          .then(function (res) {
            if (res.data.code === 0) {
              if(self.isDestroyed){
                  return;
              }
              setTimeout(() => {
                self.redEnvelope()
              }, 2500)
            } else if (res.data.code === 1) {
              _g.toastMsg('success', '支付成功')
              self.transferRecord.unshift(res.data.data)
              self.$vux.alert.show({
              title: '二维码失效',
              content: '是否重新生成二维码?',
              onHide () {
                self.init()
              }
            })
            }
          })
      },
      onSet () {
        this.$router.replace({path:'/account/hongbao',query:{money: this.money}})
      },
      onParticulars () {
        this.$router.push({path:'/account/transferInfo',query:{type: '2'}})
      }
    },
    beforeDestroy () {
      this.$vux.alert.hide()
      // 阻止轮询
      return this.isDestroyed = true
    }
  }

</script>

<style type="text/css" lang='less' scoped>
  .page {
    background: #627984;
        overflow-y: auto;
  }
  .moneyBox {
    background-color: #fff;
    margin: 0 30/40rem;
    border-radius: 3px;
  }
  .moneyCon {
    text-align: center;
    color: #333333;
  }
  .moneyCon img {
    border: 1px solid #979797;
    width: 320/40rem;
    height: 320/40rem;
    margin: 50/40rem auto;
  }
  .btnBox {
    width: 320/40rem;
    font-size: 24/40rem;
    color: #627984;
    line-height: 24/40rem;
    height: 24/40rem;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding-bottom: 120/40rem;
  }
  .btn.setBtn {
    border-right: 1px solid #999;
    text-align: left;
  }
  .btn {
    width: 50%;
    text-align: right;
  }
  .moneyTips {
    font-size: 28/40rem;
    line-height: 28/40rem;
    padding: 80/40rem 0 40/40rem;
  }
  .moneyTxt {
    font-size: 72/40rem;
    line-height: 72/40rem;
  }
  .moneyTxt span {
    font-size: 36/40rem;
    line-height: 36/40rem;
  }
  .list {
    padding: 0 30/40rem;
  }
  .listItem {
    display: flex;
    align-items: center;
    padding: 20/40rem 0;
  }
  .listItem img {
    width: 80/40rem;
    height: 80/40rem;
    border-radius: 40/40rem;
    margin-right: 20/40rem;
  }
  .listCon {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ConL {
    font-size: 28/40rem;
    color: #333333;
    line-height: 28/40rem;
  }
  .ConL p {
    font-size: 24/40rem;
    color: #CCCCCC;
    line-height: 24/40rem;
    margin-top: 16/40rem;
  }
  .ConR {
    font-size: 36/40rem;
    color: #333333;
    line-height: 36/40rem;
  }

  .loading {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    display: table;
    .cellBox {
      display: table-cell;
      vertical-align: middle;
      width: 3rem;
      text-align: center;
      margin: 0 auto;
      font-size: 24/40rem;
    }
    img {
      width: 60/40rem;
      height: 60/40rem;
    }
    .loadingImg {
      display: inline-block;
      width: 60/40rem;
      height: 60/40rem;
      background: url('../../assets/img/blank/loading.gif');
    }
  }
</style>
