<template>
  <div class="uploadTpl">
    <div class="img-wrap grid grid25" v-for="(lst,index) in imagelist">
      <img class="del" v-on:click="remove(index)" src="../assets/img/index/xx@2x.png">
      <img v-bind:src="lst" v-on:click='showBig(lst)'>
    </div>
     <div class="img-wrap grid grid25" v-if="maxlength>imagelist.length">
      <form enctype="multipart/form-data" method="post" name="fileinfo">
        <div class="upld-div">
          <input type="file" name="uploadedFile" id="inputFile" v-on:change="uploadImage">
        </div>
      </form>
      <form enctype="multipart/form-data" method="post" name="fileinfo2" style="display:none">
        <div class="nickUpldBox">
          <input type="file" style="opacity:0;">
        </div>
      </form>
      <div id="imgdata" style="opacity:0"></div>
    </div>
    <div class="uploadImgshowBig" v-show='bigImgShow'>
        <div class="uploadImgCell">
            <span v-on:click='closeBigImg()'>X</span>
            <img :src="bigImgSrc" />
        </div>
    </div>
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
let uploadFlag=0;//判断点击上传成功的次数
import VueCropper from 'vue-cropper'
export default {
  mounted(){
     let self =  this;
     setTimeout(function(){
        if(self.$route.query.id){
        self.imagelist=self.imagedatas
        if(self.imagelist.length>0){
          for (var i = 0; i <self.imagelist.length; i++) {
            self.imageUploadList.push(self.imagelist[i])
          };
        }
       }
     },500)
  },
  data() {
    return {
      imagelist: [],
      imageUploadList:[],
      showCut:false,
      bigImgShow:false,
      bigImgSrc:'',
      option:{
        img:'',
        size:1,
        outputType:'png'
      },
      width:document.body.clientWidth
    };
  },
  props: {
    maxlength: {
      type: Number,
      default: 3
    },
    uploadurl: {
      type: String,
      default: ""
    },
    imagedatas:{
      type:Array,
    }
  },
  methods: {
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
      let self =this
       // 修复删除报错bug#10456 meow.zhong 2017.6.22
      // previewImage(uploadFlag);
      if(self.imagelist.length<self.maxlength){
        let rcmurl = self.uploadurl;
        var formthml=document.forms.namedItem("fileinfo" );
        var oData = new FormData(document.forms.namedItem("fileinfo" ));

        var f=document.getElementById("inputFile").value;

        if(!/\.(gif|jpg|jpeg|png|JPG|PNG)$/.test(f))
        {
           _g.toastMsg('error', '请上传正确的图片格式')
          return false;
        }

        var file = e.target.files[0]
        var reader = new FileReader()
        reader.onload = (e) => {
          self.option.img = e.target.result
        }
        reader.readAsDataURL(file)

        self.showCut=true;

        /*self.$http.post(rcmurl,oData)
        .then(function(res) {*/


            // 修复删除报错bug#10456 meow.zhong 2017.6.22
          /*if(res.data.statusCode==0){
            self.imagelist.push(res.data.url);


            self.imageUploadList.push(res.data.url)
            uploadFlag++;

            _g.toastMsg('error', "上传成功")
          } else {
           _g.toastMsg('error', "上传失败")
          }*/
        //})

      }else{
         _g.toastMsg('error', "最多上传"+this.maxlength+"张图片")
      }
    },
    finish (type) {
      // 输出
      let self=this;
       //截图完成后data base64类型图片
        this.$refs.cropper.getCropData((data) => {
          var blob = self.dataURItoBlob(data); // 上一步中的函数
          var fd = new FormData(document.forms[1]);
          fd.append("uploadedFile", blob, 'image.png');

          self.$http.post(self.uploadurl,fd)
            .then(function(res) {

              if(res.data.statusCode==0){
                // 修复删除报错bug#10456 meow.zhong 2017.6.22
                // var imgurldata=document.querySelector('#imgdata').querySelectorAll('span')[uploadFlag].innerHTML;
                self.imagelist.push(res.data.url);
                self.imageUploadList.push(res.data.url)
                uploadFlag++;

                _g.toastMsg('error', "上传成功")
              } else {
               _g.toastMsg('error', "上传失败")
              }
              self.showCut=false;
            })
        })
      //}*/
      
    },
    remove: function(index){
      let self=this;
      if(self.$route.query.id){
        this.imagelist.splice(index,1);
        this.imageUploadList.splice(index,1);

      }else{
      this.imagelist.splice(index,1);
       // 修复删除报错bug#10456 meow.zhong 2017.6.22
        // var removenode=document.querySelector('#imgdata').querySelectorAll('span')[index]
        // document.querySelector('#imgdata').removeChild(removenode);
        uploadFlag--;
      }
    },
    showBig:function(src){
      let self=this;
      self.bigImgShow=true;
      self.bigImgSrc=src;
    },
    closeBigImg:function(){
       let self=this;
       self.bigImgShow=false;
    }
  },
  components: {
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
      z-index: 999;
    }
    .uploadTpl .finish{
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
    .uploadImgshowBig{
      position: fixed;
      z-index: 999;
      background-color: #222;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: table;
    }
    .uploadImgCell{
      display: table-cell;
      vertical-align: middle;
    }
    .uploadImgshowBig span{
      display: inline-block;
      width: 40/40rem;
      height: 40/40rem;
      font-size: 36/40rem;
      position: fixed;
      color: #fff;
      right: 0;
      top: 0;
    }
    .uploadImgshowBig img{
      width: 100%;
    }
</style>
<style lang='less'>
@height: calc(~"(document.body.clientWidth/4+'px')");
@screen_width: ~"document.body.clientWidth/4+'px'";
  .vueCropperBox .cropper-box{
      background-color: #fff!important;
    }
    .vueCropperBox .cropper-modal{
      background:rgba(255,255,255,0.2)!important; 
    }
   .test { height:100px; width:@screen_width; background:#080; }
  .uploadTpl{
    font-size: 0;
    margin-top: 20/40rem;
    padding-bottom: 20/40rem;
    padding-left: 15/40rem;
    padding-right: 30/40rem;
    background-color: #fff;
    .img-wrap{
      display: inline-block;
      box-sizing:border-box;
      width:25%;
      height:152/40rem;
      vertical-align:top;
      position: relative;
      padding: 6/40rem 6/40rem 6/40rem;
      form,.upld-div{
        height:100%;
      }
      .del{
        width: 28/40rem;
        height: 28/40rem;
        position: absolute;
        top: 0rem;
        right: 0rem;
      }
      .upld-div{
        background-color: #f1f1f1;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAQFJREFUaAXtmMEJwzAQBC2hAlyCa3BlLiElpDCphpAO4gqUO/Arv8ux+zBrEIFwt4tmTB5ZFsIzxnj03qd/ousquoCdrwuxiUf7ZChKjD0vQ2zi0T4ZihJjz8sQm3i0T4aixNjzMsQmHu2ToSgx9rwMsYlH+2QoSow9L0Ns4tG+2xkq9uffK0rhj/l1zrmWUj626wf2NCvaYOk/wX4p+8oP7Gm11g2WfgXbRQ4/ZujpB9nX9n1/Iws8217r8+o40X23+1HQhdCvZzZfhrIE0fsyhCaczZehLEH0vgyhCWfzZShLEL0vQ2jC2XwZyhJE78sQmnA2X4ayBNH7MoQmnM3/ApYHJ3qmIxGyAAAAAElFTkSuQmCC');
        background-repeat: no-repeat;
        background-size: 52/40rem 52/40rem;
        background-position: center;
        input[type=file]{
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>