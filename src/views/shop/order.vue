<template>
  <div class="page shopOrderPage">
    <group class=" groupNoTop groupNoLine">
      <cell title=""
            class='orderAddr'
            @click.native="goAddrList"
            is-link>

        <span slot='title'
              v-if='hasAddress'>
          <p>收货人:{{addressData.name}}
            <i class='phone'>{{addressData.phone}}</i>
          </p>
          <p>地址:{{addressData.address}}</p>
        </span>
        <span slot='title'
              v-else>
          请填写收货地址
        </span>
      </cell>
    </group>
    <div>
      <main>
        <div class="shopgoodBox">
          <div class="flexBox">
            <img :src="shopData.img">
            <div class='flex1'>
              <p>{{shopData.name}}</p>
              <!-- <p class="joyMoney">{{shopData.price | price2}} 酒元</p> -->
            </div>
            <!-- <span class='num'>x{{countNum*4}}</span> -->
          </div>
          <p class="numBlock">
            购买数量
            <span class="numEditBlock">
              <span class='numMinusBlack'
                    v-if='countNum===1'></span>
              <span class='numMinus'
                    v-else
                    @click="count('minus')"></span>
              <span class='text'>{{countNum}}</span>
              <span class='numAdd'
                    @click="count('add')"></span>
            </span>
          </p>
          <p class="total">共
            <span>{{countNum}}</span>箱
            <span class='totalMoney'>小计 :
              <i class='joyMoney'>{{(shopData.price * countNum) | price2}} 元</i>
            </span>
          </p>
        </div>
      </main>
    </div>
    <div>
      <section>
        <div class="shopOrderMsgBox">
          <cell title="配送方式"
                value='快递 免邮'></cell>
          <p class="ordeTotal">
            <label>订单总金额</label>
            <span>{{(shopData.price * countNum) | price2}} 元</span>
          </p>
          <p class="ordeTotal"
             @click="(couponsList.length > 0) && (showCouponList=!showCouponList)">
            <label>优惠券</label>
            <i class="arrow"
               :class="{top: showCouponList}"
               v-if="couponsList.length !== 0"></i>
            <span v-if="checkedCouponId">已选一张，省￥{{shopData.price}}</span>
            <span v-if="couponsList.length > 0 && !checkedCouponId">不使用</span>
            <span v-if="couponsList.length == 0">暂无可用</span>
          </p>
          <div class="coupon-list"
               v-if="showCouponList">
            <ul>
              <li class="coupon-item"
                  :class="{active: item.id === checkedCouponId}"
                  v-for="item in couponsList"
                  @click="handleCouponItem(item.id)"
                  :key="item.id">
                <div class="name">{{item.couponType}}</div>
                <div class="desc">
                  <p class="title">{{item.useType}}</p>
                  <p class="over-date">{{item.endTime}} 到期</p>
                </div>
                <div class="check-icon"
                     v-if="item.id === checkedCouponId"></div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    <div>
      <section>
        <p class="blockTips">支付方式</p>
        <div class="shopPayBox">
          <p @click="payMethod = 1">
            <label>旅游健康卡余额(￥
              <i>{{shopData.balance}}</i>)</label>
            <span class='payIcon unSet'
                  :class="{'hasSet':payMethod == 1}"></span>
          </p>
          <p @click="payMethod = 3">
            <label>微信支付</label>
            <span class='payIcon unSet'
                  :class="{'hasSet':payMethod == 3}"></span>
          </p>
        </div>
      </section>
    </div>
    <div class="orderBottom">
      <!-- 实付{{payMethod==1?"旅游健康卡余额:":"金额:"}}<span class='joyMoney'>{{shopPrice | price2}} 元</span> -->
      实付金额:
      <span class='joyMoney'>{{shopPrice | price2}} 元</span>
      <x-button class='exchangeBtn'
                mini
                @click.native="exchangeFn">支付</x-button>
    </div>

  </div>
</template>

