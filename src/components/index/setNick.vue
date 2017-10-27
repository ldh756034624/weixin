<template>
	<div class="setNickBox" id="nickBox" v-if='showSetNickBox==true'>
        <div class="tableBox">
            <div class="tableCellBox">
                <div class="setNickMainBox">
                    <div class="setNickMainBoxPad">
                        <span class="setNickImg">
                        <form enctype="multipart/form-data" method="post" name="fileinfo">
                          <div class="nickUpldBox">
                            <input type="file" name="uploadedFile" id="inputFile" v-on:change="uploadImage" style="opacity:0;">
                            <span :style="styles" style='background-siz:100%'></span>
                            <!-- <span :style="{background: 'url(\''+imgsrc+'\') no-repeat center'}" style='background-siz:100%'></span> -->
                            <!-- <img :src='imgsrc' /> -->
                          </div>
                        </form>

                        </span>
                        <p class="welcomeText">欢迎您</p>
                        <p class="sureText">请确认您的资料</p>
                        <group>
                            <x-input class='nickinputbox' placeholder="请输入昵称" :min="1" :max="20" v-model="nickName" :show-clear='false' ></x-input>
                            <div class="sexBox">
                              <span class='boy' @click="boychoosed=0"
                              :class="[boychoosed==0?'boychoosed':'']"></span>
                              <span class='girl' @click="boychoosed=1"
                              :class="[boychoosed==1?'girlchoosed':'']"></span>
                            </div>
                        </group>
                    </div>


                <button  class="nickBtn "  @click="goMarket()">进入猪猪集市</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import {Tabbar, TabbarItem,Group,XInput,XButton} from 'vux'
 //var nickurl = require('aUrl')
export default {
  components: {
     Tabbar,
     TabbarItem,
     XInput,
     XButton,
     Group,
  },
  mounted(){
    let self=this;
    if (localStorage.getItem('_user')) {
      //self.holder = JSON.parse(localStorage.getItem('_user')).nickname
      self.nickName = JSON.parse(localStorage.getItem('_user')).nickname
      self.imgsrc = JSON.parse(localStorage.getItem('_user')).img
       if(JSON.parse(localStorage.getItem('_user')).firstLogin==true){
         self.showSetNickBox=true;
       }else{
        self.showSetNickBox=false;
       }
    }
    self.styles = {
       backgroundImage:`url(${self.imgsrc})`,
      backgroundSize:`100%`,
    }

    /*setTimeout(()=>{
      var index=window.location.href.indexOf('setNick=true');
      var len='setNick=true'.length
      var str=window.location.href.substr(index,len)
      if(str.split('=')[1]=='true'){
           self.showSetNickBox=true;
      }else{
            self.showSetNickBox=false;
      }
    },100)*/
  },
  data(){
    return {
      holder: '',
      nickName:'',
      styles: {},
      imgsrc: '',
      uploadurl:'/sh/ja/v1/file/goods/upload',
      showSetNickBox:false,
      boychoosed:2
    }
  },
  methods: {
    goMarket(){
      let self=this;

      if(!self.nickName){
        this.$vux.toast.show({
                text: '请输入昵称',
                type: 'text',
            })
        self.showSetNickBox=true;
         return;
      }
      if(self.boychoosed==2){
         self.$vux.toast.show({
                text: '请选择性别',
                type: 'text',
            })
         self.showSetNickBox=true;
         return;
      }
      var nickData={
        avatar:self.imgsrc,
        nickName:self.nickName,
        sex:self.boychoosed
      }
      var _user=JSON.parse(localStorage.getItem('_user'));
      self.$http.post('/sh/ja/v1/user/edit',nickData)
        .then(function(res) {
          if(res.data.statusCode==0){
             _user.img=self.imgsrc;
             _user.nickname=self.nickName;
             _user.sex=self.sex;
             _user.firstLogin=false;
             localStorage.setItem("_user", JSON.stringify(_user));
             self.showSetNickBox=false;
             self.$router.push({path:self.$route.path,query:{setNick:false},replace:true})
             window.location.reload();
          }
          self.$vux.toast.show({
                text: res.data.msg,
                type: 'text',
            })
        })

    },
    uploadImage: function () {
      let self=this;
      self.$vux.toast.show({
            text: '图片正在上传..',
            type: 'text',
        })

        let rcmurl = self.uploadurl;
        var formthml=document.forms.namedItem("fileinfo" );
        var oData = new FormData(document.forms.namedItem("fileinfo" ));
         self.$http.post(rcmurl,oData)
        .then(function(res) {
          if(res.data.statusCode==0){
            self.imgsrc=res.data.url;
            self.styles = {
              backgroundImage:`url(${self.imgsrc})`,
              backgroundSize:`100%`,
            }
          } else {
            self.$vux.toast.show({
                text: res.data.msg,
                type: 'text',
            })
          }
        })

    },
  }
}


</script>
<style scoped lang='less' >
  .setNickBox{
  position: fixed;
  z-index: 999;
  top: 0;
  height:100%;
  width: 100%;
  background-color: rgba(0,0,0,0.2);
}
.tableBox{
  height: 100%;
  width: 100%;
  display: table;
}
.tableCellBox{
  display: table-cell;
  vertical-align: middle;
}
.setNickMainBox{
  border-radius: 10/40rem;
  background-color: #fff;
  text-align: center;
   margin: 0 40/40rem;
}
.setNickMainBoxPad{
  width: 12rem;
  margin: 3rem auto 0;
  padding: 0.5rem 0rem;
}
.welcomeText{
  font-size: 20px;
  padding: 40/40rem 0 20/40rem;
}
.sureText{
  font-size: 26/40rem;
  color: #a2a2a2;
  margin-bottom: -0.7rem;
}
.sexBox{
    margin: 80/40rem 0 0rem;
}
.sexBox span{
  display: inline-block;
  width: 164/40rem;
  height: 164/40rem;
  border: 1px solid #fff;
}
.boy{
  background:url('../../assets/img/login/boy@2x.png') no-repeat center;
  background-size: 100%;
  margin-right: 50/40rem;
}
.girl{
  background:url('../../assets/img/login/girl@2x.png') no-repeat center;
  background-size: 100%;
  margin-left: 50/40rem;
}
.setNickImg{
  display: inline-block;
  width: 164/40rem;
  height: 164/40rem;
  padding: 16/40rem;
  border-radius: 99px;
  background-color: #fff;
  margin-top: -5rem;
}
.setNickImg img{
  width: 100%;
}
.nickinputbox{
  border:1px solid #ddd;
  font-size: 30/40rem;
}
.nickBtn{
  background-color: #38446A;
  border-radius: 30px;
  color: #fff;
  font-size: 34/40rem;
  margin: 110/40rem 0 90/40rem;
  width: 90%;
  border: none;
  height: 80/40rem;
  line-height: 80/40rem;
}
.setNickImg form,.nickUpldBox,.nickUpldBox input,.nickUpldBox span{
  width: 100%;
  height: 100%;
}
.nickUpldBox{
  position: relative;
}
.nickUpldBox input{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.nickUpldBox span{
  display: inline-block;
  width: 100%;
  height: 100%;
  border-radius: 99/40rem;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.sexBox  .boychoosed{
  border:1px solid #5568A2;
}
.sexBox  .girlchoosed{
  border:1px solid #FF8989;
}
</style>