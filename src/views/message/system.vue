<template>
<div class="page" transition="app">
    <!--header slot-->
    <div class="vux-demo-header-box vux-1px-b" slot="header">
      <x-header :left-options="{showBack:true,backText:''}" :transition="headerTransition">系统通知</x-header>
    </div>

    <div class="content comment vux-1px-t">
      <!-- 留言列表 -->
      <div class="empty" v-if="commentData.length==0 && loading.show == false">
        <img src="../../assets/img/tips_sad.png">
        <div class="text">暂无系统通知</div>
      </div>
      <scroller v-if="commentData.length>0" lock-x scrollbar-y use-pullup use-pulldown @pullup:loading="loadMore" height="100%" @pulldown:loading="refresh" :pullup-status.sync="pullupStatus" v-ref:scroller :pulldown-config="pulldownConfig">
        <ul>
          <li v-for="cmt in commentData" class="vux-1px-b">
            <div class="comment-wrap">
              <div class="nick">猪猪集市官方<span>{{cmt.dealTime}}</span></div>
              <div class="ct">{{cmt.processMsg}}</div>
              <div class="thumb"><img src="../../assets/img/zz.png"></div>
              <div v-if="cmt.readFlag" class="readflag"></div>
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
    this.setTitle("系统通知");
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
    requestData: function(uuid){    // 
      let self = this
      let rcmurl = "/sh/ja/v1/systemmsg/all";
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
                  // alert(2)
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
      this.page.hasNext = true;
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
      padding-left: 150/40rem;
    }
    ul{
      li{
        position: relative;
        padding: 20/40rem 30/40rem;
        line-height: 1;
        .nick{
          padding-top: 10/40rem;
          color: #262626;
          font-size: 30/40rem;
          span{
            padding-top: 10/40rem;
            font-size: 26/40rem;
            color: #999;
            float: right;
          }
        }
        .ct{
          padding-top: 20/40rem;
          font-size: 28/40rem;
          color: #999;
          line-height: 1.4;
          width: 100%;
        }
        .thumb{
          height: 120/40rem;
          width: 120/40rem;
          position: absolute;
          left: 30/40rem;
          top: 30/40rem;
          background-color: #ededed;
          border-radius: 100%;
          img{
            width: 100/40rem;
            height: 100/40rem;
            margin: 10/40rem;
          }
        }
        .readflag{
          width: 32/40rem;
          height: 32/40rem;
          position: absolute;
          top: 14/40rem;
          left: 14/40rem;
          border-radius: 100%;
          background-color: #ff5060;
        }
      }
    }
  }
</style>