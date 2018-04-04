<template>
  <div class="page"
       v-if="userInfo">
    <scroller lock-x
              :pullup-config="pulldefaultConfig"
              use-pullup
              height="100%"
              :pullup-status="pullupStatus"
              @on-pullup-loading="loadMore"
              ref="scroller"
              @on-pulldown-loading="refresh"
              :pulldown-config="pulldefaultConfig"
              :pulldown-status="pulldownStatus"
              @input="getCurrentValue">
      <div>
        <div class="top">
          <div class="rule-wrapper"
               @click="handleRule">
            <img src="../../assets/img/active/huodongguize@2x.png"
                 width="18"
                 height="18">
            <p>活动规则</p>
          </div>
          <p class="getchance"
             @click="handleGetReword">
            {{userInfo.lotteryChance ? '有1次抽奖机会' : '获取抽奖机会'}}
            <i class="icon-right"
               v-if="!userInfo.lotteryChance"></i>
          </p>
          <p class="total-price"
             @click="handleRecord">
            累计中奖金额
            <span class="big-red">{{userInfo.bigRichMoney}}元</span>
            <i class="icon-right"></i>
          </p>
        </div>
        <p class="title">往期开奖记录</p>
        <div class="user-wrapper">
          <p class="list-title">
            <span class="sp1">用户</span>
            <span class="sp2">中奖金额</span>
            <span class="sp3">开奖时间</span>
          </p>
          <ul>
            <li class="user-list"
                v-for="(item, index) in dataList"
                v-if="item"
                :key="index">
              <span class="sp1 no-wrap">{{item.userName}}</span>
              <span class="sp2">{{item.lotteryMoney}}元</span>
              <span class="sp3">{{item.startLotteryTime}}</span>
            </li>
          </ul>
        </div>
      </div>
      <pull-header-footer v-if="showStatusFooter"
                          :status-up="pullupStatus"
                          :status-down="pulldownStatus"></pull-header-footer>
    </scroller>
  </div>
</template>
<script>
import { Scroller } from "vux"
import PullHeaderFooter from "@/components/pullHeaderFooter"

export default {
  created() {
    this.firstIn = true
    this.setTitle("1号大富贵")
  },
  mounted() {
    this.init(1)
  },
  data() {
    return {
      userInfo: null,
      dataList: [],
      showStatusFooter: false // 底部没有更多等数据状态栏
    }
  },
  methods: {
    // 去获取抽奖机会
    handleGetReword() {
      if (!this.userInfo.lotteryChance) {
        this.$router.push("/shop")
      }
    },
    init(page) {
      let self = this
      if (page === 1) {
        self.dataList = []
      }
      if (this.firstIn) {
        this.timer = setTimeout(() => {
          _g.showLoading()
        }, 500)
      }
      let url = "h9/api/bigrich/record" + "?page=" + page + "&limit=20"
      this.$http.get(url).then(res => {
        let datalist = res.data.data.recordList.data // 数据列表
        let pageInfo = res.data.data.recordList // 数据页面信息
        if (res.data.code == 0) {
          this.userInfo = res.data.data
          if (this.firstIn) {
            clearTimeout(self.timer)
            self.timer = null
            _g.hideLoading()
            this.firstIn = false
          }
          if (datalist.length > 0) {
            self.dataList = [...self.dataList, ...datalist]
            self.hasItem = true
          } else {
            self.hasItem = false
          }
          self.page.totalpage = pageInfo.totalPage
          if (pageInfo.hasNext) {
            self.page.currPage++
          }
          self.page.hasNext = pageInfo.hasNext
          console.log(pageInfo)
        }

        setTimeout(() => {
          self.$refs.scroller.donePullup()
          if (!self.page.hasNext) {
            self.$refs.scroller.disablePullup()
          }
          if (pageInfo.currPage == 1) {
            self.$refs.scroller.reset({ top: 0 }, 500, "ease")
          }
        }, 50)
      })
    },
    loadMore() {
      let self = this
      self.showStatusFooter = true
      if (self.page.hasNext) {
        setTimeout(() => {
          self.init(self.page.currPage)
        }, 1000)
      }
    },
    refresh() {
      let self = this
      setTimeout(() => {
        self.init(1)
      }, 1000)
    },
    // 去开奖记录
    handleRecord() {
      this.$router.push("/active/oneRichRecord")
    },
    // 去活动规则介绍
    handleRule() {
      this.$router.push("/account/descDetail?code=" + "bigRichRules")
    }
  },
  components: {
    Scroller,
    PullHeaderFooter
  }
}
</script>

<style scoped lang='less'>
p {
  line-height: 1;
}
.top {
  background: #fff;
  position: relative;
  height: 145px;
  text-align: center;
  .rule-wrapper {
    position: absolute;
    right: 10px;
    top: 18px;
    font-size: 11px;
    color: #888888;
  }
  .getchance {
    display: flex;
    justify-content: center;
    padding-top: 30px;
    font-size: 16px;
    color: #000000;
    margin-bottom: 20px;
  }
  .total-price {
    font-size: 14px;
    color: #333;
    .big-red {
      color: red;
      font-size: 28px;
    }
  }
}
.user-wrapper {
  background: #fff;
  font-size: 14px;
  color: #666666;
  .list-title {
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    height: 44px;
    line-height: 44px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    color: #333333;
    font-weight: bold;
  }
  .user-list:last-child {
    border-bottom: none;
  }
  .sp1 {
    overflow: hidden;
    display: inline-block;
    width: 85px;
    @media screen and(max-width: 320px) {
      margin-right: 15px;
    }
    margin-right: 44px;
  }
  .sp2 {
    overflow: hidden;
    display: inline-block;
    width: 65px;
  }
  .sp3 {
    float: right;
    width: 119px;
    height: 100%;
    line-height: 42px;
    text-align: right;
  }
}
.icon-right {
  display: inline-block;
  margin-left: 5px;
  width: 18px;
  height: 18px;
  background-image: url("../../assets/img/account/right_arrow_@2x.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.title {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #666666;
  margin-left: 15px;
}
.user-list {
  display: flex;
  justify-content: space-between;
  padding-right: 15px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  margin-left: 15px;
  color: #666;
}
</style>
