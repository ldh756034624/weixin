<template>
  <div class="page">
    <tab bar-active-color="#627984" :line-width="1" :custom-bar-width="getBarWidth">
      <tab-item active-class="active-tab" selected @on-item-click="handleTab(1)">我发布的</tab-item>
      <tab-item active-class="active-tab" @on-item-click="handleTab(2)">我回复的</tab-item>
      <tab-item active-class="active-tab" @on-item-click="handleTab(3)">我打赏的</tab-item>
    </tab>
    <scroller lock-x height="-45" ref="scroller" @on-scroll-bottom="loadMore"
              :scroll-bottom-offst="150">
      <div class="box2">
        <ul>
          <li class="one" v-if="type === 1" v-for="(item, index) in list" :key="index" @click="handleDetail(item.id)">
            <div class="title">
              <div class="info">
                <img :src="item.avatar" class="avatar">
                <span class="name">{{item.nickName}}</span>
              </div>
              <div class="time">{{item.createTime}}</div>
            </div>
            <p class="content">{{item.title}}</p>
            <div class="image-wrapper">
              <img :src="img" v-for="img in item.images" class="cover">
            </div>
            <div class="other-wrapper">
              <span class="type">#{{item.typeName}}#</span>
              <span class="read">阅读 {{item.readCount}}</span>
              <span class="reply">回复 {{item.answerCount}}</span>
              <span class="reward">打赏 {{item.rewardCount}}</span>
            </div>
          </li>
          <li class="two" v-if="type === 2" v-for="(item, index) in list" :key="index" @click="handleDetail(item.id)">
            <p class="title">
              <span class="time">{{item.createTime}}</span>
            </p>
            <p class="reply-content">
              {{item.content}}
            </p>
            <div class="post-wrapper">
              <img src="" class="post-cover">
              <div class="post-detail">
                <p class="text">
                  {{item.title}}
                </p>
                <p class="author">发布者：{{item.stickNickName}}</p>
              </div>
            </div>
          </li>
          <li class="two" v-if="type === 3" v-for="(item, index) in list" :key="index" @click="handleDetail(item.id)">
            <p class="title">
              <span class="time">{{item.createTime}}</span>
              <span class="money"><i class="money-icon"></i>{{item.reward}}酒元</span>
            </p>
            <p class="reply-content">
              {{item.words}}
            </p>
            <div class="post-wrapper">
              <img src="" class="post-cover">
              <div class="post-detail">
                <p class="text">
                  {{item.stickTitle}}
                </p>
                <p class="author">发布者：{{item.stickUserName}}</p>
              </div>
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
      this.api = '/h9/api/personalStick/push' // 默认为我发布的api
      this.getList()
    },
    data() {
      return {
        type: 1,    // 1 我发布的，2我回复的，3我打赏的
        list: [],  // 类型1的列表
        listQuery: {
          limit: 10,  // 每页分页
          page: 1  // 第几页
        },
        hasMore: false, // 是否有更多
        showLoading: false, // 显示加载更多提示
        getBarWidth: function (index) { // 动态计算每个bar条的宽
          return 60 + 'px'
        }
      }
    },
    methods: {
      // tab切换时 1 我发布的，2我回复的，3我打赏的
      handleTab(type) {
        this.type = type
        this.listQuery.page = 1
        this.list = []
        if (type === 1) { // 切换api
          this.api = '/h9/api/personalStick/push'
        } else if (type === 2) {
          this.api = '/h9/api/personalStick/comment'
        } else {
          this.api = 'h9/api/personalStick/giveReward'
        }
        this.getList()
      },
      /**
       * 获取列表数据
       * @param more [如果是加载更多，就是true]
       */
      getList(more) {
        _g.showLoading()
        let params = this.listQuery
        this.$http.get(this.api, {params}).then(res => {
          _g.hideLoading()
          let data = res.data
          if (data.code === 0) {
            this.hasMore = data.data.hasNext
            if (more) {
              this.list = [...this.list, ...data.data.data]
            } else {
              this.list = data.data.data
            }
          }

          this.$nextTick(() => {  // 请求数据后刷新高度
            this.$refs.scroller.reset()
          })
        })
      },
      // 查看订单详情
      handleDetail(id) {
        console.log(id)
        if (id) {
          this.$router.push({path: '/hotel/orderDetail', query: {id}})
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
            ++this.listQuery.page
            this.getList(true)
            this.onFetching = false
            this.showLoading = false
          }, 1500)
        }
      },
      // 去支付
      goPay(id) {
        this.$router.push({path: '/hotel/pay', query: {id}})
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

  .one {
    margin-top: 10px;
    background: #fff;
    padding: 15px;
    .title {
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info {
        font-size: 14px;
        color: #666666;
        img {
          height: 25px;
          width: 25px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }
      }
      .time {
        font-size: 12px;
        color: #999999;
      }
    }
    .content {
      margin-bottom: 9px;
      font-size: 18px;
      color: #333333;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .image-wrapper {
      margin-bottom: 10px;
      .cover {
        height: 90px;
        width: 90px;
        margin-right: 10px;
      }
    }
    .other-wrapper {
      position: relative;
      .type {
        margin-right: 15px;
        font-size: 12px;
        color: #2687D5;
      }
      .read, .reply {
        margin-right: 15px;
        font-size: 12px;
        color: #999999;
      }
      .reward {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 12px;
        color: #627984;
      }
    }
  }

  .two {
    margin-top: 10px;
    background: #fff;
    padding: 15px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .time {
        font-size: 12px;
        color: #999999;
      }
      .money {
        font-size: 15px;
        color: #666666;
        display: flex;
        align-items: center;
        .money-icon {
          margin-right: 5px;
          height: 20px;
          width: 20px;
          background-size: 100% 100%;
          background-image: url("../../assets/img/bbs/icon-money@2x.png");
        }
      }
    }
    .reply-content {
      margin-top: 10px;
      font-size: 15px;
      color: #333333;
    }
    .post-wrapper {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      background: #f2f2f2;
      padding: 10px;
      .post-cover {
        display: block;
        height: 80px;
        width: 80px;
        flex: 0 0 80px;
      }
      .post-detail {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .text {
          font-size: 12px;
          color: #666666;
          line-height: 16px;
        }
        .author {
          text-align: right;
          font-size: 12px;
          color: #666666;
        }
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
