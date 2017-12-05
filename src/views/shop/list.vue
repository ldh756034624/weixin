<template>
  <div class="page shopLisPage">
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
        <div class="mrgT10">
          <div v-for='(item,index) in particularsData'  >
            <router-link :to="{path:'/shopDataile',query:{id:item.id}}">
              <div class="shopListBox flexBox">
                <img :src="item.img"/>
                <div class='flex1'>
                  <p>{{item.name}}</p>
                  <p class="joyMoney">{{item.price}}酒元</p>
                </div>
                <x-button class='exchangeBtn' mini>兑换</x-button>
              </div>
            </router-link>
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
  import {Scroller,XButton} from 'vux'

  export default {
    mounted() {
      this.init(1)
      this.setTitle(this.$route.query.title)
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
        type: 'particulars',
      }
    },
    methods: {
      init(page) {
        let self = this
        if (page === 1) {
          self.particularsData = []
        }
        self.$http.get('h9/store/goodsList?type='+ this.$route.query.type+'&page=' + page + '&limit=10')
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
      Scroller, PullHeaderFooter, XButton,blankPage
    },
  }

</script>

<style scoped lang='less'>
  .shopLisPage{
    .mrgT10{
      margin-top: 20/40rem;
    }
    .shopListBox{
      background: #fff;
      padding: 30/40rem;
      font-size: 30/40rem;
      border-bottom: 2/40rem solid #f2f2f2;
      img{
        width: 120/40rem;
        height: 120/40rem;
        margin-right: 30/40rem;
      }
      .joyMoney{
        font-size: 36/40rem;
        margin-top: 10/40rem;
        color: #627984;
      }
      .exchangeBtn{
        background: #627984;
        border: none;
        color: #fff;
        border-radius: 10/40rem;
        height: 72/40rem;
        line-height: 72/40rem;
        margin-top: 20/40rem;
      }
    }
  }
</style>
