<template>
  <div class="page">
    <!--顶部搜索框-->
    <div class="top-wrapper">
      <i class="icon-back" @click="goBack"></i>
      <div class="search-wrapper">
        <div class="select-city" @click="handleCityList">
          <span class="city-name">{{query.city}}</span>
          <i class="icon-arrow-bottom" :class="showCity ? 'selecting' : ''"></i>
        </div>
        <div class="search-input">
          <input type="text" placeholder="酒店名/地址/关键词" v-model="query.queryKey">
        </div>
      </div>
    </div>
    <!--城市列表栏-->
    <transition name="fade">
      <div class="city-wrapper" v-if="showCity">
        <scroller lock-x :bounce="false">
          <div class="city-list">
            <ul>
              <li v-for="item in cityList" @click="handleChooseCity(item)">{{item}}</li>
            </ul>
          </div>
        </scroller>
        <div class="mask" @click="showCity = false"></div>
      </div>
    </transition>
    <!--酒店搜索出来的列表-->
    <div class="list-wrapper">
      <scroller lock-x height="-45" ref="scroller" @on-scroll-bottom="loadMore"
              :scroll-bottom-offst="150">
        <div>
          <ul>
            <li class="hotel-item" v-for="item in hotelList" @click="handleHotel(item)">
              <img :src="item.image" class="hotel-img">
              <div class="hotel-info">
                <p class="top">
                  <span class="name">{{item.hotelName}}</span>
                  <span class="rate">{{item.grade}}分</span>
                </p>
                <p class="middle">
                  {{item.detailAddress}}
                </p>
                <p class="bottom" v-if="item.discount">
                  <span class="brand">{{item.discount}}折</span>
                </p>
              </div>
              <div class="hotel-price">
                <span>{{item.minConsumer}}</span>起
              </div>
            </li>
          </ul>
          <load-more tip="加载更多" v-if="showLoading"></load-more>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {Scroller, LoadMore} from 'vux'
  export default {
    data() {
      return {
        hotelList: [], // 酒店列表
        cityList: [], // 待选择的城市列表
        query: {
          queryKey: '',
          city: '深圳', // todo 默认值？
          page:1,
          limit:10
        },
        hasMore: false, // 是否有更多
        showCity: false,  // 显示城市列表
        showLoading: false, // 显示加载更多提示
      }
    },
    created() {
      this.getCityList()
      this.getList()
    },
    mounted() {
      
    },
    methods: {
      /**
       * 获取酒店列表
       * @param page [页码]
       */
      getList(more) {
        let params = this.query
        this.$http.get('/h9/api/hotels', {params}).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.hasMore = data.data.hasNext
            if (more) {
              this.hotelList = [...this.hotelList, ...data.data.data]
            } else {
              this.hotelList = data.data.data
            }
          }
          this.$nextTick(() => {  // 请求数据后刷新高度
            if(data.data.currPage === 1){
              this.$refs.scroller.reset({top:0},500, 'ease')
            }else{
              this.$refs.scroller.reset()
            }
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
            ++this.query.page
            this.getList(true)
            this.onFetching = false
            this.showLoading = false
          }, 1500)
        }
      },
      // 获取城市列表
      getCityList() {
        this.$http.get('/h9/api/hotel/city').then(res => {
          let data = res.data
          if (data.code === 0) {
            this.cityList = data.data
          }
        })
      },
      // 后退
      goBack() {
        this.$router.back()
      },
      // 展开城市列表
      handleCityList() {
        this.showCity = !this.showCity
      },
      // 选择城市区域
      handleChooseCity(item) {
        this.query.page = 1
        this.query.city = item
        this.getList()
        this.showCity = false
      },
      // 选择酒店
      handleHotel(item) {
        this.$router.push({path: '/hotel/detail', query: {id: item.id, hotelName: item.hotelName}})
      }
    },
    watch: {
      // 监听输入框关键字
      'query.queryKey'() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 发起请求
          this.getList()
        }, 1000)
      },
    },
    components: {
      Scroller,
      LoadMore
    },
  }

</script>

<style scoped lang='less'>
  .page {
    height: 100%;
    position: relative;
    line-height: 1;
    background: #fff;
  }

  .top-wrapper {
    padding: 5px 15px 6px 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    .icon-back {
      margin-right: 4px;
      height: 30px;
      width: 30px;
      background-size: 100% 100%;
      background-image: url("../../assets/img/account/btn_back.png");
    }
    .search-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      background: #f1f1f1;
      .select-city {
        flex: 0 0 83px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 53px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-right: 1px solid #d8d8d8;
        font-size: 14px;
        color: #627984;
        .icon-arrow-bottom {
          display: inline-block;
          margin-left: 3px;
          margin-top: -2px;
          width: 10px;
          height: 12px;
          background-size: 100% 100%;
          background-image: url("../../assets/img/hotel/xia@2x.png");
          &.selecting {
            background-image: url("../../assets/img/hotel/shang@2x.png");
          }
        }
      }
      .search-input {
        flex: 1;
        input {
          height: 34px;
          width: 100%;
          font-size: 14px;
          background: #f1f1f1;
          border: none;
          text-indent: 10px;
        }
      }
    }
  }

  .list-wrapper {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    .hotel-item {
      position: relative;
      padding: 12px 0;
      margin: 0 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;
      .hotel-img {
        width: 80px;
        height: 80px;
        margin-right: 15px;
      }
      .hotel-info {
        width: 70%;
        .top {
          margin-bottom: 12px;
          font-size: 15px;
          font-weight: bold;
          .name {
            margin-right: 8px;
            color: #333333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rate {
            color: #627984;
          }
        }
        .middle {
          margin-bottom: 12px;
          font-size: 12px;
          color: #999999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bottom {
          & > span {
            display: inline-block;
            height: 16px;
            line-height: 16px;
            padding: 0 5px;
            background: #E57B7B;
            color: #fff;
            font-size: 10px;
          }
        }
      }
      .hotel-price {
        position: absolute;
        right: 0;
        bottom: 12px;
        font-size: 12px;
        color: #999999;
        & > span {
          font-size: 24px;
          color: #E57B7B;
        }
      }
    }
  }

  .city-wrapper {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    z-index: 10;
    overflow: hidden;
    height: 100%;
    .city-list {
      
      background: #fff;
      li {
        overflow-y: auto;
        height: 50px;
        line-height: 50px;
        padding-left: 30px;
        font-size: 15px;
        color: #627984;
      }
    }
    .mask {
      height: 100%;
      background: rgba(0, 0, 0, .4);
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
