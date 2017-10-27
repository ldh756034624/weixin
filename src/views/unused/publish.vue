<template>
  <div class="page publishUnused">
      <PublishTpl ref='publishtpl' :datas='unsetPublishData'  :publishUrl='unusedUrl'></PublishTpl>
      <main class='unusedMain'>
          <group class='radius'>
            <p class="tipText">发布价格</p>

            <x-input title='卖价' type="number" :max="9" v-model="unsetPublishData.sellingPrice" :show-clear='false'><img slot="right" src=''/></x-input>
            <x-input title='原价' type="number" :max="9" v-model="unsetPublishData.originPrice" :show-clear='false'><img slot="right" src=''/></x-input>
            <x-input title='运费' type="number" :max="9" v-model="unsetPublishData.expressFee" :show-clear='false'><img slot="right" src=''/></x-input>
          </group>
          <div class="commonbtn-wrap">
            <x-button @click.native="publish"  mini class="commonbtn">确定发布</x-button>
          </div>
      </main>


  </div>
</template>

<script>
import {  Group, XInput, XButton } from 'vux'
import PublishTpl from '@/components/publishTpl'
// var url = require('aUrl')
export default {
  mounted(){
    let self=this;
    self.setTitle('发布闲置');
    if(this.$route.query.id){

      setTimeout(function(){
      self.unsetPublishData.originPrice=self.$refs.publishtpl.publishData.originPrice
      self.unsetPublishData.sellingPrice=self.$refs.publishtpl.publishData.sellingPrice
      self.unsetPublishData.expressFee=self.$refs.publishtpl.publishData.expressFee
    },500)
    }

  },
  data () {
    return {
      unsetPublishData:{
          originPrice:'',
          sellingPrice:'',
          expressFee:'',
      },
      unusedUrl:'/sh/ja/v1/idleGoods/release',
    }
  },
  methods:{
    publish(){
      this.$refs.publishtpl.publish();
    }
  },
  components: {
    Group,
    XInput,
    XButton,
    PublishTpl,
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .unusedMain{
      margin: -0.5rem 20/40rem 5rem;
      border-radius: 15/40rem;
    }

</style>
<style lang='less'>
  .unusedMain .weui-cell,.unusedMain .weui-input,.unusedMain p{
     font-size: 30/40rem!important;
  }
  .unusedMain .tipText{
     padding: 20/40rem 30/40rem;
     color: #999;
  }
  .unusedMain .weui-cells:before {
    border-top: none!important;
  }
</style>
