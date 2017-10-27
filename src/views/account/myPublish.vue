<template>
	<div class="page myPublishPage">
      <tab :line-width=2    active-color='#38446a' >
        <tab-item selected @on-item-click="onItemClick">闲置</tab-item>
        <tab-item @on-item-click="onItemClick">拍卖</tab-item>
        <tab-item @on-item-click="onItemClick">捐赠</tab-item>
      </tab>
      <group class='marginFt'>
        <cell title="已下架" v-if='status==0' is-link @click.native='outedFn'></cell>
        <cell title="已上架" v-if='status==1' is-link @click.native='shelvesFn'></cell>
      </group>
      <div class="scroll-wrap">
        <scroller lock-x
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
             <div class='mypublishScroller'>
                <div v-for='item in myPublishData' class="myPublishList">
                    <p class="shelvesDesc" v-if='status==1'>{{item.downReason}}</p>
                    <myGoods :gooddata='item' :table-id='tableId' ref="scrollerx"></myGoods>
                    <div v-if='tableId!=1'>
                        <div class="mypublishBtn" v-if='status==0'>
                            <span @click='edit(item.id)'>编辑</span>
                            <span @click='showMoreFn(item.id)'>• • •</span>
                        </div>
                        <div class="mypublishBtn" v-if='status==1'>
                            <span @click='handleFn(item.id,0)' v-if='item.downType==0'>重新上架</span>
                            <span @click='handleFn(item.id,3)'>删除</span>
                        </div>
                    </div>
                    <div v-if='tableId==1'>
                        <div class="mypublishBtn" v-if='status==1'>
                            <!-- <span @click='handleFn(item.id,0)'>重新上架</span> -->
                            <span @click='handleFn(item.id,3)'>删除</span>
                        </div>
                    </div>
                </div>
          </div>
          <pull-header-footer :status-up="pullupStatus" :status-down="pulldownStatus"></pull-header-footer>
         </scroller>
      </div>
      <div v-transfer-dom>
          <popup v-model='showmore' class='showmore' height='100%' @click.native='showmore=false' >
              <div class="showmoreBox">
                  <div class="showMorediv">
                     <button class="outBtn" @click='handleFn(-1,1)'>下架</button>
                     <button class="deleteBtn" @click='handleFn(-1,3)'>刪除</button>
                  </div>
                  <div class="showMorediv">
                      <button class="cancelBtn" @click='showmore=false'>取消</button>
                  </div>
              </div>
          </popup>
      </div>
      <confirm v-model="show" title="是否删除该商品？" @on-confirm="handleFn2"> </confirm>
      <confirm v-model="show2" title="提示" @on-confirm="handleFn2">是否下架该商品？可在已下架商品列表找到.</confirm>
      <confirm v-model="show3" title="提示" @on-confirm="handleFn2">是否上架该商品？</confirm>
      <blankPage  :text='text' v-show='!hasItem' :images='blankImg'> </blankPage>
  </div>
