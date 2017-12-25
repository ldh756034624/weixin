<template>
	<div class="page infoChangePage">
    <group class='infoBox groupNoTop groupNoLine'>
        <cell title="头像" class='infoImgCell'>
            <uploadHeadImg class="infoHeadImg" ref='uploadHeadImg' :imgsrc='userHeadImg' v-on:listenToChildImg='hasFileChoosed'></uploadHeadImg>
        </cell>
    </group>
    <group class='infoBox groupNoTop groupNoLine' v-if='showOtherInfo'>
        <x-input title="昵称" v-model='infoData.nickName' placeholder="昵称" :max='15' :show-clear="false"></x-input>
        <cell title="手机号" v-if="infoData.tel!=''" :value='infoData.tel'></cell>
        <cell title="手机号" v-else value='绑定' link='/account/bindPhone' is-link></cell>
        <cell title="性别" :value='infoData.sex' @click.native="showPopupFn(infoData.sexList,'sex')" is-link></cell>
        <datetime v-model="infoData.birthday" :start-date="startDate" @on-change="changeDateTime"  title="生日"></datetime>
        <cell title="情感" :value='infoData.marriageStatus'  @click.native="showPopupFn(infoData.emotionList,'marriage')" is-link></cell>
    </group>
    <group class='infoBox groupNoLine' title='隐私信息(不公开)' v-if='showOtherInfo'>
        <cell title="学历" :value='infoData.education'  @click.native="showPopupFn(infoData.educationList,'education')" is-link></cell>
        <cell title="职业" :value='infoData.job'  @click.native="showPopupFn(infoData.jobList,'job')" is-link></cell>
        <!-- <x-input title="职业" v-model='infoData.job' placeholder="请输入职业" ></x-input> -->
    </group>
    <div class="fundsBtnBox">
      <x-button class='gradientBtn' v-if='showOtherInfo' @click.native="changeFn" :show-clear="false">保存</x-button>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopup">
        <div class="infoPopup">
          <p v-for='item in popupData' @click='choosePopup(item)'>{{item.value}}</p>
          <p @click='showPopup=false'>取消</p>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import {  Group, XInput,XButton,Popup,Cell,Datetime,TransferDom} from 'vux'
import userimg from '../../assets/img/index/my_img_user@2x.png'
import uploadHeadImg from '@/components/uploadHeadImg'
export default {
  directives: {
    TransferDom
  },
  mounted(){
    let  self=this;
    self.setTitle('个人信息');
    self.init();
  },
  data () {
    return {
      cuponListDetail:false,
      showPopup:false,
      userHeadImg:userimg,
      showOtherInfo:true,
      startDate:'1900-01-01',
      infoData:{},
      popupData:[],
      sexKey:'',
      marriageKey:'',
      educationKey:'',
      jobKey:'',
      type:'',
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/user/info/options')
        .then(function(res) {
          if(res.data.code==0){
              self.infoData=res.data.data
              self.infoData.sex=self.findPopup(self.infoData.sexList)
              self.infoData.marriageStatus=self.findPopup(self.infoData.emotionList)
              self.infoData.education=self.findPopup(self.infoData.educationList)
              self.infoData.job=self.findPopup(self.infoData.jobList)
              if(self.infoData.avatar){
                self.userHeadImg=self.infoData.avatar
                localStorage.setItem('img',self.infoData.avatar)
              }else{
                self.userHeadImg=self.userimg
              }
              if(!self.infoData.birthday){
                self.infoData.birthday='无'
              }
          }else{
             _g.toastMsg('error',res.data.msg);
          }
        })
    },
    findPopup:function(popup){
      var popupvalue;
      for(var i=0;i<popup.length;i++){
        if(popup[i].select==='1'){
          popupvalue=popup[i].value
        }
      }
      return popupvalue;
    },
    changeDateTime:function(val){
      this.infoData.birthday=val
    },
    hasFileChoosed:function(data){
      if(data==true){
        this.showOtherInfo=false;
      }else{
        this.showOtherInfo=true;
        localStorage.setItem('img',this.$refs.uploadHeadImg.headImg)
        this.userHeadImg=this.$refs.uploadHeadImg.headImg
      }
    },
    showPopupFn:function(data,type){
      this.popupData=data;
      this.type=type
      this.showPopup=true
    },
    choosePopup:function(item){
      if(this.type==='sex'){
        this.infoData.sex=item.value
        this.sexKey=item.key
      }else if(this.type==='marriage'){
        this.infoData.marriageStatus=item.value
        this.marriageKey=item.key
      }else if(this.type==='education'){
        this.infoData.education=item.value
        this.educationKey=item.key
      }else{
        this.infoData.job=item.value
        this.jobKey=item.key
      }
      this.showPopup=false;
    },
    changeFn:function(){
      let self = this;
      var userData={
        avatar:self.userHeadImg,
        birthday:self.infoData.birthday,
        education:self.educationKey,
        job:self.jobKey,
        marriageStatus:self.marriageKey,
        nickName:self.infoData.nickName,
        sex:self.sexKey,
      }
      self.$http.put('h9/api/user/info',userData)
        .then(function(res) {
          if(res.data.code==0){
              _g.toastMsg('error',"成功");
              setTimeout(function(){
                self.$router.push({path:'/account/personal'})
              },1500)
          }
        })
    }

  },
  components: {
     Group, XInput,XButton,Popup,Cell,Datetime,TransferDom,uploadHeadImg
  }
}

</script>

<style scoped lang='less'>
  .infoHeadImg{
    width: 150/40rem;
    height: 150/40rem;
    border:1px solid #ddd;
    border-radius: 10rem;
  }
  .bottomBtn{
    height: 100/40rem;
    line-height: 100/40rem;
    color: #fff;
    position: fixed;
    bottom: 0;
    border-radius: 0;
    width: 100%;
    text-align: center;
    font-size: 32/40rem;
  }
  .infoChangePage{
    overflow-y: auto;
  }
</style>
<style lang='less'>
  .infoBox .weui-input{
    text-align: right;
  }
  .infoBox{
    .vux-cell-primary,.weui-label{
      font-size: 30/40rem;
    }
  }
  .infoBox .weui-input,.infoBox .weui-cell_access .weui-cell__ft{
    font-size: 30/40rem;
    color: #999;
  }
  .infoBox .weui-cell{
    padding: 30/40rem 30/40rem!important;
  }
  .infoBox .infoImgCell{
    padding: 50/40rem 30/40rem 15/40rem 30/40rem!important;
  }
  .infoImgCell{
    .weui-cell__ft{
      width: 150/40rem;
      height: 150/40rem;
    }
  }
  .infoPopup p{
    background: #fff;
    font-size: 30/40rem;
    padding: 30/40rem 0;
    border-top: 1px solid #f2f2f2;
    text-align: center;
  }
  .infoChangePage .vux-datetime{
    font-size: 30/40rem;
  }
</style>
