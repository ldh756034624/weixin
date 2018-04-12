<template>
  <div class="page mycupon">
    <div class="scroll-wrap">
      <tab :line-width="1"
           class="tab"
           bar-active-color="#E60012"
           custom-bar-width="60px">
        <tab-item selected
                  @click.native="changeTab(1)">未使用</tab-item>
        <tab-item @click.native="changeTab(2)">已使用</tab-item>
        <tab-item @click.native="changeTab(3)">已过期</tab-item>
      </tab>
      <scroller lock-x
                height="-44"
                v-show='hasItem'
                :pullup-config="pulldefaultConfig"
                use-pullup
                :pullup-status="pullupStatus"
                @on-pullup-loading="loadMore"
                ref="detailScroller"
                use-pulldown
                @on-pulldown-loading="refresh"
                :pulldown-config="pulldefaultConfig"
                :pulldown-status="pulldownStatus"
                @input="getCurrentValue">
        <div class="coupon-wrapper">
          <ul>
            <li class="coupon-item"
                :class="state !== 1 && 'over-date'"
                :key="index"
                v-for="(item, index) in mycuponData">
              <div class="top">
                <div class="title">{{item.couponType}}</div>
                <div class="desc">
                  <p>{{item.useType}}</p>
                  <p>{{item.endTime}} 到期</p>
                </div>
                <div class="button-use"
                     v-if="state == 1"
                     @click="handleUseCoupon(item.goodsId)">立即使用</div>
              </div>
              <p class="bottom">{{item.wide}}</p>
            </li>
          </ul>
        </div>
        <pull-header-footer :status-up="pullupStatus"
                            :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
      <blankPage v-show='!hasItem'
                 :blankType='type'></blankPage>
    </div>
  </div>
</template>
<script>
import blankPage from "@/components/blankPage"
import PullHeaderFooter from "@/components/pullHeaderFooter"
import { Scroller, XButton, Tab, TabItem } from "vux"

export default {
  mounted() {
    this.setTitle("我的优惠券")
    this.init(1)
  },
  data() {
    return {
      mycuponData: [],
      hasItem: true,
      type: "cupon",
      state: 1 // 使用状态 1未使用 2已使用 3已过期
    }
  },
  methods: {
    init(page) {
      let self = this
      if (page === 1) {
        self.mycuponData = []
      }
      self.$http
        .get(
          "h9/api/user/coupon/" +
            this.state +
            "?page=" +
            page +
            "&limit=" +
            self.page.limit
        )
        .then(function(res) {
          if (res.data.code == 0) {
            if (res.data.data.data.length > 0) {
              self.mycuponData = [...self.mycuponData, ...res.data.data.data]
              self.hasItem = true
            } else {
              self.hasItem = false
            }
            self.page.totalpage = res.data.data.totalPage
            if (res.data.data.hasNext) {
              self.page.currPage++
            }
            self.page.hasNext = res.data.data.hasNext
          }
          self.$nextTick(() => {
            self.$refs.detailScroller.donePullup()
            if (!self.page.hasNext) {
              self.$refs.detailScroller.disablePullup()
            }
            if (res.data.data.currPage == 1) {
              self.$refs.detailScroller.reset({ top: 0 }, 500, "ease")
            }
          })
        })
    },
    loadMore() {
      let self = this
      if (self.page.hasNext) {
        setTimeout(() => {
          self.init(self.page.currPage)
        }, 2000)
      }
    },
    refresh() {
      let self = this
      setTimeout(() => {
        self.init(1)
      }, 2000)
    },
    goOrderDetail: function() {
      this.$router.push({ path: "/my/orderDetail" })
    },
    // 切换tab时
    changeTab(state) {
      this.state = state
      this.init(1)
    },
    handleUseCoupon(goodid) {
      this.$router.push({ path: "/shopDataile", query: { id: goodid } })
    }
  },
  components: {
    PullHeaderFooter,
    Scroller,
    blankPage,
    XButton,
    Tab,
    TabItem
  }
}
</script>
<style scoped lang='less'>
.mycupon {
  .coupon-wrapper {
    padding: 0.5rem;
    .coupon-item {
      padding-left: 30/40rem;
      margin-bottom: 0.5rem;
      width: 100%;
      height: 6rem;
      box-sizing: border-box;
      background: url("../../assets/img/account/youhuiquanBg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      &.over-date {
        background-image: url("../../assets/img/account/youhuiquanBg_over.png");
      }
      .top {
        overflow: hidden;
        div {
          float: left;
        }
        .title {
          margin-top: 1.55rem;
          font-size: 50/40rem;
          color: #333333;
        }
        .desc {
          margin-left: 1.4rem;
          margin-top: 1.35rem;
          font-size: 28/40rem;
          color: #333333;
          & p:last-child {
            margin-top: 0.3rem;
            font-size: 24/40rem;
            color: #888888;
          }
        }
        .button-use {
          position: absolute;
          top: 100/40rem;
          right: 30/40rem;
          height: 1.4rem;
          line-height: 1.4rem;
          text-align: center;
          font-size: 26/40rem;
          color: #fff;
          width: 140/40rem;
          border-radius: 100/40rem;
          background: #e60012;
        }
      }
      .bottom {
        position: absolute;
        font-size: 24/40rem;
        color: #666666;
        bottom: 14/40rem;
        left: 30/40rem;
      }
    }
  }
}
</style>

<style lang='less'>
.mycupon {
  .vux-tab .vux-tab-item {
    color: #999;
  }
  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #e60012;
  }
}
</style>
