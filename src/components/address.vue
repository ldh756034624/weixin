<template>
		<div class="addressBox">
			<group class='groupNoTop groupNoLine'>
        <cell title='所在地区' :value='addr' is-link @click.native='showPopup=true'></cell>   
      </group>
      <div v-transfer-dom>
        <popup v-model="showPopup" height='60%'>
          <div class="addrInfoPopup">
            <p class="area">
              <span @click="chooseTopArea(0)" :class="[areaIndex==0? 'isActive' : '']">{{province}}</span>
              <span @click="chooseTopArea(1)" :class="[areaIndex==1? 'isActive' : '']">{{city}}</span>
              <span @click="chooseTopArea(2)" v-if='hasDistict==true' :class="[areaIndex==2? 'isActive' : '']">{{distict}}</span>
            </p>
            <p v-for='(item,index) in popupData' @click='chooseArea(item,index)'>{{item.name}}</p>
            <p @click='showPopup=false'>取消</p>
          </div>
        </popup>
      </div>
		</div>
</template>

<script>

import {Group,Cell,Popup,TransferDom} from 'vux'
export default {
  directives: {
    TransferDom
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      addr:'',
      showPopup:false,
      popupData:[],
      areaIndex:0,
      addressDataNew:[],
      province:'所在省',
      city:'所在市',
      distict:'所在区',
      proviceIndex:0,
      cityIndex:0,
      hasDistict:false,
    }
  },
  methods:{
    init(){
      this.$http.get('h9/api/address/allArea')
        .then((res)=>{
          if(res.data.code==0){
            this.popupData=res.data.data
            this.addressDataNew=res.data.data
            if(this.addressDataNew[0].list[0].list){
              this.hasDistict=true
            }
            
          }
        })
    },
    chooseTopArea:function(index){
      this.areaIndex=index
      if(this.areaIndex==0){
        this.popupData=this.addressDataNew
      }else if(this.areaIndex==1){
        this.popupData=this.addressDataNew[this.proviceIndex].list
      }else{
        this.popupData=this.addressDataNew[this.proviceIndex].list[this.cityIndex].list
      }
    },
    chooseArea:function(item,index){
      if(this.areaIndex===0){
        this.province=item.name
        this.areaIndex=1
        this.proviceIndex=index
        this.city=this.popupData[index].list[0].name
        this.popupData=this.popupData[index].list
      }else if(this.areaIndex===1){
        this.city=item.name
        this.cityIndex=index
        if(this.popupData[index].list){
          this.areaIndex=2
          this.distict=this.popupData[index].list[0].name
          this.popupData=this.popupData[index].list
        }else{
          this.showPopup=false
          this.addr=this.province+this.city
        }
      }else{
        this.distict=item.name
        this.showPopup=false
        this.addr=this.province+this.city
      }
    },
  },
  components: {
    Group,Cell,Popup
  }
}
</script>
<style scoped lang='less'>
  .addrInfoPopup{
    background: #fff;
    font-size: 30/40rem;
    .isActive{
      border-bottom: 4/40rem solid #627984;
    }
    p{
      padding: 15/40rem 30/40rem;
    }
    .area{
      border-bottom: 2/40rem solid #f2f2f2;
      margin-bottom: 20/40rem;
    }
    .area span{
      margin-left: 20/40rem;padding-bottom: 20/40rem;
    }
  }
</style>