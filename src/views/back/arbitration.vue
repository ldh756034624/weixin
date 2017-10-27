<template>
	<div class="page arbitration">
      <main>
          <section class='arbitrationBox'>
              <div class="arbitrationText">
                <p>说明描述 <span>(最多200字)</span></p>
                <x-textarea :max="200"  v-model="arbitrationData.content"></x-textarea>
                <p>上传凭证 <span>(最多四张)</span></p>
              </div>
                  <ImgUpload :maxlength="4" :uploadurl="uploadurl" ref="uploadImg"></ImgUpload>
          </section>
          <div class="backApplyBtnBox">
            <x-button class=" BlueBtn" @click.native='arbitratFn()'>确认</x-button>
          </div>
      </main>
  </div>
</template>
<script>
import {XButton, XTextarea} from 'vux'
import ImgUpload from '@/components/ImgUpload2'

export default {
  
  mounted(){
    this.setTitle('举证')
  },
  data () {
    return {
       uploadurl:'/sh/ja/v1/file/goods/upload',
       arbitrationData:{
        content:'',
        imgs:'',
        orderId:this.$route.query.orderId,
       }
    }
  },
  methods:{
    arbitratFn:function(){
      let self=this;
      if(!self.arbitrationData.content && !self.$refs.uploadImg.imagelist.length ){
        _g.toastMsg('error','请添加举证描述或上传凭证')
        return;
      }
       self.arbitrationData.imgs=self.$refs.uploadImg.imagelist
       self.$http.post('/sh/ja/v1/arbitration',self.arbitrationData)
        .then(function(res) {
          if(res.data.statusCode==0){
            _g.toastMsg('error', res.data.msg)
           setTimeout(function(){
              history.go(-1)
           },1000)
          }else{
            _g.toastMsg('error', res.data.msg)
          }
        })
    }
  },
   components: {
    XButton,ImgUpload,XTextarea
  },
}

</script>

<style scoped lang='less'>
    
    .arbitrationBox{
      background-color: #fff;
      border-radius: 15/40rem;
      font-size: 30/40rem;
      margin: 30/40rem 30/40rem 0;
    }
    .arbitrationText p{
       padding: 30/40rem 0 0 40/40rem;
    }
     .backApplyBtnBox{
      padding: 2rem 30/40rem 2rem;
     }
</style>
<style type="text/css" lang='less'>
  .arbitrationText .weui-cell:before{
    border-top: none;
  }
  .arbitrationText .weui-cell__bd{
    padding: 30/40rem!important;
  }
  .arbitrationText .weui-textarea,.arbitrationText .weui-cell__bd{
    background-color: #FBF9FE
  }
  .arbitrationText textarea{
    font-family: -webkit-body
  }
</style>