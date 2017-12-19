<template>
	<div class="page problemPage">
    <group class='problemBox'>

      <cell :title="item.title"  :link="{path:'/account/articleDetail',query:{id:item.articleId}}" v-for='item in problemList' is-link></cell>
    </group>
    
  </div>
</template>
<script>
import { Group,Cell} from 'vux'
export default {
  mounted(){
    this.setTitle('常见问题');
    this.init();
  },
  data () {
    return {
      problemList:[],
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/user/help')
        .then(function(res) {
          if(res.data.code==0){
              self.problemList=res.data.data 
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
  .problemPage{
    background: #fff;
  }
</style>
<style lang='less'>
  .problemBox{
    .weui-cells:before,.weui-cells:after,.weui-cell:before {
      border:none;
    }
    .weui-cell{
      padding: 30/40rem;
    }
    .vux-label{
      font-size: 30/40rem;
    }
  }
</style>
