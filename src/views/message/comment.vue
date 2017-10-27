<template>
<div class="page" transition="app">
    <!--header slot-->
    <div class="vux-demo-header-box vux-1px-b" slot="header">
      <x-header :left-options="{showBack:true,backText:''}" :transition="headerTransition">留言</x-header>
    </div>

    <div class="content comment vux-1px-t">
      <!-- 留言列表 -->
      <div class="empty" v-if="commentData.length==0 && loading.show == false">
        <!-- <img src="../../assets/img/tips_sad.png"> -->
        <div class="text">暂无您的留言</div>
      </div>
      <scroller v-if="commentData.length>0" lock-x scrollbar-y use-pullup use-pulldown @pullup:loading="loadMore" height="100%" @pulldown:loading="refresh" :pullup-status.sync="pullupStatus" v-ref:scroller :pulldown-config="pulldownConfig">
        <ul>
          <li v-for="cmt in commentData" class="vux-1px-b" v-link="'/detail/'+cmt.goodId">
            <div class="comment-wrap">
              <div class="nick">{{cmt.nick}}给你留言</div>
              <div class="time">{{cmt.commentTime}}</div>
              <div class="ct font-one-line-ellipsis">{{cmt.comments}}</div>
              <img class="thumb" v-bind:src="cmt.goodImage">
              <div v-if="cmt.readFlag==0" class="readflag"></div>
            </div>
          </li>
        </ul>
        <!--pullup slot-->
        <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
          <span v-show="pullupStatus === 'default'"></span>
          <span class="pullup-arrow" v-show="pullupStatus === 'down' || pullupStatus === 'up'" :class="{'rotate': pullupStatus === 'up'}">上拉刷新</span>
          <span v-show="pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
    </scroller>
  </div>

  <!-- toast 提示 -->
  <toast :show.sync="toast.show" type="text" :time="1000" :callback="callback">
    <p v-text="toast.msg"></p>
  </toast>

  <!-- loading -->
  <loading :show="loading.show" :text="loading.msg"></loading>
</div>
</template>

<script>
import { XHeader ,Scroller,Loading, Spinner} from 'vux-components'
// var url = require('aUrl');
export default {
  ready () {
    this.setTitle("留言");
    let self=this;
    if(localStorage.token){
      this.requestData();
    }else{
      this.$route.router.go({path:'/login',query:{
        path:'/comment',
      }});
    }
  },
  data() {
    return {
      toast : {
        show : false,
        msg: '验证码发送成功'
      },
      loading: {
        msg: '加载中...',
        show: true
      },
      commentData: [],
      page: {
        totalpage: 1,
        currPage: 1,
        limit: 10,
        hasNext: true
      },
      pulldownConfig:{
        content: '下拉刷新',
        downContent: '释放刷新',
        upContent: '下拉刷新',
        loadingContent: '刷新中'
      },
      pullupStatus: 'default'
    };
  },
  methods:{
    init: function () {
      let self =  this;
    },
    requestData: function(uuid){    //获取商品评论 
      let self = this
      let rcmurl = "/sh/ja/v1/comments";
      self.$http.get(rcmurl,{page: self.page.currPage,limit: self.page.limit})
      .then(function(res) {
        if(self.page.hasNext){
          if(self.page.currPage<=1){
            if(!uuid){
              self.commentData = res.data.data;
            }else{
              setTimeout(() => {
                self.commentData = res.data.data;
                self.$nextTick(() => {
                  self.$broadcast('pulldown:reset', uuid)
                })
              }, 2000)
            }
          }else{
            setTimeout(() => {
              self.commentData = self.commentData.concat(res.data.data);
              self.$nextTick(() => {
                self.$broadcast('pullup:reset', uuid)
              });
            }, 2000)
          }
          self.page.totalpage = res.data.totalpage;
          self.page.currPage ++;
          self.page.hasNext = res.data.hasNext; 
        }else{
          setTimeout(() => {
            self.$nextTick(() => {
              self.$broadcast('pulldown:reset', uuid)
            })
          }, 2000)
        }
        self.loading.show = false;
      });
    },
    loadMore (uuid) {
      if(this.page.hasNext){
        this.requestData(uuid);
      }else{
        setTimeout(() => {
          this.$nextTick(() => {
            this.$broadcast('pullup:reset', uuid)
            document.querySelector(".pullup-arrow").innerHTML="没有更多数据...";
          })
        }, 2000)
      }
      
    },
    refresh (uuid) {
      this.page.currPage = 1;
      this.requestData(uuid);
    }
  },
  components: {
    XHeader,
    Scroller,
    Loading,
    Spinner
  }
}
</script>
<style scoped lang="less">
  .content{bottom: 0}
  // .scroll-box{
  //   position: absolute;
  //   overflow: hidden;
  //   top: 0; 
  //   bottom: 0;
  //   width: 100%;
  //   left: 0;
  // }
  .comment{
    .empty{
      text-align: center;
      img{
        margin-top: 300/40rem;
        width: 190/40rem;
        height: 200/40rem;
      }
    }
    .comment-wrap{
      padding-right: 150/40rem;
    }
    ul{
      li{
        position: relative;
        padding: 20/40rem 30/40rem;
        height: 140/40rem;
        line-height: 1.2;
        .nick{
          color: #262626;
          font-size: 30/40rem;
        }
        .time{
          padding-top: 6/40rem;
          font-size: 26/40rem;
          color: #999;
        }
        .ct{
          padding-top: 18/40rem;
          font-size: 28/40rem;
          color: #999;
        }
        .thumb{
          height: 120/40rem;
          width: 120/40rem;
          position: absolute;
          right: 30/40rem;
          top: 30/40rem;
        }
        .readflag{
          width: 32/40rem;
          height: 32/40rem;
          position: absolute;
          right: 14/40rem;
          top: 14/40rem;
          border-radius: 100%;
          background-color: #ff5060;
        }
      }
    }
  }
</style>