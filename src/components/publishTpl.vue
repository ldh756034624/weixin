<template>
  <div class="publishTpl">
      <main class="publishMain">
          <group class='radius'>
            <x-input placeholder="请输入标题(必填)" :max="30" :show-clear="false" v-model="publishData.title">
              <span slot='right'>{{publishData.title.length}}/30</span>
            </x-input>
            <x-textarea :max="1000" placeholder="请输入商品描述(必填)" v-model="publishData.content"></x-textarea>
            <div class="addressBox vux-1px-t">
                <img src="../assets/img/mian/publishAddr.png" class="">
                <div v-if='showloacateByHand==false'>
                    <div class="locate" :class="[loacateByHand==true ?'transprent':'']" >
                        <span v-if="LocateOk==false">定位中</span>
                        <span  v-if="LocateOk==true">{{publishData.province}}</span>
                        <span  v-if="LocateOk==true">{{publishData.city}}</span>
                        <span  v-if="LocateOk==true">{{publishData.district}}</span>
                    </div>
                     <div class="locateAdress" >
                        <div :class="[loacateByHand==false ?'transprent':'']">
                            <x-address @on-hide="logHide" :list="addressData"  :raw-value="true" placeholder="请选择地址" v-model="address" value-text-align="left" :title="''">
                            </x-address>
                        </div>
                    </div>
                </div>
                <div v-if='showloacateByHand==true'>
                     <div class="locateAdress">
                        <div :class="[loacateByHand==false ?'transprent':'']">
                            <x-address @on-hide="logHide" :list="addressData"  :raw-value="true" placeholder="请选择地址" v-model="address" value-text-align="left" :title="''">
                            </x-address>
                        </div>
                    </div>
                </div>
            </div>
            <div class="publishUpload">
                <ImgUpload v-if="isEdit==false" :maxlength="8" :uploadurl="uploadurl" ref="uploadImg"></ImgUpload>
                <ImgUpload v-if="isEdit==true" :maxlength="8" :uploadurl="uploadurl" :imagedatas='publishData.images' ref="uploadImg"></ImgUpload>
            </div>
            <cell title="分类" @click.native="showSortPopup=true" v-model="publishData.categoryName" is-link></cell>
          </group>
      </main>
      <div v-transfer-dom>
        <popup v-show="showSortPopup" height="100%">
          <div class="popup1">
            <group>
                <cell :title="item.name" v-for="(item,index) in sortList" @click.native="chooseSort(item)" :key="index"></cell>
            </group>
          </div>
        </popup>
      </div>
      <div v-transfer-dom>
      <x-dialog v-show="dialogUnSayShow" class="dialogUnBox dialogUnSayBox">
        <div>
          {{dialogUnSayText}}
        </div>
        <x-button mini class="dialogSureBtn" @click.native="dialogUnSayFn" >确定</x-button>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XInput, Group, Cell, XTextarea,TransferDom, Popup,XAddress, ChinaAddressV3Data,XDialog,XButton } from 'vux'
