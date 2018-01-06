<template>
  <div class="page">
    <tab bar-active-color="#627984" :line-width="1" :custom-bar-width="getBarWidth">
      <tab-item active-class="active-tab" selected @on-item-click="handleTab(0)">全部</tab-item>
      <tab-item active-class="active-tab" @on-item-click="handleTab(1)">有效单</tab-item>
      <tab-item active-class="active-tab" @on-item-click="handleTab(2)">待支付</tab-item>
      <tab-item active-class="active-tab" @on-item-click="handleTab(3)">退款单</tab-item>
    </tab>
    <scroller lock-x height="-45" ref="scroller" @on-scroll-bottom="loadMore"
              :scroll-bottom-offst="150">
      <div class="box2">
        <ul>
          <li class="order-item" v-for="i in list">
            <p class="top">
              <span class="name">7天优品酒店</span>
              <span class="status">预订成功</span>
            </p>
            <div class="middle">
              <div class="left">
                <p class="time-range">12月13日—12月14日</p>
                <p class="desc">
                  <span>1间</span>
                  <span>1晚</span>
                  <span>1优品大床房</span>
                </p>
              </div>
              <div class="right">￥122</div>
            </div>
            <div class="bottom">
              <span class="confirm">确认支付</span>
            </div>
          </li>
        </ul>
        <load-more tip="加载更多" v-if="showLoading"></load-more>
        <divider v-if="!hasMore">没有更多</divider>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {Tab, TabItem, Scroller, LoadMore, Divider} from 'vux'

  export default {
    created() {
    },
    data() {
      return {
        tabType: 0,  // 当前选择的是哪个tab
        list: 1,  // 列表
        limit: 10,  // 每页分页
        page: 1,  // 第几页
        hasMore: false, // 是否有更多
        showLoading: false, // 显示加载更多提示
        getBarWidth: function (index) { // 动态计算每个bar条的宽
          if (index === 0) {
            return 33 + 'px'
          } else {
            return 44 + 'px'
          }
        }
      }
    },
    methods: {
      // tab切换时 0 全部，1有效，2，待支付，3 退款
      handleTab(type) {
        this.tabType = type
        this.page = 1
        this.getList()
      },
      /**
       * 获取列表数据
       * @param type [如果是加载更多，就是true]
       */
      getList(type) {
        let api = this.chooseApi()
        this.$http.get(api + `?page=${this.page}&limit=${this.limit}`).then(res => {
          this.$nextTick(() => {  // 刷新高度
            this.$refs.scroller.reset()
          })
        })
      },
      chooseApi() { // 使用哪个api请求列表
        switch (this.tabType) {
          case 0:
            return 'xxx'
          case 1:
            return 'xxx'
          case 2:
            return 'xxx'
          case 3:
            return 'xxx'
        }
      },
      loadMore() {  // 上拉加载更多
        if (!this.hasMore) {
          return
        }
        if (this.onFetching) { // 正在加载
          return
        } else {
          this.onFetching = true
          this.showLoading = true
          setTimeout(() => {
            ++this.page
            this.getList()
            this.list += 10
            this.$nextTick(() => {
              this.$refs.scroller.reset()
            })
            this.onFetching = false
            this.showLoading = false
          }, 1500)
        }
      }
    },
    components: {
      Tab,
      TabItem,
      Scroller,
      LoadMore,
      Divider
    }
  }
</script>
<style scoped lang='less'>
  .page {
    height: 100%;
    line-height: 1;
    background: #EDF1F2;
    position: relative;
  }

  .active-tab {
    color: #627984 !important;
  }

  .box2 {
    padding-bottom: 30px;
  }

  .order-item {
    margin-top: 8px;
    background: #fff;
    .top {
      height: 38px;
      line-height: 38px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f2f2f2;
      .name {
        font-size: 15px;
        color: #333333;
      }
      .status {
        font-size: 12px;
        color: #627984;
      }
    }

    .middle {
      padding: 15px;
      font-size: 12px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        .time-range {
          margin-bottom: 12px;
        }
        .desc {
          color: #999999;
        }
      }
      .right {
        font-size: 18px;
      }
    }

    .bottom {
      border-top: 1px solid #f2f2f2;
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      .confirm {
        float: right;
        margin-right: 15px;
        margin-top: 10px;
        width: 73px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #627984;
        border-radius: 4px;
        font-size: 15px;
        color: #627984;
      }
    }
  }
</style>

<style lang="less">
  .vux-divider {
    font-size: 12px;
    color: #999999;
  }
</style>
