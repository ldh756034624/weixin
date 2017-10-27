<template>


	<div transition = "app" class="page" style="width:100%;height:100%">
    <x-header :left-options="{showBack: true}" >留言</x-header>
    <!-- <div style="width:100%;height:100%"> -->
		<Scroller  v-ref:scroller lock-x scrollbar-y use-pullDown use-pullUp :pulldown-config = "pullDownConfig" @pulldown:loading="refresh" :pulldown-status.sync="pulldownStatus" :pullup-config = "pullUpConfig" @pullup:loading="loadMore" :pulldown-status.sync="pullupStatus">

			<div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 1.5rem; line-height: 1.5rem; top: -1.5rem; text-align: center">

			  <span v-show="pulldownStatus==='up'||pulldownStatus==='down'">up</span>
			   <span v-show="pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
			</div>

      <div>
      <div v-for="item in commentsArray" class = "row contentBetween lineBottom" track-by="$index" style="height:3rem;padding: 0.75rem;position:relative"> 
        <div class="column full contentStart" style="position:relative">
          <p class="textBlack fontBig " >{{item.nick}}给你留言了</p>
          <p class="textGray fontSmall " style="position:relative;top:0.2rem">{{item.commentTime}}</p>
          <p class="textGray fontBig " style="position:absolute;bottom: 0rem">{{item.comments}}</p>
        </div>

        <img style="position:absolute;top: 0.7rem;right:0.75rem;width:3rem;height:3rem" :src=item.goodImage>
        <badge v-show="item.readFlag===0" text=" " style="width:0.8rem;height: 0.8rem;z-index:10000;position:absolute;top: 0.5rem;right:0.5rem"></badge>
      </div>
    </div>

      

		</Scroller>
    <!-- </div> -->
	</div>
</template>


<script>
import Scroller from 'vux-components/scroller'
import Loading from 'vux-components/loading'
import spinner from 'vux-components/spinner'
import badge from 'vux-components/badge'
import XHeader from 'vux-components/x-header'
import Vue from 'vue'
// var url = require('aUrl');
var currentPage = 1;
var hasNext = false;
export default{
  components: {
    Scroller,
    Loading,
    spinner,
    badge,
    XHeader,
  },

  ready:function(){
    this.setTitle("留言");
    this.refresh();
  },

  data(){


  	return{
  		pulldownStatus:'default',
      pullupStatus:'default',

  		commentsArray:[
  		],
  		pullUpConfig:{
  			 content: '上拉加载',
  			 pullUpHeight: 60,
  			 height: 40,
  			 autoRefresh: false,
  			 downContent: '释放加载',
  			 upContent: '上拉加载',
  			 loadingContent: '加载中',
  			 clsPrefix: 'xs-plugin-pullup-'
  		},
  		pullDownConfig:{
  			content: '下拉刷新',
  			 height: 60,
  			 autoRefresh: false,
  			 downContent: '下拉刷新',
  			  upContent: '释放刷新',
  			  loadingContent: '加载中',
  			  clsPrefix: 'xs-plugin-pulldown-'
  		}
  	}
  },

   methods:{
    init:function(){

    },
    loadData(pageIndex,finished){
      let self = this
      // Vue.http.headers.common['token'] = (localStorage.token) ? localStorage.token : 'e3be0d6e-d66c-48f2-9f38-9281166af148';
      self.$http.get('/sh/ja/v1/comments?page='+currentPage+'&&limit=10').then(function(res){

        // for (var i = 0; i < res.data.data.length; i++) {
        //   self.commentsArray.push(res.data.data[i]);
        // };
        self.commentsArray = [...self.commentsArray, ...res.data.data]
        if (res.data.hasNext) {
          self.$broadcast('pullup:enable', self.$refs.scroller.uuid);
        }else{
          self.$broadcast('pullup:disable', self.$refs.scroller.uuid);
          // console.log('没有更多数据');
        }

        self.$nextTick(()=>{
          // console.log('success');
          self.$refs.scroller.reset();
          self.$broadcast('pulldown:reset',self.$refs.scroller.uuid);
          finished();
        })

        }).catch(function(data,status,request){

          // console.log('error');
          self.$broadcast('pullup:disable', self.$refs.scroller.uuid);
          self.$broadcast('pulldown:reset',self.$refs.scroller.uuid);
        });

    },


    refresh(){
      currentPage = 1;
      // this.commentsArray = [];
      this.loadData(currentPage,(()=>{
        
      }));

    },

    loadMore(){
      // console.log('加载更多');
      currentPage++;
      this.loadData(currentPage,(()=>{
        
      }));
    }
  
  }


}
</script>

<style scoped>
/*flex*/
.full{
  flex:1;
  align-content:stretch;
}
.flex{
  display: flex;
}

.row{
  display: flex;
  flex-direction:row;
}

.column{
  display: flex;
  flex-direction:column;
}

.contentStart{
  justify-content:flex-start;
}

.contentBetween{
  justify-content:space-between;
}

.contentCenter{
  justify-content:center;
}

.itemsCenter{
  align-items:center;
}


.textGray{
	color:#999999;
}

.textBlack{
	color: #242424;
}

.fontSmall{
	font-size: 0.6rem;
  line-height: 0.6rem;
}
.fontBig{
	font-size: 0.7rem;
  line-height: 0.7rem;
}

.lineBottom{
  border-width: 0.0025rem;
  border-bottom-style: solid;
  border-color: #eeeeee;
}


</style>