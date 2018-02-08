<template>
  <div class="page">
    <scroller lock-x ref="scroller" @on-scroll-bottom="loadMore"
              :scroll-bottom-offst="150">
      <div class="box2">
        <ul>
          <li class="order-item" v-for="item in list">
            <div class="left">
              <p class="date">{{item.createTime}}</p>
              <p class="time">{{item.hour}}</p>
            </div>
            <div class="right">+{{item.cashBack}}</div>
          </li>
        </ul>
        <load-more tip="加载更多" v-if="showLoading"></load-more>
        <divider v-if="!hasMore">没有更多</divider>
      </div>
    </scroller>
  </div>
</template>
<script>
  import {Scroller, XDialog, XButton, Divider, LoadMore} from 'vux'

  export default {
    created() {
      this.setTitle('签到记录');
      this.getList()
    },
    data() {
      return {
        list: [],
        hasMore: false,
        showLoading: false,
        listQuery: {
          limit: 10,  // 每页分页
          page: 1  // 第几页
        },
      }
    },
    methods: {
      /**
       * 获取列表数据
       * @param more [如果是加载更多，就是true]
       */
      getList(more) {
        let params = this.listQuery
        this.$http.get('h9/api/sign/selfSign', {params}).then(res => {
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
      }
    },
    components: {
      XDialog, Scroller, XButton, Divider, LoadMore
    },
  }

</script>

<style scoped lang='less'>
  .page {
    line-height: 1;
    background: #f2f2f2;
  }

  ul {
    margin-top: 15px;
    background: #fff;
  }

  .order-item {
    height: 70px;
    margin: 0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .date {
      font-size: 15px;
      color: #333333;
      margin-bottom: 10px;
    }
    .time {
      font-size: 15px;
      color: #999999;
    }
    .right {
      font-size: 16px;
      color: #BFB182;
    }
  }
</style>

<style lang="less">
  .vux-divider {
    font-size: 12px;
    color: #999999;
  }
</style>
