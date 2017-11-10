<template>
	<div class="page">
    <group class='infoBox groupNoTop groupNoLine'>
        <cell title="头像" class='infoImgCell'>
            <uploadHeadImg class="infoHeadImg" ref='uploadHeadImg' :imgsrc='userHeadImg' v-on:listenToChildImg='hasFileChoosed'></uploadHeadImg>
        </cell>
    </group>
    <group class='infoBox groupNoTop groupNoLine' v-if='showOtherInfo'>
        <x-input title="昵称" v-model='infoData.nickName' placeholder="昵称" :show-clear="false"></x-input>
        <cell title="手机号" v-if="infoData.tel!=''" :value='infoData.tel'></cell>
        <cell title="手机号" v-else value='绑定' link='/account/bindPhone' is-link></cell>
        <cell title="性别" :value='infoData.sex' @click.native="showPopupFn(sexPopup,'sex')" is-link></cell>
        <datetime v-model="infoData.birthday" :start-date="startDate" @on-change="changeDateTime" title="生日"></datetime>
        <cell title="情感" :value='infoData.marriageStatus'  @click.native="showPopupFn(marriagePopup,'marriage')" is-link></cell>
    </group>
    <group class='infoBox' title='隐私信息(不公开)' v-if='showOtherInfo'>
        <cell title="学历" :value='infoData.education'  @click.native="showPopupFn(educationPopup,'education')" is-link></cell>
        <x-input title="职业" v-model='infoData.job' placeholder="请输入职业" ></x-input>
    </group>
    <div class="fundsBtnBox">
      <x-button class='gradientBtn' v-if='showOtherInfo' @click.native="changeFn" :show-clear="false">确认修改</x-button>
    </div>  
    <div v-transfer-dom>
      <popup v-model="showPopup" >
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
    self.setTitle('资料修改');
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
      sexPopup:[{key:1,value:'男'},{key:0,value:'女'}],
      marriagePopup:[{key:1,value:'单身'},{key:2,value:'恋爱'},{key:3,value:'已婚'},{key:4,value:'其他'}],
      educationPopup:[{key:1,value:'小学及以下'},{key:2,value:'初中'},{key:3,value:'高中'},{key:4,value:'中专'},{key:5,value:'本科'}],
      type:'',
    }
  },
  methods:{
    init(){
      let self = this
      self.$http.get('h9/api/user/info')
        .then(function(res) {
          if(res.data.code==0){
              self.infoData=res.data.data 
              if(self.infoData.avatar){
                self.userHeadImg=self.infoData.avatar
                localStorage.setItem('img',self.infoData.avatar)
              }else{
                self.userHeadImg=self.userimg
              }
              if(!self.infoData.birthday){
                self.infoData.birthday='1980-01-01'
              }
          }
        })
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
      }else if(this.type==='marriage'){
        this.infoData.marriageStatus=item.value
      }else{
        this.infoData.education=item.value
      }
      this.showPopup=false;
    },
    changeFn:function(){
      let self = this;
      console.log(self.infoData.job+"=========")
      console.log(self.infoData.nickName+"=========")
      var userData={
        avatar:self.userHeadImg,
        birthday:self.infoData.birthday,
        education:self.infoData.education,
        job:self.infoData.job,
        marriageStatus:self.infoData.marriageStatus,
        nickName:self.infoData.nickName,
        sex:self.infoData.sex,
      }
      self.$http.put('h9/api/user/info',userData)
        .then(function(res) {
          if(res.data.code==0){
              _g.toastMsg('error',"修改资料成功");
              self.$router.push({path:'/account/personal'})
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
</style>
