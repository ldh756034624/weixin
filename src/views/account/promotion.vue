<template>
  <div class="page">
    <div class="moneyBox">
      <div class="moneyCon">
        <p class="moneyTips">扫一扫收款</p>
        <div class="moneyTxt"><span>￥</span>{{moneyData.money}}</div>
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
            <div class="ConR">￥{{item.money}}</div>
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
        this.$router.push({path:'/account/hongbao',query:{money: this.money}})
      },
      onParticulars () {
        this.$router.push({path:'/account/transferInfo',query:{type: '2'}})
      }
    },
    beforeDestroy () {
      // 阻止轮询
      return this.isDestroyed = true
    }
  }

</script>

<style type="text/css" lang='less' scoped>
  .page {
    background: #627984;
  }
  .moneyBox {
    background-color: #fff;
    margin: 15px;
    border-radius: 3px;
  }
  .moneyCon {
    text-align: center;
    color: #333333;
  }
  .moneyCon img {
    border: 1px solid #979797;
    width: 160px;
    height: 160px;
    margin: 25px auto;
  }
  .btnBox {
    width: 160px;
    font-size: 12px;
    color: #627984;
    line-height: 12px;
    height: 12px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding-bottom: 60px;
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
    font-size: 14px;
    line-height: 14px;
    padding: 40px 0 20px;
  }
  .moneyTxt {
    font-size: 36px;
    line-height: 36px;
  }
  .moneyTxt span {
    font-size: 18px;
    line-height: 18px;
  }
  .list {
    padding: 0 15px;
  }
  .listItem {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .listItem img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
  }
  .listCon {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ConL {
    font-size: 14px;
    color: #333333;
    line-height: 14px;
  }
  .ConL p {
    font-size: 12px;
    color: #CCCCCC;
    line-height: 12px;
    margin-top: 8px;
  }
  .ConR {
    font-size: 18px;
    color: #333333;
    line-height: 18px;
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
