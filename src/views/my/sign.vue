<template>
  <div class="page">
    <div class="brand">
      <p class="money">258</p>
      <p class="unit">酒元</p>
    </div>
    <div class="sign-wrapper">
      <div class="sign-count">
        <div class="count">
          <p class="number">1</p>
          <p class="desc">连续签到天数</p>
        </div>
        <div class="count">
          <p class="number">8</p>
          <p class="desc">总共签到天数</p>
        </div>
      </div>
      <div class="sign-btn-wrapper">
        <span class="sing-btn" @click="handleSign" :class="hasSign ? 'hasSign' : ''">{{hasSign ? '已签到' : '签到'}}</span>
      </div>
    </div>
    <div class="info-block m_b10">
      <h3 class="title">最新签到</h3>
      <div class="people-wrapper">
        <scroller lock-x height="250px">
          <ul>
            <li class="people-list" v-for="(item, index) in 10">
              <span class="left">张三</span>
              <span class="middle">+{{3 * index}}</span>
              <span class="right">12天</span>
            </li>
          </ul>
        </scroller>
      </div>
    </div>
    <div class="info-block">
      <h3 class="title">最新签到</h3>
      <div class="desc-wrapper">
        每日签到即可获得0-99酒元；<br>
        连续签到有机会获得额外的酒元奖励，天数越多，金额越大；<br>
        酒元可在酒元商城中兑换商品。<br>
        酒元的一切解释权归徽酒集团所有。
      </div>
    </div>

    <!--todo 签到成功弹框-->
    <x-dialog v-model='showAlert' class="dialog-wrapper" :dialog-style="{width: 187+'px', borderRadius: 10+ 'px'}"
              hide-on-blur>
      <div class="sign-alert">
        <p class="title">签到成功</p>
        <p class="count">+1.5</p>
        <p class="desc">连续签到得额外奖励</p>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import {Scroller, XDialog, XButton} from 'vux'

  export default {
    mounted() {
      this.setTitle('我的签到');
    },
    data() {
      return {
        showAlert: false,
        canSign: true,
        hasSign: false
      }
    },
    methods: {
      handleSign() { // 点击签到
        if (this.hasSign) {
          return
        }
        this.hasSign = true
        this.showAlert = true
      }
    },
    components: {
      XDialog, Scroller, XButton
    },
  }

</script>

<style scoped lang='less'>
  .page {
    line-height: 1;
  }

  .brand {
    height: 182px;
    box-sizing: border-box;
    background: #FFF9E9;
    text-align: center;
    .money {
      margin-bottom: 15px;
      padding-top: 42px;
      font-size: 64px;
      font-weight: bold;
      color: #BFB182;
    }
    .unit {
      font-size: 18px;
      color: #666666;
    }
  }

  .sign-wrapper {
    height: 205px;
    padding-top: 35px;
    margin-bottom: 10px;
    box-sizing: border-box;
    background: #fff;
    .sign-count {
      margin-bottom: 40px;
      display: flex;
      .count {
        flex: 1;
        text-align: center;
        color: #BFB182;
        .number {
          margin-bottom: 12px;
          font-size: 36px;
        }
        .desc {
          font-size: 12px;
        }
      }
    }
    .sign-btn-wrapper {
      text-align: center;
      margin-bottom: 20px;
      .sing-btn {
        width: 225px;
        height: 50px;
        line-height: 50px;
        display: inline-block;
        background: #BFB182;
        border-radius: 100px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        &:after {
          border: none;
        }
        &.hasSign {
          background: #999;
        }
      }
    }
  }

  .info-block {
    padding: 15px;
    background: #fff;
    .title {
      padding-bottom: 12px;
      font-size: 12px;
      color: #666666;
      border-bottom: 1px solid #f2f2f2;
    }
    .people-wrapper {
      .people-list {
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        display: flex;
        justify-content: space-around;
        & > span {
          flex: 1;
        }
        .left {
          text-align: left;
        }
        .middle {
          text-align: center;
          color: #BFB182;
        }
        .right {
          text-align: right;
          color: #666;
        }
      }
    }
    .desc-wrapper {
      margin-top: 10px;
      line-height: 1.6;
      font-size: 12px;
      color: #333333;
    }
  }

  .dialog-wrapper {
    width: 187px;
    border-radius: 10px;
    .sign-alert {
      padding-top: 25px;
      text-align: center;
      .title {
        margin-bottom: 22px;
        font-size: 15px;
        color: #333333;
      }
      .count {
        margin-bottom: 33px;
        font-size: 30px;
        color: #BFB182;
      }
      .desc {
        margin-bottom: 20px;
        font-size: 12px;
        color: #999999;
      }
    }
  }

</style>
