<template>
  <div class="page publishUnused">
      <PublishTpl ref='publishtpl' :datas='donateDatas'  :publishUrl='donateUrl'></PublishTpl>
      <div class="commonbtn-wrap">
          <x-button @click.native="publish"  mini class="commonbtn">确定发布</x-button>
      </div>
  </div>
</template>

<script>
import {  Group, XInput ,XButton } from 'vux'
import PublishTpl from '@/components/publishTpl'
// var url = require('aUrl')
export default {
  mounted(){
    let self=this;
    self.setTitle('发布捐赠');
  },
  data () {
    return {
      donateUrl:'/sh/ja/v1/donation/release',
      donateDatas:{}
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
    PublishTpl,
    XButton
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .unusedMain{
        margin: -0.5rem 1rem 0;
    }
</style>
<style lang="less">
    .commonbtn-wrap{
        padding: 0 30/40rem 30/40rem 30/40rem;
    }
</style>
