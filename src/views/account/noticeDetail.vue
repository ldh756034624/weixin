<template>
	<div class="page articlePage">
    <p class="title">{{articleData.title}}</p>
    <p class="date"><span>{{articleData.startTime}}</span>{{articleData.userName}}</p>
    <div class="content" v-if="isHtml" v-html='articleData.content'></div>
    <div class="content" v-else>{{articleData.content}}</div>
  </div>
</template>
<script>
import { Group,Cell} from 'vux'
export default {
  mounted(){
    this.setTitle('公告详情');
    this.init();
  },
  data () {
    return {
      id:this.$route.query.id,
      articleData:{},
      isHtml:false,
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/article/'+self.id)
        .then(function(res) {
          if(res.data.code==0){
              self.articleData=res.data.data
              if(self.articleData.content.indexOf('div')!=-1 || self.articleData.content.indexOf('p')!=-1){
                self.isHtml=true
              }else{
                self.isHtml=false
              }
          }
        })
    }
  },
   components: {
    Group,Cell
  },
}

</script>
<style scoped lang='less'>
  .articlePage{
    background: #fff;
    padding: 30/40rem;
    .title{
      font-size: 36/40rem;
      line-height: 58/40rem;
      color: #333;
    }
    .date{
      color: #999;
      font-size: 32/40rem;
      margin: 30/40rem 0 60/40rem;
      span{
        margin-right: 10/40rem;
      }
    }
    .content{
      color: #666;
      font-size: 28/40rem!important;
      line-height: 46/40rem;
    }
  }
</style>
<style lang='less'>
  .articlePage{
    .content{
      color: #666;
      font-size: 28/40rem!important;
      font-size: 14px!important;
      line-height: 46/40rem;
      p{
        font-size: 14px!important;
      }
    }
  }
</style>
