<template>
	<div class="headImgUplTpl">
      <form enctype="multipart/form-data" method="post" name="fileinfo">
        <div class="nickUpldBox">
          <input type="file" name="uploadedFile" id="inputFile" v-on:change="uploadImage" style="opacity:0;">
          <!-- <span :style="styles"></span> -->
          <img :src="headImg">
        </div>
      </form>
      <form enctype="multipart/form-data" method="post" name="fileinfo2" style="display:none">
        <div class="nickUpldBox">
          <input type="file" style="opacity:0;">
        </div>
      </form>
      <vueCropper v-show='showCut' class='vueCropperBox'
      ref="cropper"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :autoCropWidth="width"
      :autoCropHeight="width"
      :autoCrop=true
      :fixed=true
      :canScale=false
    >
    </vueCropper>
    <span class="close" v-show='showCut' @click='showCut=false'></span>
    <span class='finish' v-show='showCut' @click='finish()'>完成</span>
  </div>
</template>
<script>

import {baseCode} from '@/util/base64Code'
import { XInput} from 'vux'
import VueCropper from 'vue-cropper'
import wx from 'weixin-js-sdk'
export default {
  mounted(){
    let self=this;
    if(localStorage.getItem('img')){
      this.headImg=localStorage.getItem('img')
    }
  },
  data () {
    return {
      styles: {},
      headImg:this.imgsrc,
      uploadurl:'h9/api/file/upload',
      testWx:'',
      testWx2:'',
      testWxData:'',
      inputT:'1111',
      showCut:false,
      option:{
        img:'',
        size:1,
        outputType:'png',
        width:300,
        height:200
      },
      hasChooseFile:false,
      width:document.body.clientWidth
    }
  },
  props:{
    imgsrc:{
      type:String
    }
  },
  methods:{
    finish (type) {
      // 输出
      let self=this;
       //截图完成后blob类型图片
        /*this.$refs.cropper.getCropBlob((data) => {
              var imgs=window.URL.createObjectURL(data)
              var blob=data;
              var canvas = document.createElement('canvas');
              var dataURL = canvas.toDataURL('image/jpeg', 0.5);
              var fd = new FormData(document.forms[1]);
              fd.append("uploadedFile", blob, 'image.png');
              self.$http.post(self.uploadurl,fd)
            .then(function(res) {
                if(res.data.statusCode==0){   
                } 
              }
            })
        })*/
       //截图完成后data base64类型图片
        this.$refs.cropper.getCropData((data) => {
          var blob = self.dataURItoBlob(data); // 上一步中的函数
          var fd = new FormData(document.forms[1]);
          fd.append("file", blob, 'image.png');
          self.$http.post(self.uploadurl,fd)
            .then(function(res) {

              if(res.data.code==0){
                _g.toastMsg('error','上传成功')   
                self.headImg=res.data.data;
              } else {
                _g.toastMsg('error',res.data.msg)
              }
              self.showCut=false;
              self.$emit("listenToChildImg",false)
            })
        })
      //}*/
      
    },
    dataURItoBlob:function(base64Data) {
            var byteString;
            if (base64Data.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(base64Data.split(',')[1]);
            else
            byteString = unescape(base64Data.split(',')[1]);
            var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type:mimeString});
    },
    uploadImage: function (e) {
        let self = this
        var file = e.target.files[0];
        self.$emit("listenToChildImg",true)
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
           self.$vux.toast.show({
            text: '图片类型必须是.gif,jpeg,jpg,png,bmp中的一种',
            type: 'text',
            })
           return false
         }
        var reader = new FileReader()
        reader.onload = (e) => {
          self.option.img = e.target.result
        }
        reader.readAsDataURL(file)

        self.showCut=true;
    },
  },
   components: {
    XInput,
    VueCropper
  }
}

</script>

<style scoped lang='less'>
    .vueCropperBox{
      position: fixed!important;
      top:0!important;
      left: 0!important;
      height: 100%!important;
      width: 100%!important;
    }
    .headImgUplTpl .finish{
      display: inline-block;
      width: 160/40rem;
      height: 70/40rem;
      line-height: 70/40rem;
      border-radius: 20/40rem;
      background-color: #d9bd76;
      position: fixed;
      right: 20/40rem;
      bottom: 20/40rem;
      z-index: 999999;
      text-align: center;
      color: #fff;
      font-size: 36/40rem;
    }
    .uploadTpl .close{
      display: inline-block;
      background:url('../assets/img/index/xx@2x.png') no-repeat center; 
      width: 35/40rem;
      height: 35/40rem;
      border-radius: 1rem;
      position: fixed;
      right: 20/40rem;
      top: 20/40rem;
      z-index: 999999;
    }
    .headImgUplTpl{
      background-color: #fff;
    }
    .headImgUplTpl span{
      display: inline-block;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .nickUpldBox{
      position: relative;
      img{
        width: 100%;
        border-radius: 2rem;
      }
    }
    .headImgUplTpl input{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
    }
    .headImgUplTpl,.headImgUplTpl div,.headImgUplTpl form,.headImgUplTpl input,.headImgUplTpl span{
      width: 100%;
      height: 100%;
      border-radius: 999px;
      background-size: 100%;
      background-position: center;
      background-color: #f0f0f0;
    }
</style>
<style>
  .vueCropperBox .cropper-box{
    background-color: #fff!important;
  }
  .vueCropperBox .cropper-modal{
    background:rgba(255,255,255,0.2)!important; 
  }
</style>