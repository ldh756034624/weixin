<template>
  <div class="page searchRecord">
    <flexbox :margin-left='0' class="search-input">
      <flexbox-item class="back" @click.native="goBack()"><div>&nbsp;</div></flexbox-item>
      <flexbox-item class="input">
        <div class="input-wrap">
          <form target="frameFile" id="search_from" action="#" > 
            <input type="search" placeholder="搜索商品" id='searchInput' v-model="keyword" autofocus="autofocus"/> 
            <iframe name='frameFile' style="display: none;"></iframe>
          </form>
        </div>
      </flexbox-item>
      <flexbox-item class="btn"><div @click="goBack">取消</div></flexbox-item>
    </flexbox>
    <div class="searchList" v-show='showSearchList'>
        <p v-for='item in searchListData' @click='listGoSearch(item)'>{{item.content}}</p>
        <div class="searchClear" @click='searchClearFn()'>清除搜索记录</div>
    </div>

  </div>
</template>

<script>
import {Flexbox, FlexboxItem} from 'vux'
export default {
  mounted(){
    let self=this;
    self.setTitle('搜索记录');
    document.querySelector("#searchInput").focus();
    self.init();
    document.onkeyup=function(e){
      if(e.keyCode==13){
        self.addSearchRecordFn();
      }
    }
    /*document.getElementById('search_from').onsubmit = function(){
      self.addSearchRecordFn();
    }*/
  },
  data () {
    return {
      history: new Array(5),  //默认历史记录存5条
      keyword: "",
      showPriceChoose:false,
      searchListData:[],
      showSearchList:false,
    }
  },
  methods:{
    init(){
      let self=this;
     self.$http.get('/sh/ja/v1/searchrecord/list') //获取搜索记录
      .then(function(res) {
        if(res.data.statusCode==0){
          if(res.data.data.length>5){
            for (var i = 0; i <5;i++) {
                self.searchListData.push({
                  content:res.data.data[i].content,
                  id:res.data.data[i].id
                })
            };
          }else{
            self.searchListData=res.data.data
          }
          self.showSearchList=true;
        };
      })
    },
    addSearchRecordFn:function(){
      let self=this;
      if(JSON.parse(localStorage.getItem('_user')) && self.keyword.trim()){
        self.$http.put('/sh/ja/v1/searchrecord/add',{content:self.keyword}) //添加搜索记录
        .then(function(res) {
          self.$router.push({path:'/search/search',query:{title:self.keyword}})
        })
      }else{
        if(self.searchListData.length>0){
            self.keyword=self.searchListData[0].content
          }
         self.$router.push({path:'/search/search',query:{title:self.keyword}})
      }
     
    },
    listGoSearch:function(item){
        let self=this;
        self.$router.push({path:'/search/search',query:{title:item.content,id:item.id}})
        
    },
    goBack(){
      history.go(-1) 
    },
    searchClearFn(){
       let self=this;
       self.$http.delete('/sh/ja/v1/searchrecord/delete') //清除搜索记录
        .then(function(res) {
          if(res.data.statusCode==0){
            self.showSearchList=false;
            self.searchListData=[];
            self.init();
          }
        })
    }
    
  },
  components: {
    Flexbox,FlexboxItem
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  .search-input{
    padding: 18/40rem 0;
    background-color: #fafdfd;
    height: 56/40rem;
  }
  #searchInput{
    font-size: 28/40rem;
  }
  .searchList{
    background-color: #fff;
  }
  .searchList p,.searchClear{
    height: 1rem;
    font-size: 28/40rem;
    padding: 20/40rem 2rem;
  }
  .searchList p{
     border-bottom: 1px solid #eee;
  }
  .searchClear{
    text-align: center;
  }
</style>
<style lang='less'>
   .page.searchRecord{
    background-color: #f0f0f0;
    background: url('../../assets/img/blank/searchBg.png') no-repeat center;
    background-size: cover;
    .search-input{
      .vux-flexbox-item{
        height: 56/40rem;
        line-height: 56/40rem;
        margin-left: 0 !important;
        flex: initial;
        &.back{
          width: 78/40rem !important;
          background-image: url('../../assets/img/search/back.png');
          background-repeat: no-repeat;
          background-size: 18/40rem 32/40rem;
          background-position: center;
        }
        &.input{
          flex: 1;
          .input-wrap{
            border: 1.2/40rem solid #dcdcdc;
            border-radius: 8/40rem;
            height: 100%;
            font-size: 28/40rem;
            background-image: url('../../assets/img/search/search.png');
            background-repeat: no-repeat;
            background-size: 28/40rem;
            background-position: 24/40rem center;
            padding-left: 66/40rem;
            overflow: hidden;
            input{
              outline: none;
              width: 100%;
              height: 100%;
              border: none;
            }
          }
        }
        &.btn{
          width: 110/40rem;
          text-align: center;
          font-size: 30/40rem;
        }
      }
    }
  } 
  ::-webkit-search-cancel-button { display: none; } 
</style>
