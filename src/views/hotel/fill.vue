<template>
  <div class="page">
    <div class="abstract-wrapper">
      <p class="name">合肥融侨皇冠假日酒店</p>
      <p class="hr"></p>
      <p class="range-time">
        <span class="time-desc">入住</span>
        <span class="time">{{timeData.startShowTime}}</span>
        <span class="time-desc">离店</span>
        <span class="time">{{timeData.endShowTime}}</span>
        <span>{{timeData.rangeDay}}晚</span>
      </p>
      <div class="desc">
        <span class="title">皇冠高级床</span>
        <div class="bed">
          <span>大床</span>
          <span>单早</span>
        </div>
        <span>不可取消</span>
      </div>
    </div>
    <p class="warning">订单确认后即视为消费，将不可以更改和退款。</p>
    <div class="info-wrapper">
      <group>
        <selector title="房间数" v-model="value" :options="list" @on-change="onChange"></selector>
        <x-input label-width="105px" v-model="people" title="入住人" placeholder="入住人姓名"></x-input>
        <x-input label-width="105px" v-model="phone" title="手机" placeholder="请输入手机号"></x-input>
        <selector title="保留到" v-model="value" :options="list" @on-change="onChange"></selector>
      </group>
    </div>

    <div class="info-wrapper">
      <group>
        <selector title="住宿偏好" v-model="value" :options="list" @on-change="onChange"></selector>
        <x-input label-width="105px" v-model="invoice" title="发票" :readonly="true"></x-input>
        <x-input label-width="105px" v-model="phone" title="备注" placeholder="请输入您的个性需求"></x-input>
      </group>
    </div>

    <div class="bottom">
      <div class="content">
        <div class="count-wrapper">
          <span>订单金额：</span>
          <span class="count">￥<span>420</span></span>
        </div>
        <div class="btn" @click="handleBook">立即预订</div>
      </div>
    </div>
  </div>
</template>

<script>

  import {Group, XInput, Selector} from 'vux'

  export default {
    created() {
      this.$nextTick(() => {
        this.timeData = JSON.parse(this.$route.query.timeData)
      })
    },
    data() {
      return {
        timeData: {}, // 上一个页面传来的时间相关信息
        list: [{key: '1', value: '一间'}, {key: '2', value: '二间'}],
        value: '1',
        invoice: '请到酒店前台索取放票',
        people: null, // 入住人
        phone: null // 手机
      }
    },
    methods: {
      onChange(val) { // val对应list里的key
        console.log('select', val)
      },
      handleBook() { // 点击预订按钮
        _g.showLoading('订单创建中')
        setTimeout(() => {
          _g.hideLoading()
          this.$router.push({
            path: '/hotel/pay'
          })
        }, 1500)
      },
    },
    components: {
      Group,
      XInput,
      Selector
    }
  }
</script>
<style scoped lang='less'>
  .page {
    padding-top: 10px;
    height: 100%;
    line-height: 1;
    background: #EDF1F2;
  }

  .abstract-wrapper {
    margin: 0 15px;
    background: #fff;
    .name {
      padding: 13px 10px 0;
      font-size: 15px;
      color: #333333;
      font-weight: bold;
    }

    .range-time {
      font-size: 12px;
      padding: 12px;
      .time-desc {
        color: #999;
        margin-right: 10px;
      }
      .time {
        color: #333;
        margin-right: 35px;
      }
    }

    .desc {
      padding-left: 12px;
      padding-bottom: 14px;
      display: flex;
      font-size: 12px;
      color: #999;
      .title {
        margin-right: 30px;
        color: #333;
      }
      .bed {
        margin-right: 15px;
        padding-right: 10px;
        border-right: 1px solid #f1f1f1;
      }
    }
  }

  .warning {
    margin: 10px 0;
    padding-left: 15px;
    height: 44px;
    line-height: 44px;
    background: #fff;
    font-size: 12px;
    color: #627984;
  }

  .info-wrapper {
    margin-bottom: 10px;
  }

  .bottom {
    height: 60px;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .content {
      float: right;
      display: flex;
      .count-wrapper {
        margin-top: 24px;
        margin-right: 10px;
        font-size: 12px;
        color: #999;
        .count {
          color: #E57B7B;
          & > span {
            font-size: 20px;
          }
        }
      }
      .btn {
        width: 120px;
        height: 60px;
        line-height: 60px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        background: #E57B7B;
      }
    }
  }
</style>

<style lang="less">
  .info-wrapper {
    .weui-cells {
      font-size: 15px;
      .weui-label {
        color: #999;
      }
    }
  }
</style>
