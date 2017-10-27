<template>
  <div class="page">
    <div class="complaint">
        <div class="complaintGood">
            <img src=''>
            <div class="">
                <p></p>
                <p><i>￥</i></p>
            </div>
        </div>
        <p>下架原因</p>
        <p>申诉证据</p>
        <div>
          
        </div>
        <p>补充说明</p>
        <group class='adviceBox'>
            <x-textarea :min='10' :max="200" placeholder="请填写10个字以上的问题描述,以便我们提供更好的帮助" v-model="content" @on-change="changeDesc"></x-textarea>
        </group>
    </div>
    <group class='advicebtnBox'>
        <x-button class='adviceBtn BlueBtn' @click.native='submitAdvice'> 提交</x-button>
    </group>
      
  </div>
</template>

<script>
import {Group,XTextarea,XButton} from 'vux'
// var url = require('aUrl')
export default {
  mounted(){
    let self=this;
    self.setTitle('下架申诉');
  },
  data () {
    return {
    }
  },
   components: {
    Group,XTextarea,XButton
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .complaint{
      margin: 20/40rem;
      background-color: #fff;
    }
    .complaintGood{
      padding: 30/40rem;
    }
    
</style>
<style >
  .moreSet .vux-1px-b:after{
    border-bottom: 1px solid #e2e2e2;
  }
</style>