</template>
<script>
import {Tab, TabItem,Popup,Group,Cell,Scroller,TransferDom, Confirm} from 'vux'
import myGoods from '@/components/myGoods'
import PullHeaderFooter from '@/components/pullHeaderFooter'
import blankPage from '@/components/blankPage'
// var url = require('aUrl')
export default {
  directives: {
    TransferDom
  },
  mounted(){
    this.setTitle('我发布的');
    this.init(this.type,this.page.currPage,false)
  },
  data () {
    return {
      myPublishData:[],
      type:'idleGoods',
      showmore:false,
      tableId:0,
      show:false,
      show2:false,
      show3:false,
      id:0,
      status:0,
      status2:0,
      hasItem:true,
      text:'暂时没有发布商品,去发布吧~',
      blankImg:require('../../assets/img/blank/publish.png')
    }
  },
  methods:{
    onItemClick(index){
      let self=this;
      self.myPublishData = []
       self.showmore=false;
      self.tableId=index;
      if(index==0){
        self.type='idleGoods'
      }else if(index==1){
        self.type='auctions'
      }else{
        self.type='donation'
      }
      self.page.currPage = 1
       self.init(self.type,1,true)
    },
    edit(id){
      let self=this;
      if(self.tableId==0){
          self.$router.push({path:'/unused/publish',query:{id:id,tableType:'idleGoods',publishType:self.tableId+1}})
      }else if(self.tableId==1){
          self.$router.push({path:'/sale/publish',query:{id:id,tableType:'auctions',publishType:self.tableId+1}})
      }else if(self.tableId==2){
          self.$router.push({path:'/donate/publish',query:{id:id,tableType:'donation',publishType:self.tableId+1}})
      }

    },
    init(type,nowPage,isTableSelect){
      let self=this;
      if (nowPage == 1) {
        self.myPublishData = []
      }
      self.$http.get('/sh/ja/v1/'+type+'/myRelease?status='+self.status+"&page="+nowPage+"&limit="+self.page.limit)
        .then(function(res) {

          if(res.data.statusCode==0){
              // self.myPublishData=res.data.data.data;
              self.myPublishData = [...self.myPublishData, ...res.data.data.data]
              if(self.myPublishData.length>0){
                self.hasItem=true;
              }else{
                self.hasItem=false;
              }
              self.page.totalpage = res.data.data.totalpage;
              if(res.data.data.hasNext){
                  self.page.currPage++;
              }
              self.page.hasNext = res.data.data.hasNext;

              if(isTableSelect){
                self.$nextTick(() => {
                  self.$refs.detailScroller.reset({top: 0},500, 'ease');
                })
              }
          } else {
            self.$vux.toast.show({
                text: res.data.msg,
                type: 'text',
            })
          }
          self.$nextTick(()=>{
            self.$refs.detailScroller.donePullup();
            if(!self.page.hasNext){
              self.$refs.detailScroller.disablePullup();
            }
          });
          
        })
    },
    loadMore () {
      let self=this;
      if(self.page.hasNext){
          setTimeout(() => {
            self.init(this.type,this.page.currPage,false)
          }, 2000)
      }
    },
    refresh () {
      let self=this;
      setTimeout(() => {
        self.init(this.type,1,true);
      }, 2000)
    },
    showMoreFn(id){
        let self=this;
        self.id=id;
        self.showmore=true
    },
    //已下架
    outedFn(){
      let self=this;
      self.status=1;
      this.init(self.type,1,true);
    },
    //已上架
    shelvesFn(){
      let self=this;
      self.status=0;
      this.init(self.type,1,true);
    },
    handleFn(id,status){
      if (status==3) {
        this.show = true
      }else if (status==0) {
        this.show3 = true
      } else {
        this.show2 = true
      }
      if(id==-1){
          this.goodId=this.id
      }else{
        this.goodId=id
      }
      this.status2 = status
    },
    //上架0，下架1,删除3
    handleFn2(){
      let self=this;
      var curl=''

      if (self.tableId==0) {
        curl='/sh/ja/v1/idleGoods/'+this.goodId+'/'+this.status2+'/status' //闲置
      }else if(self.tableId==1){
        curl='/sh/ja/v1/auctions/'+this.goodId+'/'+this.status2+'/status' //拍卖
      }else{
        curl='/sh/ja/v1/donation/'+this.goodId+'/'+this.status2+'/status' //捐赠
      }
      self.$http.post(curl)
        .then(function(res) {

          if(res.data.statusCode==0){
              self.showmore=false;
              self.init(self.type,1,true);
          }else{
              self.showmore=true;
          }
           self.$vux.toast.show({
                text: res.data.msg,
                type: 'text',
            })
        })
    }

  },
   components: {
    myGoods,Tab,TabItem,Popup,Group,Cell,Scroller,PullHeaderFooter,Confirm,blankPage
  },
}

</script>

<style scoped lang='less'>
    .shelvesDesc{
      margin-left: 30/40rem;
      font-size: 28/40rem
    }
    .myPublishList{
      margin-top: 20/40rem;
    }
    .mypublishBtn{
      text-align: right;
      border-top: 1px solid #e2e2e2;
      padding: 0.5rem 0;
      background-color: #fff;
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
      font-size: 34/40rem;
    }
    .marginFt{
      margin-top: -20/40rem;
    }
    .showmoreBox{
      padding: 0 120/40rem;
      position: absolute;
      bottom: 0;
      width: 68%;
    }
    .showmoreBox .showMorediv:first-child{
      margin-bottom: 15/40rem;
    }
    .showMorediv{
      background-color: #fff;
      color: #999;

      border:1px solid #999;
       border-radius: 10/40rem;

    }
    .showMorediv button{
      padding: 20/40rem;
      border:none;
      width: 100%;
      background-color: #fff;

    }
    .showMorediv .outBtn{
      border-radius: 10/40rem 10/40rem 0 0;
      border-bottom: 1px solid #ddd
    }
    .showMorediv .deleteBtn{
      border-radius: 0 0 15/40rem 15/40rem ;
    }
    .showMorediv .cancelBtn{
      border-radius: 15/40rem
    }
    .scroll-wrap{
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    top: 100px;
    overflow: hidden;
  }
  .mypublishScroller{
      padding-bottom: 45/40rem;
    }
</style>
<style lang='less'>
    .myPublishPage .vux-popup{
        background-color: rgba(0,0,0,.0);
    }
    .showmore{
      background: transparent!important;
        &.vux-popup-dialog{
            background-color: transparent!important;
            background-color: transparent!important;
        }
        &.vux-popup{
           background-color: transparent!important;
           background: transparent!important;
        }
    }

</style>