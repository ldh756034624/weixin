<template>
  <div class="page mycupon">
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
          <div class="cuponListBox" v-for="item in mycuponData">
            <div class="flexBox cuponBox">
              <div class="flex1 flexBox">
                <img :src="item.imgUrl"/>
                <div class="flex1">
                  <p class="name TextEllipsis">{{item.name}}</p>
                  <p class="money">{{item.price}}元</p>
                </div>
              </div>
              <div class="exchangeBox">
                <p class="num">{{item.status}}</p>
                <p class="num">{{item.createTime}}</p>
              </div>
            </div>
            <p class="flexBox copy">券号:
              <span class='cuponNum TextEllipsis'>{{item.cardNumber}} </span>
              <span class="flex1 alignR">
                        <x-button mini class='blueBg' @click.native="copyFn(item.cardNumber)">复制券号</x-button>
                    </span>
            </p>
          </div>
        </div>
        <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
      </scroller>
      <blankPage v-show='!hasItem' :blankType='type'></blankPage>
      <input type="text" ref="copyInput" class="copy-input">
    </div>
  </div>
</template>
<script>
  import blankPage from '@/components/blankPage'
  import PullHeaderFooter from '@/components/pullHeaderFooter'
  import {Scroller, XButton} from 'vux'

  export default {
    mounted() {
      this.setTitle('我的卡券');
      this.init(1);
    },
    data() {
      return {
        mycuponData: [],
        hasItem: false,
        type: 'cupon'
      }
    },
    methods: {
      init(page) {
        let self = this
        self.$http.get('h9/api/account/didicoupons?page=' + page + '&limit=' + self.page.limit)
          .then(function (res) {
            if (res.data.code == 0) {
              if (res.data.data.data.length > 0) {
                self.mycuponData = [...self.mycuponData, ...res.data.data.data]
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
      goOrderDetail: function () {
        this.$router.push({path: '/my/orderDetail'})
      },
      copyFn(code) {
        let input = this.$refs.copyInput
        input.value = code
        input.select()
        document.execCommand('Copy')
        _g.toastMsg('error', '复制成功')
      }
    },
    components: {
      PullHeaderFooter, Scroller, blankPage, XButton
    },
  }

</script>

<style scoped lang='less'>
  .mycupon {

    .LeastMoneyBox {
      padding: 30/40rem 0;
      font-size: 28/40rem;
      span {
        font-size: 24/40rem;
        color: #999;
      }
    }
    img {
      width: 100/40rem;
      height: 100/40rem;
      margin-right: 20/40rem;
    }
    .cuponListBox {
      border-radius: 10/40rem;
      background: #fff;
      margin: 30/40rem;
      border: 1px solid #f2f2f2;
      margin-bottom: 20/40rem;
    }
    .cuponBox {
      .flexBox {
        padding: 40/40rem 30/40rem 45/40rem;
      }
    }
    .name {
      font-size: 32/40rem;
      margin-bottom: 6/40rem;

    }
    .money {
      font-size: 28/40rem;
    }
    .num {
      font-size: 24/40rem;
      margin-bottom: 6/40rem;
      color: #999;
      text-align: right;
    }
    .exchangeBox {
      display: inline-block;
      padding: 40/40rem 1rem 45/40rem;
      text-align: center;
    }
    .copy {
      font-size: 24/40rem;
      padding: 15/40rem 30/40rem;
      border-top: 1px solid #f2f2f2;
      color: #999;
      .blueBg {
        font-size: 24/40rem;
        padding: 0 25/40rem;
      }
    }
    .cuponNum {
      width: 9.5rem;
      height: 1rem;
      -webkit-line-clamp: 1;
    }
    .copy-input {
      position: absolute;
      left: 0;
      top: 0;
      height: 1px;
      width: 1px;
      opacity: 0;
    }
  }
</style>
