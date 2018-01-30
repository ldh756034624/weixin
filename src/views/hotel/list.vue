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
      <scroller lock-x ref="scroll" 
                :pullup-config="pulldefaultConfig"
                use-pullup
                :pullup-status="pullupStatus"
                @on-pullup-loading="loadMore"
                use-pulldown
                @on-pulldown-loading="refresh"
                :pulldown-config="pulldefaultConfig"
                :pulldown-status="pulldownStatus"
                @input="getCurrentValue"
                height="-46">
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
        </div>
        <pull-header-footer v-if="showStatusFooter" :status-up="pullupStatus"
                            :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {Scroller} from 'vux'
  import PullHeaderFooter from '@/components/pullHeaderFooter'
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
        showCity: false,  // 显示城市列表
        showStatusFooter: false  // 底部没有更多等数据状态栏
      }
    },
    created() {
      this.getCityList()
      this.init(1)
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.scroll.reset()
      })
    },
    methods: {
      /**
       * 获取酒店列表
       * @param page [页码]
       */
      init(page) {
        let self = this
        if (page === 1) {
          self.hotelList = []
        }
        this.query.page = page
        let params = this.query
        console.log(params)
        self.$http.get('/h9/api/hotels',{params})
          .then(function (res) {
            if (res.data.code == 0) {
              if (res.data.data.data.length > 0) {
                self.hotelList = [...self.hotelList, ...res.data.data.data]
                self.hasItem = true
              } else {
                self.hasItem = false
              }
              self.page.totalpage = res.data.data.totalPage;
              if (res.data.data.hasNext) {
                self.page.currPage++;
              }
              self.page.hasNext = res.data.data.hasNext;
            }
            self.$nextTick(() => {
              self.$refs.scroll.donePullup();
              if (!self.page.hasNext) {
                self.$refs.scroll.disablePullup();
              }
              if (res.data.data.currPage == 1) {
                self.$refs.scroll.reset({top: 0}, 500, 'ease');
              }
            });
          })
      },
      loadMore() {
        let self = this;
        self.showStatusFooter = true
        if (self.page.hasNext) {
          setTimeout(() => {
            self.init(self.page.currPage)
          }, 2000)
        }
      },
      refresh() {
        let self = this;
        setTimeout(() => {
          self.init(1);
        }, 2000)
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
        this.query.city = item
        this.showCity = false
        this.init(1)
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
          this.init()
        }, 1000)
      },
    },
    components: {
      Scroller,
      PullHeaderFooter
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
