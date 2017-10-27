<template>
  <div class="page">
    <div class="advice">
        <group class='adviceBox'>
            <x-textarea :min='10' :max="200" placeholder="请填写10个字以上的问题描述,以便我们提供更好的帮助" v-model="content" @on-change="changeDesc"></x-textarea>
        </group>
        <group class='adviceBox'>
            <x-input placeholder="请留下电话号码或邮箱(选填)" :show-clear="false" v-model="mail"  @on-change="changeDesc"></x-input>
        </group>
        <group class='advicebtnBox'>
            <x-button class='adviceBtn ' @click.native='submitAdvice' :disabled='useStatus' :class="[useStatus ? 'grayBtn' : 'BlueBtn']"> 提交</x-button>
        </group>  
    </div>
  </div>
</template>

<script>
import {Group,XTextarea,XInput,XButton} from 'vux'
// var url = require('aUrl')
export default {
  mounted(){
    // let self=this;
    this.setTitle('用户反馈');
    // console.log(self.mail)
  },
  data () {
    return {
      content:'',
      mail:'',
      useStatus:true
    }
  },
  methods:{
      changeDesc(){
         if(this.content && this.mail){
            this.useStatus=false
         }else{
            this.useStatus=true
         }
      },
       submitAdvice(){
          let self=this;
          self.$http.post('/sh/ja/v1/send',{content:self.content,phone:self.mail})
          .then(function(res) {
            if(res.data.statusCode==0){
              self.$router.push({path:'/account/personal'})
            }else{
               self.$vux.toast.show({
                  text:  res.data.msg,
                  type: 'text',
              })
            }
          })
       }

  },
   components: {
    Group,
    XTextarea,
    XInput,
    XButton
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
    .advice{
      margin: 0 20/40rem;
    }
    .adviceBox{
      background-color: #fff;
      border-radius: 15/40rem;
      margin-top: 20/40rem;
      border:1px solid #F0F0F0;
    }
    .advicebtnBox{
      margin-top: 60/40rem;
      text-align: center;
    }
    .adviceBtn{
      
    }
    .grayBtn{
      background-color: #DDDDDD!important;
      color: #fff!important;
    }
</style>
<style lang='less'>
  .moreSet .vux-1px-b:after{
    border-bottom: 1px solid #e2e2e2;
  }
  .advice .weui-cells{
    margin-top: 0;
    border-radius: 15/40rem!important;
    font-size: 30/40rem!important;
  }
  .advice .weui-cells:before{
    border-top:none!important;
  }
  .advicebtnBox .weui-btn:after{
    border:none!important;
  }
</style>
