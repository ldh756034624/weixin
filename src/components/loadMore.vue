<template>
  <div class="page particularPage">
    <div class="scroll-wrap">
      <scroller lock-x
                v-show='hasItem'
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
          <div class="data-list"
               v-for='item in dataList'
               :key="item.ordersId"
               @click="handleDetail(item.ordersId)">
            <div class="left">
              <p class="time">{{item.startLotteryTime}} {{item.number}}期</p>
              <p class="status">{{item.way}}
                <span v-if="item.status !== 1">{{item.status | statusFilter}}</span>
                <span v-else>{{item.money}}酒元</span>
              </p>
            </div>
            <div class="right"></div>
          </div>
        </div>
        <pull-header-footer v-if="showStatusFooter"
                            :status-up="pullupStatus"
                            :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
      <blankPage v-show='!hasItem'></blankPage>
    </div>
  </div>
</template>
<script>
import blankPage from "@/components/blankPage"
import PullHeaderFooter from "@/components/pullHeaderFooter"
import { Scroller } from "vux"

export default {
  props: {
    dataUrl: {
      type: String,
      default: ""
    },
    particularsStr: {
      type: String
    },
    typeStr: {
      type: String
    }
  },
  mounted() {
    this.init(1)
  },
  data() {
    return {
      dataList: [],
      hasItem: true,
      showStatusFooter: false // 底部没有更多等数据状态栏
    }
  },
  methods: {
    // 查看订单详情
    handleDetail(id) {
      this.$router.push(`/my/orderDetail?orderId=` + id)
    },
    /**
     * @param page [页码]
     */
    init(page) {
      let self = this
      if (page === 1) {
        self.dataList = []
      }
      let url = this.dataUrl + "?page=" + page + "&limit=20"
      this.$http.get(url).then(function(res) {
        let datalist = res.data.data.data // 数据列表
        let pageInfo = res.data.data // 数据页面信息
        if (res.data.code == 0) {
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
        }
        setTimeout(() => {
          self.$refs.scroller.donePullup()
          if (!self.page.hasNext) {
            self.$refs.scroller.disablePullup()
          }
          if (pageInfo.currPage == 1) {
            self.$refs.scroller.reset({ top: 0 }, 500, "ease")
          }
        }, 100)
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
    }
  },
  filters: {
    statusFilter(type) {
      if (type === 1) {
        return "中奖"
      } else if (type === 2) {
        return "待抽奖"
      } else {
        return "未中奖"
      }
    }
  },
  components: {
    Scroller,
    PullHeaderFooter,
    blankPage
  }
}
</script>

<style scoped lang='less'>
.particularPage {
  background: #fff;
}
.data-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #888888;
  .left {
    .time {
      margin-bottom: 5px;
      font-size: 28/40rem;
      color: #888888;
    }
    .status {
      font-size: 30/40rem;
      color: #333333;
    }
  }
  .right {
    height: 36/40rem;
    width: 36/40rem;
    background-image: url("../assets/img/active/right_arrow_@2x.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
}
p {
  margin: 0;
  line-height: 1;
}
</style>
