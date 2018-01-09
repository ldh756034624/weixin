<template>
  <div class="page">
    <div class="abstract-wrapper">
      <p class="name">{{hotelInfo.hotelName}}</p>
      <p class="hr"></p>
      <p class="range-time">
        <span class="time-desc">入住</span>
        <span class="time">{{timeData.startShowTime}}</span>
        <span class="time-desc">离店</span>
        <span class="time">{{timeData.endShowTime}}</span>
        <span>{{timeData.rangeDay}}晚</span>
      </p>
      <div class="desc">
        <span class="title">{{hotelInfo.roomInfo.typeName}}</span>
        <div class="bed">
          <span>{{hotelInfo.roomInfo.bedSize}}</span>
          <span>{{hotelInfo.roomInfo.include}}</span>
        </div>
        <span>{{hotelInfo.roomInfo.canCancel}}</span>
      </div>
    </div>
    <p class="warning">订单确认后即视为消费，将不可以更改和退款。</p>
    <div class="info-wrapper">
      <group>
        <selector title="房间数" v-model="orderForm.roomCount" :options="roomList"></selector>
        <x-input label-width="105px" v-model="orderForm.stayRoomer" title="入住人" placeholder="入住人姓名"></x-input>
        <x-input label-width="105px" mask="999 9999 9999" :max="13" v-model="orderForm.phone"
                 title="手机" placeholder="请输入手机号"></x-input>
        <selector title="保留到" v-model="orderForm.keepTime" :options="keepList"></selector>
      </group>
    </div>

    <div class="info-wrapper">
      <group>
        <selector title="住宿偏好" v-model="orderForm.roomStyle" :options="favoriteList"></selector>
        <x-input label-width="105px" v-model="invoice" title="发票" :readonly="true"></x-input>
        <x-input label-width="105px" v-model="orderForm.remark" title="备注" placeholder="请输入您的个性需求"></x-input>
      </group>
    </div>

    <div class="bottom">
      <div class="content">
        <div class="count-wrapper">
          <span>订单金额：</span>
          <span class="count">￥<span>{{shouldPay}}</span></span>
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
      this.getBookSelectList()  // 初始化选择框列表
      this.timeData = JSON.parse(this.$route.query.timeData)
    },
    data() {
      return {
        timeData: {}, // 上一个页面传来的时间相关信息
        hotelInfo: JSON.parse(this.$route.query.hotelInfo), // 酒店相关信息
        orderForm: {
          comeRoomTime: '', // 入住时间
          keepTime: '',   // 保留时间
          outRoomTime: '',  // 离开时间
          phone: '',  // 电话
          remark: '', // 备注
          roomCount: '',  // 房间数量
          roomStyle: '',  // 烟房/无烟房
          roomTypeId: this.$route.query.id, // roomTypeId
          stayRoomer: '', // 入住人
        },
        roomList: [], // 房间数下拉框的内容
        favoriteList: [], // 喜好类型下拉框的内容
        keepList: [], // 保留时间下拉框的内容
        invoice: '请到酒店前台索取发票',
      }
    },
    methods: {
      // 获取酒店下拉相关信息
      getBookSelectList() {
        this.$http.get('/h9/api/hotel/reserve').then(res => {
          let data = res.data
          if (data.code === 0) {
            let selectType = data.data
            this.roomList = this.createSelectList(selectType.roomCountOptions, 1)
            this.orderForm.roomCount = 1 // 初始化下拉框默认值
            this.favoriteList = this.createSelectList(selectType.roomTypeOptions)
            this.orderForm.roomStyle = selectType.roomTypeOptions[0] // 初始化下拉框默认值
            this.keepList = this.createSelectList(selectType.keepTimeOptions)
            this.orderForm.keepTime = selectType.keepTimeOptions[0] // 初始化下拉框默认值
          }
        })
      },
      // 生成给select用的数据格式
      createSelectList(data, type) { // type=1, 为特殊处理数据，后台为1间，key,处理为1
        let tmp = []
        data.forEach(item => {
            tmp.push({
              key: item,
              value: item
            })
          }
        )
        if (type === 1) {
          tmp.forEach((item, index) => {
            item.key = index + 1
          })
        }

        return tmp
      },
      handleBook() { // 点击预订按钮
        let data = this.orderForm
        // 必填判断
        if (!data.stayRoomer) {
          _g.toastMsg('error', '请填写入住人')
          return
        }
        if (!data.phone) {
          _g.toastMsg('error', '请输入手机号码')
          return
        }
        data.comeRoomTime = this.timeData.startTime
        data.outRoomTime = this.timeData.endTime
        _g.showLoading('订单创建中')
        this.$http.post('/h9/api/hotel/order', data).then(res => {
          _g.hideLoading()
          let data = res.data
          if (data.code === 0) {
            this.$router.push({
              path: '/hotel/pay',
              query: {orderInfo: JSON.stringify(data.data)}
            })
          }
        })
      },
    },
    computed: {
      // 订单需支付金额
      shouldPay() {
        return this.orderForm.roomCount * this.hotelInfo.roomInfo.realPrice
      }
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
