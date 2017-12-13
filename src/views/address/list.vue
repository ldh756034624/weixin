<template>
		<div class="page addrListPage">
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
          <div class="marginB">
            <div class="addrListBox" v-for='item in addressListData' v-if='item.status===1'>
              <div @click='chooseAddrFn(item)'>
                <p><span class='name'>{{item.name}}</span> {{item.phone}}</p>
                <p class="area">{{item.province}}{{item.city}}{{item.distict}}{{item.address}}</p>
              </div>
              <div class="flexBox editBox">
                <p class="flex1" @click='defaultFn(item)' v-if='!fromOrder'>
                  <i class='icon' :class="[item.defaultAddress===1 ? 'hasSet':'unSet']"></i>
                  默认地址
                </p>
                <span @click='editFn(item)' class='flex1'>
                  <i class='editIcon'></i>
                  编辑
                </span>
                <span @click='delFn(item)' v-if='!fromOrder'>
                  <i class='delIcon'></i>
                  删除
                </span>
              </div>
            </div>
          </div>
          <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
        </scroller>
      </div>
      <footer>
        <router-link :to="{path:'addrChange',query:{goodsId:goodsId, fromOrder}}">
          <div>
            <x-button class='bottomBtn gradientBtn'>添加新地址</x-button>
          </div>
        </router-link>
      </footer>
      <blankPage v-show='!hasItem' :blankType='type'></blankPage>
		</div>
</template>

<script>
import blankPage from '@/components/blankPage'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import { Scroller,XButton} from 'vux'
export default {
  mounted() {
    this.setTitle('收货地址');
    this.init(1);
  },
  data() {
    return {
      type: 'address',
      hasItem:false,
      goodsId:this.$route.query.goodsId,
      fromOrder:this.$route.query.fromOrder,
      addressListData:[]
    }
  },
  methods:{
    init(page) {
      let self = this
      if (page === 1) {
        self.addressListData = []
      }
      self.$http.get('h9/api/address/allAddresses?page=' + page + '&limit=10')
        .then((res)=> {
          if (res.data.code == 0) {
            if (res.data.data.data.length > 0) {
              self.addressListData = [...self.addressListData, ...res.data.data.data]
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
    chooseAddrFn:function(item){
      if(this.$route.query.fromOrder){
        console.log('item', item)
        this.$router.replace({path:'/shopOrder',query:{id:this.goodsId,addrObj:JSON.stringify(item)}})
      }
    },
    defaultFn:function(item){
      this.$http.put('h9/api/address/default/'+item.id)
        .then((res)=> {
          _g.toastMsg('error','设定成功')
          this.init(1)
        })
    },
    editFn:function(item){
      this.$router.replace({path:'/addrChange',query:{goodsId:this.goodsId,isEdit:true,fromOrder:this.$route.query.fromOrder,addrObj:JSON.stringify(item)}})
    },
    delFn:function(item){
      let self=this;
      this.$vux.confirm.show({
        content:'确定要删除该地址吗?',
        onConfirm () {
          self.$http.put('h9/api/address/delete/'+item.id)
        .then((res)=> {
          //_g.toastMsg('error','删除成功')
          self.init(1)
        })
        }
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
  },
  components: {
    XButton,blankPage,Scroller,PullHeaderFooter
  }
}
</script>
<style scoped lang='less'>
  .addrListPage{
    overflow-y:auto;
    .addrListBox{
      background: #fff;
      font-size: 30/40rem;
      margin-bottom: 20/40rem;
      line-height: 50/40rem;
      padding: 50/40rem 30/40rem 0
    }
    .marginB{
      padding-bottom: 110/40rem;
    }
    .name{
      margin-right: 50/40rem;
    }
    .area{
      font-size: 24/40rem;
      color: #999;
      padding-bottom: 50/40rem;
      border-bottom: 2/40rem solid #f2f2f2
    }
    .editBox{
      padding: 25/40rem 0;
      span{
        margin-left: 50/40rem;
        text-align: right;
      }
    }
    .icon,.editIcon,.delIcon{
      display: inline-block;
      vertical-align: middle;
      margin-right: 10/40rem;
    }
    .icon{
      width: 31/40rem;
      height: 31/40rem;
    }
    .editIcon,.delIcon{
      width: 41/40rem;
      height: 41/40rem;
      margin-top: -10/40rem;
    }
    .unSet{
      background: url('../../assets/img/addr/oval_copy2.png');
      background-size: 100%;
    }
    .hasSet{
      background: url('../../assets/img/addr/queding.png');
      background-size: 100%;
    }
    .editIcon{
      background: url('../../assets/img/addr/bianji.png');
      background-size: 100%;
    }
    .delIcon{
      background: url('../../assets/img/addr/delete.png');
      background-size: 100%;
    }
    .bottomBtn {
      height: 100/40rem;
      line-height: 100/40rem;
      color: #fff;
      position: fixed;
      bottom: 0;
      z-index: 9;
      border-radius: 0;
      width: 100%;
      text-align: center;
      font-size: 32/40rem;
    }
  }
</style>