import value2name from 'vux/src/filters/value2name'
import ImgUpload from '@/components/ImgUpload'
// var url = require('aUrl')
export default {
  directives: {
    TransferDom
  },
  props:{
    datas: {
      type: Object,
      default: ""
    },
    publishUrl:{
      type: String,
      default: ""
    },
  },
  mounted(){
    let self=this;
    self.init();
    //定位
    if(navigator.geolocation){
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (position) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              let accuracy = position.accuracy;
              if(!accuracy){   //用户拒绝
                self.loacateByHand=true;
                self.showloacateByHand=true;
                return;
              }
              self.publishData.latitude = position.point.lat;
              self.publishData.longitude = position.point.lng;
              var point = new BMap.Point(self.publishData.longitude,self.publishData.latitude); //这里设置刚开始的点所在处
              var gc = new BMap.Geocoder();  //初始化，Geocoder类
              gc.getLocation(point, function (rs) {   //getLocation函数用来解析地址信息，分别返回省市区街等
                  self.LocateOk=true;
                  var addComp = rs.addressComponents;
                  self.publishData.province = addComp.province;//获取省份
                  self.publishData.city = addComp.city;//获取城市
                  self.publishData.district = addComp.district,//区
                  //street = addComp.street;//街
                  //self.loacateByHand=true;
                  self.address = [self.publishData.province,self.publishData.city,self.publishData.district];
                  self.publishData.address=self.publishData.province+ ' ' +self.publishData.city+ ' ' + self.publishData.district
                })
            }else{
              self.loacateByHand=true;
              self.showloacateByHand=true;
            }
        });
    }else{
      self.loacateByHand=true;
      self.showloacateByHand=true;
    }

  },
  data () {
    return {
      LocateOk:false,
      loacateByHand:false,
      showloacateByHand:false,
      addressData:ChinaAddressV3Data,
      uploadurl:'/sh/ja/v1/file/goods/upload',
      publishType:this.$route.query.publishType,
      showSortPopup:false,
      sortList:[],
      address:[],
      publishData:{
        address:[],
        categoryId:0,
        categoryName:'',
        latitude:0,
        longitude:0,
        //shgoodId:0,//修改时候带
        title:'',
        content:'',
        province:'',
        city:'',
        district:'',
      },
      id:this.$route.query.id,
      tableType:this.$route.query.tableType,
      isEdit:false,
      dialogUnSayShow:false,
      dialogUnSayText:'',
      callback:Function
    }
  },
  methods:{
    init(){
      let self=this;
      this.$http.get('/sh/ja/v1/good/categories/all')
        .then(function(res) {
          if(res.data.statusCode==0){
            self.sortList=res.data.data;
          }
        })
      if(self.id){
        this.$http.get('/sh/ja/v1/'+self.tableType+'/'+self.id+'/detail')
        .then(function(res) {
          if(res.data.statusCode==0){
            self.publishData=res.data.data
            self.LocateOk=true;
            self.isEdit=true;
          }
        })
      }  
    },
    trim(str){ 
       return str.replace(/(^\s*)|(\s*$)/g, ""); 
     },
    chooseSort(item){
      let self=this;
      self.publishData.categoryId=item.id;
      self.publishData.categoryName=item.name;
      self.showSortPopup=false;
    },
    logHide(str){
      console.log("hide"+str)
      let self=this;
      if(str==true){
        self.loacateByHand=true;
      }else{
        self.loacateByHand=false;
      }
    },
    dialogUnSayFn:function(){
      history.go(-1)
    },
    publish(){
      let self=this;
      if(self.id){
        self.publishData.id=self.id
      }
      if (!self.trim(self.publishData.title) || !self.trim(self.publishData.content)) {
        _g.toastMsg('error', '请输入标题跟商品描述')
        return
      }
      if(!self.id){//编辑暂时没有可以修改地址
        if(self.loacateByHand==true){
            self.publishData.address = value2name(self.address, ChinaAddressV3Data);
        }
        
        if (!self.publishData.address) {
          _g.toastMsg('error', '请选择地址')
          return
        }
      }
      self.publishData.images=self.$refs.uploadImg.imageUploadList
      if (self.publishData.images.length < 1) {
        _g.toastMsg('error', '图片未上传，请添加')
        return
      }
      if (self.publishData.images.length > 8) {
        _g.toastMsg('error', '图片不能大于8张，请添加')
        return
      }
      if (self.publishData.categoryId == 0) {
        _g.toastMsg('error', '请选择分类')
        return
      }
      //publishType为1表示闲置,2表示拍卖,3捐赠
     if(self.publishType==1){
        if (!self.datas.sellingPrice) {
          _g.toastMsg('error', '请输入卖价')
          return
        }
        if (!self.datas.originPrice) {
          _g.toastMsg('error', '请输入原价')
          return
        }
        if (!self.datas.expressFee) {
          _g.toastMsg('error', '请输入运费')
          return
        }
        self.publishData.originPrice=self.datas.originPrice
        self.publishData.sellingPrice=self.datas.sellingPrice
        self.publishData.expressFee=self.datas.expressFee
     }else if(self.publishType==2){
        if (!self.datas.startPrice) {
          _g.toastMsg('error', '请输入起拍价')
          return
        }
        if (!self.datas.ensurePrice) {
          _g.toastMsg('error', '请输入保证金')
          return
        }
        if (!self.datas.offsetPrice) {
          _g.toastMsg('error', '请输入加价幅度')
          return
        }
        if (!self.datas.startTime) {
          _g.toastMsg('error', '请选择开始时间')
          return
        }
        if (!self.datas.endTime) {
          _g.toastMsg('error', '请选择结束时间')
          return
        }
        self.publishData.startPrice=self.datas.startPrice;
        self.publishData.ensurePrice=self.datas.ensurePrice;
        self.publishData.offsetPrice=self.datas.offsetPrice;
        self.publishData.startTime=self.datas.startTime;
        self.publishData.endTime=self.datas.endTime;
        [self.publishData.province,self.publishData.city,self.publishData.district] = [...self.publishData.address.split(" ")];
     }
    [self.publishData.province,self.publishData.city,self.publishData.district] = [...self.publishData.address.split(" ")];
    console.log([...self.publishData.address.split(" ")])
      self.$http.post(self.publishUrl,self.publishData)
        .then(function(res) {
            if(res.data.statusCode==0){
              if(self.publishType==1){
                self.$router.replace({path:'/unused/detaile',query: { tableId:self.publishType,goodId:res.data.data}})
              }else if(self.publishType==2){
                self.$router.replace({path:'/sale/detaile',query: { tableId:self.publishType,goodId:res.data.data}})
              }else{
                self.$router.replace({path:'/donate/detaile',query: { tableId:self.publishType,goodId:res.data.data}})
              }
              
            }else if(res.data.statusCode==4006){

                self.dialogUnSayShow=true;
                self.dialogUnSayText=res.data.msg
            }else{
              _g.toastMsg('error', res.data.msg)
            }
        })
    }
  },
  components: {
    XInput,
    Group,
    Cell,
    XTextarea,
    ImgUpload,
    TransferDom,
    Popup,
    XAddress,XDialog,XButton
  },
}