<script>
import { Group, Cell, XButton } from "vux"
import { log } from "util"
export default {
  mounted() {
    this.setTitle("填写订单")
    this.getCoupons()
    this.init()
    if (this.orderAddrObj) {
      //编辑状态赋值
      var Obj = JSON.parse(this.orderAddrObj)
      this.exchangeParams.addressId = Obj.id
      this.addressData.name = Obj.name
      this.addressData.phone = Obj.phone
      this.addressData.address = Obj.address
      this.addressData.province = Obj.province
      this.addressData.city = Obj.city
      if (Obj.proCity) {
        //　如果是从新添加的地址跳过来，就直接显示拼合地址
        this.addressData.address = Obj.proCity + Obj.address
      } else {
        // 否则就拼一堆
        if (Obj.distict) {
          //　如果有区
          this.addressData.address =
            Obj.province + Obj.city + Obj.distict + Obj.address
        } else {
          this.addressData.address = Obj.province + Obj.city + Obj.address
        }
      }
      this.hasAddress = true
    } else {
      this.getDefaultAddr()
    }
  },
  data() {
    return {
      showCouponList: false, // 切换显示couponlist
      checkedCouponId: null, // 选中的coupon
      couponsList: [], // 可用优惠券列表
      addressId: 0,
      countNum: 1,
      money: 0,
      goodsId: this.$route.query.id,
      orderAddrObj: this.$route.query.addrObj,
      hasAddress: false,
      addressData: {},
      shopData: {},
      shopPrice: 0,
      payMethod: 1,
      exchangeParams: {}
    }
  },
  methods: {
    init() {
      this.$http.get("h9/store/goods/" + this.$route.query.id).then(res => {
        if (res.data.code == 0) {
          this.shopData = res.data.data
          this.calShouldPayPrice()
        }
      })
    },
    // 点击某个优惠券时
    handleCouponItem(id) {
      if (this.checkedCouponId === id) {
        this.checkedCouponId = null
      } else {
        this.checkedCouponId = id
      }
      this.calShouldPayPrice()
    },
    // 计算应该付的总金额
    calShouldPayPrice() {
      if (this.checkedCouponId) {
        this.shopPrice = this.shopData.price * (this.countNum - 1)
      } else {
        this.shopPrice = this.shopData.price * this.countNum
      }
    },
    // 指定商品可用优惠券列表
    getCoupons() {
      this.$http
        .get(`/h9/api/user/coupons?goodsId=${this.goodsId}`)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.length > 0) {
              this.couponsList = res.data.data
              this.checkedCouponId = this.couponsList[0].id
              this.shopPrice = 0
              this.calShouldPayPrice()
            }
          }
        })
    },
    getDefaultAddr: function() {
      this.$http.get("h9/api/address/default").then(res => {
        if (res.data.code == 0) {
          if (res.data.data) {
            this.hasAddress = true
            this.addressData = res.data.data
            let data = res.data.data
            this.addressData.address =
              data.province + data.city + data.distict + data.address
            this.exchangeParams.addressId = res.data.data.id
          }
        }
      })
    },
    goAddrList: function() {
      if (this.hasAddress) {
        this.$router.push({
          path: "/addrList",
          query: { goodsId: this.goodsId, fromOrder: true }
        })
      } else {
        this.$router.push({
          path: "/addrChange",
          query: { goodsId: this.goodsId, fromOrder: true }
        })
      }
    },
    count: function(type) {
      if (type === "minus") {
        this.countNum--
      } else {
        if (this.countNum === this.shopData.stock) {
          _g.toastMsg("error", "库存不足")
          return
        }
        this.countNum++
      }
      this.calShouldPayPrice()
    },
    exchangeFn: function() {
      if (
        this.payMethod == 1 &&
        parseFloat(this.shopData.balance) < parseFloat(this.shopPrice)
      ) {
        _g.toastMsg("error", "酒元余额不足，请使用微信支付")
        return
      }
      this.exchangeParams.count = this.countNum
      this.exchangeParams.goodsId = this.goodsId
      this.exchangeParams.payMethod = this.payMethod
      this.exchangeParams.payPlatform = "wxjs"
      this.exchangeParams.couponsId = this.checkedCouponId
      _g.showLoading("支付中")
      this.$http
        .post("h9/store/goods/convert", this.exchangeParams)
        .then(res => {
          _g.hideLoading()
          if (res.data.code == 0) {
            let activityName = res.data.data.activityName
            let lotteryChance = res.data.data.lotteryChance
            let goodsCount = this.exchangeParams.count
            if (
              this.payMethod == 1 ||
              (this.exchangeParams.couponsId && !res.data.data.resumePaywxjs)
            ) {
              this.$router.replace({
                path: "/account/result",
                query: {
                  type: "shopExchange",
                  money: res.data.data.price,
                  goodsName: res.data.data.goodsName,
                  activityName,
                  lotteryChance,
                  goodsCount
                }
              })
            } else {
              const url = window.location.href.split("#")[0]
              let callbackurl =
                url +
                "#/account/result?type=shopExchange&money=" +
                res.data.data.price +
                "&goodsName=" +
                res.data.data.goodsName +
                "&activityName=" +
                activityName +
                "&lotteryChance=" +
                lotteryChance +
                "&goodsCount=" +
                goodsCount
              let callbackFail =
                url +
                "#/my/orderDetail?orderId=" +
                res.data.data.wxPayInfo.orderId // 失败回调
              callbackurl = encodeURIComponent(callbackurl) // encode
              callbackFail = encodeURIComponent(callbackFail) // encode
              let link =
                res.data.data.wxPayInfo.payUrl +
                "&callback=" +
                callbackurl +
                "&callbackFail=" +
                callbackFail
              window.location.replace(link)
            }
          }
        })
    }
  },
  components: {
    Group,
    Cell,
    XButton
  }
}
</script>
<style scoped lang='less'>
.coupon-list {
  padding: 20/40rem 0;
  margin: 0 20/40rem;
  border-top: 1/40rem solid #f2f2f2;
  .coupon-item {
    overflow: hidden;
    width: 100%;
    height: 120/40rem;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url("../../assets/img/shop/coupon_bg.png");
    &.active {
      background-image: url("../../assets/img/shop/coupon_bg_active.png");
    }
    & > div {
      float: left;
    }
    .name {
      height: 3rem;
      width: 200/40rem;
      line-height: 3em;
      text-align: center;
      font-size: 1rem;
      color: #333333;
    }
    .desc {
      margin-left: 1rem;
      margin-top: 0.5rem;
      .title {
        font-size: 28/40rem;
        color: #333333;
        margin-bottom: 10/40rem;
        padding: 0;
      }
      .over-date {
        font-size: 22/40rem;
        color: #888888;
      }
    }
    .check-icon {
      float: right;
      margin-right: 40/40rem;
      margin-top: 35/40rem;
      height: 50/40rem;
      width: 50/40rem;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url("../../assets/img/shop/icon_check_coupon.png");
    }
  }
}
.shopOrderPage {
  overflow-y: auto;
  .title {
    padding: 30/40rem;
  }
  .orderAddr {
    height: 165/40rem;
    line-height: 45/40rem;
    background: url("../../assets/img/shop/changtiao.png") center bottom
      no-repeat;
    background-size: 100%;
  }
  .phone {
    color: #627984;
  }
  .shopgoodBox {
    background: #fff;
    padding: 30/40rem 30/40rem 20/40rem;
    margin: 20/40rem 0;
    line-height: 50/40rem;
    font-size: 30/40rem;
    img {
      width: 120/40rem;
      height: 120/40rem;
      margin-right: 30/40rem;
    }
    .joyMoney {
      font-size: 36/40rem;
      color: #627984;
      margin-top: 20/40rem;
    }
    .num {
      margin-top: 70/40rem;
    }
    .numBlock {
      padding: 25/40rem 0;
      border-bottom: 2/40rem solid #f2f2f2;
    }
    .total {
      text-align: right;
      padding: 30/40rem 0 10/40rem;
    }
    .totalMoney {
      margin-left: 20/40rem;
    }
    .numEditBlock {
      display: inline-block;
      float: right;
      .text {
        margin: 0 20/40rem;
      }
    }
    .numMinus,
    .numAdd,
    .numMinusBlack {
      display: inline-block;
      width: 40/40rem;
      height: 40/40rem;
      vertical-align: middle;
    }
    .numMinus {
      background: url("../../assets/img/shop/jianhao_cai.png");
      background-size: 100%;
    }
    .numMinusBlack {
      background: url("../../assets/img/shop/jianhao_hui.png");
      background-size: 100%;
    }
    .numAdd {
      background: url("../../assets/img/shop/jiahao.png");
      background-size: 100%;
    }
  }
  .shopOrderMsgBox {
    background: #fff;
  }
  .ordeTotal {
    border-top: 2/40rem solid #f2f2f2;
    font-size: 30/40rem;
    padding: 34/40rem 0;
    margin: 0 30/40rem;
    span {
      float: right;
      color: #627984;
    }
    .arrow {
      position: relative;
      top: -3px;
      float: right;
      height: 1.5rem;
      width: 60/40rem;
      background-image: url("../../assets/img/shop/arr_bottom.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      &.top {
        background-image: url("../../assets/img/shop/arr_top.png");
      }
    }
  }
  .shopPayBox {
    background: #fff;
    margin-bottom: 100/40rem;
    p {
      padding: 35/40rem 30/40rem;
      font-size: 30/40rem;
    }
    .payIcon {
      display: inline-block;
      width: 36/40rem;
      height: 36/40rem;
      float: right;
    }
  }
  .unSet {
    background: url("../../assets/img/addr/oval_copy2.png");
    background-size: 100%;
  }
  .hasSet {
    background: url("../../assets/img/addr/queding.png");
    background-size: 100%;
  }
  .orderBottom {
    position: fixed;
    bottom: 0;
    border-top: 1px solid #efefef;
    height: 120/40rem;
    line-height: 120/40rem;
    background: #fff;
    font-size: 30/40rem;
    text-align: right;
    width: 100%;
    .exchangeBtn {
      background: #627984;
      color: #fff;
      border-radius: 0;
      float: right;
      height: 120/40rem;
      margin-left: 40/40rem;
      font-size: 26/40rem;
      padding: 0 1.6rem;
    }
  }
}
</style>
<style lang='less'>
.orderAddr .vux-label {
  font-size: 30/40rem;
}
.shopOrderMsgBox {
  .vux-label,
  .weui-cell__ft {
    font-size: 30/40rem;
    padding: 15/40rem 0;
  }
  .joyMoneyCell {
    .weui-cell__ft {
      color: #627984;
    }
  }
}
</style>
