<template>
  <div class="page myCollectionPage">
      <tab :line-width=2    active-color='#38446a' >
        <tab-item selected @on-item-click="onItemClick">闲置</tab-item>
        <tab-item @on-item-click="onItemClick">拍卖</tab-item>
        <tab-item @on-item-click="onItemClick">捐赠</tab-item>
      </tab>
      <div class="scroll-wrap">
          <scroller v-show='hasItem'
            lock-x
            :pullup-config="pulldefaultConfig"
            :pulldown-config="pulldefaultConfig"
            use-pullup
            use-pulldown
            height="100%"
            :pullup-status="pullupStatus"
            :pulldown-status="pulldownStatus"
            @on-pullup-loading="loadMore"
            @on-pulldown-loading="refresh"
            ref="detailScroller"
            @input="getCurrentValue">
            <!--content slot-->
            <div class="mycollectScroller">
                <div v-for='item in myCollectionData' class="myPublishList">
                    <div>
                        <myGoods :gooddata='item' :table-id='goodTableId'></myGoods>
                    </div>
                    <div class="mypublishBtn">
                        <span @click='uncollect(item.id)'>取消收藏</span>
                    </div>
                </div>
            </div>
            <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
          </scroller>
          
      </div>
      <blankPage  :text='text' v-show='!hasItem' :images='blankImg'> </blankPage>
  </div>
</template>
<script>
import {Tab, TabItem, Scroller} from 'vux'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import myGoods from '@/components/myGoods'
import blankPage from '@/components/blankPage'
// var url = require('aUrl')
export default {
  mounted(){
    this.setTitle('我收藏的');
    this.init(1)
  },
  data () {
    return {
      myCollectionData:[],
      type:'idleGoods',
      tableId:1,
      goodTableId:0,
      hasItem:true,
      text:'您还没有收藏的商品,去逛逛哈~',
      blankImg:require('../../assets/img/blank/collection.png')
    }
  },
  methods:{
    onItemClick(index){
      let self=this;
      self.goodTableId=index;
      self.tableId=index+1;
      this.myCollectionData = []
      this.page.currPage = 1
      self.init(1,true)
    },
    uncollect(id){
      let self=this;
      var datas={
        goodId:id,
        status:0,
        tableId:self.tableId
      }
      self.$http.post('/sh/ja/v1/favorites/update',datas)
        .then(function(res) {
          if(res.data.statusCode==0){
            self.init(self.tableId)
            self.$vux.toast.show({
                text:  res.data.msg,
                type: 'text',
            })
          }
        })
    },
    init(nowPage,isTableSelect){
      let self=this;
      if (nowPage === 1) {
        self.myCollectionData = []
      }
      self.$http.get('/sh/ja/v1/favorites/'+self.tableId+'/list', {params: {page: nowPage, limit:self.page.limit}})
        .then(function(res) {
          if(res.data.statusCode==0){
              if(res.data.data.data.length>0){
                  self.hasItem=true
                  self.myCollectionData = [...self.myCollectionData, ...res.data.data.data]
                  self.page.totalpage = res.data.data.totalpage;
                  if(res.data.data.hasNext){
                      self.page.currPage++;
                  }
                  self.page.hasNext = res.data.data.hasNext;

                  if(isTableSelect){
                    self.$nextTick(() => {
                    })
                  }
              }else{
                  self.hasItem=false
              }
              
          } else {
            self.$vux.toast.show({
                text: res.data.msg,
                type: 'text',
            })
          }
          self.$nextTick(()=>{
            self.listenScroller();

            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
            self.$refs.detailScroller.reset({top: 0},500, 'ease');
          });
        })
    },
    getCurrentValue(value){
        this.pullupStatus = value.pullupStatus;
        this.pulldownStatus = value.pulldownStatus;
     },
     listenScroller(){
       this.$nextTick(()=>{
       this.$refs.detailScroller._xscroll.on('scroll',(e)=> {
          let scrolly = this.$refs.detailScroller._xscroll.getScrollTop();
          this.$refs.detailScroller._xscroll.resetSize()
        });
      });
     },
     loadMore () {
      if(this.page.hasNext){
          setTimeout(() => {
            this.init(this.page.currPage,false)
          }, 2000)
      }
    },
    refresh () {
      setTimeout(() => {
        this.init(1,true);
      }, 2000)
    }
  },
   components: {
    myGoods, Tab, TabItem, Scroller, PullHeaderFooter,blankPage
  }
}

</script>

<style scoped lang='less'>
    .myPublishList,.myCollectionPage{
      background-color: #fff;
    }
    .mypublishBtn{
      text-align: right;
      border-top: 1px solid #e2e2e2;
      padding: 0.5rem 0;
    }
    .mypublishBtn span{
      display: inline-block;
      width: 150/40rem;
      height: 54/40rem;
      line-height: 54/40rem;
      margin-right: 20/40rem;
      border-radius: 30/40rem;
      border: 1px solid #979797;
      text-align: center;
      font-size: 30/40rem;
    }
    .scroll-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 49px;
    overflow: hidden;
  }
  .mycollectScroller{
      padding-bottom: 50/40rem;
    }
</style>