</script>

<style scoped lang='less'>
    .popup1{
      height: 100%;
      overflow: auto;
    }
    .locateAdress{
      width: 280/40rem;
      height: 70/40rem;
    }
    .publishTpl{
      padding-top: 1rem;
    }
    .publishMain{
      background-color: #fff;
      border-radius: 15/40rem;
      font-size: 28/40rem;
      margin: -1.5rem 20/40rem 0;
    }
    
    .addressBox{
      position: relative;
      padding: 20/40rem 0  0 30/40rem;
      font-size: 28/40rem;
      &>img,&>span,&>div{
        vertical-align: -webkit-baseline-middle;
      }
    }
    .addressBox img{
      width: 22/40rem;
      height: 30/40rem;
    }
    .locate{
      display: inline-block;
      margin-top: 20/40rem;
    }
    .transprent{
      opacity: 0
    }
    .locateAdress{
      display: inline-block;
      z-index: 9;
    }
    .locate,.locateAdress{
      position: absolute;
      left: 70/40rem;
      top: 10/40rem;
    }

</style>
<style lang='less'>
  .publishTpl .weui-cell,.publishTpl .weui-cell__bd{
    font-size: 28/40rem;
  }
  .publishTpl .vux-1px-t:before{
    left: 30/40rem!important;
    right: 30/40rem!important;
  }
  .publishTpl .weui-cells:before {
    border-top: none!important;
  }
  .vux-popup-picker-placeholder,.vux-popup-picker-value{
    white-space: nowrap;
  }
  .locateAdress{
    .weui-cell{
      padding-left: 5/40rem;
    }
  }
  .dialogUnSayBox .weui-mask, .dialogUnSayBox .weui-dialog{ 
    display: inline-block!important;
  }
</style>
