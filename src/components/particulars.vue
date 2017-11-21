<template>
  <div class="page particularPage">
    <div class="scroll-wrap">

      <scroller lock-x v-show='hasItem'
                :pullup-config="pulldefaultConfig"
                use-pullup
                height="100%"
                :pullup-status="pullupStatus"
                @on-pullup-loading="loadMore"
                ref="detailScroller"
                use-pulldown
                @on-pulldown-loading="refresh"
                :pulldown-config="pulldefaultConfig"
                :pulldown-status="pulldownStatus"
                @input="getCurrentValue">
        <div>
          <div v-for='(item,index) in particularsData'>
            <div v-if="particularsStr!=='hongbao'">
              <div v-if='index==0'>
                <p class="blockTips">{{item.month}}</p>
              </div>
              <div v-else>
                <p class="blockTips" v-if='item.month!=particularsData[index].month'>{{item.month}}</p>
              </div>
            </div>
            <div class="flexBox">
              <img :src="item.imgUrl" v-if="particularsStr!=='hongbao'"/>
              <div class="flex1">
                <p class="tipText">{{item.remarks}}</p>
                <p class="date">{{item.createTime}}</p>
              </div>
              <span :class="item.money >= 0 ? 'redFont' : 'blueFont'">
                <span v-if="item.money > 0">+</span>{{item.money | price2}}
              </span>
            </div>
          </div>
        </div>
        <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
      <blankPage v-show='!hasItem' :blankType='type'></blankPage>

    </div>
  </div>
</template>
<script>
  import blankPage from '@/components/blankPage'
  import PullHeaderFooter from '@/components/pullHeaderFooter'
  import {Scroller} from 'vux'

  export default {
    mounted() {
      let self = this;
      self.init(1)
    },
    props: {
      particularsUrl: {
        type: String,
        default: ""
      },
      particularsStr: {
        type: String,
      }
    },
    data() {
      return {
        particularsData: [],
        hasItem: false,
        type: 'particulars'
      }
    },
    methods: {
      init(page) {
        let self = this
        if (page === 1) {
          self.particularsData = []
        }
        self.$http.get(self.particularsUrl + '?page=' + page + '&limit=10')
          .then(function (res) {
            if (res.data.code == 0) {
              if (res.data.data.data.length > 0) {
                self.particularsData = [...self.particularsData, ...res.data.data.data]
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
              self.$refs.detailScroller.donePullup();
              if (!self.page.hasNext) {
                self.$refs.detailScroller.disablePullup();
              }
              if (res.data.data.currPage == 1) {
                self.$refs.detailScroller.reset({top: 0}, 500, 'ease');
              }
            });
          })
      },
      prizeFn: function () {

      },
      scanFn: function () {

      },
      loadMore() {
        let self = this;
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

    },
    components: {
      Scroller, PullHeaderFooter, blankPage
    },
  }

</script>

<style scoped lang='less'>

  .particularPage {
    background: #fff;
    .blockTips {
      background: #f2f2f2;
    }
    .flexBox {
      padding: 30/40rem;
      margin: 0 30/40rem;
      background: #fff;
      border-top: 1px solid #f2f2f2;
      margin-top: -2/40rem;
      line-height: 80/40rem;
    }
    .flex1 {
      line-height: 40/40rem;
    }
    img {
      width: 80/40rem;
      height: 80/40rem;
      margin-right: 20/40rem;
    }
    .tipText {
      font-size: 32/40rem;
      color: #333;
    }
    .date {
      font-size: 24/40rem;
      color: #999;
    }
    .blueFont {
      color: #5ECFBB;
    }
    .redFont {
      color: #E57B7B;
    }
  }

</style>
